import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './Datastructure.css';

// Import the GIFs from the src/assets/ folder
import stackGif from '../../assets/stack-of-plates.gif';
import queueGif from '../../assets/queue-animation.gif';

const DataStructures = () => {
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div className="game-page">
      <div className="game-header" data-aos="fade-down">
        <h1>Data Structure Games</h1>
        <p>Choose a game to master data structures!</p>
      </div>

      {/* Visualization Section */}
      <div className="game-visualization" data-aos="zoom-in">
        {/* Stack Animation (Using GIF) */}
        <Link to="/stackgame" className="animated-stack">
          <div className="stack-container">
            <img src={stackGif} alt="Stack Animation" className="stack-gif" />
          </div>
          <p className="visual-label">Stack (First In Last Out)</p>
        </Link>

        {/* Queue Animation (Using GIF) */}
        <Link to="/queuegame" className="animated-queue">
          <div className="queue-container">
            <img src={queueGif} alt="Queue Animation" className="queue-gif" />
          </div>
          <p className="visual-label">Queue (First In First Out)</p>
        </Link>
      </div>
    </div>
  );
};

export default DataStructures;