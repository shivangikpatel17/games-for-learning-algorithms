// InsertionSortGame.js
import React, { useState, useEffect, useRef } from "react";
import Sketch from "react-p5";
import "./InsertionSortGame.css";
// Import sound files
import bgMusic from "../../assets/sounds/Insertion-bg.mp3";
import cardDropSound from "../../assets/sounds/Insertion-card-drop.mp3";

// Card dimensions constants
const MAX_CARD_WIDTH = 120;  // Maximum card width
const MAX_CARD_HEIGHT = 170; // Maximum card height
const MIN_CARD_WIDTH = 90;   // Minimum card width
const MIN_CARD_HEIGHT = 126; // Minimum card height (maintains aspect ratio)
const MIN_SPACING = 20;      // Minimum spacing between cards
const LEFT_MARGIN = 50;      // Left margin
const RIGHT_MARGIN = 50;     // Right margin
const VERTICAL_GAP = 180;    // Gap between rows

// Add card content scaling constants
const CORNER_WIDTH_RATIO = 0.22;  // Reduced corner width ratio
const CORNER_HEIGHT_RATIO = 0.22; // Reduced corner height ratio
const SYMBOL_SPACING_RATIO = 0.2; // Symbol spacing as ratio of card width

// Add these for consistent use throughout the component
const topMargin = 140;
const rowGap = 110; // 100 + 10

const InsertionSortGame = () => {
  // Game state
  const [array, setArray] = useState([]);
  const [keyIndex, setKeyIndex] = useState(1);
  const [sortedIndex, setSortedIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState("playing"); // playing, won, lost
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Sound refs
  const bgMusicRef = useRef(null);
  const cardDropSoundRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Initialize audio only once when component mounts
  useEffect(() => {
    // Initialize sound elements
    try {
      bgMusicRef.current = new Audio(bgMusic);
      cardDropSoundRef.current = new Audio(cardDropSound);
      
      // Set background music to loop
      if (bgMusicRef.current) {
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.5; // Set volume to 50%
        
        // Add event listeners for audio loading
        bgMusicRef.current.addEventListener('canplaythrough', () => {
          console.log("Background music loaded and ready to play");
          setAudioInitialized(true);
        });
        
        bgMusicRef.current.addEventListener('error', (e) => {
          console.error("Error loading background music:", e);
        });
        
        // Try to play the background music
        const playPromise = bgMusicRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented:", error);
            // We'll handle this in the user interaction
          });
        }
      }
      
      if (cardDropSoundRef.current) {
        cardDropSoundRef.current.volume = 0.7;
        
        cardDropSoundRef.current.addEventListener('error', (e) => {
          console.error("Error loading card drop sound:", e);
        });
      }
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
    
    // Cleanup function
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (cardDropSoundRef.current) {
        cardDropSoundRef.current.pause();
        cardDropSoundRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs only once on mount

  // Initialize game when level changes
  useEffect(() => {
    initializeGame();
  }, [level]);

  // Start audio on user interaction
  const startAudio = () => {
    if (bgMusicRef.current && !isMuted && audioInitialized) {
      const playPromise = bgMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Playback failed:", error);
        });
      }
    }
  };

  // Toggle mute function
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = !isMuted;
    }
    if (cardDropSoundRef.current) {
      cardDropSoundRef.current.muted = !isMuted;
    }
  };

  // Play card drop sound
  const playCardDropSound = () => {
    if (cardDropSoundRef.current && !isMuted) {
      try {
        // Reset the sound to the beginning
        cardDropSoundRef.current.currentTime = 0;
        const playPromise = cardDropSoundRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Card drop sound playback failed:", error);
          });
        }
      } catch (error) {
        console.error("Error playing card drop sound:", error);
      }
    }
  };

  // Generate random array with card values and suits
  function generateRandomArray(size) {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cards = [];
    
    // Generate unique cards
    while (cards.length < size) {
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      const isRed = suit === '♥' || suit === '♦';
      
      // Check if card already exists
      const cardExists = cards.some(card => card.value === value && card.suit === suit);
      if (!cardExists) {
        cards.push({ value, suit, isRed });
      }
    }
    
    // Shuffle the cards using Fisher-Yates algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards;
  }

  const initializeGame = () => {
    // Calculate number of cards based on level (4 to 18 cards)
    // Start with 4 cards at level 1 and increase to 18 cards by level 15
    const size = Math.min(4 + Math.floor((level - 1) * 1.1), 18);
    const newArray = generateRandomArray(size);
    setArray(newArray);
    setKeyIndex(1);
    setSortedIndex(0);
    setSelectedCard(null);
    setMessage("Select the next card to sort. Click on a card to select it.");
    setGameStatus("playing");
    setAttempts(0);
  };

  // p5.js setup
  const setup = (p5, canvasParentRef) => {
    // Get the parent container's width
    const parentWidth = canvasParentRef.offsetWidth;
    // Determine number of rows based on card count
    let numRows = 1;
    if (array.length > 14) {
      numRows = 3;
    } else if (array.length > 7) {
      numRows = 2;
    }
    // Calculate dynamic canvas height
    const cardHeight = MAX_CARD_HEIGHT;
    const canvasHeight = topMargin + (numRows * cardHeight) + ((numRows - 1) * rowGap) + 80;
    p5.createCanvas(parentWidth, canvasHeight).parent(canvasParentRef);
    p5.textAlign(p5.CENTER, p5.CENTER);
    // Add click event to start audio
    p5.canvas.addEventListener('click', startAudio);
  };

  // p5.js draw
  const draw = (p5) => {
    const parentWidth = p5.canvas.parentElement.offsetWidth;
    let numRows = 1;
    let cardsPerRow = array.length;
    let cardWidth = MAX_CARD_WIDTH;
    let cardHeight = MAX_CARD_HEIGHT;

    // Determine number of rows based on card count
    if (array.length > 14) {
      numRows = 3;
      cardsPerRow = Math.ceil(array.length / 3);
    } else if (array.length > 7) {
      numRows = 2;
      cardsPerRow = Math.ceil(array.length / 2);
    }

    const canvasHeight = topMargin + (numRows * cardHeight) + ((numRows - 1) * rowGap) + 80;
    if (p5.width !== parentWidth || p5.height !== canvasHeight) {
      p5.resizeCanvas(parentWidth, canvasHeight, false);
    }

    p5.background(240);

    // Calculate dimensions based on number of cards
    const availableWidth = p5.width - LEFT_MARGIN - RIGHT_MARGIN;
    
    // Calculate card size that fits in the available space
    if (numRows > 1) {
      const maxWidthPerCard = (availableWidth - (cardsPerRow - 1) * MIN_SPACING) / cardsPerRow;
      cardWidth = Math.max(MIN_CARD_WIDTH, Math.min(MAX_CARD_WIDTH, maxWidthPerCard));
      cardHeight = (cardWidth / MAX_CARD_WIDTH) * MAX_CARD_HEIGHT;
    }

    const spacing = Math.max(MIN_SPACING, (availableWidth - (cardsPerRow * cardWidth)) / (cardsPerRow - 1));
    
    // Draw cards
    array.forEach((card, index) => {
      if (isDragging && index === draggedCard) return; // Skip drawing dragged card in normal position

      // Calculate row and position within row
      const row = numRows > 1 ? Math.floor(index / cardsPerRow) : 0;
      const posInRow = numRows > 1 ? index % cardsPerRow : index;
      
      const x = LEFT_MARGIN + (posInRow * (cardWidth + spacing));
      const y = topMargin + (row * (cardHeight + rowGap));
      
      drawCard(p5, card, x, y, cardWidth, cardHeight, index === keyIndex, selectedCard === index, index <= sortedIndex);
    });

    // Draw dragged card on top if exists
    if (isDragging && draggedCard !== null) {
      const card = array[draggedCard];
      drawCard(p5, card, dragPosition.x, dragPosition.y, cardWidth, cardHeight, draggedCard === keyIndex, true, draggedCard <= sortedIndex);
    }

    // Draw game status
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.textSize(36);
    p5.fill(0, 0, 0, 30);
    p5.text(`Level: ${level}/15 | Score: ${score} | Attempts: ${attempts}/${maxAttempts}`, p5.width/2 + 1, 40);
    p5.fill(0);
    p5.text(`Level: ${level}/15 | Score: ${score} | Attempts: ${attempts}/${maxAttempts}`, p5.width/2, 38);

    // Draw congratulation message in the white area if level is complete
    if (showCongrats) {
      p5.textAlign(p5.CENTER, p5.TOP);
      p5.textSize(32);
      p5.fill(0, 128, 0); // Green color
      p5.text(congratsMessage, p5.width/2, topMargin / 2 + 20);
    }

    // Draw drop zone indicators when dragging
    if (isDragging) {
      // Show drop zone indicators for the continuous sequence of cards
      for (let i = 0; i <= sortedIndex + 1; i++) {
        // Calculate row and position for this index
        const row = numRows > 1 ? Math.floor(i / cardsPerRow) : 0;
        const posInRow = numRows > 1 ? i % cardsPerRow : i;
        
        const dropX = LEFT_MARGIN + (posInRow * (cardWidth + spacing));
        const dropY = topMargin + (row * (cardHeight + rowGap));
        
        p5.stroke(0, 150, 255);
        p5.strokeWeight(2);
        p5.line(dropX - 10, dropY - 10, dropX - 10, dropY + cardHeight + 10);
        if (i === sortedIndex + 1) {
          p5.line(dropX + cardWidth + 10, dropY - 10, dropX + cardWidth + 10, dropY + cardHeight + 10);
        }
      }
    }
  };

  // Update mousePressed to handle cards as a continuous sequence
  const mousePressed = (p5) => {
    if (gameStatus !== "playing") return;

    const availableWidth = p5.width - LEFT_MARGIN - RIGHT_MARGIN;
    let cardsPerRow = array.length;
    let cardWidth = MAX_CARD_WIDTH;
    let cardHeight = MAX_CARD_HEIGHT;
    let numRows = 1;

    // Determine number of rows based on card count
    if (array.length > 14) {
      numRows = 3;
      cardsPerRow = Math.ceil(array.length / 3);
    } else if (array.length > 7) {
      numRows = 2;
      cardsPerRow = Math.ceil(array.length / 2);
    }
    
    // Calculate card size that fits in the available space
    if (numRows > 1) {
      const maxWidthPerCard = (availableWidth - (cardsPerRow - 1) * MIN_SPACING) / cardsPerRow;
      cardWidth = Math.max(MIN_CARD_WIDTH, Math.min(MAX_CARD_WIDTH, maxWidthPerCard));
      cardHeight = (cardWidth / MAX_CARD_WIDTH) * MAX_CARD_HEIGHT;
    }

    const spacing = Math.max(MIN_SPACING, (availableWidth - (cardsPerRow * cardWidth)) / (cardsPerRow - 1));
    
    // Calculate clicked position
    const clickX = p5.mouseX - LEFT_MARGIN;
    const clickY = p5.mouseY;
    
    // Calculate row and position
    let row = 0;
    if (numRows > 1) {
      // Calculate row based on the actual card positions
      const firstRowY = topMargin;
      const rowSpacing = cardHeight + rowGap; // Same spacing as in draw function
      
      // Calculate which row was clicked based on distance from first row
      row = Math.floor((clickY - firstRowY) / rowSpacing);
      row = Math.max(0, Math.min(numRows - 1, row)); // Clamp to valid row range
    }
    
    const posInRow = Math.floor(clickX / (cardWidth + spacing));
    const index = row * cardsPerRow + posInRow;
    
    // Allow dragging any card in the second or third row (unsorted) or the keyIndex card in the first row
    if (index >= 0 && index < array.length) {
      const x = LEFT_MARGIN + (posInRow * (cardWidth + spacing));
      const y = topMargin + (row * (cardHeight + rowGap));
      
      const isInCardArea = clickX >= 0 && clickX <= cardsPerRow * (cardWidth + spacing) &&
                          clickY >= y && clickY <= y + cardHeight;
      
      if (isInCardArea && (row > 0 || index === keyIndex)) {
        setIsDragging(true);
        setDraggedCard(index);
        setDragPosition({ x: x, y: y });
        setDragOffset({ 
          x: p5.mouseX - x,
          y: p5.mouseY - y
        });
        setMessage("Drag the card to where you want to insert it in the sorted area.");
      }
    }
  };

  const mouseDragged = (p5) => {
    if (isDragging && draggedCard !== null) {
      setDragPosition({
        x: p5.mouseX - dragOffset.x,
        y: p5.mouseY - dragOffset.y
      });
    }
  };

  const mouseReleased = (p5) => {
    if (!isDragging || draggedCard === null) return;

    const availableWidth = p5.width - LEFT_MARGIN - RIGHT_MARGIN;
    let cardsPerRow = array.length;
    let cardWidth = MAX_CARD_WIDTH;
    let cardHeight = MAX_CARD_HEIGHT;
    let numRows = 1;

    // Determine number of rows based on card count
    if (array.length > 14) {
      numRows = 3;
      cardsPerRow = Math.ceil(array.length / 3);
    } else if (array.length > 7) {
      numRows = 2;
      cardsPerRow = Math.ceil(array.length / 2);
    }
    
    // Calculate card size that fits in the available space
    if (numRows > 1) {
      const maxWidthPerCard = (availableWidth - (cardsPerRow - 1) * MIN_SPACING) / cardsPerRow;
      cardWidth = Math.max(MIN_CARD_WIDTH, Math.min(MAX_CARD_WIDTH, maxWidthPerCard));
      cardHeight = (cardWidth / MAX_CARD_WIDTH) * MAX_CARD_HEIGHT;
    }

    const spacing = Math.max(MIN_SPACING, (availableWidth - (cardsPerRow * cardWidth)) / (cardsPerRow - 1));
    
    // Find the closest position to drop
    const mouseX = p5.mouseX - LEFT_MARGIN;
    const mouseY = p5.mouseY;
    
    // Calculate row and position for drop
    let dropRow = 0;
    if (numRows > 1) {
      // Calculate row based on the actual card positions
      const firstRowY = topMargin;
      const rowSpacing = cardHeight + rowGap; // Same spacing as in draw function
      
      // Calculate which row was clicked based on distance from first row
      dropRow = Math.floor((mouseY - firstRowY) / rowSpacing);
      dropRow = Math.max(0, Math.min(numRows - 1, dropRow)); // Clamp to valid row range
    }
    
    const posInRow = Math.floor(mouseX / (cardWidth + spacing));
    const dropIndex = dropRow * cardsPerRow + posInRow;
    
    // Allow dropping in any position up to sortedIndex + 1
    if (dropIndex >= 0 && dropIndex <= sortedIndex + 1) {
      handleInsert(dropIndex);
    }

    // Reset drag state
    setIsDragging(false);
    setDraggedCard(null);
  };

  // Validate and process insertion
  const handleInsert = (position) => {
    // Use the dragged card instead of always using the keyIndex card
    const draggedCardValue = array[draggedCard];
    let correctPosition = sortedIndex;

    // Find correct position by comparing with sorted portion
    for (let i = sortedIndex; i >= 0; i--) {
      if (getCardValue(draggedCardValue) >= getCardValue(array[i])) {
        correctPosition = i + 1;
        break;
      }
      if (i === 0) correctPosition = 0;
    }

    // Check if the card is already in the correct position
    const isAlreadyCorrect = draggedCard === correctPosition;
    
    // Play card drop sound
    playCardDropSound();
    
    // If the card is already in the correct position, allow keeping it there
    if (isAlreadyCorrect) {
      // Card is already in the correct position
      setSortedIndex(sortedIndex + 1);
      setKeyIndex(keyIndex + 1);
      setSelectedCard(null);
      setScore(score + 10);
      setMessage("Correct! The card was already in the right place. Select the next card to sort.");

      // Check if level is complete
      if (keyIndex + 1 >= array.length) {
        if (level < 15) {
          // Set congratulation message
          setCongratsMessage(`Congratulations! You've completed Level ${level}!`);
          setShowCongrats(true);
          setMessage("Level complete! Starting next level...");
          
          // Log for debugging
          console.log("Level complete, showing congrats:", level);
          
          // Delay before next level
          setTimeout(() => {
            setShowCongrats(false);
            setLevel(level + 1);
            initializeGame();
          }, 2000);
        } else {
          // Final level complete
          setCongratsMessage("Congratulations! You've completed all levels!");
          setShowCongrats(true);
          setMessage("Congratulations! You've completed all levels!");
          setGameStatus("won");
          
          // Log for debugging
          console.log("All levels complete, showing final congrats");
        }
      }
      return;
    }

    if (position === correctPosition) {
      // Correct insertion
      const newArray = [...array];
      for (let i = draggedCard; i > correctPosition; i--) {
        newArray[i] = newArray[i - 1];
      }
      newArray[correctPosition] = draggedCardValue;
      setArray(newArray);
      setSortedIndex(sortedIndex + 1);
      setKeyIndex(keyIndex + 1);
      setSelectedCard(null);
      setScore(score + 10);
      setMessage("Correct! Select the next card to sort.");

      // Check if level is complete
      if (keyIndex + 1 >= array.length) {
        if (level < 15) {
          // Set congratulation message
          setCongratsMessage(`Congratulations! You've completed Level ${level}!`);
          setShowCongrats(true);
          setMessage("Level complete! Starting next level...");
          
          // Log for debugging
          console.log("Level complete, showing congrats:", level);
          
          // Delay before next level
          setTimeout(() => {
            setShowCongrats(false);
            setLevel(level + 1);
            initializeGame();
          }, 2000);
        } else {
          // Final level complete
          setCongratsMessage("Congratulations! You've completed all levels!");
          setShowCongrats(true);
          setMessage("Congratulations! You've completed all levels!");
          setGameStatus("won");
          
          // Log for debugging
          console.log("All levels complete, showing final congrats");
        }
      }
    } else {
      // Incorrect insertion
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= maxAttempts) {
        setMessage("Game Over! Too many incorrect attempts.");
        setGameStatus("lost");
      } else {
        setMessage(`Incorrect. The card should go at position ${correctPosition + 1}. Try again. (${maxAttempts - newAttempts} attempts remaining)`);
      }
      setScore(Math.max(0, score - 5));
    }
  };

  // Helper function to get numeric value of a card
  const getCardValue = (card) => {
    const valueMap = {
      'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
    };
    return valueMap[card.value];
  };

  // Helper function to get symbol positions based on card value
  const getSymbolPositions = (value, cardWidth, cardHeight) => {
    const positions = [];
    const centerX = cardWidth/2;
    const spacing = cardWidth * SYMBOL_SPACING_RATIO;
    const verticalUnit = cardHeight / 6;

    switch(value) {
      case 1: // Ace
        positions.push({x: centerX, y: cardHeight/2});
        break;
      case 2:
        positions.push(
          {x: centerX, y: verticalUnit * 2},
          {x: centerX, y: verticalUnit * 4}
        );
        break;
      case 3:
        positions.push(
          {x: centerX, y: verticalUnit * 1.5},
          {x: centerX, y: verticalUnit * 3},
          {x: centerX, y: verticalUnit * 4.5}
        );
        break;
      case 4:
        positions.push(
          {x: centerX - spacing, y: verticalUnit * 2},
          {x: centerX + spacing, y: verticalUnit * 2},
          {x: centerX - spacing, y: verticalUnit * 4},
          {x: centerX + spacing, y: verticalUnit * 4}
        );
        break;
      case 5:
        positions.push(
          {x: centerX - spacing, y: verticalUnit * 1.5},
          {x: centerX + spacing, y: verticalUnit * 1.5},
          {x: centerX, y: verticalUnit * 3},
          {x: centerX - spacing, y: verticalUnit * 4.5},
          {x: centerX + spacing, y: verticalUnit * 4.5}
        );
        break;
      case 6:
        positions.push(
          {x: centerX - spacing, y: verticalUnit * 1.5},
          {x: centerX + spacing, y: verticalUnit * 1.5},
          {x: centerX - spacing, y: verticalUnit * 3},
          {x: centerX + spacing, y: verticalUnit * 3},
          {x: centerX - spacing, y: verticalUnit * 4.5},
          {x: centerX + spacing, y: verticalUnit * 4.5}
        );
        break;
      case 7:
        positions.push(
          {x: centerX - spacing, y: verticalUnit * 1.5},
          {x: centerX + spacing, y: verticalUnit * 1.5},
          {x: centerX, y: verticalUnit * 2.5},
          {x: centerX - spacing, y: verticalUnit * 3.5},
          {x: centerX + spacing, y: verticalUnit * 3.5},
          {x: centerX - spacing, y: verticalUnit * 4.5},
          {x: centerX + spacing, y: verticalUnit * 4.5}
        );
        break;
      case 8:
        positions.push(
          {x: centerX - spacing, y: verticalUnit * 1.2},
          {x: centerX + spacing, y: verticalUnit * 1.2},
          {x: centerX - spacing, y: verticalUnit * 2.4},
          {x: centerX + spacing, y: verticalUnit * 2.4},
          {x: centerX - spacing, y: verticalUnit * 3.6},
          {x: centerX + spacing, y: verticalUnit * 3.6},
          {x: centerX - spacing, y: verticalUnit * 4.8},
          {x: centerX + spacing, y: verticalUnit * 4.8}
        );
        break;
      case 9:
        positions.push(
          {x: centerX - spacing, y: verticalUnit},
          {x: centerX + spacing, y: verticalUnit},
          {x: centerX - spacing, y: verticalUnit * 2},
          {x: centerX + spacing, y: verticalUnit * 2},
          {x: centerX, y: verticalUnit * 3},
          {x: centerX - spacing, y: verticalUnit * 4},
          {x: centerX + spacing, y: verticalUnit * 4},
          {x: centerX - spacing, y: verticalUnit * 5},
          {x: centerX + spacing, y: verticalUnit * 5}
        );
        break;
      case 10:
        positions.push(
          {x: centerX - spacing, y: verticalUnit},
          {x: centerX + spacing, y: verticalUnit},
          {x: centerX, y: verticalUnit * 1.8},
          {x: centerX - spacing, y: verticalUnit * 2.5},
          {x: centerX + spacing, y: verticalUnit * 2.5},
          {x: centerX - spacing, y: verticalUnit * 3.5},
          {x: centerX + spacing, y: verticalUnit * 3.5},
          {x: centerX - spacing, y: verticalUnit * 4.5},
          {x: centerX + spacing, y: verticalUnit * 4.5},
          {x: centerX, y: verticalUnit * 5}
        );
        break;
      default:
        positions.push({x: centerX, y: cardHeight/2});
    }
    return positions;
  };

  // Reset game
  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setShowCongrats(false); // Reset congrats message
    initializeGame();
  };

  // Add helper function to draw a card
  const drawCard = (p5, card, x, y, cardWidth, cardHeight, isKey, isSelected, isSorted) => {
    // Card shadow
    p5.noStroke();
    p5.fill(0, 0, 0, 30);
    p5.rect(x + 3, y + 3, cardWidth, cardHeight, 10);

    // Card base
    p5.fill(isSelected ? "#FFD700" : isKey ? "#FFE4E1" : isSorted ? "#F0FFF0" : "#FFFFFF");
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.rect(x, y, cardWidth, cardHeight, 10);
    
    // Inner border
    p5.noFill();
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.rect(x + 4, y + 4, cardWidth - 8, cardHeight - 8, 8);

    // Adjust text sizes based on card size
    const cornerTextSize = Math.max(12, Math.floor(20 * (cardWidth / MAX_CARD_WIDTH)));
    const symbolTextSize = Math.max(16, Math.floor(24 * (cardWidth / MAX_CARD_WIDTH)));

    // Draw corners with adjusted sizes
    const drawCorner = (xPos, yPos, rotate = false) => {
      // Corner background
      p5.fill(isSelected ? "#FFD700" : isKey ? "#FFE4E1" : isSorted ? "#F0FFF0" : "#FFFFFF");
      p5.noStroke();
      const cornerWidth = Math.floor(cardWidth * CORNER_WIDTH_RATIO);
      const cornerHeight = Math.floor(cardHeight * CORNER_HEIGHT_RATIO);
      
      if (rotate) {
        p5.rect(xPos - cornerWidth + 15, yPos - cornerHeight + 15, cornerWidth - 6, cornerHeight - 6, 5);
      } else {
        p5.rect(xPos, yPos, cornerWidth, cornerHeight, 5);
      }
      
      // Corner text
      p5.fill(card.isRed ? "#D40000" : "#000000");
      p5.textAlign(p5.LEFT, p5.TOP);
      p5.textSize(cornerTextSize);
      
      const textPadding = Math.floor(cornerTextSize * 0.3);
      if (rotate) {
        p5.text(card.value, xPos - cornerWidth + textPadding + 15, yPos - cornerHeight + textPadding + 8);
        p5.textSize(cornerTextSize + 2);
        p5.text(card.suit, xPos - cornerWidth + textPadding + 15, yPos - cornerHeight + cornerTextSize + textPadding * 2 + 6);
      } else {
        p5.text(card.value, xPos + textPadding, yPos + textPadding);
        p5.textSize(cornerTextSize + 2);
        p5.text(card.suit, xPos + textPadding, yPos + cornerTextSize + textPadding * 2);
      }
    };

    // Draw corners
    drawCorner(x, y);
    p5.push();
    p5.translate(x + cardWidth - 15, y + cardHeight - 25);
    p5.rotate(p5.PI);
    drawCorner(0, 0, true);
    p5.pop();

    // Center pattern with adjusted sizes
    if (card.value !== 'A' && card.value !== 'K' && card.value !== 'Q' && card.value !== 'J') {
      const value = getCardValue(card);
      const positions = getSymbolPositions(value, cardWidth, cardHeight);
      
      positions.forEach(pos => {
        p5.textSize(symbolTextSize);
        p5.textAlign(p5.CENTER, p5.CENTER);
        // Shadow
        p5.fill(0, 0, 0, 20);
        p5.text(card.suit, x + pos.x + 1, y + pos.y + 1);
        
        // Symbol
        p5.fill(card.isRed ? "#D40000" : "#000000");
        p5.text(card.suit, x + pos.x, y + pos.y);
      });
    } else {
      // Face cards with adjusted sizes
      p5.textAlign(p5.CENTER, p5.CENTER);
      const faceTextSize = Math.max(20, Math.floor(32 * (cardWidth / MAX_CARD_WIDTH)));
      
      if (card.value === 'A') {
        p5.textSize(faceTextSize + 8);
        // Shadow
        p5.fill(0, 0, 0, 20);
        p5.text(card.suit, x + cardWidth/2 + 1, y + cardHeight/2 + 1);
        
        // Symbol
        p5.fill(card.isRed ? "#D40000" : "#000000");
        p5.text(card.suit, x + cardWidth/2, y + cardHeight/2);
      } else {
        // Face cards
        p5.textSize(faceTextSize);
        const verticalOffset = cardHeight/5;
        
        // Shadow
        p5.fill(0, 0, 0, 20);
        p5.text(card.value, x + cardWidth/2 + 1, y + cardHeight/2 - verticalOffset + 1);
        p5.text(card.suit, x + cardWidth/2 + 1, y + cardHeight/2 + verticalOffset + 1);
        
        // Text
        p5.fill(card.isRed ? "#D40000" : "#000000");
        p5.text(card.value, x + cardWidth/2, y + cardHeight/2 - verticalOffset);
        p5.text(card.suit, x + cardWidth/2, y + cardHeight/2 + verticalOffset);
      }
    }
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
    <div className="Insert-game-container">
      <div className="Insert-header">
        <h1 className="Insert-title">Card Sorting Quest</h1>
        <div className="Insert-header-buttons">
          <button className="Insert-button" onClick={resetGame}>
            {gameStatus === "playing" ? "Reset Game" : "Play Again"}
          </button>
          <button className="Insert-mute-button" onClick={toggleMute}>
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>
      </div>
      <div className="Insert-canvas-wrapper">
        <Sketch 
          setup={setup} 
          draw={draw} 
          mousePressed={mousePressed}
          mouseDragged={mouseDragged}
          mouseReleased={mouseReleased}
        />
      </div>
      <div className="Insert-controls">
        <p className="Insert-message">{message}</p>
        <p className="Insert-info">Cards: {array.length} cards to sort</p>
      </div>
      {showInstructions && (
        <div className="Insert-instructions">
          <div className="Insert-instructions-content">
            <h2>How to Play</h2>
            <p>Sort the cards in ascending order by dragging them to their correct positions. Each correct placement earns 10 points, while incorrect attempts reduce your score by 5 points. You have 3 attempts per level. Complete all 15 levels to win!</p>
            <p className="Insert-press-enter">Press Enter to start the game</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertionSortGame;