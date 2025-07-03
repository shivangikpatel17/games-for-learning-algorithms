import React, { useState, useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import './TreeTraversalMethods.css';

const TreeTraversalMethods = () => {
    const canvasRef = useRef(null);
    const traversalHistoryRef = useRef([]);
    const [tree, setTree] = useState({
        nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        edges: [
            ['A', 'B'],
            ['A', 'C'],
            ['B', 'D'],
            ['B', 'E'],
            ['C', 'F'],
            ['C', 'G']
        ]
    });
    const [visited, setVisited] = useState({});
    const [currentNode, setCurrentNode] = useState(null);
    const [step, setStep] = useState(-1);
    const [sequence, setSequence] = useState([]);
    const [traversalType, setTraversalType] = useState('preorder');
    const [highlightedLine, setHighlightedLine] = useState(null);
    const [traversalStage, setTraversalStage] = useState('start');
    const [customTreeInput, setCustomTreeInput] = useState('');
    const [inputError, setInputError] = useState('');
    
    const resetState = () => {
        setVisited({});
        setCurrentNode(null);
        setStep(-1);
        setSequence([]);
        setHighlightedLine(null);
        setTraversalStage('start');
        traversalHistoryRef.current = [];
    };

    const generateRandomTree = () => {
        // Generate a tree with random level between 2 and 6
        const level = Math.floor(Math.random() * 5) + 2; // 2-6 levels
        const maxNodes = Math.pow(2, level) - 1; // Maximum nodes for complete binary tree
        const numNodes = Math.floor(Math.random() * (maxNodes - Math.pow(2, level - 1) + 1)) + Math.pow(2, level - 1);
        
        const nodes = Array.from({ length: numNodes }, (_, i) => String.fromCharCode(65 + i));
        const edges = [];
        
        // Build a binary tree
        for (let i = 1; i < nodes.length; i++) {
            const parentIndex = Math.floor((i - 1) / 2);
            edges.push([nodes[parentIndex], nodes[i]]);
        }
        
        // Reset state before updating tree
        resetState();
        
        // Set the new tree
        setTree({ nodes, edges, level });
    };

    useEffect(() => {
        generateRandomTree();
    }, []);

    // Update highlighted line when currentNode changes
    useEffect(() => {
        if (currentNode) {
            setHighlightedLine(getCurrentLine());
        } else {
            setHighlightedLine(null);
        }
    }, [currentNode, traversalType]);

    const draw = (p5) => {
        p5.background(255);
        
        // Move to the center of the canvas
        p5.translate(p5.width/2, p5.height/2);
        
        // Calculate radius based on tree level
        const level = tree.level || 3; // Default to 3 if not set
        const baseRadius = Math.min(p5.width, p5.height) * 0.25;
        
        // Adjust scaling factors based on level
        const levelScale = 1 - (level - 2) * 0.15; // More aggressive scaling for higher levels
        const radius = baseRadius * levelScale;
        
        // Node size based on radius - smaller nodes for larger trees
        const nodeSize = radius * 0.4 * (1 - (level - 2) * 0.08);
        
        const nodePositions = {};
        
        // Position nodes in a tree structure with level-based spacing
        const levelHeight = radius * 1.5 * (1 - (level - 2) * 0.1);
        const levelWidth = radius * 3.0 * (1 - (level - 2) * 0.15);
        
        // Calculate positions for each level
        const levels = {};
        tree.nodes.forEach((node, index) => {
            const nodeLevel = Math.floor(Math.log2(index + 1));
            if (!levels[nodeLevel]) levels[nodeLevel] = [];
            levels[nodeLevel].push(node);
        });

        // Position nodes level by level with adjusted spacing
        Object.entries(levels).forEach(([level, nodes]) => {
            const y = -levelHeight + (parseInt(level) * levelHeight);
            // Adjust width scaling based on tree level
            const widthScale = 1 - (tree.level - 2) * 0.1;
            const currentLevelWidth = levelWidth * Math.pow(1.5, parseInt(level)) * widthScale;
            const spacing = currentLevelWidth / (nodes.length + 1);
            
            nodes.forEach((node, i) => {
                const x = -currentLevelWidth/2 + (i + 1) * spacing;
                nodePositions[node] = { x, y };
            });
        });

        // Draw edges with adjusted stroke weight
        p5.stroke(200);
        p5.strokeWeight(0.5 * (1 - (level - 2) * 0.05));
        tree.edges.forEach(edge => {
            const [from, to] = edge;
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];
            p5.line(fromPos.x, fromPos.y, toPos.x, toPos.y);
        });

        // Draw nodes with adjusted sizes
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

        // Draw root node label and arrow with adjusted size
        const rootPos = nodePositions['A'];
        if (rootPos) {
            // Draw "Root Node" text
            p5.fill(0);
            p5.noStroke();
            p5.textAlign(p5.RIGHT, p5.CENTER);
            p5.textSize(14 * (1 - (level - 2) * 0.05));
            p5.text("Root Node", rootPos.x - nodeSize - 50, rootPos.y);

            // Draw arrow
            p5.stroke(0);
            p5.strokeWeight(1 * (1 - (level - 2) * 0.05));
            const arrowLength = 40 * (1 - (level - 2) * 0.05);
            const arrowSize = 8 * (1 - (level - 2) * 0.05);
            const startX = rootPos.x - nodeSize - 45;
            const endX = rootPos.x - nodeSize/2;
            const y = rootPos.y;

            // Draw arrow line
            p5.line(startX, y, endX, y);

            // Draw arrow head
            p5.fill(0);
            p5.triangle(
                endX, y,
                endX - arrowSize, y - arrowSize/2,
                endX - arrowSize, y + arrowSize/2
            );
        }
    };

    const handlePrevStep = () => {
        if (step > 0) {
            const newStep = step - 1;
            setStep(newStep);
            const history = traversalHistoryRef.current[newStep];
            setVisited({ ...history.visited });
            setCurrentNode(history.node);
            setSequence([...history.sequence]);
            setTraversalStage(history.stage);
        }
    };

    const handleNextStep = () => {
        if (step < traversalHistoryRef.current.length - 1) {
            const newStep = step + 1;
            setStep(newStep);
            const history = traversalHistoryRef.current[newStep];
            setVisited({ ...history.visited });
            setCurrentNode(history.node);
            setSequence([...history.sequence]);
            setTraversalStage(history.stage);
        }
    };

    const handleStart = (type) => {
        setTraversalType(type);
        resetState();
        
        // Initialize traversal history with an empty state
        const initialHistory = [{
            node: null,
            visited: {},
            sequence: [],
            step: 0,
            stage: 'start'
        }];
        
        traversalHistoryRef.current = initialHistory;
        setStep(0);
        
        // Create a new sequence array for the traversal
        const traversalSequence = [];
        const visitedNodes = {};
        
        // Perform the selected traversal
        if (type === 'preorder') {
            preorderTraversal('A', traversalSequence, visitedNodes);
        } else if (type === 'inorder') {
            inorderTraversal('A', traversalSequence, visitedNodes);
        } else if (type === 'postorder') {
            postorderTraversal('A', traversalSequence, visitedNodes);
        } else if (type === 'levelorder') {
            levelOrderTraversal('A', traversalSequence, visitedNodes);
        }
    };

    const preorderTraversal = (node, traversalSequence, visitedNodes) => {
        if (!node) return;
        
        // Visit node
        visitedNodes[node] = true;
        traversalSequence.push(node);
        
        // Add to history
        traversalHistoryRef.current.push({
            node,
            visited: { ...visitedNodes },
            sequence: [...traversalSequence],
            step: traversalHistoryRef.current.length,
            stage: 'visit'
        });
        
        // Get children
        const children = tree.edges
            .filter(edge => edge[0] === node)
            .map(edge => edge[1]);
            
        // Process left child
        if (children[0]) {
            traversalHistoryRef.current.push({
                node: children[0],
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'left'
            });
            preorderTraversal(children[0], traversalSequence, visitedNodes);
        }
        
        // Process right child
        if (children[1]) {
            traversalHistoryRef.current.push({
                node: children[1],
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'right'
            });
            preorderTraversal(children[1], traversalSequence, visitedNodes);
        }
    };

    const inorderTraversal = (node, traversalSequence, visitedNodes) => {
        if (!node) return;
        
        const children = tree.edges
            .filter(edge => edge[0] === node)
            .map(edge => edge[1]);
            
        // Process left child
        if (children[0]) {
            traversalHistoryRef.current.push({
                node: children[0],
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'left'
            });
            inorderTraversal(children[0], traversalSequence, visitedNodes);
        }
        
        // Visit node
        visitedNodes[node] = true;
        traversalSequence.push(node);
        
        traversalHistoryRef.current.push({
            node,
            visited: { ...visitedNodes },
            sequence: [...traversalSequence],
            step: traversalHistoryRef.current.length,
            stage: 'visit'
        });
        
        // Process right child
        if (children[1]) {
            traversalHistoryRef.current.push({
                node: children[1],
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'right'
            });
            inorderTraversal(children[1], traversalSequence, visitedNodes);
        }
    };

    const postorderTraversal = (node, traversalSequence, visitedNodes) => {
        if (!node) return;
        
        const children = tree.edges
            .filter(edge => edge[0] === node)
            .map(edge => edge[1]);
            
        // Process left child
        if (children[0]) {
            traversalHistoryRef.current.push({
                node: children[0],
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'left'
            });
            postorderTraversal(children[0], traversalSequence, visitedNodes);
        }
        
        // Process right child
        if (children[1]) {
            traversalHistoryRef.current.push({
                node: children[1],
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'right'
            });
            postorderTraversal(children[1], traversalSequence, visitedNodes);
        }
        
        // Visit node
        visitedNodes[node] = true;
        traversalSequence.push(node);
        
        traversalHistoryRef.current.push({
            node,
            visited: { ...visitedNodes },
            sequence: [...traversalSequence],
            step: traversalHistoryRef.current.length,
            stage: 'visit'
        });
    };

    const levelOrderTraversal = (root, traversalSequence, visitedNodes) => {
        const queue = [root];
        
        // Add initial state
        traversalHistoryRef.current.push({
            node: root,
            visited: { ...visitedNodes },
            sequence: [...traversalSequence],
            step: traversalHistoryRef.current.length,
            stage: 'init'
        });
        
        while (queue.length > 0) {
            const node = queue.shift();
            
            // Add dequeue state
            traversalHistoryRef.current.push({
                node,
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'dequeue'
            });
            
            // Visit node
            visitedNodes[node] = true;
            traversalSequence.push(node);
            
            // Add visit state
            traversalHistoryRef.current.push({
                node,
                visited: { ...visitedNodes },
                sequence: [...traversalSequence],
                step: traversalHistoryRef.current.length,
                stage: 'visit'
            });
            
            const children = tree.edges
                .filter(edge => edge[0] === node)
                .map(edge => edge[1]);
            
            if (children.length > 0) {
                // Add enqueue state for each child
                children.forEach(child => {
                    queue.push(child);
                    traversalHistoryRef.current.push({
                        node: child,
                        visited: { ...visitedNodes },
                        sequence: [...traversalSequence],
                        step: traversalHistoryRef.current.length,
                        stage: 'enqueue'
                    });
                });
            }
        }
    };

    const setup = (p5, canvasParentRef) => {
        const canvas = p5.createCanvas(600, 600).parent(canvasParentRef);
        canvasRef.current = canvas;
    };

    const getAlgorithmCode = () => {
        switch (traversalType) {
            case 'preorder':
                return [
                    'function preorderTraversal(node) {',
                    '    if (!node) return;',
                    '    visit(node);',
                    '    preorderTraversal(node.left);',
                    '    preorderTraversal(node.right);',
                    '}'
                ];
            case 'inorder':
                return [
                    'function inorderTraversal(node) {',
                    '    if (!node) return;',
                    '    inorderTraversal(node.left);',
                    '    visit(node);',
                    '    inorderTraversal(node.right);',
                    '}'
                ];
            case 'postorder':
                return [
                    'function postorderTraversal(node) {',
                    '    if (!node) return;',
                    '    postorderTraversal(node.left);',
                    '    postorderTraversal(node.right);',
                    '    visit(node);',
                    '}'
                ];
            case 'levelorder':
                return [
                    'function levelOrderTraversal(root) {',
                    '    queue = [root];',
                    '    while (queue.length > 0) {',
                    '        node = queue.shift();',
                    '        visit(node);',
                    '        if (node.left) queue.push(node.left);',
                    '        if (node.right) queue.push(node.right);',
                    '    }',
                    '}'
                ];
            default:
                return [];
        }
    };

    const getCurrentLine = () => {
        if (!currentNode) return null;
        
        switch (traversalType) {
            case 'preorder':
                switch (traversalStage) {
                    case 'visit': return 2;  // visit(node)
                    case 'left': return 3;   // preorderTraversal(node.left)
                    case 'right': return 4;  // preorderTraversal(node.right)
                    default: return 1;       // if (!node) return
                }
            case 'inorder':
                switch (traversalStage) {
                    case 'visit': return 3;  // visit(node)
                    case 'left': return 2;   // inorderTraversal(node.left)
                    case 'right': return 4;  // inorderTraversal(node.right)
                    default: return 1;       // if (!node) return
                }
            case 'postorder':
                switch (traversalStage) {
                    case 'visit': return 4;  // visit(node)
                    case 'left': return 2;   // postorderTraversal(node.left)
                    case 'right': return 3;  // postorderTraversal(node.right)
                    default: return 1;       // if (!node) return
                }
            case 'levelorder':
                switch (traversalStage) {
                    case 'init': return 2;      // queue = [root]
                    case 'dequeue': return 3;   // node = queue.shift()
                    case 'visit': return 4;     // visit(node)
                    case 'enqueue': return 6;   // queue.push(node.left/right)
                    default: return 1;          // while (queue.length > 0)
                }
            default:
                return null;
        }
    };

    const handleCustomTree = () => {
        try {
            // Parse the input string
            const lines = customTreeInput.trim().split('\n');
            const nodes = new Set();
            const edges = [];
            
            // Process each line
            lines.forEach(line => {
                const [parent, child] = line.trim().split('->').map(s => s.trim());
                if (parent && child) {
                    nodes.add(parent);
                    nodes.add(child);
                    edges.push([parent, child]);
                }
            });

            // Validate the tree structure
            if (nodes.size === 0) {
                throw new Error('No valid nodes found');
            }

            // Calculate tree level
            const level = Math.ceil(Math.log2(nodes.size + 1));

            // Reset state and set new tree
            resetState();
            setTree({
                nodes: Array.from(nodes),
                edges,
                level
            });
            setInputError('');
        } catch (error) {
            setInputError('Invalid tree format. Please enter parent->child pairs, one per line.');
        }
    };

    return (
        <div className="tree-traversal-visualization">
            <div className="tree-traversal-visualization-header">
                <h2>Tree Traversal Methods</h2>
            </div>
            
            <div className="tree-traversal-visualization-content">
                <div className="tree-traversal-canvas-section">
                    <div className="tree-traversal-canvas-wrapper">
                        <Sketch setup={setup} draw={draw} />
                    </div>
                    
                    <div className="tree-traversal-controls">
                        <div className="tree-traversal-buttons">
                            <button 
                                onClick={() => handleStart('preorder')}
                                className={traversalType === 'preorder' ? 'active' : ''}
                            >
                                Pre-order
                            </button>
                            <button 
                                onClick={() => handleStart('inorder')}
                                className={traversalType === 'inorder' ? 'active' : ''}
                            >
                                In-order
                            </button>
                            <button 
                                onClick={() => handleStart('postorder')}
                                className={traversalType === 'postorder' ? 'active' : ''}
                            >
                                Post-order
                            </button>
                            <button 
                                onClick={() => handleStart('levelorder')}
                                className={traversalType === 'levelorder' ? 'active' : ''}
                            >
                                BFS
                            </button>
                            <button 
                                onClick={generateRandomTree}
                                className="generate-tree-button"
                            >
                                Generate New Tree
                            </button>
                        </div>
                        
                        <div className="tree-traversal-step-buttons">
                            <button onClick={handlePrevStep} disabled={step <= 0}>
                                Previous Step
                            </button>
                            <button onClick={handleNextStep} disabled={step >= traversalHistoryRef.current.length - 1}>
                                Next Step
                            </button>
                        </div>

                        <div className="tree-traversal-custom-input">
                            <h3>Custom Tree Input</h3>
                            <textarea
                                value={customTreeInput}
                                onChange={(e) => setCustomTreeInput(e.target.value)}
                                placeholder="Enter tree structure (one edge per line)&#10;Example:&#10;A->B&#10;A->C&#10;B->D&#10;B->E"
                                rows={5}
                            />
                            {inputError && <div className="tree-traversal-input-error">{inputError}</div>}
                            <button onClick={handleCustomTree}>
                                Visualize Custom Tree
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="tree-traversal-right-section">
                    <div className="tree-traversal-algorithm-box">
                        <h3>Algorithm</h3>
                        <div className="tree-traversal-algorithm-code">
                            {getAlgorithmCode().map((line, index) => (
                                <div 
                                    key={index}
                                    className={`tree-traversal-code-line ${index === highlightedLine ? 'highlight' : ''}`}
                                >
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="tree-traversal-sequence-box">
                        <h3>Current Traversal: {traversalType === 'levelorder' ? 'BFS' : traversalType}</h3>
                        <div className="tree-traversal-sequence">
                            {sequence.length > 0 ? sequence.join(' → ') : 'No nodes visited yet'}
                        </div>
                        <div className="tree-traversal-sequence-info">
                            {sequence.length > 0 && `Total nodes visited: ${sequence.length}`}
                        </div>
                    </div>
                    
                    <div className="tree-traversal-complexity-box">
                        <h3>Complexity Analysis ({traversalType === 'levelorder' ? 'BFS' : traversalType})</h3>
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
                                    <td>Best Case</td>
                                    <td>O(n)</td>
                                    <td>{traversalType === 'levelorder' ? 'O(w)' : 'O(h)'}</td>
                                </tr>
                                <tr>
                                    <td>Average Case</td>
                                    <td>O(n)</td>
                                    <td>{traversalType === 'levelorder' ? 'O(w)' : 'O(h)'}</td>
                                </tr>
                                <tr>
                                    <td>Worst Case</td>
                                    <td>O(n)</td>
                                    <td>{traversalType === 'levelorder' ? 'O(n)' : 'O(h)'}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="complexity-note">
                                        {traversalType === 'levelorder' 
                                            ? 'w = maximum width of tree, n = number of nodes'
                                            : 'h = height of tree, typically O(log n) for balanced trees'}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeTraversalMethods;
