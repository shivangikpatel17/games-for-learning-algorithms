import React, { useState } from 'react';
import { questions } from '../../data/questions';
import './Quiz.css';
import { FaSeedling, FaStarHalfAlt, FaStar } from 'react-icons/fa';

const Quiz = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const topics = [
    { id: 'stack', name: 'Stack' },
    { id: 'queue', name: 'Queue' },
    { id: 'bubble-sort', name: 'Bubble Sort' },
    { id: 'insertion-sort', name: 'Insertion Sort' },
    { id: 'selection-sort', name: 'Selection Sort' },
    { id: 'dfs', name: 'Depth-First Search' },
    { id: 'bfs', name: 'Breadth-First Search' }
  ];

  const difficulties = [
    { id: 'beginner', name: 'Beginner', icon: '🌱' },
    { id: 'medium', name: 'Medium', icon: '⭐' },
    { id: 'hard', name: 'Hard', icon: '🔥' }
  ];

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedDifficulty(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleAnswerClick = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    const currentQuestions = questions[selectedTopic.id][selectedDifficulty.id];
    const correct = selectedOption === currentQuestions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    // Show explanation after 1 second
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    const currentQuestions = questions[selectedTopic.id][selectedDifficulty.id];
    
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const getCorrectAnswerText = () => {
    const currentQuestions = questions[selectedTopic.id][selectedDifficulty.id];
    const correctIndex = currentQuestions[currentQuestion].correctAnswer;
    return currentQuestions[currentQuestion].options[correctIndex];
  };

  return (
    <div className="quiz-container">
      <h1>Data Structures and Algorithms Quiz</h1>
      
      {!selectedTopic ? (
        <div className="topic-selection">
          <h2>Select a Topic</h2>
          <div className="topic-grid">
            {topics.map((topic) => (
              <button
                key={topic.id}
                className="topic-button"
                onClick={() => handleTopicSelect(topic)}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      ) : !selectedDifficulty ? (
        <div className="difficulty-selection">
          <h2>Select Difficulty Level</h2>
          <div className="difficulty-grid">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                className="difficulty-button"
                onClick={() => handleDifficultySelect(difficulty)}
              >
                <div className="difficulty-icon">{difficulty.icon}</div>
                <span>{difficulty.name}</span>
              </button>
            ))}
          </div>
          <button className="back-button" onClick={() => setSelectedTopic(null)}>
            Back to Topics
          </button>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} out of {questions[selectedTopic.id][selectedDifficulty.id].length}</p>
          <p className="score-percentage">
            {Math.round((score / questions[selectedTopic.id][selectedDifficulty.id].length) * 100)}%
          </p>
          <button className="reset-button" onClick={resetQuiz}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="question-section">
          <h2>
            {selectedTopic.name} - {selectedDifficulty.name}
            <span className="difficulty-icon-inline">
              {difficulties.find(d => d.id === selectedDifficulty.id)?.icon}
            </span>
          </h2>
          <div className="question-count">
            <span>Question {currentQuestion + 1}</span>/
            <span>{questions[selectedTopic.id][selectedDifficulty.id].length}</span>
          </div>
          <div className="question-text">
            {questions[selectedTopic.id][selectedDifficulty.id][currentQuestion].text}
          </div>
          <div className="answer-options">
            {questions[selectedTopic.id][selectedDifficulty.id][currentQuestion].options.map(
              (option, index) => (
                <button
                  key={index}
                  className={`answer-button ${
                    selectedAnswer === index
                      ? isCorrect
                        ? 'correct'
                        : 'incorrect'
                      : ''
                  }`}
                  onClick={() => handleAnswerClick(index)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </button>
              )
            )}
          </div>
          {showExplanation && (
            <div className="explanation-section">
              <h3>Explanation:</h3>
              <p className="correct-answer">
                <strong>Correct Answer:</strong> {getCorrectAnswerText()}
              </p>
              <p className="explanation-text">
                {questions[selectedTopic.id][selectedDifficulty.id][currentQuestion].explanation}
              </p>
              <button className="next-button" onClick={handleNextQuestion}>
                Next Question
              </button>
            </div>
          )}
          <button className="back-button" onClick={() => setSelectedDifficulty(null)}>
            Back to Difficulty
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
