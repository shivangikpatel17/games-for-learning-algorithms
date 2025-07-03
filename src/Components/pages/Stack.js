import React, { useState } from "react";
import Sketch from "react-p5";

const Stack = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [currentStep, setCurrentStep] = useState(null);
  const [operations, setOperations] = useState([]);
  const [stackSize, setStackSize] = useState("");
  const [maxSize, setMaxSize] = useState(null);

  const createStack = () => {
    const size = parseInt(stackSize);
    if (isNaN(size) || size <= 0) {
      alert("⚠ Enter a valid stack size!");
      return;
    }
    setStack([]);
    setMaxSize(size);
    setOperations([...operations, `Created empty stack of size ${size}`]);
    setAlgorithm("");
    setCurrentStep(null);
  };

  const pushItem = () => {
    if (maxSize === null) {
      alert("⚠ Please create a stack first!");
      return;
    }
    if (inputValue.trim() === "") {
      alert("⚠ Please enter a value!");
      return;
    }
    if (stack.length >= maxSize) {
      alert("⚠ Stack is full!");
      return;
    }

    const steps = [
      "[Check for stack overflow]\nIf TOP>=N\nthen Write('STACK OVERFLOW')\nReturn",
      "[Increment TOP]\nTOP<-TOP+1",
      "[Insert element]\nS[TOP]<- X",
      "[Finished]\nReturn"
    ];

    let stepIndex = 0;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`PUSH(S, TOP, X)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        if (stack.length >= maxSize) {
          return;
        }
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else if (stepIndex === 1) {
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else if (stepIndex === 2) {
        setStack([...stack, inputValue]);
        setInputValue("");
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else if (stepIndex === 3) {
        setOperations([...operations, `Push ${inputValue} at the top`]);
        setCurrentStep(null);
      }
    };

    executeStep();
  };

  const popItem = () => {
    if (stack.length === 0) {
      alert("⚠ Stack is empty!");
      return;
    }

    const steps = [
      "[Check for underflow on stack]\nIf TOP=0\nthen Write('STACK UNDERFLOW ON POP')\ntake action in response to underflow\nExit",
      "[Decrement pointer]\nTOP<-TOP-1",
      "[Return former top element of stack]\nReturn(S[TOP+1])"
    ];

    let stepIndex = 0;
    let poppedValue;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`POP(S, TOP)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        if (stack.length === 0) {
          return;
        }
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else if (stepIndex === 1) {
        poppedValue = stack[stack.length - 1];
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else if (stepIndex === 2) {
        setStack(stack.slice(0, -1));
        setOperations([...operations, `Pop ${poppedValue} from the top`]);
        setCurrentStep(null);
      }
    };

    executeStep();
  };

  const peekItem = () => {
    if (stack.length === 0) {
      alert("⚠ Stack is empty!");
      return;
    }

    const steps = [
      "[Check for stack underflow]\nIf TOP=0\nthen Write('STACK UNDERFLOW ON POP')\ntake action in response to underflow\nExit",
      "[Return the top element]\nReturn(S[TOP])"
    ];

    let stepIndex = 0;
    let peekedValue;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`PEEK(S, TOP)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        if (stack.length === 0) {
          return;
        }
        stepIndex++;
        setTimeout(executeStep, 1000);
      } else if (stepIndex === 1) {
        peekedValue = stack[stack.length - 1];
        setOperations([...operations, `Peeked: ${peekedValue}`]);
        setCurrentStep(null);
      }
    };

    executeStep();
  };

  const isEmpty = () => {
    const steps = [
      "[Check if stack is empty]\nIf TOP=0\nthen Return(TRUE)\nelse Return(FALSE)"
    ];

    let stepIndex = 0;
    let isEmptyResult;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`ISEMPTY(S, TOP)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        setTimeout(() => {
          isEmptyResult = stack.length === 0;
          setOperations([...operations, `IsEmpty: ${isEmptyResult ? "TRUE" : "FALSE"}`]);
          setCurrentStep(null);
        }, 1000);
      }
    };

    executeStep();
  };

  const isFull = () => {
    if (maxSize === null) {
      alert("⚠ Please create a stack first!");
      return;
    }

    const steps = [
      "[Check if stack is full]\nIf TOP=N\nthen Return(TRUE)\nelse Return(FALSE)"
    ];

    let stepIndex = 0;
    let isFullResult;

    const executeStep = () => {
      setCurrentStep(stepIndex);
      setAlgorithm(`ISFULL(S, TOP, N)\n${steps.join("\n\n")}`);

      if (stepIndex === 0) {
        setTimeout(() => {
          isFullResult = stack.length >= maxSize;
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
    p5.text("Stack Visualization", p5.width / 2, 20);

    let x = 150;
    let y = 500;
    let boxWidth = 100;
    let boxHeight = 40;

    // Draw stack container
    if (maxSize !== null) {
      p5.fill(200);
      p5.stroke(100);
      p5.strokeWeight(2);
      
      // Draw the container outline
      p5.rect(x, y - (maxSize - 1) * boxHeight, boxWidth, maxSize * boxHeight);
      p5.strokeWeight(1);
      
      // Draw filled stack cells
      for (let i = stack.length - 1; i >= 0; i--) {
        p5.fill([100, 150, 255]);
        p5.rect(x, y - i * boxHeight, boxWidth, boxHeight);
        p5.fill(255);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(stack[i], x + boxWidth / 2, y - i * boxHeight + boxHeight / 2);
      }
      
      // Display top value
      if (stack.length > 0) {
        let topY = y - (stack.length - 1) * boxHeight;
        p5.fill("black");
        p5.textSize(14);
        p5.text(`Top = ${stack.length - 1}`, x - 80, topY + boxHeight / 2);

        p5.stroke("black");
        p5.line(x - 25, topY + boxHeight / 2, x, topY + boxHeight / 2);
        p5.line(x - 25, topY + boxHeight / 2, x - 15, topY + boxHeight / 2 - 5);
        p5.line(x - 25, topY + boxHeight / 2, x - 15, topY + boxHeight / 2 + 5);
      } else {
        // Show top = -1 below the stack for empty stack
        p5.fill("black");
        p5.textSize(14);
        p5.text(`Top = -1`, x + boxWidth / 2, y + 70);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ marginBottom: "10px", fontSize: "28px" }}>Stack Visualization</h1>
        <p style={{ marginBottom: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
          Stack is a linear data structure which follows Last-In-First-Out(LIFO) concept. The following operations can be performed on the stack:
          <ul style={{ marginTop: "10px" }}>
            <li>Push: Insert a value at the top of the stack.</li>
            <li>Pop: Remove the top value from the stack.</li>
            <li>Peek: Get the value at the top of the stack without removeing it.</li>
            <li>IsEmpty: Checks if stack is empty and return boolean value.</li>
            <li>IsFull: Checks if stack is full and return boolean value.</li>
          </ul>
        </p>
      </div>
      
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="number"
              value={stackSize}
              onChange={(e) => setStackSize(e.target.value)}
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
              onClick={createStack}
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
              Create Stack
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
              onClick={pushItem}
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
              Push
            </button>
            <button 
              onClick={popItem}
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
              Pop
            </button>
            <button 
              onClick={peekItem}
              style={{ 
                backgroundColor: "blue",
                color: "white",
                border: "none",
                padding: "8px 20px",
                cursor: "pointer",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "80px"
              }}
            >
              Peek
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
                    <td style={{ padding: "5px" }}>Push</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>Pop</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                    <td style={{ padding: "5px" }}>O(1)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "5px" }}>Peek</td>
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

export default Stack;