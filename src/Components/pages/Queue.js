import React, { useState } from "react";
import Sketch from "react-p5";

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [currentStep, setCurrentStep] = useState(null);
  const [front, setFront] = useState(-1);
  const [rear, setRear] = useState(-1);
  const [operations, setOperations] = useState([]);
  const [queueSize, setQueueSize] = useState("");
  const [maxSize, setMaxSize] = useState(null);

  const createQueue = () => {
    const size = parseInt(queueSize);
    if (isNaN(size) || size <= 0) {
      alert("⚠ Enter a valid queue size!");
      return;
    }
    setQueue([]);
    setMaxSize(size);
    setFront(-1);
    setRear(-1);
    setOperations([...operations, `Created empty queue of size ${size}`]);
    setAlgorithm("");
    setCurrentStep(null);
    setQueueSize("");
  };

  const enqueue = () => {
    if (maxSize === null) {
      alert("⚠ Please create a queue first!");
      return;
    }
    if (inputValue.trim() === "") {
      alert("⚠ Please enter a value!");
      return;
    }
    if (queue.length >= maxSize) {
      alert("⚠ Queue is full!");
      return;
    }

    const steps = [
      "[Overflow?]\nIf R >= N\nthen Write('OVERFLOW')\nReturn",
      "[Increment rear pointer]\nR <- R + 1",
      "[Insert element]\nQ[R] <- Y",
      "[Is front pointer properly set?]\nIf F = 0\nthen F <- 1\nReturn"
    ];

    let stepIndex = 0;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`QINSERT(Q, F, R, N, Y)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        if (queue.length >= maxSize) {
          return;
        }
        stepIndex++;
        setTimeout(executeStep, 500);
      } else if (stepIndex === 1) {
        setRear(queue.length);
        stepIndex++;
        setTimeout(executeStep, 500);
      } else if (stepIndex === 2) {
        setQueue([...queue, inputValue]);
        setInputValue("");
        stepIndex++;
        setTimeout(executeStep, 500);
      } else if (stepIndex === 3) {
        if (front === -1) setFront(0);
        setOperations([...operations, `Enqueued ${inputValue}`]);
        setCurrentStep(null);
      }
    };

    executeStep();
  };

  const dequeue = () => {
    if (queue.length === 0) {
      alert("⚠ Queue is empty!");
      return;
    }

    const steps = [
      "[Underflow?]\nIf F = 0\nthen Write('UNDERFLOW')\nReturn(0) (0 denotes an empty queue)",
      "[Delete element]\nY <- Q[F]",
      "[Queue empty?]\nIf F = R\nthen F <- R <- 0\nelse F <- F + 1 (Increment front pointer)",
      "[Return element]\nReturn(Y)"
    ];

    let stepIndex = 0;
    let dequeuedValue;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`QDELETE(Q, F, R)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        if (queue.length === 0) {
          return;
        }
        stepIndex++;
        setTimeout(executeStep, 500);
      } else if (stepIndex === 1) {
        dequeuedValue = queue[0];
        stepIndex++;
        setTimeout(executeStep, 500);
      } else if (stepIndex === 2) {
        let newQueue = queue.slice(1);
        if (newQueue.length === 0) {
          setFront(-1);
          setRear(-1);
          setOperations([]);
        } else {
          setFront(front + 1);
          setRear(rear);
        }
        setQueue(newQueue);
        stepIndex++;
        setTimeout(executeStep, 500);
      } else if (stepIndex === 3) {
        setOperations([...operations, `Dequeued ${dequeuedValue}`]);
        setCurrentStep(null);
      }
    };

    executeStep();
  };

  const isEmpty = () => {
    const steps = [
      "[Check if queue is empty]\nIf F = 0\nthen Return(TRUE)\nelse Return(FALSE)"
    ];

    let stepIndex = 0;
    let isEmptyResult;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`ISEMPTY(Q, F)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        setTimeout(() => {
          isEmptyResult = queue.length === 0;
          setOperations([...operations, `IsEmpty: ${isEmptyResult ? "TRUE" : "FALSE"}`]);
          setCurrentStep(null);
        }, 1000);
      }
    };

    executeStep();
  };

  const isFull = () => {
    if (maxSize === null) {
      alert("⚠ Please create a queue first!");
      return;
    }

    const steps = [
      "[Check if queue is full]\nIf R = N\nthen Return(TRUE)\nelse Return(FALSE)"
    ];

    let stepIndex = 0;
    let isFullResult;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`ISFULL(Q, R, N)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        setTimeout(() => {
          isFullResult = queue.length >= maxSize;
          setOperations([...operations, `IsFull: ${isFullResult ? "TRUE" : "FALSE"}`]);
          setCurrentStep(null);
        }, 1000);
      }
    };

    executeStep();
  };

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 600).parent(canvasParentRef);
    p5.textFont("Arial");
    p5.textStyle(p5.NORMAL);
  };

  const draw = (p5) => {
    p5.background(240);
    p5.fill(0);
    p5.textSize(16);
    p5.textStyle(p5.NORMAL);
    p5.textAlign(p5.CENTER, p5.TOP);
    p5.text("Queue Visualization", p5.width / 2, 20);

    let x = 100;
    let y = 300;
    let boxWidth = 60;
    let boxHeight = 40;

    if (queue.length === 0) {
      p5.fill("black");
      p5.textSize(14);
      p5.text("Front = -1", x, y - 20);
      p5.text("Rear = -1", x, y + boxHeight + 20);
    } else {
      for (let i = 0; i < queue.length; i++) {
        let logicalIndex = i + front;
        p5.fill([100, 150, 255]);
        p5.rect(x + i * (boxWidth + 10), y, boxWidth, boxHeight);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(queue[i], x + i * (boxWidth + 10) + boxWidth / 2, y + boxHeight / 2);
        p5.fill("black");
        p5.textSize(12);
        p5.text(logicalIndex, x + i * (boxWidth + 10) + boxWidth / 2, y - 10);
      }

      p5.fill("black");
      p5.textSize(14);
      let frontPosition = 0;
      p5.text(`Front`, x + frontPosition * (boxWidth + 10), y - 40);
      p5.stroke("black");
      p5.line(x + frontPosition * (boxWidth + 10) + boxWidth / 2, y - 25, x + frontPosition * (boxWidth + 10) + boxWidth / 2, y - 35);
      p5.line(x + frontPosition * (boxWidth + 10) + boxWidth / 2, y - 35, x + frontPosition * (boxWidth + 10) + boxWidth / 2 - 5, y - 30);
      p5.line(x + frontPosition * (boxWidth + 10) + boxWidth / 2, y - 35, x + frontPosition * (boxWidth + 10) + boxWidth / 2 + 5, y - 30);

      let rearPosition = queue.length - 1;
      p5.text(`Rear`, x + rearPosition * (boxWidth + 10), y + boxHeight + 25);
      p5.stroke("black");
      p5.line(x + rearPosition * (boxWidth + 10) + boxWidth / 2, y + boxHeight + 20, x + rearPosition * (boxWidth + 10) + boxWidth / 2, y + boxHeight + 30);
      p5.line(x + rearPosition * (boxWidth + 10) + boxWidth / 2, y + boxHeight + 30, x + rearPosition * (boxWidth + 10) + boxWidth / 2 - 5, y + boxHeight + 25);
      p5.line(x + rearPosition * (boxWidth + 10) + boxWidth / 2, y + boxHeight + 30, x + rearPosition * (boxWidth + 10) + boxWidth / 2 + 5, y + boxHeight + 25);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ marginBottom: "10px", fontSize: "28px" }}>Queue Visualization</h1>
        <p style={{ marginBottom: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          Queue is a linear data structure which follows First-In-First-Out(FIFO) concept. The following operations can be performed on the queue:
          <ul style={{ marginTop: "10px" }}>
            <li>Enqueue: Insert a value in the queue from the rear end.</li>
            <li>Dequeue: Delete a value from the front end.</li>
            <li>IsEmpty: Checks if queue is empty and return boolean value.</li>
            <li>IsFull: Checks if queue is full and return boolean value.</li>
          </ul>
        </p>
      </div>
      
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="number"
              value={queueSize}
              onChange={(e) => setQueueSize(e.target.value)}
              placeholder="Enter value"
              style={{ 
                marginRight: "10px", 
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "120px"
              }}
            />
            <button 
              onClick={createQueue}
              style={{ 
                backgroundColor: "black",
                color: "white",
                border: "none",
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px"
              }}
            >
              Create Queue
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              style={{ 
                marginRight: "10px", 
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                width: "120px"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <button 
              onClick={enqueue}
              style={{ 
                backgroundColor: "green",
                color: "white",
                border: "none",
                padding: "8px 20px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "80px"
              }}
            >
              Enqueue
            </button>
            <button 
              onClick={dequeue}
              style={{ 
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "8px 20px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "80px"
              }}
            >
              Dequeue
            </button>
            <button 
              onClick={isEmpty}
              style={{ 
                backgroundColor: "teal",
                color: "white",
                border: "none",
                padding: "8px 20px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "80px"
              }}
            >
              IsEmpty
            </button>
            <button 
              onClick={isFull}
              style={{ 
                backgroundColor: "brown",
                color: "white",
                border: "none",
                padding: "8px 20px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "80px"
              }}
            >
              IsFull
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
              <h3>Algorithm:</h3>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {algorithm ? (
                  algorithm.split("\n\n").map((step, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: currentStep === index ? "yellow" : "transparent",
                        padding: "2px 0",
                      }}
                    >
                      {step}
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#666" }}>No operation performed yet.</div>
                )}
              </pre>
            </div>
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px" }}>
              <h3>Complexity Analysis</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "5px" }}>Operation</th>
                    <th style={{ textAlign: "left", padding: "5px" }}>Time Complexity</th>
                    <th style={{ textAlign: "left", padding: "5px" }}>Space Complexity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "5px" }}>Enqueue</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>Dequeue</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>IsEmpty</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>IsFull</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ flex: 2, display: "flex", gap: "20px" }}>
          <div style={{ flex: 2 }}>
            <Sketch setup={setup} draw={draw} />
          </div>
          <div style={{ flex: 1, backgroundColor: "white", padding: "15px", borderRadius: "5px" }}>
            <h3>Operations Log:</h3>
            {operations.map((op, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>{op}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queue;