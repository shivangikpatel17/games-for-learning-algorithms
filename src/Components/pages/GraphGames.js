import React from 'react';
import { Link } from 'react-router-dom';
import './GraphGames.css';

const GraphGames = () => {
  return (
    <div className="graph-games-container">
      <h1>
        <span className="graph-games-title-icon">🎮</span>
        Graph Traversal Games
      </h1>
      <div className="graph-games-grid">
        <Link to="/graphs/dfsgames" className="graph-game-card">
          <div className="graph-game-icon">
            <img src={require('../../assets/Depth-First-Search-gif.gif')} alt="DFS" style={{ width: '140px', height: '140px' }} />
          </div>
          <h2>DFS Game</h2>
          <p>Learn and practice Depth-First Search algorithm through interactive gameplay</p>
        </Link>
        
        <Link to="/graphs/untangle" className="graph-game-card">
          <div className="graph-game-icon">
            <img src={require('../../assets/Untangle-Graph-gif.gif')} alt="Untangle" style={{ width: '200px', height: '160px' }} />
          </div>
          <h2>Untangle Graph</h2>
          <p>Challenge yourself to untangle complex graph structures and improve your graph visualization skills</p>
        </Link>

        <Link to="/graphs/bfsgames" className="graph-game-card">
          <div className="graph-game-icon">
            <img src={require('../../assets/Breadth-First-Search-gif.gif')} alt="BFS" style={{ width: '140px', height: '140px' }} />
          </div>
          <h2>BFS Game</h2>
          <p>Master Breadth-First Search algorithm with engaging challenges</p>
        </Link>
      </div>
    </div>
  );
};

export default GraphGames; 