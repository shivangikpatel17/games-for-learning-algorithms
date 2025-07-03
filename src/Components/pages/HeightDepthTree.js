import React, { useState, useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import './TreeTraversalMethods.css';

const HeightDepthTree = () => {
    const canvasRef = useRef(null);
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
    const [selectedNode, setSelectedNode] = useState(null);
    const [nodeInfo, setNodeInfo] = useState({ height: null, depth: null });
    const [customTreeInput, setCustomTreeInput] = useState('');
    const [inputError, setInputError] = useState('');
    const [heightPath, setHeightPath] = useState([]);
    const [depthPath, setDepthPath] = useState([]);
    const [showPath, setShowPath] = useState('height'); // 'height' or 'depth'

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
        
        setTree({ nodes, edges, level });
        setSelectedNode(null);
        setNodeInfo({ height: null, depth: null });
    };

    useEffect(() => {
        generateRandomTree();
    }, []);

    const calculateNodeInfo = (node) => {
        // Calculate depth path
        const depthPath = [];
        let currentNode = node;
        while (currentNode !== 'A') {
            const edge = tree.edges.find(edge => edge[1] === currentNode);
            if (!edge) break;
            depthPath.push(edge);
            currentNode = edge[0];
        }
        setDepthPath(depthPath);

        // Calculate height path - full path from node to deepest leaf
        const heightPath = [];
        const getHeightPath = (currentNode) => {
            if (!currentNode) return { height: -1, path: [] };
            const children = tree.edges
                .filter(edge => edge[0] === currentNode)
                .map(edge => edge[1]);
            if (children.length === 0) return { height: 0, path: [] };
            let maxChild = null;
            let maxResult = { height: -1, path: [] };
            for (let i = 0; i < children.length; i++) {
                const result = getHeightPath(children[i]);
                if (result.height > maxResult.height) {
                    maxResult = result;
                    maxChild = children[i];
                }
            }
            if (maxChild) {
                return {
                    height: 1 + maxResult.height,
                    path: [[currentNode, maxChild], ...maxResult.path]
                };
            } else {
                return { height: 0, path: [] };
            }
        };
        const result = getHeightPath(node);
        setHeightPath(result.path);

        // Set node info
        setNodeInfo({ 
            height: calculateHeight(node), 
            depth: calculateDepth(node) 
        });
    };

    const calculateDepth = (node) => {
        let depth = 0;
        let currentNode = node;
        while (currentNode !== 'A') {
            depth++;
            // Find parent node
            const edge = tree.edges.find(edge => edge[1] === currentNode);
            if (!edge) break;
            currentNode = edge[0];
        }
        return depth;
    };

    const calculateHeight = (node) => {
        const getHeight = (currentNode) => {
            if (!currentNode) return -1;
            
            const children = tree.edges
                .filter(edge => edge[0] === currentNode)
                .map(edge => edge[1]);
            
            if (children.length === 0) return 0;
            
            const leftHeight = getHeight(children[0]);
            const rightHeight = children[1] ? getHeight(children[1]) : -1;
            
            return 1 + Math.max(leftHeight, rightHeight);
        };
        
        return getHeight(node);
    };

    const getNodeLevel = (node) => {
        let level = 0;
        let currentNode = node;
        while (currentNode !== 'A') {
            level++;
            const edge = tree.edges.find(edge => edge[1] === currentNode);
            if (!edge) break;
            currentNode = edge[0];
        }
        return level;
    };

    const getNodeChildren = (node) => {
        return tree.edges
            .filter(edge => edge[0] === node)
            .map(edge => edge[1]);
    };

    const getNodeParent = (node) => {
        const edge = tree.edges.find(edge => edge[1] === node);
        return edge ? edge[0] : null;
    };

    const isLeafNode = (node) => {
        return !tree.edges.some(edge => edge[0] === node);
    };

    const getAncestors = (node) => {
        const ancestors = [];
        let currentNode = node;
        while (currentNode !== 'A') {
            const parent = getNodeParent(currentNode);
            if (!parent) break;
            ancestors.push(parent);
            currentNode = parent;
        }
        return ancestors;
    };

    const getDescendants = (node) => {
        const descendants = [];
        const queue = [node];
        while (queue.length > 0) {
            const current = queue.shift();
            const children = getNodeChildren(current);
            descendants.push(...children);
            queue.push(...children);
        }
        return descendants;
    };

    const draw = (p5) => {
        p5.background(255);
        
        // Move to the center of the canvas
        p5.translate(p5.width/2, p5.height/2);
        
        // Calculate radius based on tree level
        const level = tree.level || 3;
        const baseRadius = Math.min(p5.width, p5.height) * 0.25;
        const levelScale = 1 - (level - 2) * 0.15;
        const radius = baseRadius * levelScale;
        const nodeSize = radius * 0.4 * (1 - (level - 2) * 0.08);
        
        const nodePositions = {};
        
        // Position nodes in a tree structure
        const levelHeight = radius * 1.5 * (1 - (level - 2) * 0.1);
        const levelWidth = radius * 3.0 * (1 - (level - 2) * 0.15);
        
        const levels = {};
        tree.nodes.forEach((node, index) => {
            const nodeLevel = Math.floor(Math.log2(index + 1));
            if (!levels[nodeLevel]) levels[nodeLevel] = [];
            levels[nodeLevel].push(node);
        });

        Object.entries(levels).forEach(([level, nodes]) => {
            const y = -levelHeight + (parseInt(level) * levelHeight);
            const widthScale = 1 - (tree.level - 2) * 0.1;
            const currentLevelWidth = levelWidth * Math.pow(1.5, parseInt(level)) * widthScale;
            const spacing = currentLevelWidth / (nodes.length + 1);
            
            nodes.forEach((node, i) => {
                const x = -currentLevelWidth/2 + (i + 1) * spacing;
                nodePositions[node] = { x, y };
            });
        });

        // Draw regular edges
        p5.stroke(200);
        p5.strokeWeight(0.5 * (1 - (level - 2) * 0.05));
        tree.edges.forEach(edge => {
            const [from, to] = edge;
            const fromPos = nodePositions[from];
            const toPos = nodePositions[to];
            p5.line(fromPos.x, fromPos.y, toPos.x, toPos.y);
        });

        // Draw the selected path
        if (selectedNode) {
            const path = showPath === 'height' ? heightPath : depthPath;
            const color = showPath === 'height' ? [0, 150, 0] : [255, 0, 255]; // Green for height, Purple for depth
            
            p5.stroke(...color);
            p5.strokeWeight(2 * (1 - (level - 2) * 0.05));
            path.forEach(edge => {
                const [from, to] = edge;
                const fromPos = nodePositions[from];
                const toPos = nodePositions[to];
                p5.line(fromPos.x, fromPos.y, toPos.x, toPos.y);
                // Draw arrow
                const angle = p5.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
                const arrowSize = 10 * (1 - (level - 2) * 0.05);
                p5.push();
                p5.translate(toPos.x, toPos.y);
                p5.rotate(angle);
                p5.line(0, 0, -arrowSize, -arrowSize/2);
                p5.line(0, 0, -arrowSize, arrowSize/2);
                p5.pop();
            });
        }

        // Draw nodes
        Object.entries(nodePositions).forEach(([node, pos]) => {
            const isSelected = selectedNode === node;
            
            if (isSelected) {
                p5.fill(0, 0, 255);
                p5.stroke(0, 0, 200);
                p5.strokeWeight(1);
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

        // Add click handler
        p5.mouseClicked = () => {
            const mouseX = p5.mouseX - p5.width/2;
            const mouseY = p5.mouseY - p5.height/2;
            
            Object.entries(nodePositions).forEach(([node, pos]) => {
                const distance = p5.dist(mouseX, mouseY, pos.x, pos.y);
                if (distance < nodeSize/2) {
                    setSelectedNode(node);
                    calculateNodeInfo(node);
                }
            });
        };
    };

    const setup = (p5, canvasParentRef) => {
        const canvas = p5.createCanvas(600, 600).parent(canvasParentRef);
        canvasRef.current = canvas;
    };

    const handleCustomTree = () => {
        try {
            // Parse the input string
            const input = customTreeInput.trim();
            if (!input) {
                setInputError('Please enter a valid tree structure');
                return;
            }

            // Split the input into lines
            const lines = input.split('\n').map(line => line.trim());
            
            // First line should be nodes
            const nodes = lines[0].split(',').map(node => node.trim());
            if (nodes.length === 0) {
                setInputError('Please enter at least one node');
                return;
            }

            // Remaining lines should be edges
            const edges = [];
            for (let i = 1; i < lines.length; i++) {
                const [from, to] = lines[i].split(',').map(node => node.trim());
                if (!from || !to) {
                    setInputError(`Invalid edge format at line ${i + 1}`);
                    return;
                }
                edges.push([from, to]);
            }

            // Validate the tree structure
            const allNodes = new Set(nodes);
            edges.forEach(([from, to]) => {
                if (!allNodes.has(from) || !allNodes.has(to)) {
                    setInputError(`Invalid node in edge: ${from},${to}`);
                    return;
                }
            });

            // Calculate tree level
            const level = Math.ceil(Math.log2(nodes.length + 1));

            // Update the tree
            setTree({ nodes, edges, level });
            setSelectedNode(null);
            setNodeInfo({ height: null, depth: null });
            setInputError('');
        } catch (error) {
            setInputError('Invalid tree structure format');
        }
    };

    return (
        <div className="tree-traversal-visualization">
            <div className="tree-traversal-visualization-header">
                <h2>Height and Depth of Binary Tree</h2>
            </div>
            <div className="tree-traversal-visualization-content">
                <div className="tree-traversal-canvas-section">
                    <div className="tree-traversal-canvas-wrapper">
                        <Sketch setup={setup} draw={draw} />
                    </div>
                    <div className="tree-traversal-controls">
                        <div className="tree-traversal-buttons">
                            <button 
                                className="generate-tree-button"
                                onClick={generateRandomTree}
                            >
                                Generate New Tree
                            </button>
                            <button 
                                className="path-toggle-button"
                                onClick={() => setShowPath(showPath === 'height' ? 'depth' : 'height')}
                            >
                                {showPath === 'height' ? 'Depth' : 'Height'}
                            </button>
                        </div>
                    </div>
                    <div className="tree-traversal-custom-input">
                        <h3>Custom Tree Input</h3>
                        <textarea
                            value={customTreeInput}
                            onChange={(e) => setCustomTreeInput(e.target.value)}
                            placeholder="Enter nodes (comma-separated)&#10;Enter edges (one per line, comma-separated)&#10;Example:&#10;A,B,C,D&#10;A,B&#10;A,C&#10;B,D"
                            rows={6}
                        />
                        {inputError && <div className="tree-traversal-input-error">{inputError}</div>}
                        <button onClick={handleCustomTree}>Apply Custom Tree</button>
                    </div>
                </div>
                <div className="tree-traversal-right-section">
                    <div className="tree-traversal-algorithm-box">
                        <h3>About Height and Depth</h3>
                        <div className="tree-traversal-algorithm-code">
                            <p>Height of a node:</p>
                            <p>- The number of edges on the longest path from the node to a leaf</p>
                            <p>- Height of a leaf node is 0</p>
                            <p>- Height of an empty tree is -1</p>
                            <br />
                            <p>Depth of a node:</p>
                            <p>- The number of edges from the node to the tree's root node</p>
                            <p>- Depth of the root node is 0</p>
                        </div>
                    </div>
                    <div className="tree-traversal-algorithm-box">
                        <h3>Node Information</h3>
                        {selectedNode ? (
                            <div className="tree-traversal-sequence">
                                <p>Selected Node: {selectedNode}</p>
                                <p>Height: {nodeInfo.height}</p>
                                <p>Depth: {nodeInfo.depth}</p>
                                <p>Showing: {showPath === 'height' ? 'Height Path (Green)' : 'Depth Path (Purple)'}</p>
                            </div>
                        ) : (
                            <div className="tree-traversal-sequence">
                                <p>Click on any node to see its height and depth</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeightDepthTree;
