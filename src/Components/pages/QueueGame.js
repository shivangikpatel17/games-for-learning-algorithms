import React, { useState, useEffect, useRef } from 'react';
import p5 from 'p5';
import './QueueGame.css';
// Import sound files
import newEmailSound from '../../assets/sounds/new-email-queue.mp3';
import levelUpSound from '../../assets/sounds/cute-level-up-queuegame.mp3';
import bgMusicFile from '../../assets/sounds/queue-game-bg.mp3';

const QueueGame = () => {
  // Game state
  const [queue, setQueue] = useState([]);
  const [score, setScore] = useState(0);
  const [reputation, setReputation] = useState(100);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState('Welcome to the Post Office!');
  const [money, setMoney] = useState(0);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState(8); // 8 AM start
  const [isRushHour, setIsRushHour] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const maxQueueSize = 8;
  const destinations = ['North', 'South', 'East', 'West'];
  
  // Refs to maintain state between renders
  const p5InstanceRef = useRef(null);
  const gameStateRef = useRef({
    queue: [],
    score: 0,
    reputation: 100,
    level: 1,
    message: 'Welcome to the Post Office!',
    money: 0,
    day: 1,
    time: 8,
    isRushHour: false,
    gamePaused: false,
    gameOver: false
  });
  
  // Sound effects
  const soundEffects = useRef({
    newEmail: new Audio(newEmailSound),
    levelUp: new Audio(levelUpSound),
    error: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'), // Silent audio for error
    success: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'), // Silent audio for success
    bell: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'), // Silent audio for bell
    dayEnd: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU') // Silent audio for day end
  });
  
  // Background music
  const bgMusic = useRef(new Audio(bgMusicFile));
  bgMusic.current.loop = true; // Loop the background music

  // Play sound if enabled
  const playSound = (soundName) => {
    if (soundEnabled && soundEffects.current[soundName]) {
      soundEffects.current[soundName].currentTime = 0;
      soundEffects.current[soundName].play().catch(e => console.log('Sound play error:', e));
    }
  };
  
  // Toggle background music
  const toggleBackgroundMusic = () => {
    if (soundEnabled) {
      bgMusic.current.play().catch(e => console.log('Background music play error:', e));
    } else {
      bgMusic.current.pause();
    }
  };
  
  // Update background music when sound is toggled
  useEffect(() => {
    toggleBackgroundMusic();
  }, [soundEnabled]);

  // Letter types with different properties
  const letterTypes = [
    { type: 'Regular', weight: 0.6, value: 1, color: [255, 255, 200] },
    { type: 'Priority', weight: 0.2, value: 2, color: [255, 200, 200] },
    { type: 'Express', weight: 0.1, value: 3, color: [200, 255, 200] },
    { type: 'International', weight: 0.1, value: 4, color: [200, 200, 255] }
  ];

  // Queue operations
  const enqueue = () => {
    if (gamePaused || gameOver) return;
    
    if (queue.length >= maxQueueSize) {
      setMessage('Sorting table full! Dispatch some letters.');
      setReputation(Math.max(0, reputation - 5));
      playSound('error');
      return;
    }
    
    // Determine letter type based on weights
    const rand = Math.random();
    let cumulativeWeight = 0;
    let selectedType = letterTypes[0];
    
    for (const type of letterTypes) {
      cumulativeWeight += type.weight;
      if (rand <= cumulativeWeight) {
        selectedType = type;
        break;
      }
    }
    
    const newLetter = {
      id: Date.now(), // Unique ID for animation
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      type: selectedType.type,
      value: selectedType.value,
      color: selectedType.color,
      arrivalTime: time,
      priority: Math.random() < 0.2 // 20% chance of being priority
    };
    
    setQueue([...queue, newLetter]);
    setMessage(`New ${newLetter.type} letter for ${newLetter.destination}`);
    playSound('newEmail'); // Play the new email sound
  };

  const dequeue = (truckDestination) => {
    if (gamePaused || gameOver) return;
    
    if (queue.length === 0) {
      setMessage('No letters to dispatch!');
      setReputation(Math.max(0, reputation - 10));
      playSound('error');
      return;
    }
    
    const letter = queue[0];
    if (letter.destination === truckDestination) {
      setQueue(queue.slice(1));
      const points = letter.value * 10 * level;
      setScore(score + points);
      setMoney(money + letter.value * 5);
      setMessage(`Correct! Dispatched ${letter.type} to ${truckDestination}. +${points} points!`);
      playSound('success');
    } else {
      setReputation(Math.max(0, reputation - 15));
      setMessage(`Wrong truck! Needed ${letter.destination}`);
      playSound('error');
    }
  };

  const peek = () => {
    if (gamePaused || gameOver) return;
    
    if (queue.length === 0) {
      setMessage('Queue is empty!');
      return;
    }
    
    const nextLetter = queue[0];
    setMessage(`Next: ${nextLetter.type} letter for ${nextLetter.destination}${nextLetter.priority ? ' (Priority!)' : ''}`);
    playSound('bell');
  };

  const togglePause = () => {
    setGamePaused(!gamePaused);
    setMessage(gamePaused ? 'Game resumed!' : 'Game paused!');
    
    // Pause/resume background music
    if (gamePaused) {
      bgMusic.current.play().catch(e => console.log('Background music play error:', e));
    } else {
      bgMusic.current.pause();
    }
  };

  const resetGame = () => {
    setQueue([]);
    setScore(0);
    setReputation(100);
    setLevel(1);
    setMoney(0);
    setDay(1);
    setTime(8);
    setGameOver(false);
    setMessage('Welcome to the Post Office! Click "Start Game" to begin!');
    playSound('dayEnd');
    
    // Restart background music
    bgMusic.current.currentTime = 0;
    if (soundEnabled) {
      bgMusic.current.play().catch(e => console.log('Background music play error:', e));
    }
  };

  // Initialize game on first load
  useEffect(() => {
    // Only show instructions on first load
    const hasPlayedBefore = localStorage.getItem('hasPlayedQueueGame');
    if (!hasPlayedBefore) {
      setShowInstructions(true);
      localStorage.setItem('hasPlayedQueueGame', 'true');
    }
  }, []);

  // Time progression
  useEffect(() => {
    if (gamePaused || gameOver) return;
    
    const timeInterval = setInterval(() => {
      setTime(prevTime => {
        const newTime = prevTime + 0.1;
        if (newTime >= 24) {
          setDay(prevDay => prevDay + 1);
          setTime(8); // Reset to 8 AM
          playSound('dayEnd');
          return 8;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, [gamePaused, gameOver]);

  // Rush hour detection
  useEffect(() => {
    const isRush = (time >= 7 && time <= 9) || (time >= 11 && time <= 14) || (time >= 16 && time <= 18);
    setIsRushHour(isRush);
  }, [time]);

  // Random letter arrivals
  useEffect(() => {
    if (gamePaused || gameOver) return;
    
    const baseInterval = isRushHour ? 500 : 1000;
    const interval = setInterval(() => {
      if (Math.random() < 0.25 * level * (isRushHour ? 2 : 1)) {
        enqueue();
      }
    }, baseInterval);
    
    return () => clearInterval(interval);
  }, [queue, level, isRushHour, gamePaused, gameOver]);

  // Reputation decay for delays
  useEffect(() => {
    if (gamePaused || gameOver) return;
    
    const decay = setInterval(() => {
      if (queue.length > 3) {
        setReputation(Math.max(0, reputation - 2));
        setMessage('Letters piling up! Dispatch quickly.');
      }
    }, 5000);
    
    return () => clearInterval(decay);
  }, [queue, reputation, gamePaused, gameOver]);

  // Level up and game over
  useEffect(() => {
    if (score >= level * 100) {
      setLevel(level + 1);
      setMessage(`Level ${level + 1}! More letters incoming!`);
      playSound('levelUp');
    }
    
    if (reputation <= 0) {
      setGameOver(true);
      setMessage('Game Over! Reputation lost.');
      playSound('error');
    }
  }, [score, reputation]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'e' || e.key === 'E') enqueue();
      if (e.key === '1') dequeue('North');
      if (e.key === '2') dequeue('South');
      if (e.key === '3') dequeue('East');
      if (e.key === '4') dequeue('West');
      if (e.key === 'p' || e.key === 'P') peek();
      if (e.key === ' ') togglePause();
      if (e.key === 'r' || e.key === 'R') resetGame();
      if (e.key === 'm' || e.key === 'M') setSoundEnabled(!soundEnabled);
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [queue, score, reputation, gamePaused, gameOver, soundEnabled]);

  // Update game state ref when state changes
  useEffect(() => {
    gameStateRef.current = {
      queue,
      score,
      reputation,
      level,
      message,
      money,
      day,
      time,
      isRushHour,
      gamePaused,
      gameOver
    };
  }, [queue, score, reputation, level, message, money, day, time, isRushHour, gamePaused, gameOver]);

  // Initialize background music on component mount
  useEffect(() => {
    if (soundEnabled) {
      bgMusic.current.play().catch(e => console.log('Background music play error:', e));
    }
    
    return () => {
      bgMusic.current.pause();
      bgMusic.current.currentTime = 0;
    };
  }, []);

  // p5.js sketch
  const sketch = (p) => {
    let letters = [];
    let trucks = [
      { destination: 'North', x: 50, y: 380, ready: true, color: [100, 100, 255] },
      { destination: 'South', x: 200, y: 380, ready: true, color: [255, 100, 100] },
      { destination: 'East', x: 350, y: 380, ready: true, color: [100, 255, 100] },
      { destination: 'West', x: 500, y: 380, ready: true, color: [255, 255, 100] }
    ];
    
    let clouds = [];
    let birds = [];
    
    // Initialize clouds and birds
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: p.random(p.width),
        y: p.random(50, 100),
        size: p.random(50, 100),
        speed: p.random(0.2, 0.5)
      });
    }
    
    for (let i = 0; i < 3; i++) {
      birds.push({
        x: p.random(p.width),
        y: p.random(50, 100),
        speed: p.random(1, 2),
        wingAngle: 0,
        wingSpeed: p.random(0.1, 0.2)
      });
    }

    p.setup = () => {
      // Get the container element
      const container = document.getElementById('queue-canvas-container');
      
      // Create a responsive canvas that fills the container
      const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
      canvas.parent('queue-canvas-container');
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('Arial');
      
      // Add resize handler
      p.windowResized = () => {
        p.resizeCanvas(container.clientWidth, container.clientHeight);
      };
    };

    p.draw = () => {
      // Get current game state from ref
      const gameState = gameStateRef.current;
      
      // Draw sky background
      const skyColor = gameState.time < 6 || gameState.time > 18 ? [20, 20, 50] : // Night
                       gameState.time < 7 || gameState.time > 17 ? [100, 100, 200] : // Dawn/Dusk
                       [150, 200, 255]; // Day
      p.background(skyColor);
      
      // Draw sun/moon
      const sunY = p.map(gameState.time, 0, 24, p.height, -100);
      const sunX = p.map(gameState.time, 0, 24, 0, p.width);
      p.fill(gameState.time < 6 || gameState.time > 18 ? [200, 200, 220] : [255, 255, 200]);
      p.noStroke();
      p.ellipse(sunX, sunY, 60, 60);
      
      // Draw clouds
      p.fill(255, 255, 255, 200);
      clouds.forEach(cloud => {
        p.ellipse(cloud.x, cloud.y, cloud.size, cloud.size/2);
        cloud.x += cloud.speed;
        if (cloud.x > p.width + cloud.size) cloud.x = -cloud.size;
      });
      
      // Draw birds
      p.fill(0);
      birds.forEach(bird => {
        bird.wingAngle += bird.wingSpeed;
        const wingY = Math.sin(bird.wingAngle) * 10;
        
        p.push();
        p.translate(bird.x, bird.y);
        p.rotate(Math.PI / 6);
        p.line(-10, wingY, 10, 0);
        p.line(-10, -wingY, 10, 0);
        p.pop();
        
        bird.x += bird.speed;
        if (bird.x > p.width + 20) bird.x = -20;
      });
      
      // Draw ground
      p.fill(100, 150, 100);
      p.rect(0, p.height * 0.8, p.width, p.height * 0.2);
      
      // Draw post office building
      p.fill(200, 150, 150);
      p.rect(p.width * 0.1, p.height * 0.3, p.width * 0.8, p.height * 0.5);
      
      // Draw roof
      p.fill(150, 100, 100);
      p.triangle(p.width * 0.1, p.height * 0.3, p.width * 0.5, p.height * 0.2, p.width * 0.9, p.height * 0.3);
      
      // Draw door
      p.fill(100, 50, 50);
      p.rect(p.width * 0.45, p.height * 0.7, 40, 50);
      
      // Draw windows
      p.fill(200, 200, 255);
      p.rect(p.width * 0.2, p.height * 0.4, 60, 80);
      p.rect(p.width * 0.35, p.height * 0.4, 60, 80);
      p.rect(p.width * 0.65, p.height * 0.4, 60, 80);
      p.rect(p.width * 0.8, p.height * 0.4, 60, 80);
      
      // Draw sorting table
      p.fill(200, 150, 100);
      p.rect(p.width * 0.05, p.height * 0.5, p.width * 0.9, p.height * 0.16);
      p.fill(150, 100, 50);
      p.rect(p.width * 0.05, p.height * 0.66, p.width * 0.9, p.height * 0.02);
      
      p.fill(0);
      p.textSize(16);
      p.text('Sorting Table', p.width * 0.5, p.height * 0.58);
      
      // Draw clock
      p.fill(255);
      p.ellipse(p.width * 0.9, p.height * 0.1, 60, 60);
      p.fill(0);
      p.textSize(12);
      const hour = Math.floor(gameState.time);
      const minute = Math.floor((gameState.time - hour) * 60);
      const timeStr = `${hour}:${minute < 10 ? '0' : ''}${minute}`;
      p.text(timeStr, p.width * 0.9, p.height * 0.1);
      
      // Draw day counter - moved downwards
      p.textSize(14);
      p.text(`Day ${gameState.day}`, p.width * 0.9, p.height * 0.2);
      
      // Update letters based on queue
      letters = gameState.queue.map((letter, i) => ({
        id: letter.id,
        destination: letter.destination,
        type: letter.type,
        color: letter.color,
        priority: letter.priority,
        x: p.width * 0.1 + i * (p.width * 0.8 / maxQueueSize),
        y: p.height * 0.56,
        targetX: p.width * 0.1 + i * (p.width * 0.8 / maxQueueSize),
        rotation: 0
      }));

      // Draw letters
      letters.forEach((letter) => {
        p.push();
        p.translate(letter.x, letter.y);
        p.rotate(letter.rotation);
        
        // Draw envelope
        p.fill(letter.color);
        p.rect(-30, -20, 60, 40);
        
        // Draw priority stamp if needed
        if (letter.priority) {
          p.fill(255, 0, 0);
          p.ellipse(-15, -15, 20, 20);
          p.fill(255);
          p.textSize(8);
          p.text('P', -15, -15);
        }
        
        // Draw destination
        p.fill(0);
        p.textSize(12);
        p.text(letter.destination, 0, 0);
        
        // Draw letter type
        p.textSize(8);
        p.text(letter.type, 0, 10);
        
        p.pop();
        
        // Animate letter sliding
        if (letter.x !== letter.targetX) {
          letter.x += (letter.targetX - letter.x) * 0.1;
        }
        
        // Add slight rotation animation
        letter.rotation = Math.sin(p.frameCount * 0.05 + letter.id * 0.01) * 0.05;
      });

      // Draw road
      p.fill(100);
      p.rect(0, p.height * 0.72, p.width, p.height * 0.08);
      p.stroke(255);
      p.strokeWeight(2);
      for (let i = 0; i < p.width; i += 40) {
        p.line(i, p.height * 0.76, i + 20, p.height * 0.76);
      }
      p.noStroke();

      // Draw trucks
      trucks.forEach((truck, index) => {
        // Position trucks evenly across the road
        const truckX = p.width * (0.2 + index * 0.2);
        truck.x = truckX;
        truck.y = p.height * 0.76; // Update truck y position to be on the road
        
        p.push();
        p.translate(truck.x, truck.y);
        
        // Truck body
        p.fill(truck.ready ? truck.color : [50, 50, 50]);
        p.rect(-50, -30, 100, 60);
        
        // Truck cab
        p.fill(truck.ready ? [truck.color[0] * 0.8, truck.color[1] * 0.8, truck.color[2] * 0.8] : [40, 40, 40]);
        p.rect(-40, -40, 30, 20);
        
        // Wheels
        p.fill(0);
        p.ellipse(-30, 10, 20, 20);
        p.ellipse(30, 10, 20, 20);
        
        // Destination text
        p.fill(0);
        p.textSize(14);
        p.text(truck.destination, 0, 0);
        
        // Flash lights when ready
        if (truck.ready && p.frameCount % 60 < 30) {
          p.fill(255, 255, 0);
          p.ellipse(-40, -20, 10, 10);
          p.ellipse(40, -20, 10, 10);
        }
        
        p.pop();
      });
      
      // Draw rush hour indicator
      if (gameState.isRushHour) {
        p.fill(255, 0, 0, 150);
        p.rect(0, 0, p.width, 5);
        p.fill(255);
        p.textSize(12);
        p.text('RUSH HOUR!', p.width * 0.1, 15);
      }
    };
  };

  // Initialize p5.js canvas only once
  useEffect(() => {
    if (!p5InstanceRef.current) {
      p5InstanceRef.current = new p5(sketch, document.getElementById('queue-canvas-container'));
    }
    
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="queue-game">
      <div className="queue-header">
        <h1 className="queue-title">Post Office Sorting Game</h1>
        <button className="queue-sound-button" onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
        </button>
      </div>
      <div id="queue-canvas-container" className="queue-canvas"></div>
      
      {/* Direction buttons group */}
      <div className="queue-controls direction-controls">
        <button className="queue-button" onClick={() => dequeue('North')}>Dispatch North (1)</button>
        <button className="queue-button" onClick={() => dequeue('South')}>Dispatch South (2)</button>
        <button className="queue-button" onClick={() => dequeue('East')}>Dispatch East (3)</button>
        <button className="queue-button" onClick={() => dequeue('West')}>Dispatch West (4)</button>
      </div>
      
      {/* Control buttons group */}
      <div className="queue-controls control-buttons">
        <button className="queue-button" onClick={enqueue}>New Letter (E)</button>
        <button className="queue-button" onClick={peek}>Peek Next (P)</button>
        <button className="queue-button" onClick={togglePause}>{gamePaused ? 'Resume (Space)' : 'Pause (Space)'}</button>
        <button className="queue-button" onClick={resetGame}>Reset Game (R)</button>
      </div>
      
      <div className="queue-stats">
        <p className="queue-stat">Score: {score}</p>
        <p className="queue-stat">Money: ${money.toFixed(2)}</p>
        <p className="queue-stat">Reputation: {reputation}%</p>
        <p className="queue-stat">Level: {level}</p>
        <p className="queue-stat">Day: {day} | Time: {Math.floor(time)}:{(Math.floor((time - Math.floor(time)) * 60) < 10 ? '0' : '') + Math.floor((time - Math.floor(time)) * 60)}</p>
        <p className="queue-stat">{isRushHour ? 'RUSH HOUR!' : 'Normal hours'}</p>
        <p className="queue-message">{message}</p>
        {gameOver && (
          <div className="queue-game-over">
            <h2 className="queue-game-over-title">Game Over!</h2>
            <p className="queue-game-over-stat">Final Score: {score}</p>
            <p className="queue-game-over-stat">Money Earned: ${money.toFixed(2)}</p>
            <button className="queue-button" onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>

      {showInstructions && (
        <div className="queue-instructions-modal">
          <div className="queue-instructions-content">
            <h2>How to Play Queue Game</h2>
            <div className="queue-instructions-text">
              <p>Welcome to the Post Office Queue Game! Your job is to manage incoming letters and dispatch them to the correct destinations.</p>
              
              <h3>Game Rules:</h3>
              <ul>
                <li>Letters arrive at your sorting table and need to be dispatched to trucks going North, South, East, or West.</li>
                <li>Click the "New Letter" button to receive a new letter.</li>
                <li>Use the "Peek" button to see the next letter's destination.</li>
                <li>Click the corresponding direction button (N/S/E/W) to dispatch the letter to the correct truck.</li>
                <li>Dispatch letters quickly to maintain your reputation!</li>
                <li>Watch out for rush hours when letters arrive more frequently.</li>
              </ul>

              <h3>Scoring:</h3>
              <ul>
                <li>Regular letters: 10 points × level</li>
                <li>Priority letters: 20 points × level</li>
                <li>Express letters: 30 points × level</li>
                <li>International letters: 40 points × level</li>
                <li>Wrong dispatches reduce your reputation</li>
                <li>Game ends if reputation drops to 0</li>
              </ul>

              <h3>Tips:</h3>
              <ul>
                <li>Use the peek feature to plan your dispatches</li>
                <li>Keep an eye on your reputation</li>
                <li>Handle priority letters quickly</li>
                <li>Prepare for rush hours</li>
              </ul>
            </div>
            <button className="queue-button" onClick={() => setShowInstructions(false)}>Start Game</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueGame;