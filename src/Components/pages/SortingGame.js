import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SortingGame.css';
// Using placeholder images instead of importing non-existent images
// import bubbleSortImage from '../../assets/images/bubble-sort.png';
// import insertionSortImage from '../../assets/images/insertion-sort.png';
// import selectionSortImage from '../../assets/images/selection-sort.png';

const SortingGame = () => {
    const navigate = useNavigate();

    const handleGameSelect = (gameType) => {
        switch (gameType) {
            case 'bubble':
                navigate('/bubble-sort-game');
                break;
            case 'insertion':
                navigate('/insertion-sort-game');
                break;
            case 'selection':
                navigate('/selection-sort-game');
                break;
            default:
                break;
        }
    };

    return (
        <div className="sorting-game-menu">
            <div className="sorting-game-header">
                <h1 className="sorting-game-title">Sorting Games</h1>
                <p className="sorting-game-description">
                    Choose a sorting algorithm to learn and practice through interactive games!
                </p>
            </div>

            <div className="sorting-game-options">
                <div className="sorting-game-card" onClick={() => handleGameSelect('bubble')}>
                    <div className="sorting-game-card-image">
                        <div className="placeholder-image bubble-sort-placeholder">
                            <div className="bubble-animation">
                                <div className="bubble"></div>
                                <div className="bubble"></div>
                                <div className="bubble"></div>
                                <div className="bubble"></div>
                                <div className="bubble"></div>
                            </div>
                        </div>
                    </div>
                    <div className="sorting-game-card-content">
                        <h2>Bubble Sort</h2>
                        <p>Learn bubble sort by helping fish arrange themselves in order!</p>
                        <div className="sorting-game-difficulty">
                            <span className="difficulty-label">Difficulty:</span>
                            <span className="difficulty-stars">⭐</span>
                        </div>
                    </div>
                    <button className="sorting-game-play-button">Play Now</button>
                </div>

                <div className="sorting-game-card" onClick={() => handleGameSelect('insertion')}>
                    <div className="sorting-game-card-image">
                        <div className="placeholder-image insertion-sort-placeholder">
                            <div className="insertion-animation">
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                                <div className="card"></div>
                            </div>
                        </div>
                    </div>
                    <div className="sorting-game-card-content">
                        <h2>Insertion Sort</h2>
                        <p>Sort playing cards in ascending order by dragging and inserting them in the correct position!</p>
                        <div className="sorting-game-difficulty">
                            <span className="difficulty-label">Difficulty:</span>
                            <span className="difficulty-stars">⭐⭐</span>
                        </div>
                    </div>
                    <button className="sorting-game-play-button">Play Now</button>
                </div>

                <div className="sorting-game-card" onClick={() => handleGameSelect('selection')}>
                    <div className="sorting-game-card-image">
                        <div className="placeholder-image selection-sort-placeholder">
                            <div className="selection-animation">
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                                <div className="bar"></div>
                            </div>
                        </div>
                    </div>
                    <div className="sorting-game-card-content">
                        <h2>Selection Sort</h2>
                        <p>Challenge yourself with selection sort by finding the smallest elements!</p>
                        <div className="sorting-game-difficulty">
                            <span className="difficulty-label">Difficulty:</span>
                            <span className="difficulty-stars">⭐⭐⭐</span>
                        </div>
                    </div>
                    <button className="sorting-game-play-button">Play Now</button>
                </div>
            </div>

            <div className="sorting-game-info">
                <h3>How to Play</h3>
                <ol>
                    <li>Select a sorting algorithm game from the options above</li>
                    <li>Follow the on-screen instructions to learn the algorithm</li>
                    <li>Complete tasks to earn points and unlock rewards</li>
                    <li>Challenge yourself with increasingly difficult levels</li>
                </ol>
            </div>
        </div>
    );
};

export default SortingGame; 