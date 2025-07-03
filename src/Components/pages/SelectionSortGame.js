import React, { useState, useEffect } from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import './SelectionSortGame.css';
import backgroundMusic from '../../assets/sounds/selection-game-bg.mp3';

function SelectionSortGame() {
  // Initialize 2D array with random package weights based on difficulty
  const generateArray = (difficulty) => {
    let rows;
    let cols;
    let minWeight;
    let maxWeight;
    
    switch (difficulty) {
      case 1: // Easy
        rows = 4;
        cols = 4;
        minWeight = 10;
        maxWeight = 30;
        break;
      case 2: // Medium
        rows = 5;
        cols = 5;
        minWeight = 10;
        maxWeight = 50;
        break;
      case 3: // Hard
        rows = 6;
        cols = 6;
        minWeight = 10;
        maxWeight = 70;
        break;
      case 4: // Expert
        rows = 7;
        cols = 7;
        minWeight = 10;
        maxWeight = 90;
        break;
      case 5: // Master
        rows = 8;
        cols = 8;
        minWeight = 10;
        maxWeight = 100;
        break;
      default:
        rows = 4;
        cols = 4;
        minWeight = 10;
        maxWeight = 90;
    }
    
    const arr = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight);
      }
      arr.push(row);
    }
    return arr;
  };

  // State management
  const [difficulty, setDifficulty] = useState(1);
  const [array, setArray] = useState(generateArray(1));
  const [sortedIndex, setSortedIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Select the next item to wrap!');
  const [gameComplete, setGameComplete] = useState(false);
  const [currentWrapper, setCurrentWrapper] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [slidingPackage, setSlidingPackage] = useState(null);
  const [slidingPosition, setSlidingPosition] = useState({ x: 0, y: 0 });
  const [slidingTarget, setSlidingTarget] = useState({ x: 0, y: 0 });
  const [slidingPhase, setSlidingPhase] = useState('none');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [unlockedStages, setUnlockedStages] = useState([1]); // Start with only Easy stage unlocked
  const [selectedRow, setSelectedRow] = useState(-1);
  const [selectedCol, setSelectedCol] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Initialize audio
  useEffect(() => {
    const newAudio = new Audio(backgroundMusic);
    newAudio.loop = true;
    newAudio.volume = 0.5;
    setAudio(newAudio);
    
    // Start playing when component mounts
    newAudio.play().catch(error => {
      console.log("Audio autoplay failed:", error);
    });
    
    // Cleanup on unmount
    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, []);
  
  // Handle mute/unmute
  const toggleMute = () => {
    if (audio) {
      if (isMuted) {
        audio.volume = 0.5;
        audio.play();
      } else {
        audio.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  // Reset game
  const resetGame = () => {
    setArray(generateArray(difficulty));
    setSortedIndex(0);
    setScore(0);
    setMessage('Select the next item to wrap!');
    setGameComplete(false);
    setIsMoving(false);
    setSelectedPackage(null);
    setCurrentWrapper(null);
    setSlidingPackage(null);
    setSlidingPosition({ x: 0, y: 0 });
    setSlidingTarget({ x: 0, y: 0 });
    setSlidingPhase('none');
    setAnimationComplete(false);
    setMistakes(0);
    setLevelComplete(false);
    setSelectedRow(-1);
    setSelectedCol(-1);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty) => {
    // Check if the stage is unlocked
    if (!unlockedStages.includes(newDifficulty)) {
      setMessage(`This stage is locked! Complete the previous stages to unlock it.`);
      return;
    }
    
    setDifficulty(newDifficulty);
    setArray(generateArray(newDifficulty));
    setSortedIndex(0);
    setScore(0);
    setMessage(`Level ${newDifficulty}: Select the next item to wrap!`);
    setGameComplete(false);
    setIsMoving(false);
    setSelectedPackage(null);
    setCurrentWrapper(null);
    setSlidingPackage(null);
    setSlidingPosition({ x: 0, y: 0 });
    setSlidingTarget({ x: 0, y: 0 });
    setSlidingPhase('none');
    setAnimationComplete(false);
    setMistakes(0);
    setLevelComplete(false);
    setSelectedRow(-1);
    setSelectedCol(-1);
  };

  // Unlock next stage
  const unlockNextStage = () => {
    console.log("Attempting to unlock next stage. Level complete:", levelComplete, "Current difficulty:", difficulty, "Unlocked stages:", unlockedStages);
    
    if (levelComplete && difficulty < 5) {
      const nextStage = difficulty + 1;
      if (!unlockedStages.includes(nextStage)) {
        console.log("Unlocking stage:", nextStage);
        const newUnlockedStages = [...unlockedStages, nextStage];
        setUnlockedStages(newUnlockedStages);
        setMessage(`Congratulations! You've unlocked the ${getDifficultyName(nextStage)} stage!`);
      }
    }
  };

  // Get difficulty name
  const getDifficultyName = (level) => {
    switch (level) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Unknown';
    }
  };

  // p5.js sketch
  const sketch = (p5) => {
    let packages = array;
    let sortedIdx = sortedIndex;
    let onSelect = () => {};
    let isAnimating = false;
    let selectedRowIdx = selectedRow;
    let selectedColIdx = selectedCol;
    let animComplete = animationComplete;
    let wrapperSize = null;
    let personX = 200;
    let personY = 300;
    let armAngle = 0;
    let armLength = 80;
    let slidingPkg = slidingPackage;
    let slidingPos = slidingPosition;
    let slidingTgt = slidingTarget;
    let slidingPhs = slidingPhase;
    let animationSpeed = 5;
    let currentDifficulty = difficulty;
    let unlockedStagesList = unlockedStages;
    
    // Calculate the starting x position to center the array
    const getArrayStartX = () => {
      // Position the array on the right side of the person
      return personX + 250;
    };

    // Calculate the starting y position to center the array
    const getArrayStartY = () => {
      const totalHeight = packages.length * 50; // Further reduced spacing between rows
      return (p5.height - totalHeight) / 2;
    };

    p5.setup = () => {
      p5.createCanvas(1000, 600);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(12); // Smaller text size for more packages
    };

    p5.draw = () => {
      // Create a dynamic background based on game state and difficulty
      // Base background color changes with difficulty level
      const baseColors = [
        [240, 240, 250], // Easy - Light blue-gray
        [230, 240, 250], // Medium - Slightly darker blue-gray
        [220, 230, 250], // Hard - More saturated blue-gray
        [210, 220, 250], // Expert - Even more saturated
        [200, 210, 250]  // Master - Most saturated
      ];
      
      // Get the base color for current difficulty
      const baseColor = baseColors[currentDifficulty - 1] || baseColors[0];
      p5.background(baseColor[0], baseColor[1], baseColor[2]);
      
      // Add stars that twinkle based on game state
      p5.fill(255);
      for (let i = 0; i < 100; i++) {
        const x = (i * 7) % p5.width;
        const y = (i * 13) % p5.height;
        // Stars twinkle more when a package is being wrapped
        const twinkle = slidingPhs === 'wrapping' ? 
          p5.sin(p5.frameCount * 0.1 + i) * 0.5 + 0.5 : 
          p5.sin(p5.frameCount * 0.05 + i) * 0.3 + 0.7;
        const size = (i % 3) + 1;
        p5.ellipse(x, y, size * twinkle, size * twinkle);
      }
      
      // Add a distant planet that changes color based on sorted progress
      const planetProgress = sortedIdx / (packages.length * packages[0].length);
      const planetHue = p5.map(planetProgress, 0, 1, 100, 200);
      p5.fill(planetHue, 50, 150);
      p5.ellipse(800, 100, 80, 80);
      p5.fill(planetHue - 20, 40, 120);
      p5.ellipse(800, 100, 60, 60);
      
      // Add nebula effects that pulse based on game state
      p5.noStroke();
      // First nebula - changes color based on difficulty
      const nebulaHue1 = p5.map(currentDifficulty, 1, 5, 150, 250);
      p5.fill(nebulaHue1, 50, 150, 30);
      const pulse1 = slidingPhs === 'wrapping' ? 
        p5.sin(p5.frameCount * 0.05) * 20 + 200 : 200;
      p5.ellipse(200, 150, pulse1, pulse1);
      
      // Second nebula - changes color based on sorted progress
      const nebulaHue2 = p5.map(planetProgress, 0, 1, 50, 150);
      p5.fill(nebulaHue2, 100, 150, 30);
      const pulse2 = slidingPhs === 'wrapping' ? 
        p5.sin(p5.frameCount * 0.05 + 1) * 20 + 150 : 150;
      p5.ellipse(300, 200, pulse2, pulse2);
      
      // Add a space station that changes based on game state
      p5.fill(200, 200, 220);
      p5.rect(50, 50, 100, 20, 5);
      p5.rect(60, 70, 80, 10, 3);
      
      // Station light that blinks when a package is being wrapped
      if (slidingPhs === 'wrapping') {
        p5.fill(0, 255, 255, p5.sin(p5.frameCount * 0.2) * 100 + 155);
      } else {
        p5.fill(0, 255, 255, 100);
      }
      p5.ellipse(100, 50, 20, 20);
      
      // Add a progress indicator in the background
      p5.noFill();
      p5.stroke(255, 255, 255, 100);
      p5.strokeWeight(2);
      p5.arc(100, 100, 150, 150, 0, p5.PI * 2 * planetProgress);
      p5.noStroke();
      
      // Draw packaging person as a robot
      p5.fill(150, 150, 180);
      
      // Robot body - more mechanical and futuristic
      // Base/legs
      p5.fill(100, 100, 120);
      p5.rect(personX - 35, personY + 50, 70, 25, 5);
      
      // Main body
      p5.fill(120, 120, 150);
      p5.rect(personX - 40, personY - 25, 80, 75, 8);
      
      // Chest panel with glowing effect - glows more when wrapping
      p5.fill(70, 70, 90);
      p5.rect(personX - 25, personY - 15, 50, 35, 5);
      if (slidingPhs === 'wrapping') {
        p5.fill(0, 255, 255, 200);
      } else {
        p5.fill(0, 255, 255, 150);
      }
      p5.ellipse(personX, personY, 20, 20);
      
      // Shoulders
      p5.fill(100, 100, 130);
      p5.ellipse(personX - 45, personY + 10, 25, 25);
      p5.ellipse(personX + 45, personY + 10, 25, 25);
      
      // Head
      p5.fill(130, 130, 160);
      p5.ellipse(personX, personY - 50, 50, 50);
      
      // Face details
      p5.fill(0, 255, 255);
      // Eyes - blink when wrapping
      if (slidingPhs === 'wrapping' && p5.sin(p5.frameCount * 0.2) < 0) {
        p5.ellipse(personX - 12, personY - 55, 10, 2);
        p5.ellipse(personX + 12, personY - 55, 10, 2);
      } else {
        p5.ellipse(personX - 12, personY - 55, 10, 14);
        p5.ellipse(personX + 12, personY - 55, 10, 14);
      }
      // Mouth - changes based on game state
      p5.noFill();
      p5.stroke(0, 255, 255);
      p5.strokeWeight(2);
      if (slidingPhs === 'wrapping') {
        p5.arc(personX, personY - 45, 18, 12, 0, p5.PI);
      } else if (gameComplete) {
        p5.arc(personX, personY - 45, 18, 12, 0, p5.PI * 2);
      } else {
        p5.arc(personX, personY - 45, 18, 12, 0, p5.PI);
      }
      p5.noStroke();
      
      // Antenna
      p5.stroke(150, 150, 170);
      p5.strokeWeight(2);
      p5.line(personX, personY - 75, personX, personY - 85);
      // Antenna light changes based on game state
      if (slidingPhs === 'wrapping') {
        p5.fill(0, 255, 255, p5.sin(p5.frameCount * 0.2) * 100 + 155);
      } else if (gameComplete) {
        p5.fill(255, 255, 0);
      } else {
        p5.fill(0, 255, 255);
      }
      p5.ellipse(personX, personY - 85, 6, 6);
      p5.noStroke();
      
      // Arms - more mechanical
      p5.push();
      p5.translate(personX, personY);
      p5.rotate(armAngle);
      
      // Upper arm
      p5.fill(100, 100, 130);
      p5.rect(0, -20, 40, 40, 5);
      
      // Elbow joint
      p5.fill(130, 130, 160);
      p5.ellipse(40, 0, 20, 20);
      
      // Lower arm
      p5.fill(120, 120, 150);
      p5.rect(40, -15, armLength - 40, 25, 5);
      
      // Hand/gripper
      p5.fill(90, 90, 120);
      p5.rect(armLength - 5, -20, 15, 40, 3);
      
      p5.pop();
    
      
      // Calculate the starting positions to center the array
      const arrayStartX = getArrayStartX();
      const arrayStartY = getArrayStartY();
      
      // Draw packages in the 2D array
      packages.forEach((row, rowIndex) => {
        row.forEach((weight, colIndex) => {
          const x = arrayStartX + colIndex * 70; // Increased spacing between columns
          const y = arrayStartY + rowIndex * 60; // Increased spacing between rows
          
          // Calculate if this package is in the sorted portion
          const isSorted = rowIndex * packages[0].length + colIndex < sortedIdx;
          
          // Package shadow
          p5.fill(0, 0, 0, 50);
          p5.rect(x - 20, y - 15, 40, 35, 5); // Larger packages
          
          // Package body - blue for sorted, cyan for unsorted
          if (isSorted) {
            p5.fill([0, 100, 255]);
          } else {
            p5.fill([0, 200, 255]);
          }
          p5.rect(x - 25, y - 20, 40, 35, 5); // Larger packages
          
          // Package details
        p5.fill(255);
          p5.textSize(14); // Larger text
          p5.text(weight, x, y - 2);
          p5.textSize(12); // Reset text size
          
          // Highlight selected package with yellow box
          if (rowIndex === selectedRowIdx && colIndex === selectedColIdx) {
            p5.noFill();
            p5.stroke(255, 255, 0);
            p5.strokeWeight(2);
            p5.rect(x - 30, y - 25, 50, 45, 5); // Larger highlight
            p5.noStroke();
          }
          
          // Highlight the package being animated with yellow box
          if (slidingPkg !== null && slidingPkg === packages[rowIndex][colIndex]) {
            p5.noFill();
            p5.stroke(255, 255, 0);
            p5.strokeWeight(2);
            p5.rect(x - 30, y - 25, 50, 45, 5); // Larger highlight
            p5.noStroke();
          }
          
          // Highlight the current sorted position with green box
          if (rowIndex === Math.floor(sortedIdx / packages[0].length) && 
              colIndex === sortedIdx % packages[0].length) {
            p5.noFill();
            p5.stroke(0, 255, 0);
            p5.strokeWeight(3);
            p5.rect(x - 30, y - 25, 50, 45, 5); // Larger highlight
            p5.noStroke();
          }
        });
      });

      // Draw sliding package
      if (slidingPkg !== null) {
        // Package shadow
        p5.fill(0, 0, 0, 50);
        p5.rect(slidingPos.x - 20, slidingPos.y - 15, 40, 35, 5); // Larger package
        
        // Package body
        p5.fill([0, 200, 255]);
        p5.rect(slidingPos.x - 25, slidingPos.y - 20, 40, 35, 5); // Larger package
        
        // Package details
        p5.fill(255);
        p5.textSize(14); // Larger text
        p5.text(slidingPkg, slidingPos.x, slidingPos.y - 2);
        p5.textSize(12); // Reset text size
        
        // Animate sliding
        if (slidingPhs === 'toCenter') {
          // Move to center
          const dx = slidingTgt.x - slidingPos.x;
          const dy = slidingTgt.y - slidingPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            slidingPos.x += (dx / distance) * animationSpeed;
            slidingPos.y += (dy / distance) * animationSpeed;
          } else {
            slidingPhs = 'wrapping';
            setTimeout(() => {
              slidingPhs = 'toSortedPosition';
              // Set target to the sorted position
              const sortedX = arrayStartX + (sortedIdx % packages[0].length) * 70;
              const sortedY = arrayStartY + Math.floor(sortedIdx / packages[0].length) * 60;
              slidingTgt = { x: sortedX, y: sortedY };
            }, 1000);
          }
        } else if (slidingPhs === 'toSortedPosition') {
          // Move to sorted position
          const dx = slidingTgt.x - slidingPos.x;
          const dy = slidingTgt.y - slidingPos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 1) {
            slidingPos.x += (dx / distance) * animationSpeed;
            slidingPos.y += (dy / distance) * animationSpeed;
          } else {
            // Animation complete
            slidingPkg = null;
            slidingPhs = 'none';
            animComplete = true;
          }
        }
      }

      // Animate packaging person's arm
      if (isAnimating || slidingPhs === 'wrapping') {
        // Reduce the amplitude and frequency of the sine wave to make the animation smoother
        armAngle = p5.sin(p5.frameCount * 0.05) * 0.3;
      } else {
        armAngle = p5.sin(p5.frameCount * 0.05) * 0.2;
      }
    };

    p5.mouseClicked = () => {
      if (gameComplete || isAnimating || slidingPkg !== null) return;
      
      // Calculate the starting positions to center the array
      const arrayStartX = getArrayStartX();
      const arrayStartY = getArrayStartY();
      
      // Check if clicked on a package in the unsorted array
      packages.forEach((row, rowIndex) => {
        row.forEach((weight, colIndex) => {
          const index = rowIndex * packages[0].length + colIndex;
          if (index >= sortedIdx) {
            const x = arrayStartX + colIndex * 70; // Increased spacing
            const y = arrayStartY + rowIndex * 60; // Increased spacing
            
            if (p5.dist(p5.mouseX, p5.mouseY, x, y) < 25) { // Increased click detection radius
              selectedRowIdx = rowIndex;
              selectedColIdx = colIndex;
              isAnimating = true;
              animComplete = false;
              wrapperSize = packages[rowIndex][colIndex];
              
              // Start sliding animation
              slidingPkg = packages[rowIndex][colIndex];
              slidingPos = { x: x, y: y };
              // Set target position in front of the robot, not on its head
              slidingTgt = { x: personX + 120, y: personY + 30 };
              slidingPhs = 'toCenter';
              
              // After animation completes, call onSelect to update the array
              setTimeout(() => {
                if (selectedRowIdx !== -1 && selectedColIdx !== -1) {
                  onSelect(selectedRowIdx, selectedColIdx);
                  selectedRowIdx = -1;
                  selectedColIdx = -1;
                }
              }, 3000); // Wait for the entire animation sequence to complete
            }
          }
        });
      });
    };

    p5.updateWithProps = (props) => {
      packages = props.array;
      sortedIdx = props.sortedIndex;
      onSelect = props.onSelect;
      wrapperSize = props.currentWrapper;
      slidingPkg = props.slidingPackage;
      slidingPos = props.slidingPosition;
      slidingTgt = props.slidingTarget;
      slidingPhs = props.slidingPhase;
      animComplete = props.animationComplete;
      currentDifficulty = props.difficulty;
      unlockedStagesList = props.unlockedStages;
      selectedRowIdx = props.selectedRow;
      selectedColIdx = props.selectedCol;
    };
  };

  // Handle package selection
  const handleSelect = (row, col) => {
    if (gameComplete) return;

    // Find the minimum value in the unsorted portion
    let minRow = -1;
    let minCol = -1;
    let minValue = Infinity;
    
    // Flatten the 2D array for easier processing
    const flatArray = [];
    array.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        flatArray.push({ value, rowIndex, colIndex });
      });
    });
    
    // Find the minimum value in the unsorted portion
    for (let i = sortedIndex; i < flatArray.length; i++) {
      if (flatArray[i].value < minValue) {
        minValue = flatArray[i].value;
        minRow = flatArray[i].rowIndex;
        minCol = flatArray[i].colIndex;
      }
    }
    
    // Calculate the current index in the flattened array
    const currentIndex = row * array[0].length + col;
    const minIndex = minRow * array[0].length + minCol;

    if (currentIndex === minIndex) {
      setIsMoving(true);
      const newArray = [...array];
      
      // Swap the minimum value with the first unsorted position
      const sortedRow = Math.floor(sortedIndex / array[0].length);
      const sortedCol = sortedIndex % array[0].length;
      
      // Swap values
      [newArray[sortedRow][sortedCol], newArray[minRow][minCol]] = [
        newArray[minRow][minCol],
        newArray[sortedRow][sortedCol],
      ];
      
      setArray(newArray);
      setSortedIndex(sortedIndex + 1);
      setScore(score + 10);
      setMessage('Item wrapped! Select the next item.');
      setSelectedPackage(array[minRow][minCol]);
      setCurrentWrapper(null);
      setSelectedRow(-1);
      setSelectedCol(-1);

      if (sortedIndex + 1 >= array.length * array[0].length) {
        setGameComplete(true);
        setLevelComplete(true);
        
        // Call unlockNextStage directly
        unlockNextStage();
        
        setMessage(`Level ${difficulty} Complete! 🎉 Click Next Level or Reset to try again.`);
      }
    } else {
      setScore(Math.max(0, score - 5));
      setMistakes(mistakes + 1);
      setMessage(`Wrong size! The next wrapper needs size ${array[minRow][minCol]}. Try again.`);
      setSelectedPackage(null);
      setCurrentWrapper(null);
      setSelectedRow(-1);
      setSelectedCol(-1);
    }
    setIsMoving(false);
  };

  // Update sliding animation state
  useEffect(() => {
    if (slidingPackage !== null) {
      if (slidingPhase === 'toCenter') {
        // Animation is handled in the p5.js sketch
      } else if (slidingPhase === 'wrapping') {
        // Wrapping animation
        setTimeout(() => {
          setSlidingPhase('toSortedPosition');
          // Calculate the starting x position to center the array
          const canvasWidth = 1000;
          const personX = 200;
          const arrayStartX = personX + 250;
          const sortedX = arrayStartX + (sortedIndex % array[0].length) * 70; // Increased spacing
          const sortedY = 300 + Math.floor(sortedIndex / array[0].length) * 60; // Increased spacing
          setSlidingTarget({ x: sortedX, y: sortedY });
        }, 1000);
      } else if (slidingPhase === 'toSortedPosition') {
        // Animation is handled in the p5.js sketch
      }
    }
  }, [slidingPackage, slidingPhase, sortedIndex, array]);

  // Handle animation completion
  useEffect(() => {
    if (animationComplete) {
      setAnimationComplete(false);
      setSlidingPackage(null);
      setSlidingPhase('none');
    }
  }, [animationComplete]);

  // Handle level completion
  const handleNextLevel = () => {
    if (difficulty < 5) {
      // Only allow moving to the next level if it's unlocked
      if (unlockedStages.includes(difficulty + 1)) {
        changeDifficulty(difficulty + 1);
      } else {
        setMessage(`Complete the current level to unlock the next stage!`);
      }
    } else {
      setMessage('Congratulations! You completed all levels! 🏆');
    }
  };

  // Add a useEffect to log unlocked stages when they change
  useEffect(() => {
    console.log("Unlocked stages updated:", unlockedStages);
  }, [unlockedStages]);

  // Add a useEffect to check if level is complete and unlock next stage
  useEffect(() => {
    if (levelComplete && gameComplete) {
      console.log("Level complete effect triggered. Difficulty:", difficulty);
      unlockNextStage();
    }
  }, [levelComplete, gameComplete, difficulty]);

  // Add a useEffect to initialize the game
  useEffect(() => {
    // Make sure the first level is always unlocked
    if (!unlockedStages.includes(1)) {
      setUnlockedStages([1]);
    }
  }, []);

  // Get the current step in the algorithm
  const getCurrentStep = () => {
    if (gameComplete) {
      return "complete";
    }
    
    if (selectedPackage !== null) {
      return "wrapping";
    }
    
    return "selecting";
  };

  // Format the task steps with highlighting for the current step
  const getHighlightedPseudocode = () => {
    const currentStep = getCurrentStep();
    
    // Define the steps with their corresponding game states
    const steps = [
      { 
        text: "1. Look at the packages. Find the smallest package by scanning each row and click on the smallest package from the unsorted array.", 
        state: "selecting", 
        condition: true 
      },
      { 
        text: "2. Watch the robot arm wrap the package. The package is placed in its sorted position.", 
        state: "wrapping", 
        condition: true 
      },
      { 
        text: "3. Repeat until all packages are sorted", 
        state: "selecting", 
        condition: sortedIndex > 0 && !gameComplete 
      },
      { 
        text: "4. Level complete! 🎉", 
        state: "complete", 
        condition: true 
      }
    ];
    
    // Build the highlighted steps
    let result = "Task Steps:\n";
    
    steps.forEach(step => {
      const shouldHighlight = step.state === currentStep && step.condition;
      if (shouldHighlight) {
        result += `<span class="highlight">${step.text}</span>\n`;
      } else {
        result += `${step.text}\n`;
      }
    });
    
    return result;
  };

  // Add key press event listener for instructions
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && showInstructions) {
        setShowInstructions(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showInstructions]);

  return (
    <div className="select-game-container">
      <div className="select-header">
        <div className="title-container">
          <span className="title-emoji">📦</span>
          <h1 className="select-title">Package Sorting Factory</h1>
          <span className="title-emoji">🤖</span>
        </div>
        <button 
          className="mute-button" 
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
      <div className="select-game-layout">
        <div className="select-canvas-wrapper">
          <ReactP5Wrapper
            sketch={sketch}
            array={array}
            sortedIndex={sortedIndex}
            onSelect={handleSelect}
            gameComplete={gameComplete}
            currentWrapper={currentWrapper}
            slidingPackage={slidingPackage}
            slidingPosition={slidingPosition}
            slidingTarget={slidingTarget}
            slidingPhase={slidingPhase}
            animationComplete={animationComplete}
            difficulty={difficulty}
            unlockedStages={unlockedStages}
            selectedRow={selectedRow}
            selectedCol={selectedCol}
          />
        </div>
        
        <div className="select-algorithm-panel">
          <h3 className="select-algorithm-title">Selection Sort Algorithm</h3>
          <div className="select-algorithm-code">
            <pre dangerouslySetInnerHTML={{ 
              __html: getHighlightedPseudocode()
            }} />
          </div>
          <div className="select-algorithm-explanation">
            <p>Current step: {sortedIndex === 0 ? "Start" : `Finding the ${sortedIndex + 1}${getOrdinalSuffix(sortedIndex + 1)} smallest package`}</p>
          </div>
        </div>
      </div>
      
      <div className="select-info-panel">
        <p className="select-message">{message}</p>
        <p className="select-score">Score: {score}</p>
        <p className="select-difficulty">Level: {difficulty} ({getDifficultyName(difficulty)})</p>
        {selectedPackage && (
          <div className="select-package-info">
            <p>Current Package: {selectedPackage}</p>
          </div>
        )}
        <div className="select-buttons">
          <button className="select-reset-button" onClick={resetGame}>
            Reset Level
          </button>
          {levelComplete && (
            <button className="select-next-button" onClick={handleNextLevel}>
              Next Level
            </button>
          )}
        </div>
        <div className="select-difficulty-buttons">
          {[1, 2, 3, 4, 5].map((level) => (
            <button 
              key={level}
              className={`select-difficulty-button ${difficulty === level ? 'active' : ''} ${!unlockedStages.includes(level) ? 'locked' : ''}`} 
              onClick={() => changeDifficulty(level)}
              disabled={!unlockedStages.includes(level)}
            >
              {getDifficultyName(level)}
              {!unlockedStages.includes(level) && <span className="lock-icon">🔒</span>}
            </button>
          ))}
        </div>
      </div>
      
      {showInstructions && (
        <div className="select-instructions">
          <div className="select-instructions-content">
            <h2>How to Play</h2>
            <p>Follow the algorithm steps shown on the right panel. Click on the smallest package in the unsorted area to move it to its correct position. Each correct selection earns 10 points, while incorrect attempts reduce your score by 5 points.</p>
            <p>Complete each level to unlock the next difficulty. The game gets progressively harder with more packages to sort.</p>
            <p className="select-press-enter">Press Enter to start the game</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get ordinal suffix
const getOrdinalSuffix = (n) => {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

export default SelectionSortGame;