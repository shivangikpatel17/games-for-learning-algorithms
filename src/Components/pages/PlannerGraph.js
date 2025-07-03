import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import './PlannerGraph.css';
import confetti from 'canvas-confetti';

// Helper: check if two edges cross (excluding shared vertices)
const doEdgesCross = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
  if (denominator === 0) return false;
  const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
  const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;
  return ua > 0 && ua < 1 && ub > 0 && ub < 1;
};

// Function to check if adding an edge would create a crossing
const wouldCreateCrossing = (edges, newEdge) => {
  for (const edge of edges) {
    // Skip if edges share a vertex
    if (edge[0] === newEdge[0] || edge[0] === newEdge[1] || 
        edge[1] === newEdge[0] || edge[1] === newEdge[1]) {
      continue;
    }
    
    // Check if edges cross
    const [x1, y1] = edge;
    const [x2, y2] = newEdge;
    
    // If edges are adjacent in the cycle, they can't cross
    if (Math.abs(x1 - x2) === 1 || Math.abs(y1 - y2) === 1) {
      continue;
    }
    
    // Check if the edges would cross in a planar embedding
    // This is a simplified check - in a real planar graph, we'd need a more complex algorithm
    const isCrossing = (x1 < x2 && y1 > y2) || (x1 > x2 && y1 < y2);
    if (isCrossing) {
      return true;
    }
  }
  return false;
};

// Function to generate a random planar graph
const generateRandomPlanarGraph = (numVertices) => {
  // Start with a cycle to ensure connectivity
  const edges = [];
  for (let i = 0; i < numVertices; i++) {
    edges.push([i, (i + 1) % numVertices]);
  }

  // Add random edges while maintaining planarity
  const maxEdges = 3 * numVertices - 6; // Maximum edges for a planar graph
  const currentEdges = numVertices; // We already have the cycle edges

  // Create a list of all possible edges
  const possibleEdges = [];
  for (let i = 0; i < numVertices; i++) {
    for (let j = i + 2; j < numVertices; j++) {
      // Skip adjacent vertices (already connected in cycle)
      if (j === (i + 1) % numVertices) continue;
      possibleEdges.push([i, j]);
    }
  }

  // Shuffle possible edges
  for (let i = possibleEdges.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possibleEdges[i], possibleEdges[j]] = [possibleEdges[j], possibleEdges[i]];
  }

  // Try to add edges while maintaining planarity
  for (const edge of possibleEdges) {
    if (edges.length >= maxEdges) break;
    
    // Only add edge if it doesn't create a crossing
    if (!wouldCreateCrossing(edges, edge)) {
      edges.push(edge);
    }
  }

  // Ensure the graph is not too sparse
  const minEdges = numVertices + Math.floor(numVertices / 2);
  if (edges.length < minEdges) {
    // Add more edges if needed, still maintaining planarity
    for (const edge of possibleEdges) {
      if (edges.length >= minEdges) break;
      if (!edges.some(e => e[0] === edge[0] && e[1] === edge[1]) && 
          !wouldCreateCrossing(edges, edge)) {
        edges.push(edge);
      }
    }
  }

  return {
    name: `${numVertices} Nodes`,
    vertices: numVertices,
    edges: edges,
    difficulty: numVertices <= 6 ? 'Easy' : numVertices <= 8 ? 'Medium' : 'Hard'
  };
};

function GraphThumbnail({ design }) {
  const n = design.vertices;
  const r = 30;
  const cx = 40, cy = 40;
  const points = Array.from({length: n}, (_, i) => {
    const angle = (2 * Math.PI * i) / n;
    return [
      cx + r * Math.cos(angle),
      cy + r * Math.sin(angle)
    ];
  });
  return (
    <svg width={80} height={80}>
      {design.edges.map(([a, b], i) => (
        (points[a] && points[b]) ? (
          <line
            key={i}
            x1={points[a][0]} y1={points[a][1]}
            x2={points[b][0]} y2={points[b][1]}
            stroke="#333"
          />
        ) : null
      ))}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="#111" />
      ))}
    </svg>
  );
}

const countCrossings = (edges, vertices) => {
  let count = 0;
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      const e1 = edges[i];
      const e2 = edges[j];
      // Ignore if edges share a vertex
      if (e1.from === e2.from || e1.from === e2.to || e1.to === e2.from || e1.to === e2.to) continue;
      if (doEdgesCross(
        vertices[e1.from].x, vertices[e1.from].y,
        vertices[e1.to].x, vertices[e1.to].y,
        vertices[e2.from].x, vertices[e2.from].y,
        vertices[e2.to].x, vertices[e2.to].y
      )) {
        count++;
      }
    }
  }
  return count;
};

const PlanarityGame = () => {
  const sketchRef = useRef();
  const [moves, setMoves] = useState(0);
  const [crossings, setCrossings] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [mode, setMode] = useState('select');
  const [bestMoves, setBestMoves] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const stateRef = useRef({
    vertices: [],
    edges: [],
    selectedVertex: null,
    dragOffset: { x: 0, y: 0 },
    vertexRadius: 15,
    numVertices: 0,
  });
  const confettiIntervalRef = useRef(null);

  useEffect(() => {
    if (mode !== 'play' || !selectedDesign) return;
    // Helper: count crossings, ignoring edges that share a vertex
    const countCrossings = () => {
      let count = 0;
      const { edges, vertices } = stateRef.current;
      for (let i = 0; i < edges.length; i++) {
        for (let j = i + 1; j < edges.length; j++) {
          const e1 = edges[i];
          const e2 = edges[j];
          // Ignore if edges share a vertex
          if (e1.from === e2.from || e1.from === e2.to || e1.to === e2.from || e1.to === e2.to) continue;
          if (doEdgesCross(
            vertices[e1.from].x, vertices[e1.from].y,
            vertices[e1.to].x, vertices[e1.to].y,
            vertices[e2.from].x, vertices[e2.from].y,
            vertices[e2.to].x, vertices[e2.to].y
          )) {
            count++;
          }
        }
      }
      return count;
    };

    // Helper: for each edge, check if it is involved in any crossing
    const getEdgeCrossingStatus = () => {
      const { edges, vertices } = stateRef.current;
      const edgeStatus = new Array(edges.length).fill(false); // false = not crossing
      for (let i = 0; i < edges.length; i++) {
        for (let j = 0; j < edges.length; j++) {
          if (i === j) continue;
          const e1 = edges[i];
          const e2 = edges[j];
          // Ignore if edges share a vertex
          if (e1.from === e2.from || e1.from === e2.to || e1.to === e2.from || e1.to === e2.to) continue;
          if (doEdgesCross(
            vertices[e1.from].x, vertices[e1.from].y,
            vertices[e1.to].x, vertices[e1.to].y,
            vertices[e2.from].x, vertices[e2.from].y,
            vertices[e2.to].x, vertices[e2.to].y
          )) {
            edgeStatus[i] = true; // This edge is involved in a crossing
            break;
          }
        }
      }
      return edgeStatus;
    };

    // Generate the selected graph design
    const generateSelectedGraph = () => {
      const { vertices: n, edges } = selectedDesign;
      // Place vertices randomly within the canvas
      const verts = [];
      const radius = 250;
      const centerX = 400, centerY = 300;
      for (let i = 0; i < n; i++) {
        verts.push({
          id: i,
          x: centerX + (Math.random() - 0.5) * 2 * radius,
          y: centerY + (Math.random() - 0.5) * 2 * radius
        });
      }
      stateRef.current.vertices = verts;
      stateRef.current.edges = edges.map(([from, to]) => ({ from, to }));
      stateRef.current.numVertices = n;
    };

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 600);
        generateSelectedGraph();
        setMoves(0);
        setTimeout(() => setCrossings(countCrossings()), 100); // Initial count
      };

      p.mousePressed = () => {
        const { vertices, vertexRadius } = stateRef.current;
        const mouseX = p.mouseX;
        const mouseY = p.mouseY;
        for (let i = vertices.length - 1; i >= 0; i--) {
          const v = vertices[i];
          const dx = mouseX - v.x;
          const dy = mouseY - v.y;
          if (dx * dx + dy * dy <= vertexRadius * vertexRadius) {
            stateRef.current.selectedVertex = i;
            stateRef.current.dragOffset = { x: dx, y: dy };
            setMoves(prev => prev + 1);
            break;
          }
        }
      };

      p.mouseDragged = () => {
        if (stateRef.current.selectedVertex !== null) {
          const { selectedVertex, dragOffset } = stateRef.current;
          stateRef.current.vertices[selectedVertex].x = p.mouseX - dragOffset.x;
          stateRef.current.vertices[selectedVertex].y = p.mouseY - dragOffset.y;
          setCrossings(countCrossings());
        }
      };

      p.mouseReleased = () => {
        stateRef.current.selectedVertex = null;
        const newCrossings = countCrossings();
        setCrossings(newCrossings);
        if (newCrossings === 0) {
          setIsComplete(true);
          setShowCongrats(true);
          triggerConfetti();
        } else {
          setShowCongrats(false);
        }
      };

      p.draw = () => {
        p.background(255);
        const { vertices, edges, vertexRadius } = stateRef.current;
        // Highlight non-intersecting lines
        const edgeStatus = getEdgeCrossingStatus();
        // Draw edges
        edges.forEach((edge, idx) => {
          const v1 = vertices[edge.from];
          const v2 = vertices[edge.to];
          p.stroke(edgeStatus[idx] ? 0 : 'green');
        p.strokeWeight(2);
          p.line(v1.x, v1.y, v2.x, v2.y);
        });
        // Draw vertices
        vertices.forEach((v, i) => {
          p.fill(i === stateRef.current.selectedVertex ? '#4CAF50' : '#2196F3');
          p.stroke(0);
          p.strokeWeight(2);
          p.ellipse(v.x, v.y, vertexRadius * 2);
            p.fill(255);
          p.noStroke();
          p.textAlign(p.CENTER, p.CENTER);
          p.text(i, v.x, v.y);
        });
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, [mode, selectedDesign]);

  const generateNewGraph = () => {
    if (selectedDesign) {
      // Clear any ongoing confetti animations
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
      
      const { vertices: n, edges } = selectedDesign;
      const verts = [];
      const radius = 250;
      const centerX = 400, centerY = 300;
      for (let i = 0; i < n; i++) {
        verts.push({
          id: i,
          x: centerX + (Math.random() - 0.5) * 2 * radius,
          y: centerY + (Math.random() - 0.5) * 2 * radius
        });
      }
      stateRef.current.vertices = verts;
      stateRef.current.edges = edges.map(([from, to]) => ({ from, to }));
      stateRef.current.numVertices = n;
      setMoves(0);
      setShowCongrats(false);
      setIsComplete(false);

      // Calculate and set initial crossings count
      const initialCrossings = countCrossings(stateRef.current.edges, stateRef.current.vertices);
      setCrossings(initialCrossings);
    }
  };

  const triggerConfetti = () => {
    // Clear any existing confetti
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    confettiIntervalRef.current = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  // Group designs by difficulty
  const groupedDesigns = {
    Easy: [4, 5, 6],
    Medium: [7, 8],
    Hard: [9, 10]
  };

  return (
    <div className="game-container">
      <h1>
        <span className="game-title-icon">🎯</span>
        Untangle Graph
      </h1>
      {mode === 'select' && (
        <>
          <p>Choose number of nodes to play. Click a thumbnail to start.<br/>Non-intersecting lines are highlighted in green.</p>
          <div className="graph-grid">
            {Object.entries(groupedDesigns).map(([difficulty, nodeCounts]) => (
              <div key={difficulty} className="graph-group">
                <div className="graph-group-label">{difficulty}</div>
                <div className="graph-group-thumbnails">
                  {nodeCounts.map((vertices) => {
                    // Generate a sample graph for the thumbnail
                    const sampleGraph = generateRandomPlanarGraph(vertices);
                    return (
                      <div
                        key={difficulty + '-' + vertices}
                        className="graph-thumbnail"
                        onClick={() => {
                          // Generate a new random graph when selected
                          const newGraph = generateRandomPlanarGraph(vertices);
                          setSelectedDesign(newGraph);
                          setMode('play');
                        }}
                      >
                        <GraphThumbnail design={sampleGraph} />
                        <div className="graph-label">{vertices} Nodes</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {mode === 'play' && selectedDesign && (
        <>
          <div className="game-controls">
            <button className="back-button" onClick={() => setMode('select')}>
              <span className="button-icon">←</span> Back to Designs
            </button>
            <button className="new-graph-button" onClick={generateNewGraph}>
              <span className="button-icon">🔄</span> New Graph
            </button>
          </div>
          <div className="stats-panel">
            <div className="stats-group">
              <div className="stat-item">
                <span className="stat-label">Crossings</span>
                <span className="stat-value">{crossings}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Moves</span>
                <span className="stat-value">{moves}</span>
              </div>
            </div>
            {(bestMoves) && (
              <div className="stats-group best-stats">
                <div className="stat-item">
                  <span className="stat-label">Best Moves</span>
                  <span className="stat-value">{bestMoves || '-'}</span>
                </div>
              </div>
            )}
      </div>
          {showCongrats && (
            <div className="completion-message">
              <h2>🎉 Congratulations! 🎉</h2>
              <p>You've untangled the graph!</p>
              <div className="completion-stats">
                <p>Moves: {moves}</p>
      </div>
        </div>
      )}
      <div ref={sketchRef} className="canvas"></div>
        </>
      )}
    </div>
  );
};

export default PlanarityGame;
