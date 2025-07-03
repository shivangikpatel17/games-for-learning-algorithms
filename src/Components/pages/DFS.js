import React, { useState, useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import './dfs.css';

const DFS = () => {
    const canvasRef = useRef(null);
    const dfsHistoryRef = useRef([]);
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
    const [visited, setVisited] = useState({});
    const [currentNode, setCurrentNode] = useState(null);
    const [step, setStep] = useState(-1);
    const [sequence, setSequence] = useState([]);
    const [treeSequence, setTreeSequence] = useState([]);
    const [discoveryTime, setDiscoveryTime] = useState({});
    const [finishTime, setFinishTime] = useState({});
    const [time, setTime] = useState(0);
    
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
        
        // Reset state before updating graph
        resetState();
        
        // Set the new graph
        setGraph({ nodes, edges });
        
        // Initialize DFS history with an empty state
        const initialHistory = [{
            node: null,
            visited: {},
            sequence: [],
            treeSequence: [],
            discoveryTime: {},
            finishTime: {},
            time: 0,
            step: 0 // Initial state
        }];
        
        dfsHistoryRef.current = initialHistory;
        setStep(0); // Set step to 0 to enable the Next Step button
    };

    const resetState = () => {
        setVisited({});
        setCurrentNode(null);
        setStep(-1);
        setSequence([]);
        setTreeSequence([]);
        setDiscoveryTime({});
        setFinishTime({});
        setTime(0);
        dfsHistoryRef.current = [];
    };

    useEffect(() => {
        generateRandomGraph();
    }, []);

    const draw = (p5) => {
        p5.background(255);
        
        // Move to the center of the canvas
        p5.translate(p5.width/2, p5.height/2);
        
        // Calculate radius based on canvas size 
        const radius = Math.min(p5.width, p5.height) * 0.15; 
        
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

        // Draw visited edges with arrows
        graph.edges.forEach(edge => {
            const [from, to] = edge;
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];
            
            const forwardEdge = `${from}->${to}`;
            const reverseEdge = `${to}->${from}`;
            const isForwardInSequence = sequence.includes(forwardEdge);
            const isReverseInSequence = sequence.includes(reverseEdge);
            const isInSequence = isForwardInSequence || isReverseInSequence;
            
            if (isInSequence) {
                p5.stroke(0, 200, 0);
                p5.strokeWeight(1);
                p5.line(fromPos.x, fromPos.y, toPos.x, toPos.y);

                let arrowFrom, arrowTo;
                
                if (isForwardInSequence) {
                    arrowFrom = fromPos;
                    arrowTo = toPos;
                } else {
                    arrowFrom = toPos;
                    arrowTo = fromPos;
                }
                
                const angle = Math.atan2(arrowTo.y - arrowFrom.y, arrowTo.x - arrowFrom.x);
                const arrowSize = nodeSize * 0.3;
                const arrowDistance = 0.6;

                const arrowX = arrowFrom.x + (arrowTo.x - arrowFrom.x) * arrowDistance;
                const arrowY = arrowFrom.y + (arrowTo.y - arrowFrom.y) * arrowDistance;

                p5.push();
                p5.translate(arrowX, arrowY);
                p5.rotate(angle);
                p5.fill(0, 200, 0);
                p5.noStroke();
                p5.triangle(
                    0, -arrowSize/2,
                    0, arrowSize/2,
                    arrowSize, 0
                );
                p5.pop();
            }
        });

        // Draw nodes
        Object.entries(nodePositions).forEach(([node, pos]) => {
            const isCurrent = currentNode === node;
            const isVisited = visited[node] === true;
            
            if (isCurrent) {
                p5.fill(0, 0, 255);
                p5.stroke(0, 0, 200);
                p5.strokeWeight(1);
            } else if (isVisited) {
                p5.fill(0, 255, 0);
                p5.stroke(0, 200, 0);
                p5.strokeWeight(0.5);
            } else {
                p5.fill(220, 220, 220);
                p5.stroke(150, 150, 150);
                p5.strokeWeight(0.5);
            }
            
            p5.ellipse(pos.x, pos.y, nodeSize, nodeSize);
            
            p5.fill(0);
            p5.noStroke();
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.textSize(nodeSize * 0.6);
            p5.text(node, pos.x, pos.y);
        });
    };

    const handlePrevStep = () => {
        if (step > 0) {
            const newStep = step - 1;
            setStep(newStep);
            const history = dfsHistoryRef.current[newStep];
            setVisited({ ...history.visited });
            setCurrentNode(history.node);
            setSequence([...history.sequence]);
            setTreeSequence([...history.treeSequence]);
            setDiscoveryTime({ ...history.discoveryTime });
            setFinishTime({ ...history.finishTime });
            setTime(history.time);
            console.log(`Previous Step: ${newStep}, History:`, history);
        }
    };

    const handleNextStep = () => {
        if (step < dfsHistoryRef.current.length - 1) {
            const newStep = step + 1;
            setStep(newStep);
            const history = dfsHistoryRef.current[newStep];
            setVisited({ ...history.visited });
            setCurrentNode(history.node);
            setSequence([...history.sequence]);
            setTreeSequence([...history.treeSequence]);
            setDiscoveryTime({ ...history.discoveryTime });
            setFinishTime({ ...history.finishTime });
            setTime(history.time);
            console.log(`Next Step: ${newStep}, History:`, history);
        }
    };

    const handleStart = () => {
        if (!graph) return;
        
        // Reset state
        resetState();
        
        // Initialize DFS history with an empty state
        const initialHistory = [{
            node: null,
            visited: {},
            sequence: [],
            treeSequence: [],
            discoveryTime: {},
            finishTime: {},
            time: 0,
            step: 0 // Initial state
        }];
        
        dfsHistoryRef.current = initialHistory;
        setStep(0); // Set step to 0 to enable the Next Step button
        
        // Start DFS from the first node
        const startNode = graph.nodes[0];
        const visited = {}; // Use an object instead of a Set
        const sequence = [];
        const treeSequence = [];
        const discoveryTime = {};
        const finishTime = {};
        let time = 0;
        
        // Add initial state to history
        const history = [{
            node: null,
            visited: { ...visited },
            sequence: [...sequence],
            treeSequence: [...treeSequence],
            discoveryTime: { ...discoveryTime },
            finishTime: { ...finishTime },
            time,
            step: 0
        }];
        
        // Add step 1: Initialize stack with start node
        history.push({
            node: null,
            visited: { ...visited },
            sequence: [...sequence],
            treeSequence: [...treeSequence],
            discoveryTime: { ...discoveryTime },
            finishTime: { ...finishTime },
            time,
            step: 1
        });
        
        // Perform DFS
        dfsRec(startNode, visited, sequence, treeSequence, discoveryTime, finishTime, time, history);
        
        // Add final state
        history.push({
            node: null,
            visited: { ...visited },
            sequence: [...sequence],
            treeSequence: [...treeSequence],
            discoveryTime: { ...discoveryTime },
            finishTime: { ...finishTime },
            time,
            step: 6 // Final state
        });
        
        dfsHistoryRef.current = history;
    };

    const dfsRec = (node, visited, sequence, treeSequence, discoveryTime, finishTime, time, history) => {
        if (!graph.nodes.includes(node)) {
            console.error(`Start node ${node} not in graph`);
            return;
        }

        // If node is already visited, return
        if (visited[node]) {
            return;
        }

        // Step 2: Take the top item of the stack and add it to the visited list
        visited[node] = true;
        time++;
        discoveryTime[node] = time;
        treeSequence.push({ node, depth: 0 });
        
        // Record the state after marking the node as visited
        history.push({
            node: node, // Set the current node
            visited: { ...visited },
            sequence: [...sequence],
            treeSequence: [...treeSequence],
            discoveryTime: { ...discoveryTime },
            finishTime: { ...finishTime },
            time,
            step: 2
        });

        // Find all neighbors of the current node
        const neighbors = graph.edges
            .filter(edge => edge[0] === node || edge[1] === node)
            .map(edge => edge[0] === node ? edge[1] : edge[0]);

        // Step 3: Create a list of that vertex's adjacent nodes
        // Add the ones which aren't in the visited list to the top of the stack
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];
            
            // If the neighbor is not visited, add the edge and continue DFS
            if (!visited[neighbor]) {
                // Add the edge to the sequence when we discover a new node
                sequence.push(`${node}->${neighbor}`);
                
                // Record the state after adding the edge
                history.push({
                    node: node, // Keep the current node
                    visited: { ...visited },
                    sequence: [...sequence],
                    treeSequence: [...treeSequence],
                    discoveryTime: { ...discoveryTime },
                    finishTime: { ...finishTime },
                    time,
                    step: 3
                });
                
                // Step 4: Keep repeating steps 2 and 3
                // Continue DFS from the neighbor
                dfsRec(neighbor, visited, sequence, treeSequence, discoveryTime, finishTime, time, history);
            }
        }

        time++;
        finishTime[node] = time;

        // Step 5: Handle disconnected nodes (if any)
        history.push({
            node: null, // Clear the current node
            visited: { ...visited },
            sequence: [...sequence],
            treeSequence: [...treeSequence],
            discoveryTime: { ...discoveryTime },
            finishTime: { ...finishTime },
            time,
            step: 5
        });
    };

    const getTreeStyles = (depth) => ({
        marginLeft: `${depth * 20}px`,
        fontFamily: 'monospace',
        whiteSpace: 'pre'
    });

    const setup = (p5, canvasParentRef) => {
        const canvas = p5.createCanvas(600, 600);
        canvas.parent(canvasParentRef);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.translate(p5.width/2, p5.height/2);
    };

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
        <div className="dfs-graph-visualization">
            <div className="dfs-graph-visualization-header" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ textAlign: "center", marginBottom: "0", width: "100%", fontSize: "32px" }}>Depth-First Search Visualization</h2>
                <p style={{ marginTop: "10px", marginBottom: "30px", maxWidth: "800px", margin: "0 auto", textAlign: "left", padding: "0 20px" }}>
                    Depth-first search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking to explore other branches. It's a recursive algorithm that uses a stack data structure to keep track of visited nodes. Click on the new graph to generate distinct graphs or use custom graph. Then Click on DFS and follow the next/previous step button to see the traversal method by visualizing together with algorithm.
                </p>
            </div>
            <div className="dfs-graph-visualization-content">
                <div className="dfs-graph-canvas-section">
                    <div ref={canvasRef} className="dfs-graph-canvas-wrapper">
                        <Sketch setup={setup} draw={draw} />
                    </div>
                    <div className="dfs-controls">
                        <div className="dfs-control-buttons">
                            <button onClick={generateRandomGraph}>New Graph</button>
                            <button onClick={() => setShowCustomGraph(!showCustomGraph)}>
                                {showCustomGraph ? 'Hide Custom Graph' : 'Custom Graph'}
                            </button>
                            <button onClick={handleStart}>DFS</button>
                            <button 
                                onClick={handlePrevStep} 
                                disabled={step <= 0}
                                style={{ opacity: step <= 0 ? 0.5 : 1 }}
                            >
                                Previous Step
                            </button>
                            <button 
                                onClick={handleNextStep} 
                                disabled={step >= dfsHistoryRef.current.length - 1 || step === -1}
                                style={{ opacity: step >= dfsHistoryRef.current.length - 1 || step === -1 ? 0.5 : 1 }}
                            >
                                Next Step
                            </button>
                        </div>
                        
                        {showCustomGraph && (
                            <div className="dfs-custom-graph-form">
                                <h3>Create Custom Graph</h3>
                                <div className="dfs-form-group">
                                    <label>Nodes (comma-separated):</label>
                                    <input 
                                        type="text" 
                                        value={customNodes} 
                                        onChange={(e) => setCustomNodes(e.target.value)}
                                        placeholder="A, B, C, D, E"
                                    />
                                </div>
                                <div className="dfs-form-group">
                                    <label>Edges (one per line, format: Node1,Node2):</label>
                                    <textarea 
                                        value={customEdges} 
                                        onChange={(e) => setCustomEdges(e.target.value)}
                                        placeholder="A,B&#10;A,C&#10;B,D&#10;C,E&#10;D,E"
                                        rows={5}
                                    />
                                </div>
                                {customError && <div className="dfs-error-message">{customError}</div>}
                                <div className="dfs-form-buttons">
                                    <button onClick={handleCustomGraphSubmit}>Create Graph</button>
                                    <button onClick={handleClearCustomGraph} className="dfs-clear-button">Clear</button>
                                </div>
                            </div>
                        )}
                        
                        {sequence.length > 0 && (
                            <div className="dfs-graph-sequence-display">
                                <h3>DFS Path Sequence:</h3>
                                <p>{sequence.join(" → ")}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="dfs-graph-right-section">
                    <div className="dfs-graph-algorithm-box">
                        <pre>
                            <span className={dfsHistoryRef.current[step]?.step === 1 ? 'dfs-graph-highlight' : ''}>
                                {`DFS(graph, start):\n1. Start by putting any one of the graph's vertices on top of a stack.\n\tstack = [start]`}
                            </span>
                            {'\n\n'}
                            <span className={dfsHistoryRef.current[step]?.step === 2 ? 'dfs-graph-highlight' : ''}>
                                {`2. Take the top item of the stack and add it to the visited list.\n\tvertex = stack.pop()\n\tvisited.add(vertex)`}
                            </span>
                            {'\n\n'}
                            <span className={dfsHistoryRef.current[step]?.step === 3 ? 'dfs-graph-highlight' : ''}>
                                {`3. Create a list of that vertex's adjacent nodes. Add the ones which aren't in the visited list to the top of the stack.\n\tfor neighbor in graph[vertex]:\n\t\tif neighbor not in visited:\n\t\t\tstack.push(neighbor)`}
                            </span>
                            {'\n\n'}
                            <span className={dfsHistoryRef.current[step]?.step === 4 ? 'dfs-graph-highlight' : ''}>
                                {`4. Keep repeating steps 2 and 3 until the stack is empty.\n\twhile stack is not empty:\n\t\t[repeat steps 2-3]`}
                            </span>
                            {'\n\n'}
                            <span className={dfsHistoryRef.current[step]?.step === 5 ? 'dfs-graph-highlight' : ''}>
                                {`5. Handle disconnected nodes\n\tfor node in graph:\n\t\tif node not in visited:\n\t\t\tstack = [node]\n\t\t\t[repeat steps 2-4]`}
                            </span>
                            {'\n\n'}
                            <span className={dfsHistoryRef.current[step]?.step === 6 ? 'dfs-graph-highlight' : ''}>
                                {`6. Final state\n\treturn visited`}
                            </span>
                        </pre>
                    </div>
                    {treeSequence.length > 0 && (
                        <div className={`dfs-graph-tree-sequence ${treeSequence.length > 0 ? 'visible' : ''}`}>
                            <h3>DFS Visit Sequence:</h3>
                            <div className="dfs-graph-tree-structure">
                                {treeSequence.map((item, index) => (
                                    <div key={index} style={getTreeStyles(item.depth)}>
                                        DFS({item.node})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="dfs-graph-complexity-box">
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

export default DFS;