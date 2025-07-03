import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import './BFSGames.css';

// Word sets by difficulty
const WORD_SETS = {
  easy: [
    'CAT', 'BAT', 'RAT', 'MAT', 'HAT', 'SAT', 'FAT', 'PAT',
    'CAP', 'CAR', 'CAN', 'CAB', 'BAR', 'BAG', 'BAD', 'PAD',
    'PAN', 'MAN', 'MAP', 'NAP', 'SAP', 'TAP', 'TAR', 'TAN',
    'HAD', 'HAP', 'HAM', 'DAM', 'RAM', 'RAP', 'RAN', 'RAG',
    'SAD', 'SAG', 'SIT'
  ],
  medium: [
    'COLD', 'GOLD', 'SOLD', 'BOLD', 'HOLD', 'TOLD', 'FOLD', 'MOLD', 'WOLD', 'YOLD', 'ZOLD',
    'CORD', 'CARD', 'WARD', 'WARM', 'TARD', 'TARN', 'BARN', 'BARK', 'DARK', 'DARN', 'DART',
    'PART', 'PARD', 'PARE', 'PANE', 'PINE', 'PING', 'KING', 'KIND', 'FIND', 'FINE', 'LINE',
    'LION', 'LOIN', 'COIN', 'COIL', 'SOIL', 'FOIL', 'FAIL', 'FALL', 'BALL', 'BELL', 'BILL',
    'BULL', 'BURL', 'BURN', 'TURN', 'TURF', 'SURF', 'SURE', 'CURE', 'CUBE', 'CUTE', 'CITE',
    'SITE', 'SINE', 'SINK', 'SANK', 'SACK', 'PACK', 'PICK', 'PINK', 'PINE', 'LINE', 'LIME',
    'LAME', 'LAMB', 'LIMB', 'LIMP', 'LAMP', 'RAMP', 'RAMP', 'RAMP', 'RAMP', 'RAMP'
  ],
  hard: [
    'STONE', 'SHONE', 'SHORE', 'SCORE', 'SCARE', 'SHARE', 'SHADE', 'SHAKE', 'STOKE', 'STOVE',
    'STAVE', 'SLAVE', 'SLATE', 'PLATE', 'PLACE', 'PEACE', 'PEACH', 'REACH', 'REACT', 'TRACT',
    'TRACK', 'TRICK', 'TRUCK', 'TRUNK', 'DRUNK', 'DRANK', 'CRANK', 'CRACK', 'STACK', 'STICK',
    'STOCK', 'SHOCK', 'SHACK', 'SHANK', 'SHARK', 'SHARP', 'SPARK', 'PLANK', 'BLANK', 'CLANK',
    'CLACK', 'BLACK', 'SLACK', 'FLACK', 'FLANK', 'FRANK', 'PRANK', 'PLANS', 'PLANT', 'PLAZA',
    'PLUSH', 'PLUMB', 'PLUMP', 'PLUME', 'SLANT', 'SLASH'
  ]
};

const DIFFICULTY_WORD_LENGTH = {
  easy: 3,
  medium: 4,
  hard: 5
};

const DIFFICULTY_LABELS = {
  easy: 'Easy (3 letters)',
  medium: 'Medium (4 letters)',
  hard: 'Hard (5 letters)'
};

const DEFAULT_DIFFICULTY = 'medium';

const NODE_TYPES = {
  EMPTY: 'empty',
  START: 'start',
  VISITED: 'visited',
  QUEUE: 'queue',
  PATH: 'path'
};

// Helper to deep clone a tree
function deepClone(node) {
  return JSON.parse(JSON.stringify(node));
}

// Recursively find a node by label
function findNode(node, label) {
  if (node.label === label) return node;
  for (let child of node.children) {
    const found = findNode(child, label);
    if (found) return found;
  }
  return null;
}

// Get all nodes at a given level (BFS)
function getNodesAtLevel(root, level) {
  let current = [root];
  for (let l = 0; l < level; l++) {
    let next = [];
    for (let node of current) {
      next.push(...node.children);
    }
    current = next;
  }
  return current;
}

// Convert internal tree to react-d3-tree format
function convertToD3Tree(node, startWord, selectedWords) {
  if (!node) return null;
  return {
    name: node.label,
    children: node.children?.map(child => convertToD3Tree(child, startWord, selectedWords)) || [],
    _isRoot: node.label === startWord,
    _isUsed: selectedWords.has(node.label),
  };
}

const BFSGames = () => {
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [words, setWords] = useState([]);
  const [startWord, setStartWord] = useState('');
  const [gameState, setGameState] = useState('setup');
  const [tree, setTree] = useState(null); // tree root node
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [message, setMessage] = useState('Select a start word to begin!');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedParent, setSelectedParent] = useState(null); // label of selected parent in current level
  const [history, setHistory] = useState([]);
  const [hintUsed, setHintUsed] = useState(false); // Track if hint has been used

  // Get the current word set and length
  const currentWordSet = WORD_SETS[difficulty];
  const currentWordLength = DIFFICULTY_WORD_LENGTH[difficulty];

  useEffect(() => {
    // Shuffle and set words for the selected difficulty
    const shuffledWords = [...currentWordSet].sort(() => Math.random() - 0.5);
    setWords(shuffledWords);
  }, [difficulty]);

  // Select start word
  const handleWordClick = (word) => {
    if (gameState === 'completed') return;
    if (gameState === 'setup') {
      setStartWord(word);
      setTree({ label: word, children: [] });
      setSelectedWords(new Set([word]));
      setSelectedParent(word);
      setGameState('level');
      setMessage('Now start adding children to the root.');
        }
  };

  // Helper to start a new level
  const startNewLevel = () => {
    const shuffledWords = [...currentWordSet].sort(() => Math.random() - 0.5);
    const newRoot = shuffledWords[0];
    setStartWord(newRoot);
    setTree({ label: newRoot, children: [] });
    setSelectedWords(new Set([newRoot]));
    setSelectedParent(newRoot);
    setGameState('level');
    setWords(shuffledWords);
    setHistory([]);
    setMessage('New level! Start building the tree.');
  };

  // Undo/Previous step
  const handlePrevious = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setTree(prev.tree);
    setSelectedWords(prev.selectedWords);
    setSelectedParent(prev.selectedParent);
    setHistory(history.slice(0, -1));
    setMessage('Went back to the previous step.');
  };

  // Select parent node in the tree (only from previous level)
  const handleTreeNodeClick = (label) => {
    // Only allow selecting parent nodes from the previous level (currentLevel - 1)
    if (currentLevel === 0) {
      setMessage('No parent nodes to select at the root level.');
      return;
    }
    const nodesAtPrevLevel = tree ? getNodesAtLevel(tree, currentLevel) : [];
    const isAtPrevLevel = nodesAtPrevLevel.some(node => node.label === label);
    if (!isAtPrevLevel) {
      setMessage('You can only select a parent node from the previous level!');
      return;
    }
    setSelectedParent(label);
    setMessage(`Selected parent: ${label}. Now click a word below to add as its child.`);
  };

  // Add a word as a child to the selected parent in the next level
  const handleAddChild = (word) => {
    if (!selectedParent) {
      setMessage('Please select a parent node first.');
      return;
    }
    // Only allow adding children to nodes at the previous level
    const nodesAtPrevLevel = tree ? getNodesAtLevel(tree, currentLevel) : [];
    const isAtPrevLevel = nodesAtPrevLevel.some(node => node.label === selectedParent);
    if (!isAtPrevLevel) {
      setMessage('You can only add children to nodes from the previous level!');
      return;
    }
    if (selectedWords.has(word)) {
      setMessage('This word has already been used in the tree!');
      return;
    }
    const parentNode = findNode(tree, selectedParent);
    if (!parentNode) {
      setMessage('Parent node not found.');
      return;
    }
    if (!isOneLetterDifferent(parentNode.label, word)) {
      setMessage('Selected word must differ by exactly one letter from the parent.');
      return;
    }
    // Save current state to history for undo
    setHistory([...history, {
      tree: deepClone(tree),
      selectedWords: new Set(selectedWords),
      selectedParent
    }]);
    const newTree = deepClone(tree);
    const nodeToAddTo = findNode(newTree, selectedParent);
    nodeToAddTo.children.push({ label: word, children: [] });
    const newSelectedWords = new Set([...selectedWords, word]);
    setTree(newTree);
    setSelectedWords(newSelectedWords);
    setMessage(`Added "${word}" as a child of "${selectedParent}". You can continue adding children to "${selectedParent}" or select another parent node from the previous level.`);

    // Check for completion
    if (newSelectedWords.size === currentWordSet.length) {
      setMessage('🎉 Congratulations! You completed the level! Starting a new level...');
      setTimeout(() => {
        startNewLevel();
      }, 2000);
    }
  };

  const isOneLetterDifferent = (word1, word2) => {
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) differences++;
      if (differences > 1) return false;
        }
    return differences === 1;
  };

  const handleNextLevel = () => {
    if (!tree) return;
    const nextLevelNodes = getNodesAtLevel(tree, currentLevel + 1);
    if (nextLevelNodes.length === 0) {
      setMessage('Please add at least one child in this level before moving to the next level.');
      return;
    }
    setCurrentLevel(currentLevel + 1);
    setSelectedParent(null);
    setMessage('Select a parent from the new level to add children.');
  };

  const resetGame = () => {
    setStartWord('');
    setGameState('setup');
    setTree(null);
    setSelectedWords(new Set());
    setCurrentLevel(0);
    setSelectedParent(null);
    setMessage('Select a start word to begin!');
  };

  // Prepare data for react-d3-tree
  const d3TreeData = tree ? [convertToD3Tree(tree, startWord, selectedWords)] : [];

  // Custom node renderer for react-d3-tree
  const renderCustomNode = ({ nodeDatum }) => (
    <g>
      <rect
        width="100"
        height="40"
        x="-50"
        y="-20"
        rx="8"
        fill={nodeDatum._isRoot ? '#4CAF50' : nodeDatum._isUsed ? '#2196F3' : '#fff'}
        stroke="#1976D2"
        strokeWidth="2"
        style={{ cursor: 'pointer' }}
        onClick={() => handleTreeNodeClick(nodeDatum.name)}
      />
      <text
        fill={nodeDatum._isRoot ? '#fff' : nodeDatum._isUsed ? '#fff' : '#1976D2'}
        x="0"
        y="0"
        textAnchor="middle"
        alignmentBaseline="central"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontWeight: nodeDatum._isRoot ? 'bold' : 'normal',
          fontSize: '16px',
          textTransform: 'uppercase',
          stroke: 'none',
          paintOrder: 'fill'
        }}
        pointerEvents="none"
      >
        {nodeDatum.name}
      </text>
    </g>
  );

  // Add hint functionality
  const handleHint = () => {
    if (gameState !== 'setup') {
      setMessage('Hints are only available during setup!');
      return;
    }
    if (hintUsed) {
      setMessage('You have already used your hint!');
      return;
    }
    // Pick a random word from the word set and set as root node
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setStartWord(randomWord);
    setTree({ label: randomWord, children: [] });
    setSelectedWords(new Set([randomWord]));
    setSelectedParent(randomWord);
    setGameState('level');
    setHintUsed(true);
    setMessage(`Hint: The word "${randomWord}" has been added as the root node. Now start adding children to the root.`);
  };

  return (
    <div className="bfsgame-container">
      <h1>
        <span className="bfsgame-title-icon">🌳</span>
        Word Tree Builder
      </h1>
      <div className="bfsgame-difficulty-selector">
        {Object.keys(WORD_SETS).map((level) => (
          <button
            key={level}
            className={`bfsgame-difficulty-btn${difficulty === level ? ' selected' : ''}`}
            onClick={() => {
              setDifficulty(level);
              setGameState('setup');
              setTree(null);
              setSelectedWords(new Set());
              setCurrentLevel(0);
              setSelectedParent(null);
              setHintUsed(false);
              setMessage('Select a start word to begin!');
            }}
          >
            {DIFFICULTY_LABELS[level]}
          </button>
        ))}
        </div>
      <div className="bfsgame-message">{message}</div>
      <div className="bfsgame-main-flex">
        <div className="bfsgame-tree-visual">
          <div style={{ width: '900px', height: '600px', background: '#f5f5f5', borderRadius: '12px', marginBottom: '2rem', marginLeft: 0, position: 'relative' }}>
            {tree && (
              <Tree
                data={d3TreeData}
                orientation="vertical"
                renderCustomNodeElement={renderCustomNode}
                separation={{ siblings: 1.5, nonSiblings: 2 }}
                zoomable
                collapsible={false}
                translate={{ x: 350, y: 80 }}
              />
            )}
        </div>
        </div>
        <div className="bfsgame-word-list">
          {words.map((word, index) => (
              <div
              key={index}
              className={`bfsgame-node ${selectedWords.has(word) ? 'visited' : 'empty'}`}
              onClick={() => {
                if (gameState === 'setup') handleWordClick(word);
                else if (gameState === 'level') handleAddChild(word);
              }}
            >
              {word}
              </div>
            ))}
          </div>
      </div>
      <div className="bfsgame-controls">
        <button className="bfsgame-button" onClick={resetGame}>
          Reset Game
        </button>
        <button className="bfsgame-button" onClick={handlePrevious} disabled={history.length === 0}>
          Previous
        </button>
        <button 
          className={`bfsgame-button ${hintUsed ? 'disabled' : ''}`} 
          onClick={handleHint}
          disabled={hintUsed || gameState !== 'setup'}
        >
          Show Hint
        </button>
        <button
          className="bfsgame-button"
          onClick={handleNextLevel}
          disabled={!tree || gameState !== 'level'}
        >
          Next Level
        </button>
      </div>
    </div>
  );
};

export default BFSGames;

