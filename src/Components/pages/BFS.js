import React, { useState, useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import './bfs.css';

const BFS = () => {
    const canvasRef = useRef(null);
    const bfsHistoryRef = useRef([]);
    const [graph, setGraph] = useState({
        nodes: ['A', 'B', 'C', 'D', 'E'],
        edges: [
            ['A', 'B'],
            ['A', 'C'],
            ['B', 'D'],
            ['C', 'E'],
            ['D', 'E']
        ]
    });
    const [dist, setDist] = useState({});
    const [reach, setReach] = useState({});
    const [queue, setQueue] = useState([]);
    const [currentNode, setCurrentNode] = useState(null);
    const [step, setStep] = useState(-1);
    const [finished, setFinished] = useState(false);
    const [sequence, setSequence] = useState([]);
    const [levelSequence, setLevelSequence] = useState([]);
    const [visitedEdges, setVisitedEdges] = useState(new Set());
    
    // Custom graph generation states
    const [showCustomGraph, setShowCustomGraph] = useState(false);
    const [customNodes, setCustomNodes] = useState('');
    const [customEdges, setCustomEdges] = useState('');
    const [customError, setCustomError] = useState('');

    const generateRandomGraph = () => {
        const numNodes = Math.floor(Math.random() * 5) + 5; // 5-9 nodes
        const nodes = Array.from({ length: numNodes }, (_, i) => String.fromCharCode(65 + i));
        const edges = [];
        
        // Ensure graph is connected
        for (let i = 1; i < nodes.length; i++) {
            const randomNode = nodes[Math.floor(Math.random() * i)];
            edges.push([randomNode, nodes[i]]);
        }
        
        // Add some random edges
        const maxEdges = Math.floor((numNodes * (numNodes - 1)) / 4);
        const currentEdges = edges.length;
        
        for (let i = currentEdges; i < maxEdges; i++) {
            const node1 = nodes[Math.floor(Math.random() * nodes.length)];
            const node2 = nodes[Math.floor(Math.random() * nodes.length)];
            if (node1 !== node2 && !edges.some(([a, b]) => 
                (a === node1 && b === node2) || (a === node2 && b === node1))) {
                edges.push([node1, node2]);
            }
        }
        
        setGraph({ nodes, edges });
        resetState();
    };

    const resetState = () => {
        setDist({});
        setReach({});
        setQueue([]);
        setCurrentNode(null);
        setStep(-1);
        setFinished(false);
        setSequence([]);
        setLevelSequence([]);
        setVisitedEdges(new Set());
        bfsHistoryRef.current = [];
    };

    useEffect(() => {
        generateRandomGraph();
    }, []);

    const bfs = {
        history: [],
        traverse: (startNode) => {
            if (!graph.nodes.includes(startNode)) {
                console.error(`Start node ${startNode} not in graph`);
                return;
            }

            const visited = new Set();
            const queue = [{ node: startNode, depth: 0, parent: null }];
            let sequence = [];
            let levelSequence = [{ node: startNode, depth: 0 }];
            let visitedEdges = new Set();
            const dist = { [startNode]: 0 };
            const reach = { [startNode]: true };

            // Step 1: Initialize queue
            bfs.history.push({
                node: startNode,
                dist: { ...dist },
                reach: { ...reach },
                queue: queue.map(q => q.node),
                sequence: [...sequence],
                levelSequence: [...levelSequence],
                visitedEdges: new Set(visitedEdges),
                step: 1 // Initialize queue
            });

            while (queue.length > 0) {
                const { node: vertex, depth, parent } = queue.shift();
                
                if (!visited.has(vertex)) {
                    visited.add(vertex);
                    
                    // Only add edge to sequence if it's part of the path (has a parent)
                    if (parent) {
                        sequence = [...sequence, `${parent}->${vertex}`];
                        visitedEdges.add(`${parent}-${vertex}`);
                    }

                    // Step 2: Process current node
                    bfs.history.push({
                        node: vertex,
                        dist: { ...dist },
                        reach: { ...reach },
                        queue: queue.map(q => q.node),
                        sequence: [...sequence],
                        levelSequence: [...levelSequence],
                        visitedEdges: new Set(visitedEdges),
                        step: 2 // Process current node
                    });

                    const neighbors = graph.edges
                        .filter(edge => edge[0] === vertex || edge[1] === vertex)
                        .map(edge => edge[0] === vertex ? edge[1] : edge[0])
                        .filter(neighbor => !visited.has(neighbor));

                    for (const neighbor of neighbors) {
                        queue.push({ node: neighbor, depth: depth + 1, parent: vertex });
                        dist[neighbor] = (dist[vertex] || 0) + 1;
                        reach[neighbor] = true;
                        levelSequence = [...levelSequence, { node: neighbor, depth: depth + 1 }];
                        
                        // Don't add edge to visitedEdges here, only when the node is actually visited

                        // Step 3: Enqueue neighbor
                        bfs.history.push({
                            node: vertex,
                            dist: { ...dist },
                            reach: { ...reach },
                            queue: queue.map(q => q.node),
                            sequence: [...sequence],
                            levelSequence: [...levelSequence],
                            visitedEdges: new Set(visitedEdges),
                            step: 3 // Enqueue neighbor
                        });
                    }
                }
            }

            // Step 4: Final state
            bfs.history.push({
                node: null,
                dist: { ...dist },
                reach: { ...reach },
                queue: [],
                sequence: [...sequence],
                levelSequence: [...levelSequence],
                visitedEdges: new Set(visitedEdges),
                step: 4 // Final state
            });

            setSequence(sequence);
            setLevelSequence(levelSequence);
            setVisitedEdges(visitedEdges);
            console.log('BFS History:', bfs.history);
        }
    };

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(600, 600).parent(canvasParentRef);
        p5.textAlign(p5.CENTER, p5.CENTER);
        // Move the origin to the center of the canvas
        p5.translate(p5.width/2, p5.height/2);
    };

    const draw = (p5) => {
        p5.background(255);
        
        // Move to the center of the canvas
        p5.translate(p5.width/2, p5.height/2);
        
        // Calculate radius based on canvas size - significantly reduced
        const radius = Math.min(p5.width, p5.height) * 0.15; // Increased slightly for better visibility
        
        // Node size based on radius - smaller nodes
        const nodeSize = radius * 0.4;
        
        const nodePositions = {};
        
        // Position nodes in a circle relative to center (0,0)
        const totalNodes = graph.nodes.length;
        graph.nodes.forEach((node, i) => {
            const angle = (i * 2 * Math.PI) / totalNodes;
            nodePositions[node] = {
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            };
        });

        // Draw edges as undirected lines first
        p5.stroke(200);
        p5.strokeWeight(0.5);
        graph.edges.forEach(edge => {
            const [from, to] = edge;
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];
            p5.line(fromPos.x, fromPos.y, toPos.x, toPos.y);
        });

        // Draw edges in the BFS path sequence
        graph.edges.forEach(edge => {
            const [from, to] = edge;
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];
            
            const isInSequence = sequence.some(seq => {
                const [seqFrom, seqTo] = seq.split('->');
                return (seqFrom === from && seqTo === to) || (seqFrom === to && seqTo === from);
            });
            
            if (isInSequence) {
                const matchingSeq = sequence.find(seq => {
                    const [seqFrom, seqTo] = seq.split('->');
                    return (seqFrom === from && seqTo === to) || (seqFrom === to && seqTo === from);
                });
                
                if (matchingSeq) {
                    const [start, end] = matchingSeq.split('->');
                    
                    if (nodePositions[start] && nodePositions[end]) {
                        const startPos = nodePositions[start];
                        const endPos = nodePositions[end];

                        p5.stroke(0, 150, 0);
                        p5.strokeWeight(1);
                        p5.line(startPos.x, startPos.y, endPos.x, endPos.y);

                        const angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
                        const arrowSize = nodeSize * 0.3;
                        const arrowDistance = 0.6;

                        const arrowX = startPos.x + (endPos.x - startPos.x) * arrowDistance;
                        const arrowY = startPos.y + (endPos.y - startPos.y) * arrowDistance;

                        p5.push();
                        p5.translate(arrowX, arrowY);
                        p5.rotate(angle);
                        p5.fill(0, 150, 0);
                        p5.noStroke();
                        p5.triangle(
                            0, -arrowSize/2,
                            0, arrowSize/2,
                            arrowSize, 0
                        );
                        p5.pop();
                    }
                }
            }
        });

        // Draw nodes
        Object.entries(nodePositions).forEach(([node, pos]) => {
            const isCurrent = currentNode === node;
            const isReached = reach[node] === true;
            const isInQueue = queue.includes(node);
            
            p5.fill(isCurrent ? '#2196F3' : isReached ? '#4CAF50' : isInQueue ? '#FFC107' : '#ccc');
            
            p5.stroke(0);
            p5.strokeWeight(0.5);
            p5.ellipse(pos.x, pos.y, nodeSize, nodeSize);
            p5.fill(0);
            p5.noStroke();
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(nodeSize * 0.6);
            p5.text(node, pos.x, pos.y);
        });
    };

    const handleStart = () => {
        resetState();
        
        // Initialize the BFS history with an empty state
        const initialHistory = [{
            node: null,
            dist: {},
            reach: {},
            queue: [],
            sequence: [],
            levelSequence: [],
            visitedEdges: new Set(),
            step: 0 // Initial state
        }];
        
        bfsHistoryRef.current = initialHistory;
        setStep(0); // Set step to 0 to enable the Next Step button
        
        // Perform BFS traversal
        bfs.traverse(graph.nodes[0]);
        
        // Update the history ref with the complete history
        bfsHistoryRef.current = bfs.history;
        
        console.log('BFS History after traversal:', bfsHistoryRef.current);
        
        // Set the initial state
        setDist({});
        setReach({});
        setQueue([]);
        setCurrentNode(null);
        setSequence([]);
        setLevelSequence([]);
        setVisitedEdges(new Set());
        setFinished(false);
        
        console.log('Initial state set, step:', 0, 'history length:', bfsHistoryRef.current.length);
    };

    const handlePrevStep = () => {
        if (step > 0) {
            const newStep = step - 1;
            setStep(newStep);
            const history = bfsHistoryRef.current[newStep];
            
            // Update all state variables based on the current history step
            setDist({ ...history.dist });
            setReach({ ...history.reach });
            setQueue([...history.queue]);
            setCurrentNode(history.node);
            setSequence([...history.sequence]);
            setLevelSequence([...history.levelSequence]);
            setVisitedEdges(new Set(history.visitedEdges));
            setFinished(newStep === bfsHistoryRef.current.length - 1);
            
            console.log(`Previous Step: ${newStep}, History:`, history);
        }
    };

    const handleNextStep = () => {
        if (step < bfsHistoryRef.current.length - 1) {
            const newStep = step + 1;
            setStep(newStep);
            const history = bfsHistoryRef.current[newStep];
            
            // Update all state variables based on the current history step
            setDist({ ...history.dist });
            setReach({ ...history.reach });
            setQueue([...history.queue]);
            setCurrentNode(history.node);
            setSequence([...history.sequence]);
            setLevelSequence([...history.levelSequence]);
            setVisitedEdges(new Set(history.visitedEdges));
            setFinished(newStep === bfsHistoryRef.current.length - 1);
            
            console.log(`Next Step: ${newStep}, History:`, history);
            console.log(`Current Node: ${history.node}, Queue: ${history.queue.join(', ')}, Step: ${history.step}`);
        }
    };

    const getLevelStyles = (level) => ({
        marginLeft: `${level * 20}px`,
        fontFamily: 'monospace',
        whiteSpace: 'pre'
    });

    const handleCustomGraphSubmit = () => {
        setCustomError('');
        
        // Parse nodes
        const nodes = customNodes.split(',').map(node => node.trim()).filter(node => node);
        if (nodes.length === 0) {
            setCustomError('Please enter at least one node');
            return;
        }
        
        // Parse edges
        const edges = [];
        const edgeLines = customEdges.split('\n').filter(line => line.trim());
        
        for (const line of edgeLines) {
            const [from, to] = line.split(',').map(node => node.trim());
            if (!from || !to) {
                setCustomError('Invalid edge format. Use format: Node1,Node2');
                return;
            }
            
            if (!nodes.includes(from) || !nodes.includes(to)) {
                setCustomError(`Edge contains node not in the node list: ${from},${to}`);
                return;
            }
            
            edges.push([from, to]);
        }
        
        // Check if graph is connected
        if (edges.length === 0) {
            setCustomError('Please enter at least one edge');
            return;
        }
        
        // Create graph
        setGraph({ nodes, edges });
        resetState();
    };

    const handleClearCustomGraph = () => {
        setCustomNodes('');
        setCustomEdges('');
        setCustomError('');
    };

    return (
        <div className="bfs-graph-visualization">
            <div className="bfs-graph-visualization-header" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ textAlign: "center", marginBottom: "0", width: "100%", fontSize: "32px" }}>Breadth-First Search Visualization</h2>
                <p style={{ marginTop: "10px", marginBottom: "30px", maxWidth: "800px", margin: "0 auto", textAlign: "left", padding: "0 20px" }}>
                    Breadth-First Search (BFS) is a graph traversal algorithm that starts at the root node (source node) and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level. It uses a queue to keep track of the nodes to be explored.
                </p>
            </div>
            <div className="bfs-graph-visualization-content">
                <div className="bfs-graph-canvas-section">
                    <div ref={canvasRef} className="bfs-graph-canvas-wrapper">
                        <Sketch setup={setup} draw={draw} />
                    </div>
                    <div className="bfs-controls">
                        <div className="bfs-control-buttons">
                            <button onClick={generateRandomGraph}>New Graph</button>
                            <button onClick={() => setShowCustomGraph(!showCustomGraph)}>
                                {showCustomGraph ? 'Hide Custom Graph' : 'Custom Graph'}
                            </button>
                            <button onClick={handleStart}>BFS</button>
                            <button 
                                onClick={handlePrevStep} 
                                disabled={step <= 0}
                                style={{ opacity: step <= 0 ? 0.5 : 1 }}
                            >
                                Previous Step
                            </button>
                            <button 
                                onClick={handleNextStep} 
                                disabled={step >= bfsHistoryRef.current.length - 1 || step === -1}
                                style={{ opacity: step >= bfsHistoryRef.current.length - 1 || step === -1 ? 0.5 : 1 }}
                            >
                                Next Step
                            </button>
                        </div>
                        
                        {sequence.length > 0 && (
                            <div className="bfs-graph-sequence-display">
                                <h3>BFS Path Sequence:</h3>
                                <p>{sequence.join(" → ")}</p>
                            </div>
                        )}
                        
                        {showCustomGraph && (
                            <div className="bfs-custom-graph-form">
                                <h3>Create Custom Graph</h3>
                                <div className="bfs-form-group">
                                    <label>Nodes (comma-separated):</label>
                                    <input 
                                        type="text" 
                                        value={customNodes} 
                                        onChange={(e) => setCustomNodes(e.target.value)}
                                        placeholder="A, B, C, D, E"
                                    />
                                </div>
                                <div className="bfs-form-group">
                                    <label>Edges (one per line, format: Node1,Node2):</label>
                                    <textarea 
                                        value={customEdges} 
                                        onChange={(e) => setCustomEdges(e.target.value)}
                                        placeholder="A,B&#10;A,C&#10;B,D&#10;C,E&#10;D,E"
                                        rows={5}
                                    />
                                </div>
                                {customError && <div className="bfs-error-message">{customError}</div>}
                                <div className="bfs-form-buttons">
                                    <button onClick={handleCustomGraphSubmit}>Create Graph</button>
                                    <button onClick={handleClearCustomGraph} className="bfs-clear-button">Clear</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bfs-graph-right-section">
                    <div className="bfs-graph-algorithm-box">
                        <pre>
                            <span className={bfsHistoryRef.current[step]?.step === 0 ? 'bfs-graph-highlight' : ''}>
                                {`BFS(graph, start):\n0. Initial state\n\tqueue = []\n\tvisited = {}`}
                            </span>
                            {'\n\n'}
                            <span className={bfsHistoryRef.current[step]?.step === 1 ? 'bfs-graph-highlight' : ''}>
                                {`1. Initialize queue with start node\n\tqueue = [(start, 0, null)]\n\tcurrent = start`}
                            </span>
                            {'\n\n'}
                            <span className={bfsHistoryRef.current[step]?.step === 2 ? 'bfs-graph-highlight' : ''}>
                                {`2. Process current node\n\tvertex = queue.shift()\n\tvisited.add(vertex)\n\tcurrent = vertex`}
                            </span>
                            {'\n\n'}
                            <span className={bfsHistoryRef.current[step]?.step === 3 ? 'bfs-graph-highlight' : ''}>
                                {`3. Enqueue unvisited neighbors\n\tfor neighbor in graph[vertex]:\n\t\tif neighbor not in visited:\n\t\t\tqueue.push((neighbor, depth+1, vertex))\n\t\t\tdist[neighbor] = dist[vertex] + 1`}
                            </span>
                            {'\n\n'}
                            <span className={bfsHistoryRef.current[step]?.step === 4 ? 'bfs-graph-highlight' : ''}>
                                {`4. Final state\n\treturn visited, dist`}
                            </span>
                        </pre>
                    </div>
                    {levelSequence.length > 0 && (
                        <div className={`bfs-graph-level-sequence ${levelSequence.length > 0 ? 'visible' : ''}`}>
                            <h3>BFS Level Sequence:</h3>
                            <div className="bfs-graph-level-structure">
                                {levelSequence.map((item, index) => (
                                    <div key={index} style={getLevelStyles(item.depth)}>
                                        Level {item.depth}: {item.node}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="bfs-graph-complexity-box">
                        <h3>Complexity Analysis</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Case</th>
                                    <th>Time Complexity</th>
                                    <th>Space Complexity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Best</td>
                                    <td>O(V + E)</td>
                                    <td>O(V)</td>
                                </tr>
                                <tr>
                                    <td>Average</td>
                                    <td>O(V + E)</td>
                                    <td>O(V)</td>
                                </tr>
                                <tr>
                                    <td>Worst</td>
                                    <td>O(V + E)</td>
                                    <td>O(V)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BFS;