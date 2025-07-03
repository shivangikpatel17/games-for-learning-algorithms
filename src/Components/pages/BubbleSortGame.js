import React, { useState, useRef, useEffect } from 'react';
import Sketch from 'react-p5';
import './BubbleSortGame.css';
import backgroundMusic from '../../assets/sounds/creek-swimming-bg.mp3';
import bubbleSwapSound from '../../assets/sounds/bubble-swap.mp3';
import bubbleBurstSound from '../../assets/sounds/bubble-burst.mp3';
//import bubbleSortImage from '../../assets/images/bubble-sort.png';

const BubbleSortGame = () => {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const bubbleSwapAudioRef = useRef(null);
    const bubbleBurstAudioRef = useRef(null);
    const [numbers, setNumbers] = useState([]);
    const [step, setStep] = useState(0);
    const [history, setHistory] = useState([]);
    const [currentStep, setCurrentStep] = useState(0); // For highlighting algorithm steps
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [harmonyPoints, setHarmonyPoints] = useState(0);
    const [bubbleBurstMeter, setBubbleBurstMeter] = useState(0); // 0 to 5
    const [gameState, setGameState] = useState('initial'); // 'initial', 'playing', 'finished', 'gameOver'
    const [userAction, setUserAction] = useState(null); // 'swap', 'noSwap', or null
    const [feedback, setFeedback] = useState('');
    const [decorations, setDecorations] = useState({
        coralReef: false,
        treasureChest: false,
        glowingPearl: false,
    });
    const [algorithm, setAlgorithm] = useState('bubble');
    const [powerUp, setPowerUp] = useState({ isActive: false });
    const [gameInitialized, setGameInitialized] = useState(false);
    const [passNumber, setPassNumber] = useState(0);
    const [swapsInPass, setSwapsInPass] = useState(0);
    const [currentPass, setCurrentPass] = useState(0);
    const [passComplete, setPassComplete] = useState(false);
    const [coralImages, setCoralImages] = useState({
        coralReef: null,
        coral: null,
        coral1: null,
        coral2: null,
        reef: null
    });
    const [treasureImages, setTreasureImages] = useState({
        treasureChest: null,
        treasure: null,
        gold: null
    });
    const [pearlImages, setPearlImages] = useState({
        pearl: null,
        pearls: null,
        oyster: null,
        clam: null
    });
    const [isMuted, setIsMuted] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [instructionStep, setInstructionStep] = useState(1);

    // Generate random numbers for the game
    const generateRandomNumbers = () => {
        const size = Math.min(5 + level, 10); // Increase size with level, max 10
        const newNumbers = [];
        for (let i = 0; i < size; i++) {
            newNumbers.push(Math.floor(Math.random() * 100) + 1);
        }
        setNumbers(newNumbers);
        setStep(0);
        setHistory([]);
        setCurrentStep(0);
        setGameState('initial');
        setUserAction(null);
        setFeedback('');
        setBubbleBurstMeter(0);
        setPassNumber(0);
        setSwapsInPass(0);
        setCurrentPass(0);
        setPassComplete(false);
    };

    // Start the game
    const startGame = () => {
        if (gameState === 'initial' || gameState === 'finished') {
            setGameState('playing');
            setGameInitialized(true);
        }
    };

    // Handle user decision (swap or no swap)
    const handleUserDecision = (shouldSwap) => {
        if (gameState !== 'playing') return;

        setUserAction(shouldSwap ? 'swap' : 'noSwap');

        // Check if the decision is correct
        const currentNumber = numbers[step];
        const nextNumber = numbers[step + 1];
        const isCorrectDecision =
            (shouldSwap && currentNumber > nextNumber) ||
            (!shouldSwap && currentNumber <= nextNumber);

        // Update score and feedback
        if (isCorrectDecision) {
            setScore(score + 10);
            setHarmonyPoints(harmonyPoints + 5);
            setFeedback('Correct! The fish are now in harmony.');
            console.log('Sound: Chime!'); // Simulate correct sound

            // If swapping, update the numbers
            if (shouldSwap) {
                const newNumbers = [...numbers];
                [newNumbers[step], newNumbers[step + 1]] = [newNumbers[step + 1], newNumbers[step]];
                setNumbers(newNumbers);
                setSwapsInPass(swapsInPass + 1);
                
                // Play bubble swap sound if not muted
                if (!isMuted && bubbleSwapAudioRef.current) {
                    bubbleSwapAudioRef.current.currentTime = 0;
                    bubbleSwapAudioRef.current.play();
                }
                
                console.log('Sound: Bubble Pop!'); // Simulate swap sound
            }
        } else {
            setScore(Math.max(0, score - 5));
            setBubbleBurstMeter(Math.min(5, bubbleBurstMeter + 1));
            setFeedback('Oops! That was not the right decision.');
            
            // Play bubble burst sound if not muted
            if (!isMuted && bubbleBurstAudioRef.current) {
                bubbleBurstAudioRef.current.currentTime = 0;
                bubbleBurstAudioRef.current.play();
            }
            
            console.log('Sound: Bubble Burst!'); // Simulate incorrect sound
            if (bubbleBurstMeter + 1 >= 5) {
                setGameState('gameOver');
                setFeedback('Too Many Bubble Bursts! A fish swam away!');
            }
        }

        // Move to the next step
        setStep(step + 1);
        setCurrentStep((currentStep + 1) % 5);

        // Check if the pass is complete
        if (step + 1 >= numbers.length - 1) {
            setPassComplete(true);
            setCurrentPass(currentPass + 1);
            setPassNumber(passNumber + 1); // Increment pass number

            // Check if the array is sorted
            if (isArraySorted(numbers)) {
                setGameState('finished');
                setFeedback('Congratulations! You have sorted all the fish!');
                console.log('Sound: Sparkle!'); // Simulate level complete sound
            } else {
                // Start a new pass
                setStep(0);
                setCurrentStep(0);
                setPassComplete(false);
                setFeedback(`Starting Pass ${passNumber + 1}! Keep going!`); // Add feedback for new pass
            }
        }
    };

    // Check if the array is sorted
    const isArraySorted = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    };

    // Unlock decorations
    const unlockDecoration = (decoration) => {
        const costs = {
            coralReef: 50,
            treasureChest: 100,
            glowingPearl: 150,
        };
        const cost = costs[decoration];
        if (harmonyPoints >= cost && !decorations[decoration]) {
            setHarmonyPoints((prev) => prev - cost);
            setDecorations((prev) => ({ ...prev, [decoration]: true }));
            setFeedback(`Unlocked ${decoration.replace(/([A-Z])/g, ' $1').toLowerCase()}!`);
        } else if (decorations[decoration]) {
            setFeedback('You already unlocked this decoration!');
        } else {
            setFeedback('Not enough harmony points!');
        }
    };

    // Move to the next level
    const nextLevel = () => {
        setLevel(level + 1);
        generateRandomNumbers();
    };

    // Load images for decorations
    const loadImages = (p5) => {
        // Load coral reef images
        const coralReefImg = p5.loadImage(require('../../assets/images/coral-reef.png'));
        const coralImg = p5.loadImage(require('../../assets/images/coral.png'));
        const coral1Img = p5.loadImage(require('../../assets/images/coral (1).png'));
        const coral2Img = p5.loadImage(require('../../assets/images/coral (2).png'));
        const reefImg = p5.loadImage(require('../../assets/images/reef.png'));
        
        // Load treasure chest images
        const treasureChestImg = p5.loadImage(require('../../assets/images/treasure-chest.png'));
        const treasureImg = p5.loadImage(require('../../assets/images/treasure.png'));
        const goldImg = p5.loadImage(require('../../assets/images/gold.png'));
        
        // Load pearl images
        const pearlImg = p5.loadImage(require('../../assets/images/pearl.png'));
        const pearlsImg = p5.loadImage(require('../../assets/images/pearls.png'));
        const oysterImg = p5.loadImage(require('../../assets/images/oyster.png'));
        const clamImg = p5.loadImage(require('../../assets/images/clam.png'));
        
        setCoralImages({
            coralReef: coralReefImg,
            coral: coralImg,
            coral1: coral1Img,
            coral2: coral2Img,
            reef: reefImg
        });
        
        setTreasureImages({
            treasureChest: treasureChestImg,
            treasure: treasureImg,
            gold: goldImg
        });
        
        setPearlImages({
            pearl: pearlImg,
            pearls: pearlsImg,
            oyster: oysterImg,
            clam: clamImg
        });
    };

    // Setup function for p5.js
    const setup = (p5, canvasParentRef) => {
        // Remove any existing canvas to prevent duplicates
        const existingCanvases = document.querySelectorAll('.sorting-canvas-wrapper canvas');
        existingCanvases.forEach(canvas => canvas.remove());
        
        // Create canvas with smaller size
        const canvas = p5.createCanvas(1000, 600);
        canvas.parent(canvasParentRef);
        
        // Load images
        loadImages(p5);
    };

    // Draw function for p5
    const draw = (p5) => {
        p5.background(135, 206, 235); // Light blue water background

        // Draw sandy bottom
        p5.fill(255, 215, 0); // Sandy bottom
        p5.rect(0, p5.height - 20, p5.width, 20);

        // Draw decorations if unlocked
        if (decorations.coralReef && coralImages.coralReef) {
            // Draw multiple coral reef images with reduced spacing
            const coralSize = 70;
            const coralSpacing = 20; // Reduced spacing between coral reefs
            const startCoralX = 250; // Increased from 200 to 250 to move coral reefs more to the right
            const startCoralY = p5.height - coralSize - 30;
            
            p5.image(coralImages.coralReef, startCoralX, startCoralY, coralSize, coralSize);
            p5.image(coralImages.coral, startCoralX + coralSize + coralSpacing, startCoralY, coralSize, coralSize);
            p5.image(coralImages.coral1, startCoralX + (coralSize + coralSpacing) * 2, startCoralY, coralSize, coralSize);
            p5.image(coralImages.coral2, startCoralX + (coralSize + coralSpacing) * 3, startCoralY, coralSize, coralSize);
            p5.image(coralImages.reef, startCoralX + (coralSize + coralSpacing) * 4, startCoralY, coralSize, coralSize);
        }
        if (decorations.treasureChest && treasureImages.treasureChest) {
            // Draw multiple treasure chest images in the bottom right corner with spacing
            const chestSize = 50;
            const spacing = 15; // Reduced from 30 to 15
            const startX = p5.width - (chestSize * 3 + spacing * 2) - 10; // Adjusted for 3 items instead of 4
            const startY = p5.height - chestSize - 30; // Position from bottom
            
            // Draw 3 treasure chests with different images
            p5.image(treasureImages.treasureChest, startX, startY, chestSize, chestSize);
            p5.image(treasureImages.treasure, startX + chestSize + spacing, startY, chestSize, chestSize);
            p5.image(treasureImages.gold, startX + (chestSize + spacing) * 2, startY, chestSize, chestSize);
        }
        if (decorations.glowingPearl) {
            // Draw 4 pearl images in the bottom left corner with spacing
            const pearlSize = 40;
            const pearlSpacing = 20;
            const startPearlX = 10; // Position from left edge
            const startPearlY = p5.height - pearlSize - 30; // Position from bottom
            
            // Draw 4 pearls with different images
            p5.image(pearlImages.pearl, startPearlX, startPearlY, pearlSize, pearlSize);
            p5.image(pearlImages.pearls, startPearlX + pearlSize + pearlSpacing, startPearlY, pearlSize, pearlSize);
            p5.image(pearlImages.oyster, startPearlX + (pearlSize + pearlSpacing) * 2, startPearlY, pearlSize, pearlSize);
            p5.image(pearlImages.clam, startPearlX + (pearlSize + pearlSpacing) * 3, startPearlY, pearlSize, pearlSize);
        }

        // Draw rising bubbles
        p5.fill(255, 255, 255, 100);
        p5.noStroke();
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * p5.width;
            const y = (p5.frameCount % p5.height) + i * 20;
            p5.ellipse(x, p5.height - y, 15, 15);
        }

        // Draw fish and bubbles
        const baseFishSize = 20; // Base size for the smallest fish
        const spacing = 50; // Increased from 30 to 50 for more distance between fish
        const startX = (p5.width - (numbers.length * (baseFishSize * 2 + spacing) - spacing)) / 2;
        const centerY = p5.height / 2;

        // First, draw highlight bubbles for comparing fishes
        if (gameState === 'playing' && step < numbers.length - 1) {
            const idx1 = step;
            const idx2 = step + 1;
            const x1 = startX + idx1 * (baseFishSize * 2 + spacing);
            const x2 = startX + idx2 * (baseFishSize * 2 + spacing);
            const y = centerY;

            // Draw connecting bubble between comparing fishes
            p5.noStroke();
            p5.fill(76, 175, 80, 50); // Semi-transparent green
            p5.ellipse((x1 + x2) / 2, y, (x2 - x1) + 80, 100);

            // Draw pointing hand
            p5.push();
            p5.translate((x1 + x2) / 2 + 40, y + 70);
            p5.fill(76, 175, 80);
            p5.textSize(30);
            p5.text('👆', -15, 0);
            p5.pop();
        }

        numbers.forEach((num, idx) => {
            const x = startX + idx * (baseFishSize * 2 + spacing);
            const y = centerY + Math.sin(p5.frameCount * 0.05 + idx) * 10; // Bobbing motion
            
            // Calculate fish size based on value (larger numbers = larger fish)
            const fishSize = baseFishSize + (num / 10);

            // Highlight current comparing fishes
            let fillColor;
            if (gameState === 'playing' && (idx === step || idx === step + 1)) {
                fillColor = p5.color(76, 175, 80); // Green for comparing fishes
            } else {
                const brightness = p5.map(num, 10, 59, 100, 255);
                fillColor = p5.color(255, brightness, 100);
            }

            // Draw fish
            p5.fill(fillColor);
            p5.noStroke();
            
            // Fish body
            p5.ellipse(x, y, fishSize * 2, fishSize);
            
            // Fish tail
            p5.push();
            p5.translate(x - fishSize, y);
            p5.rotate(Math.sin(p5.frameCount * 0.1) * 0.2); // Tail wagging
            p5.triangle(-fishSize/2, 0, -fishSize, -fishSize/2, -fishSize, fishSize/2);
            p5.pop();
            
            // Fish eye
            p5.fill(0);
            p5.ellipse(x + fishSize/2, y - fishSize/4, fishSize/4, fishSize/4);
            p5.fill(255);
            p5.ellipse(x + fishSize/2 + fishSize/8, y - fishSize/4, fishSize/8, fishSize/8);

            // Bubble with number - positioned near the mouth of the fish
            p5.fill(255, 255, 255, 200);
            // Calculate vertical position with animation
            const bubbleY = y - fishSize - Math.sin(p5.frameCount * 0.05) * 5; // Add slight bobbing motion
            p5.ellipse(x + fishSize, bubbleY, fishSize * 1.2, fishSize * 1.2);
            p5.fill(0);
            p5.textAlign(p5.CENTER);
            p5.textSize(16);
            p5.text(num, x + fishSize, bubbleY); // Match text position with bubble
        });

       
        p5.textSize(14);
        p5.fill(26, 35, 126); // Dark blue color (#1a237e)

        // Draw score, harmony points, and bubble burst meter
        p5.textAlign(p5.RIGHT, p5.TOP);
        p5.text(`Score: ${score}`, p5.width - 10, 10);
        p5.text(`Harmony Points: ${harmonyPoints}`, p5.width - 10, 30);
        p5.text(`Bubble Burst: ${bubbleBurstMeter}/5`, p5.width - 10, 50);
        p5.text(`Level: ${level}`, p5.width - 10, 70);
        
        // Show current pass number
        p5.text(`Pass: ${passNumber + 1}`, p5.width - 10, 90);
    };

    // Effect to clean up the canvas when the component unmounts
    useEffect(() => {
        return () => {
            const existingCanvases = document.querySelectorAll('.sorting-canvas-wrapper canvas');
            existingCanvases.forEach(canvas => canvas.remove());
        };
    }, []);

    // Effect to simulate the first step when the game is initialized
    useEffect(() => {
        if (gameInitialized && gameState === 'playing' && history.length === 0) {
            const timer = setTimeout(() => {
                simulateStep();
            }, 100);
            
            // Cleanup function to prevent memory leaks
            return () => {
                clearTimeout(timer);
            };
        }
    }, [gameInitialized, gameState, history.length]);

    // Effect to handle pass transitions
    useEffect(() => {
        if (gameState === 'playing' && history.length > 0) {
            const currentAction = history[history.length - 1]?.action;
            
            // If we just completed a pass and the array is not sorted
            if (currentAction?.type === 'pass') {
                // Check if the array is actually sorted
                if (isArraySorted(numbers)) {
                    // Array is truly sorted
                    setGameState('finished');
                    setFeedback('Congratulations! All fish are now sorted!');
                } else {
                    // Reset step counter for the new pass
                    setStep(0);
                    setPassComplete(false);
                    
                    // Simulate the first step of the new pass after a delay
                    const timer = setTimeout(() => {
                        simulateStep();
                    }, 500);
                    
                    // Cleanup function to prevent memory leaks
                    return () => {
                        clearTimeout(timer);
                    };
                }
            }
        }
    }, [history, gameState, numbers]);

    // Simulate a step in the sorting algorithm
    const simulateStep = () => {
        if (gameState !== 'playing') return;
        
        // Check if we've reached the end of the array
        if (step >= numbers.length - 1) {
            // Check if the array is sorted
            if (isArraySorted(numbers)) {
                setGameState('finished');
                setFeedback('Congratulations! All fish are now sorted!');
                return;
            }
            
            // If not sorted, start a new pass
            setStep(0);
            setPassNumber(passNumber + 1);
            setSwapsInPass(0);
            setCurrentPass(currentPass + 1);
            setPassComplete(true);
            
            // Add a pass action to history
            setHistory([...history, { 
                numbers: [...numbers], 
                action: { type: 'pass', passNumber: currentPass + 1 } 
            }]);
            
            return;
        }
        
        // Compare current and next elements
        const currentNumber = numbers[step];
        const nextNumber = numbers[step + 1];
        
        // Add comparison action to history
        setHistory([...history, { 
            numbers: [...numbers], 
            action: { 
                type: 'compare', 
                indices: [step, step + 1],
                values: [currentNumber, nextNumber]
            } 
        }]);
        
        // Update current step for algorithm display
        setCurrentStep(1); // Highlight the comparison step
    };

    // Initialize audio
    useEffect(() => {
        // Background music
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(error => {
            console.log('Audio playback failed:', error);
        });

        // Bubble swap sound
        bubbleSwapAudioRef.current = new Audio(bubbleSwapSound);
        bubbleSwapAudioRef.current.volume = 0.7;
        
        // Bubble burst sound
        bubbleBurstAudioRef.current = new Audio(bubbleBurstSound);
        bubbleBurstAudioRef.current.volume = 0.7;

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (bubbleSwapAudioRef.current) {
                bubbleSwapAudioRef.current.pause();
                bubbleSwapAudioRef.current = null;
            }
            if (bubbleBurstAudioRef.current) {
                bubbleBurstAudioRef.current.pause();
                bubbleBurstAudioRef.current = null;
            }
        };
    }, []);

    // Function to toggle audio mute/unmute
    const toggleAudio = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = 0.5;
                audioRef.current.play();
            } else {
                audioRef.current.volume = 0;
            }
            setIsMuted(!isMuted);
        }
    };

    // Function to handle instruction steps
    const handleInstructionStep = () => {
        if (instructionStep === 1) {
            setInstructionStep(2);
        } else {
            setShowInstructions(false);
        }
    };

    return (
        <div className="sorting-visualization">
            <button onClick={toggleAudio} className="sorting-audio-toggle">
                {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>
            <div className="sorting-visualization-header">
                <h2>Bubble Sort Fish Aquarium</h2>
            </div>
            {showInstructions && (
                <div className="sorting-instructions-overlay" onClick={handleInstructionStep}>
                    {instructionStep === 1 ? (
                        <div className="sorting-instruction-box">
                            <h3>Welcome to Bubble Sort Fish Aquarium! 🐠</h3>
                            <p>Step 1: Click the "New Level" button to enter the first level.</p>
                            <div className="sorting-instruction-arrow">👇</div>
                            <button className="sorting-instruction-next">Click here to continue</button>
                        </div>
                    ) : (
                        <div className="sorting-instruction-box">
                            <h3>Great! Now let's begin sorting! 🎮</h3>
                            <p>Step 2: Click the "Start Game" button to start sorting the fish.</p>
                            <div className="sorting-instruction-arrow">👇</div>
                            <button className="sorting-instruction-next">Click here to start</button>
                        </div>
                    )}
                </div>
            )}
            <div className="sorting-visualization-content">
                <div className="sorting-canvas-section">
                    <div className="sorting-canvas-wrapper">
                        <Sketch key="bubble-sort-sketch" setup={setup} draw={draw} />
                    </div>
                    <div className="sorting-controls-row">
                        <div className="sorting-main-buttons">
                            <button onClick={startGame}>Start Game</button>
                            <button onClick={generateRandomNumbers}>New Level</button>
                        </div>
                        {gameState === 'playing' && (
                            <div className="sorting-question-box redesigned-question-box">
                                <div className="question-title">Should these fish be swapped?</div>
                                <div className="comparison-row">
                                    <div className="fish-circle">{numbers[step]}</div>
                                    <div className="comparison-operator">&lt;</div>
                                    <div className="fish-circle">{numbers[step + 1]}</div>
                                </div>
                                <div className="yesno-row">
                                    <button className="yes-btn" onClick={() => handleUserDecision(true)}>Yes</button>
                                    <button className="no-btn" onClick={() => handleUserDecision(false)}>No</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="sorting-right-section">
                    <div className="sorting-algorithm-box">
                        <pre>
                            <span className={currentStep === 0 ? 'highlight' : ''}>
                                {`BubbleSort(array)\n1. [Start new pass]\n\tfor i <- 0 to length-1`}
                            </span>
                            {'\n\n'}
                            <span className={currentStep === 1 ? 'highlight' : ''}>
                                {`2. [Compare and swap]\n\tif array[i] > array[i+1]\n\tthen swap array[i] and array[i+1]`}
                            </span>
                            {'\n\n'}
                            <span className={currentStep === 2 ? 'highlight' : ''}>
                                {`3. [Repeat until no swaps]\n\tRepeat until sorted`}
                            </span>
                        </pre>
                    </div>
                    <div className="sorting-rewards-box">
                        <h3>Aquarium Rewards</h3>
                        <div className="sorting-rewards-container">
                            <div className={`sorting-reward-item ${decorations.coralReef ? 'unlocked' : 'locked'}`}>
                                <div className="sorting-reward-image coral-reef">
                                    <img src={require('../../assets/images/coral-reef.png')} alt="Coral Reef" />
                                </div>
                                <div className="sorting-reward-info">
                                    <h4>Coral Reef</h4>
                                    <p>Cost: 50 Harmony Points</p>
                                    <p className="sorting-reward-status">{decorations.coralReef ? 'Unlocked!' : 'Locked'}</p>
                                </div>
                            </div>
                            <div className={`sorting-reward-item ${decorations.treasureChest ? 'unlocked' : 'locked'}`}>
                                <div className="sorting-reward-image treasure-chest">
                                    <img src={require('../../assets/images/treasure-chest.png')} alt="Treasure Chest" />
                                </div>
                                <div className="sorting-reward-info">
                                    <h4>Treasure Chest</h4>
                                    <p>Cost: 100 Harmony Points</p>
                                    <p className="sorting-reward-status">{decorations.treasureChest ? 'Unlocked!' : 'Locked'}</p>
                                </div>
                            </div>
                            <div className={`sorting-reward-item ${decorations.glowingPearl ? 'unlocked' : 'locked'}`}>
                                <div className="sorting-reward-image glowing-pearl">
                                    <img src={require('../../assets/images/pearl.png')} alt="Glowing Pearl" />
                                </div>
                                <div className="sorting-reward-info">
                                    <h4>Glowing Pearl</h4>
                                    <p>Cost: 150 Harmony Points</p>
                                    <p className="sorting-reward-status">{decorations.glowingPearl ? 'Unlocked!' : 'Locked'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {gameState === 'finished' && (
                <div className="sorting-results-container">
                    <h3 className="sorting-results-title">Level Complete!</h3>
                    <p className="sorting-results-message">{feedback}</p>
                    <div className="sorting-results-stats-row">
                        <div className="sorting-results-stat">
                            <div className="sorting-results-stat-value">{score}</div>
                            <div className="sorting-results-stat-label">Score</div>
                        </div>
                        <div className="sorting-results-stat">
                            <div className="sorting-results-stat-value">{harmonyPoints}</div>
                            <div className="sorting-results-stat-label">Harmony Points</div>
                        </div>
                        <div className="sorting-results-stat">
                            <div className="sorting-results-stat-value">{bubbleBurstMeter}</div>
                            <div className="sorting-results-stat-label">Bubble Burst Meter</div>
                        </div>
                    </div>
                    <div className="sorting-results-actions">
                        <button className="sorting-results-next-btn" onClick={nextLevel}>Next Level</button>
                        <div className="sorting-results-rewards">
                            <button
                                className="sorting-results-reward-btn"
                                onClick={() => unlockDecoration('coralReef')}
                                disabled={decorations.coralReef}
                            >
                                Coral Reef (50 HP)
                            </button>
                            <button
                                className="sorting-results-reward-btn"
                                onClick={() => unlockDecoration('treasureChest')}
                                disabled={decorations.treasureChest}
                            >
                                Treasure Chest (100 HP)
                            </button>
                            <button
                                className="sorting-results-reward-btn"
                                onClick={() => unlockDecoration('glowingPearl')}
                                disabled={decorations.glowingPearl}
                            >
                                Glowing Pearl (150 HP)
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {gameState === 'gameOver' && (
                <div className="sorting-game-results">
                    <h3>Game Over!</h3>
                    <p>{feedback}</p>
                    <div className="sorting-game-stats">
                        <div className="sorting-stat">
                            <div className="sorting-stat-value">{score}</div>
                            <div className="sorting-stat-label">Score</div>
                        </div>
                        <div className="sorting-stat">
                            <div className="sorting-stat-value">{harmonyPoints}</div>
                            <div className="sorting-stat-label">Harmony Points</div>
                        </div>
                        <div className="sorting-stat">
                            <div className="sorting-stat-value">{bubbleBurstMeter}</div>
                            <div className="sorting-stat-label">Bubble Burst Meter</div>
                        </div>
                    </div>
                    <div className="control-buttons">
                        <button onClick={startGame}>Try Again</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BubbleSortGame;