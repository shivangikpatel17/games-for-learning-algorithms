import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sketch from 'react-p5';
import './StackGame.css';
import backgroundMusic from '../../assets/sounds/Stack-game-bg.mp3';

// StackGame component implementing a block-stacking color sort game
const StackGame = () => {
  // State for stacks, selected stack, game state, and moves
  const [stacks, setStacks] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth * 0.9, height: 600 });
  const canvasRef = useRef(null);
  // Add move history state
  const [moveHistory, setMoveHistory] = useState([]);
  // Add points and purchased stacks state
  const [points, setPoints] = useState(50);
  const [purchasedStacks, setPurchasedStacks] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  // Add audio state
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    // Background music
    audioRef.current = new Audio(backgroundMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(error => {
      console.log('Audio playback failed:', error);
    });

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to toggle audio mute/unmute
  const toggleAudio = (event) => {
    // Prevent event propagation to avoid triggering canvas click
    if (event) {
      event.stopPropagation();
    }
    
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

  // Update canvas size when window resizes
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth * 0.9,
        height: 600
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize game with difficulty settings
  const initializeGame = useCallback(() => {
    let numStacks, blocksPerStack, numColors;
    
    switch(difficulty) {
      case 'easy':
        numStacks = 4;
        blocksPerStack = 3;
        numColors = 3;
        break;
      case 'medium':
        numStacks = 5; // Increased from 5 to 6 to add one more empty stack
        blocksPerStack = 4;
        numColors = 4;
        break;
      case 'hard':
        numStacks = 6;
        blocksPerStack = 5;
        numColors = 5;
        break;
      default:
        numStacks = 4;
        blocksPerStack = 3;
        numColors = 3;
    }
    
    // Add purchased stacks to the total
    numStacks += purchasedStacks;
    
    console.log(`Initializing game with ${numStacks} stacks, ${blocksPerStack} blocks per stack, ${numColors} colors`);
    
    // Create blocks with colors
    const colors = [
      '#FF5252', // Red
      '#4CAF50', // Green
      '#2196F3', // Blue
      '#FFC107', // Yellow
      '#9C27B0', // Purple
      '#FF9800', // Orange
      '#00BCD4', // Cyan
      '#E91E63', // Pink
    ];
    
    const blocks = [];
    for (let i = 0; i < numColors; i++) {
      for (let j = 0; j < blocksPerStack; j++) {
        blocks.push(colors[i]);
      }
    }
    
    // Shuffle blocks
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    }
    
    // Create stacks
    const newStacks = [];
    for (let i = 0; i < numStacks; i++) {
      newStacks.push([]);
    }
    
    // Distribute blocks to stacks
    let blockIndex = 0;
    for (let i = 0; i < numStacks - purchasedStacks; i++) {
      for (let j = 0; j < blocksPerStack; j++) {
        if (blockIndex < blocks.length) {
          newStacks[i].push(blocks[blockIndex]);
          blockIndex++;
        }
      }
    }
    
    console.log('Stacks initialized:', newStacks);
    
    setStacks(newStacks);
    setSelectedStack(null);
    setMoves(0);
    setGameState('playing');
    // Reset move history when initializing a new game
    setMoveHistory([]);
  }, [difficulty, purchasedStacks]);

  // Handle stack click
  const handleStackClick = useCallback((index) => {
    console.log(`Stack ${index} clicked. Current state:`, {
      selectedStack,
      stacks,
      gameState
    });
    
    if (gameState !== 'playing') return;
    
    if (selectedStack === null) {
      // Select the stack if it's not empty
      setSelectedStack(index);
    } else if (selectedStack === index) {
      // Deselect if clicking the same stack
      setSelectedStack(null);
    } else {
      // Try to pour from selected stack to clicked stack
      pourFromTo(selectedStack, index);
    }
  }, [selectedStack, stacks, gameState]);

  // Pour blocks from one stack to another
  const pourFromTo = useCallback((fromIndex, toIndex) => {
    console.log(`Attempting to pour from stack ${fromIndex} to stack ${toIndex}`);
    console.log('From stack contents:', stacks[fromIndex]);
    console.log('To stack contents:', stacks[toIndex]);
    
    const fromStack = stacks[fromIndex];
    const toStack = stacks[toIndex];
    
    // Validate stacks
    if (!fromStack || !toStack) {
      console.error('Invalid stack index');
      return;
    }
    
    // Check if source stack is empty
    if (fromStack.length === 0) {
      console.log('Source stack is empty');
      setSelectedStack(null);
      return;
    }
    
    // Check if destination stack is full
    const maxBlocks = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    if (toStack.length >= maxBlocks) {
      console.log('Destination stack is full');
      setSelectedStack(null);
      return;
    }
    
    // Get the color of the top block in the source stack
    const sourceColor = fromStack[fromStack.length - 1];
    
    // Check if destination stack is empty or has the same color on top
    if (toStack.length === 0 || toStack[toStack.length - 1] === sourceColor) {
      // Create a deep copy of the current stacks for the history
      const stacksCopy = JSON.parse(JSON.stringify(stacks));
      
      // Create new stacks array for the current state
      const newStacks = [...stacks];
      
      // Move the block
      const blockToMove = newStacks[fromIndex].pop();
      newStacks[toIndex].push(blockToMove);
      
      // Save the current state to move history before updating
      setMoveHistory(prevHistory => [...prevHistory, {
        stacks: stacksCopy,
        fromIndex,
        toIndex,
        blockColor: blockToMove
      }]);
      
      // Update state
      setStacks(newStacks);
      setMoves(prev => prev + 1);
      setSelectedStack(null);
      
      // Check game state
      checkGameState(newStacks);
    } else {
      console.log('Cannot pour: different colors');
      setSelectedStack(null);
    }
  }, [stacks, difficulty]);

  // Undo the last move
  const undoLastMove = useCallback(() => {
    if (moveHistory.length === 0) {
      console.log('No moves to undo');
      return;
    }
    
    // Get the last move from history
    const lastMove = moveHistory[moveHistory.length - 1];
    
    // Restore the previous state
    setStacks(JSON.parse(JSON.stringify(lastMove.stacks)));
    
    // Remove the last move from history
    setMoveHistory(prevHistory => prevHistory.slice(0, -1));
    
    // Decrement moves counter
    setMoves(prev => prev - 1);
    
    // Reset game state to playing
    setGameState('playing');
    
    console.log('Undid last move:', lastMove);
  }, [moveHistory]);

  // Check if the game is won or lost
  const checkGameState = useCallback((currentStacks) => {
    const maxBlocks = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    
    // Check if any stack is empty or has all blocks of the same color
    const isWon = currentStacks.every(stack => 
      stack.length === 0 || 
      (stack.length === maxBlocks && stack.every(block => block === stack[0]))
    );
    
    if (isWon) {
      setGameState('won');
      // Award points for winning
      const basePoints = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200;
      const moveBonus = Math.max(0, 100 - moves);
      const totalPoints = basePoints + moveBonus;
      setPoints(prev => prev + totalPoints);
    }
  }, [difficulty, moves]);

  // Reset the game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Change difficulty
  const changeDifficulty = useCallback((newDifficulty) => {
    setDifficulty(newDifficulty);
    // Game will be reinitialized when difficulty changes due to useEffect
  }, []);

  // Purchase an additional empty stack
  const purchaseStack = useCallback(() => {
    const stackCost = 50;
    if (points >= stackCost) {
      setPoints(prev => prev - stackCost);
      setPurchasedStacks(prev => prev + 1);
      setShowPurchaseModal(false);
      // Reinitialize the game with the new stack
      initializeGame();
    } else {
      alert('Not enough points to purchase a stack!');
    }
  }, [points, initializeGame]);

  // Initialize game when difficulty changes
  useEffect(() => {
    console.log('Difficulty changed, reinitializing game');
    initializeGame();
  }, [initializeGame, difficulty]);

  // Initialize game when component mounts
  useEffect(() => {
    console.log('Component mounted, initializing game');
    initializeGame();
  }, [initializeGame]);

  // Setup p5 canvas
  const setup = useCallback((p5, canvasParentRef) => {
    console.log('Setting up canvas with dimensions:', canvasSize);
    
    // Create canvas with explicit dimensions
    const canvas = p5.createCanvas(canvasSize.width, canvasSize.height);
    canvas.parent(canvasParentRef);
    canvasRef.current = canvas;
    
    // Set background to a solid color for visibility
    p5.background(240, 240, 240);
    
    // Set text properties
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(24);
    p5.noStroke();
    
    // Force initial draw
    p5.redraw();
  }, [canvasSize]);

  // Draw the game
  const draw = useCallback((p5) => {
    // Clear the canvas with a solid background
    p5.background(240, 240, 240);
    
    p5.textAlign(p5.CENTER, p5.CENTER);
    
    // Draw moves and points - moved upward
    p5.textSize(24);
    p5.fill(0); // Set text color to black
    p5.text(`Moves: ${moves}`, canvasSize.width / 2, 40);
    p5.text(`Points: ${points}`, canvasSize.width / 2, 70);
    
    // Debug message
    if (!stacks || stacks.length === 0) {
      p5.fill(255, 0, 0);
      p5.textSize(20);
      p5.text('No stacks available. Please reset the game.', canvasSize.width / 2, canvasSize.height / 2);
      return;
    }
    
    // Calculate stack dimensions - use fixed width for stacks
    const stackWidth = 120; // Fixed width for stacks
    const spacing = 30; // Fixed spacing between stacks
    const totalWidth = stacks.length * (stackWidth + spacing) - spacing;
    const startX = (canvasSize.width - totalWidth) / 2;
    const stackY = canvasSize.height * 0.25; 
    const stackHeight = canvasSize.height * 0.6;
    const blockHeight = stackHeight / (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);
    
    console.log(`Drawing ${stacks.length} stacks with width ${stackWidth}, height ${stackHeight}`);
    
    // Draw stacks
    for (let i = 0; i < stacks.length; i++) {
      const stackX = startX + i * (stackWidth + spacing);
      
      // Draw stack container with solid background
      p5.fill(200, 200, 200);
      p5.rect(stackX, stackY, stackWidth, stackHeight, 10);
      
      // Draw blocks in the stack
      const stack = stacks[i];
      console.log(`Stack ${i} has ${stack.length} blocks`);
      
      for (let j = 0; j < stack.length; j++) {
        const blockY = stackY + stackHeight - (j + 1) * blockHeight;
        
        // Draw block with solid color
        const color = stack[j];
        p5.fill(color);
        
        // Main block
        p5.rect(stackX, blockY, stackWidth, blockHeight, 5);
        
        // Add a border to make blocks more visible
        p5.stroke(0, 0, 0, 100);
        p5.strokeWeight(1);
        p5.rect(stackX, blockY, stackWidth, blockHeight, 5);
        p5.noStroke();
      }
      
      // Highlight selected stack
      if (selectedStack === i) {
        p5.noFill();
        p5.stroke(255, 255, 0);
        p5.strokeWeight(4);
        p5.rect(stackX - 5, stackY - 5, stackWidth + 10, stackHeight + 10, 15);
        p5.noStroke();
      }
      
      // Mark purchased stacks with a special indicator
      if (i >= stacks.length - purchasedStacks) {
        p5.noFill();
        p5.stroke(0, 255, 0);
        p5.strokeWeight(2);
        p5.rect(stackX - 3, stackY - 3, stackWidth + 6, stackHeight + 6, 12);
        p5.noStroke();
      }
    }
    
    // Draw game state message
    if (gameState === 'won') {
      p5.fill(0, 0, 0, 200);
      p5.rect(0, 0, canvasSize.width, canvasSize.height);
      p5.fill(255);
      p5.textSize(48);
      p5.text('You Won!', canvasSize.width / 2, canvasSize.height / 2 - 30);
      p5.textSize(24);
      p5.text(`Moves: ${moves}`, canvasSize.width / 2, canvasSize.height / 2 + 30);
      
      // Draw replay button
      const buttonWidth = 200;
      const buttonHeight = 50;
      const buttonX = canvasSize.width / 2 - buttonWidth / 2;
      const buttonY = canvasSize.height / 2 + 80;
      
      // Check if mouse is over the button
      const isMouseOverButton = 
        p5.mouseX >= buttonX && 
        p5.mouseX <= buttonX + buttonWidth && 
        p5.mouseY >= buttonY && 
        p5.mouseY <= buttonY + buttonHeight;
      
      // Draw button with hover effect
      p5.fill(isMouseOverButton ? 100 : 50);
      p5.rect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
      
      // Draw button text
      p5.fill(255);
      p5.textSize(20);
      p5.text('Replay', canvasSize.width / 2, buttonY + buttonHeight / 2);
      
      // Store button position for click detection
      p5.replayButton = {
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight
      };
    } else if (gameState === 'lost') {
      p5.fill(0, 0, 0, 200);
      p5.rect(0, 0, canvasSize.width, canvasSize.height);
      p5.fill(255);
      p5.textSize(48);
      p5.text('Game Over', canvasSize.width / 2, canvasSize.height / 2);
    }
  }, [stacks, selectedStack, moves, gameState, canvasSize, difficulty, points, purchasedStacks]);

  // Handle canvas click
  const handleCanvasClick = useCallback((p5) => {
    if (gameState === 'won') {
      // Check if replay button was clicked
      if (p5.replayButton && 
          p5.mouseX >= p5.replayButton.x && 
          p5.mouseX <= p5.replayButton.x + p5.replayButton.width && 
          p5.mouseY >= p5.replayButton.y && 
          p5.mouseY <= p5.replayButton.y + p5.replayButton.height) {
        // Replay the same level
        resetGame();
        return;
      }
    }
    
    if (gameState !== 'playing') return;
    
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;
    
    // Calculate stack dimensions - use fixed width for stacks
    const stackWidth = 120; // Fixed width for stacks
    const spacing = 30; // Fixed spacing between stacks
    const totalWidth = stacks.length * (stackWidth + spacing) - spacing;
    const startX = (canvasSize.width - totalWidth) / 2;
    const stackY = canvasSize.height * 0.25; // Increased from 0.2 to 0.25 to match the draw function
    const stackHeight = canvasSize.height * 0.6;
    
    // Check if a stack was clicked
    for (let i = 0; i < stacks.length; i++) {
      const stackX = startX + i * (stackWidth + spacing);
      
      if (
        mouseX >= stackX && 
        mouseX <= stackX + stackWidth && 
        mouseY >= stackY && 
        mouseY <= stackY + stackHeight
      ) {
        handleStackClick(i);
        break;
      }
    }
  }, [stacks, gameState, canvasSize, handleStackClick, resetGame]);

  // Handle mouse press
  const mousePressed = useCallback((p5) => {
    handleCanvasClick(p5);
  }, [handleCanvasClick]);

  return (
    <div className="stack-game-container">
      <div className="stack-game-header">
        <h1 className="stack-game-title">Color Cascade</h1>
        <button 
          className="stack-game-mute-button"
          onClick={toggleAudio}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      
      <div className="stack-game-difficulty">
        <span>Difficulty:</span>
        <button 
          className={`stack-game-button ${difficulty === 'easy' ? 'active' : ''}`}
          onClick={() => changeDifficulty('easy')}
        >
          Easy
        </button>
        <button 
          className={`stack-game-button ${difficulty === 'medium' ? 'active' : ''}`}
          onClick={() => changeDifficulty('medium')}
        >
          Medium
        </button>
        <button 
          className={`stack-game-button ${difficulty === 'hard' ? 'active' : ''}`}
          onClick={() => changeDifficulty('hard')}
        >
          Hard
        </button>
      </div>
      
      <div className="stack-game-canvas-container">
        <Sketch 
          setup={setup} 
          draw={draw} 
          mousePressed={mousePressed}
        />
      </div>
      
      <div className="stack-game-controls">
        <button 
          className="stack-game-button"
          onClick={undoLastMove}
          disabled={moveHistory.length === 0}
        >
          Previous
        </button>
        <button 
          className="stack-game-button"
          onClick={resetGame}
        >
          Reset Game
        </button>
        <button 
          className="stack-game-button"
          onClick={() => setShowPurchaseModal(true)}
          disabled={points < 50}
        >
          Buy Empty Stack (50 pts)
        </button>
      </div>
      
      {showPurchaseModal && (
        <div className="stack-game-modal">
          <div className="stack-game-modal-content">
            <h2>Purchase Empty Stack</h2>
            <p>Do you want to purchase an additional empty stack for 50 points?</p>
            <p>Your current points: {points}</p>
            <div className="stack-game-modal-buttons">
              <button 
                className="stack-game-button"
                onClick={purchaseStack}
                disabled={points < 50}
              >
                Purchase
              </button>
              <button 
                className="stack-game-button"
                onClick={() => setShowPurchaseModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="stack-game-instructions">
        <p><strong>How to Play:</strong></p>
        <ol>
          <li>Click on a stack to select it (it will be highlighted with a yellow border).</li>
          <li>Click on another stack to pour the top block from the selected stack to the clicked stack.</li>
          <li>You can only pour a block if the destination stack is empty or if the top block of the destination stack is the same color as the block you're pouring.</li>
          <li>Your goal is to sort all blocks so that each stack contains blocks of the same color.</li>
          <li>The game is won when all stacks are either empty or contain blocks of the same color.</li>
          <li>Use the "Previous" button to undo your last move if you make a mistake.</li>
          <li>Purchase additional empty stacks with points to help you solve the puzzle.</li>
        </ol>
        <p><strong>Difficulty Levels:</strong></p>
        <ul>
          <li><strong>Easy:</strong> 4 stacks, 3 blocks per stack, 3 colors</li>
          <li><strong>Medium:</strong> 6 stacks, 4 blocks per stack, 4 colors (2 empty stacks)</li>
          <li><strong>Hard:</strong> 6 stacks, 5 blocks per stack, 5 colors</li>
        </ul>
        <p><strong>Points System:</strong></p>
        <ul>
          <li>Win on Easy: 50 points + bonus for fewer moves</li>
          <li>Win on Medium: 100 points + bonus for fewer moves</li>
          <li>Win on Hard: 200 points + bonus for fewer moves</li>
          <li>Purchase Empty Stack: 50 points</li>
        </ul>
      </div>
    </div>
  );
};

export default StackGame;