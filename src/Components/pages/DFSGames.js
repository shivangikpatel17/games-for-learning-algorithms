import React, { useState, useRef, useEffect } from 'react';
import './DFSGames.css';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DIFFICULTY_LEVELS = {
  easy: { min: 5, max: 7 },
  medium: { min: 8, max: 10 },
  hard: { min: 11, max: 12 }
};

function generateRandomGraph(difficulty = 'easy') {
  const { min, max } = DIFFICULTY_LEVELS[difficulty];
  let nodes, edges, hamiltonian;
  do {
    const nodeCount = getRandomInt(min, max);
    nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      name: String.fromCharCode(65 + (i % 26)),
      x: getRandomInt(60, 800),
      y: getRandomInt(60, 600)
    }));
    edges = [];
    for (let i = 0; i < nodeCount; i++) {
      let toIdx = getRandomInt(0, nodeCount - 1);
      while (toIdx === i) toIdx = getRandomInt(0, nodeCount - 1);
      edges.push({ from: nodes[i].id, to: nodes[toIdx].id });
    }
    const extraEdges = getRandomInt(nodeCount, nodeCount * 2);
    for (let i = 0; i < extraEdges; i++) {
      let fromIdx = getRandomInt(0, nodeCount - 1);
      let toIdx = getRandomInt(0, nodeCount - 1);
      while (toIdx === fromIdx || edges.some(e => e.from === nodes[fromIdx].id && e.to === nodes[toIdx].id)) {
        fromIdx = getRandomInt(0, nodeCount - 1);
        toIdx = getRandomInt(0, nodeCount - 1);
      }
      edges.push({ from: nodes[fromIdx].id, to: nodes[toIdx].id });
    }
    hamiltonian = findHamiltonianCycle(nodes, edges);
  } while (!hamiltonian || hamiltonian.length === 0);
  return { nodes, edges };
}

const initialDifficulty = 'easy';
const { nodes: initialNodes, edges: initialEdges } = generateRandomGraph(initialDifficulty);

// Helper: check if there is a path from start to end using BFS
function isReachable(start, end, edges) {
  if (start === end) return true;
  const visited = new Set();
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === end) return true;
    visited.add(node);
    edges.forEach(e => {
      if (e.from === node && !visited.has(e.to)) {
        queue.push(e.to);
      }
    });
  }
  return false;
}

// Helper: find a path from start to end using BFS, returns the path as an array of node ids
function findPath(start, end, edges) {
  if (start === end) return [start];
  const queue = [[start]];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];
    if (node === end) return path;
    edges.forEach(e => {
      if (e.from === node && !visited.has(e.to)) {
        visited.add(e.to);
        queue.push([...path, e.to]);
      }
    });
  }
  return null;
}

// Helper: Find all cycles using DFS, return the longest one
function findLongestCycle(nodes, edges) {
  let longest = [];
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => { adj[e.from].push(e.to); });

  function dfs(node, visited, path) {
    visited[node] = true;
    path.push(node);
    for (let neighbor of adj[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor, visited, path);
      } else {
        // Found a cycle
        const idx = path.indexOf(neighbor);
        if (idx !== -1) {
          const cycle = path.slice(idx).concat(neighbor);
          if (cycle.length > longest.length) longest = [...cycle];
        }
      }
    }
    path.pop();
    visited[node] = false;
  }
  for (let n of nodes) {
    dfs(n.id, {}, []);
  }
  // Remove duplicate last node for comparison
  if (longest.length > 1 && longest[0] === longest[longest.length - 1]) longest.pop();
  return longest;
}

function areCyclesEqual(cycleA, cycleB) {
  // Work on copies to avoid mutating input
  let a = [...cycleA];
  let b = [...cycleB];
  // Remove duplicate last node if present
  if (a.length > 1 && a[0] === a[a.length - 1]) a = a.slice(0, -1);
  if (b.length > 1 && b[0] === b[b.length - 1]) b = b.slice(0, -1);
  if (a.length !== b.length) return false;
  // Try all rotations and both directions
  for (let dir of [1, -1]) {
    for (let offset = 0; offset < b.length; offset++) {
      let match = true;
      for (let i = 0; i < a.length; i++) {
        const idx = (offset + dir * i + b.length) % b.length;
        if (a[i] !== b[idx]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }
  return false;
}

// Helper: Find a Hamiltonian cycle using backtracking
function findHamiltonianCycle(nodes, edges) {
  const n = nodes.length;
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => { adj[e.from].push(e.to); });

  let result = null;
  function backtrack(path, visited) {
    if (result) return;
    if (path.length === n) {
      // Check if last node connects to first to form a cycle
      if (adj[path[path.length - 1]].includes(path[0])) {
        result = [...path, path[0]];
      }
      return;
    }
    for (let neighbor of adj[path[path.length - 1]]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);
        backtrack(path, visited);
        path.pop();
        visited.delete(neighbor);
      }
    }
  }
  for (let start of nodes) {
    backtrack([start.id], new Set([start.id]));
    if (result) break;
  }
  // Ensure the result is a true Hamiltonian cycle
  if (result && result.length === n + 1 && result[0] === result[result.length - 1]) {
    return result;
  }
  return [];
}

function isHamiltonianCycle(cycle, nodes) {
  if (cycle.length !== nodes.length + 1) return false;
  if (cycle[0] !== cycle[cycle.length - 1]) return false;
  const unique = new Set(cycle.slice(0, -1));
  return unique.size === nodes.length;
}

// Helper: Find all Hamiltonian cycles using backtracking
function findAllHamiltonianCycles(nodes, edges) {
  const n = nodes.length;
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => { adj[e.from].push(e.to); });
  const cycles = [];
  function backtrack(path, visited) {
    if (path.length === n) {
      if (adj[path[path.length - 1]].includes(path[0])) {
        const cycle = [...path, path[0]];
        // Check for uniqueness (up to rotation and direction)
        if (!cycles.some(c => areCyclesEqual(c, cycle))) {
          cycles.push(cycle);
        }
      }
      return;
    }
    for (let neighbor of adj[path[path.length - 1]]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        path.push(neighbor);
        backtrack(path, visited);
        path.pop();
        visited.delete(neighbor);
      }
    }
  }
  for (let start of nodes) {
    backtrack([start.id], new Set([start.id]));
  }
  return cycles;
}

const DFSGames = () => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedPath, setSelectedPath] = useState([]);
  const [cycle, setCycle] = useState(null);
  const [message, setMessage] = useState('Click nodes to form a path. Find the longest cycle to win!');
  const [waitingForEdgeRemoval, setWaitingForEdgeRemoval] = useState(false);
  const [draggingNode, setDraggingNode] = useState(null);
  const [longestCycle, setLongestCycle] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [allHamiltonianCycles, setAllHamiltonianCycles] = useState([]);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Update longest cycle on graph change (now using Hamiltonian cycle)
  useEffect(() => {
    const allCycles = findAllHamiltonianCycles(nodes, edges);
    setAllHamiltonianCycles(allCycles);
    setLongestCycle(allCycles[0] || []);
  }, [nodes, edges]);

  // Reset showAnswer on new graph or reset
  useEffect(() => {
    setShowAnswer(false);
  }, [nodes, edges]);

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
    const { nodes: newNodes, edges: newEdges } = generateRandomGraph(newDifficulty);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedPath([]);
    setCycle(null);
    setWaitingForEdgeRemoval(false);
    setMessage('Click nodes to form a path. Find the longest cycle to win!');
  };

  const handleNodeClick = (nodeId) => {
    if (cycle || waitingForEdgeRemoval) return;
    if (selectedPath.length === 0) {
      setSelectedPath([nodeId]);
      setMessage('');
      return;
    }
    const lastNode = selectedPath[selectedPath.length - 1];
    const isDirectlyConnected = edges.some(e => e.from === lastNode && e.to === nodeId);
    if (!isDirectlyConnected) {
      setSelectedPath([nodeId]);
      setMessage('Nodes are not directly connected! Path reset.');
        return;
    }
    const idx = selectedPath.indexOf(nodeId);
    if (idx !== -1) {
      const foundCycle = selectedPath.slice(idx).concat(nodeId);
      // Check if user cycle is a valid Hamiltonian cycle and matches any found
      const isHamiltonian = isHamiltonianCycle(foundCycle, nodes);
      const matchesAny = allHamiltonianCycles.some(c => areCyclesEqual(foundCycle, c));
      if (isHamiltonian && matchesAny) {
        setCycle(foundCycle);
        setMessage('🎉 You found a Hamiltonian cycle! You win!');
        setWaitingForEdgeRemoval(false);
      } else {
        setCycle(foundCycle);
        setMessage('This is not a Hamiltonian cycle. Try again!');
        setWaitingForEdgeRemoval(false);
        setTimeout(() => {
          setSelectedPath([]);
          setCycle(null);
        }, 1000);
      }
    } else {
      setSelectedPath([...selectedPath, nodeId]);
      setMessage('');
    }
  };

  // Update isEdgeInPath to highlight only edges traversed in selectedPath/cycle
  const isEdgeInPath = (from, to) => {
    const path = cycle || selectedPath;
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] === from && path[i + 1] === to) return true;
    }
    if (cycle && path.length > 1 && path[0] === to && path[path.length - 1] === from) return true;
    return false;
  };

  const handleEdgeClick = (from, to) => {
    if (!waitingForEdgeRemoval || !cycle) return;
    let isInCycle = false;
    for (let i = 0; i < cycle.length - 1; i++) {
      if (cycle[i] === from && cycle[i + 1] === to) isInCycle = true;
    }
    if (cycle.length > 1 && cycle[0] === to && cycle[cycle.length - 1] === from) isInCycle = true;
    if (isInCycle) {
      setWaitingForEdgeRemoval(false);
      setEdges(prevEdges => prevEdges.filter(edge => !(edge.from === from && edge.to === to)));
      setTimeout(() => {
        setSelectedPath([]);
        setCycle(null);
        setMessage('Edge removed! Try to find another cycle.');
      }, 0);
    }
  };

  const resetGame = () => {
    const { nodes: newNodes, edges: newEdges } = generateRandomGraph(difficulty);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedPath([]);
    setCycle(null);
    setWaitingForEdgeRemoval(false);
    setMessage('Click nodes to form a path. Find the longest cycle to win!');
  };

  const newGraph = () => {
    const { nodes: newNodes, edges: newEdges } = generateRandomGraph(difficulty);
    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedPath([]);
    setCycle(null);
    setWaitingForEdgeRemoval(false);
    setMessage('Click nodes to form a path. Find the longest cycle to win!');
  };

  // Drag and drop handlers
  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    setDraggingNode(nodeId);
    dragOffset.current = {
      x: e.clientX - node.x,
      y: e.clientY - node.y
    };
  };

  const handleMouseMove = (e) => {
    if (draggingNode === null) return;
    setNodes(nodes => nodes.map(node =>
      node.id === draggingNode
        ? { ...node, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }
        : node
    ));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleShowAnswer = () => {
    setShowAnswer(v => !v);
  };

  return (
    <div className="dfs-game-root"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="dfs-header">
        <span role="img" aria-label="satellite">🛰️</span> Network Deadlock Detection
      </div>
      <div className="dfs-controls-bar">
        <label>
          Difficulty:
          <select value={difficulty} onChange={handleDifficultyChange} style={{ marginLeft: 4 }}>
            <option value="easy">Easy (5-7 nodes)</option>
            <option value="medium">Medium (8-10 nodes)</option>
            <option value="hard">Hard (11-12 nodes)</option>
          </select>
        </label>
        <button onClick={resetGame}>Reset</button>
        <button onClick={newGraph} style={{ marginLeft: 8 }}>New Graph</button>
        <button
          onClick={handleShowAnswer}
          style={{ marginLeft: 8, background: '#283593', color: '#fff' }}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
      <div className="dfs-graph-area">
        <svg className="dfs-graph-svg">
          <defs>
            <marker id="arrowhead-main" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
              <polyline points="0,0 8,4 0,8" fill="none" stroke="#283593" strokeWidth="2" />
            </marker>
          </defs>
          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            // Highlight answer edges if showAnswer is true
            let answerEdge = false;
            if (showAnswer && longestCycle.length > 1) {
              for (let i = 0; i < longestCycle.length - 1; i++) {
                if (longestCycle[i] === edge.from && longestCycle[i + 1] === edge.to) answerEdge = true;
              }
              // For cycle, also check closing edge
              if (longestCycle[0] === edge.to && longestCycle[longestCycle.length - 1] === edge.from) answerEdge = true;
            }
            const inPath = showAnswer ? answerEdge : isEdgeInPath(edge.from, edge.to);
            return (
              <g key={idx} style={{ cursor: waitingForEdgeRemoval && cycle && inPath ? 'pointer' : 'default' }}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={(() => { const dx = toNode.x - fromNode.x; const dy = toNode.y - fromNode.y; const len = Math.sqrt(dx * dx + dy * dy); const offset = 24; const ratio = (len - offset) / len; return fromNode.x + dx * ratio; })()}
                  y2={(() => { const dx = toNode.x - fromNode.x; const dy = toNode.y - fromNode.y; const len = Math.sqrt(dx * dx + dy * dy); const offset = 24; const ratio = (len - offset) / len; return fromNode.y + dy * ratio; })()}
                  stroke={inPath ? "#FFD600" : "#283593"}
                  strokeWidth={inPath ? 4 : 3}
                  markerEnd="url(#arrowhead-main)"
                  className={inPath ? "dfs-blocked-edge dfs-answer-edge" : "dfs-edge"}
                  style={{
                    opacity: 1,
                    filter: 'none'
                  }}
                  onClick={() => !showAnswer && handleEdgeClick(edge.from, edge.to)}
                />
              </g>
            );
          })}
        </svg>
        {nodes.map(node => {
          // Highlight answer nodes if showAnswer is true
          let answerNode = false;
          if (showAnswer && longestCycle.length > 0) {
            answerNode = longestCycle.includes(node.id);
          }
          return (
          <div
            key={node.id}
              className={`dfs-node${(cycle ? cycle.includes(node.id) : selectedPath.includes(node.id)) ? ' dfs-node-cycle' : ''}${showAnswer && answerNode ? ' dfs-answer-node' : ''}`}
              style={{ left: node.x, top: node.y, zIndex: draggingNode === node.id ? 10 : 2 }}
              onClick={() => !showAnswer && handleNodeClick(node.id)}
              onMouseDown={e => !showAnswer && handleMouseDown(e, node.id)}
          >
            <span className="dfs-node-label">{node.name}</span>
          </div>
          );
        })}
      </div>
      <div className="dfs-message">{message}</div>
      <div className="dfs-instructions">
        <p>
          <b>Instructions:</b> This is a <b>directed graph</b>. Click nodes to form a path. Only directly connected nodes (following the arrow direction) can be selected in sequence. Find the longest cycle to win! Use "New Graph" to generate a new random graph. <b>You can also drag nodes to rearrange the graph.</b>
        </p>
      </div>
    </div>
  );
};

export default DFSGames;
