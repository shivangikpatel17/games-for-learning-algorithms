import React, { useState, useEffect } from 'react';
import Sketch from 'react-p5';
import './SortingAlgo.css';

class BubbleSort {
    constructor(array) {
        this.array = array.slice();
        this.n = array.length;
        this.pass = 1;
        this.i = 1;
        this.last = this.n;
        this.exchs = 0;
        this.step = 0;
        this.finished = false;
        this.history = [];
        this.saveState();
    }

    saveState() {
        this.history.push({
            array: this.array.slice(),
            pass: this.pass,
            i: this.i,
            last: this.last,
            exchs: this.exchs,
            step: this.step,
            finished: this.finished
        });
    }

    getState() {
        return {
            array: this.array.slice(),
            pass: this.pass,
            i: this.i,
            last: this.last,
            exchs: this.exchs,
            step: this.step,
            finished: this.finished
        };
    }

    nextStep() {
        if (this.finished) return;

        this.saveState();
        switch(this.step) {
            case 0: // 1. [Initialize]
                this.last = this.n;
                this.step = 1;
                break;
            case 1: // 2. [Loop on pass index]
                if (this.pass > this.n - 1) {
                    this.finished = true;
                    this.step = 6;
                    return;
                }
                this.step = 2;
                break;
            case 2: // 3. [Initialize exchanges counter for this pass]
                this.exchs = 0;
                this.i = 1;
                this.step = 3;
                break;
            case 3: // 4. [Perform pairwise comparisons on unsorted elements]
                if (this.i >= this.last) {
                    this.step = 4;
                    break;
                }
                if (this.array[this.i - 1] > this.array[this.i]) {
                    let temp = this.array[this.i - 1];
                    this.array[this.i - 1] = this.array[this.i];
                    this.array[this.i] = temp;
                    this.exchs++;
                }
                this.i++;
                break;
            case 4: // 5. [Were any exchanges made on this pass?]
                if (this.exchs === 0) {
                    this.finished = true;
                    this.step = 6;
                } else {
                    this.last--;
                    this.pass++;
                    this.step = 1;
                }
                break;
            case 6: // 6. [Finished]
                this.finished = true;
                break;
        }
    }

    prevStep() {
        if (this.history.length > 1) {
            this.history.pop();
            const prevState = this.history[this.history.length - 1];
            this.array = prevState.array.slice();
            this.pass = prevState.pass;
            this.i = prevState.i;
            this.last = prevState.last;
            this.exchs = prevState.exchs;
            this.step = prevState.step;
            this.finished = prevState.finished;
        }
    }
}

const BubbleSortViz = ({ initialArray }) => {
    const [sorter, setSorter] = useState(new BubbleSort(initialArray));
    const [state, setState] = useState(sorter.getState());
    const [customInput, setCustomInput] = useState('');

    useEffect(() => {
        setState(sorter.getState());
    }, [sorter]);

    const handleNextStep = () => {
        sorter.nextStep();
        setState(sorter.getState());
    };

    const handlePrevStep = () => {
        sorter.prevStep();
        setState(sorter.getState());
    };

    const handleRandomArray = () => {
        const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
        setSorter(new BubbleSort(newArray));
    };

    const handleCustomArray = () => {
        const parsedArray = customInput.split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));
        if (parsedArray.length > 0) {
            setSorter(new BubbleSort(parsedArray));
            setCustomInput('');
        } else {
            alert('Please enter valid numbers separated by commas');
        }
    };

    const { array, pass, i, last, exchs, step, finished } = state;

    const setup = (p5, canvasParentRef) => {
       
        p5.createCanvas(800, 600).parent(canvasParentRef); 
    };

    const draw = (p5) => {
        p5.background(240);
        const paddingX = 30;
        const paddingY = 40;
        const totalWidth = p5.width - 2 * paddingX;
        const barWidth = totalWidth / (array.length + 1);
        const maxHeight = p5.height - paddingY;

        array.forEach((value, idx) => {
            const x = paddingX + idx * (barWidth + barWidth / array.length);
            const height = p5.map(value, 0, Math.max(...array), 0, maxHeight - 20);
            if (idx === i - 1 || idx === i) {
                p5.fill(255, 255, 153);
            } else {
                p5.fill(100, 150, 255);
            }
            p5.rect(x, maxHeight - height, barWidth, height, 4);
            p5.fill(0);
            p5.textSize(14);
            p5.textAlign(p5.CENTER);
            p5.text(idx, x + barWidth / 2, maxHeight + 15);
            p5.text(value, x + barWidth / 2, maxHeight - height - 10);
        });
    };

    return (
        <div className="sortingalgo-visualization">
            <div className="sortingalgo-visualization-header" style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2 style={{ textAlign: "center", marginBottom: "5px", width: "100%", fontSize: "32px" }}>Bubble Sort Visualization</h2>
                <p style={{ marginTop: "10px", marginBottom: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "left", padding: "0 20px" }}>
                    Bubble sort(Sinking Sort) is a simple sorting algorithm that repeatedly steps through the input list element by element, comparing the current element with the one after it, swapping their values if needed.
                    Click on the random array to generate random values in array or enter the custom array.
                    Then perform bubble sort on it by clicking on next button and visualize the sorting with algorithm.
                </p>
            </div>
            <div className="sortingalgo-visualization-content">
                <div className="sortingalgo-canvas-section">
                    <div className="sortingalgo-canvas-wrapper">
                        <Sketch setup={setup} draw={draw} />
                    </div>
                    <div className="sortingalgo-controls">
                        <div className="sortingalgo-control-buttons">
                            <button onClick={handlePrevStep} disabled={sorter.history.length <= 1}>
                                Back
                            </button>
                            <button onClick={handleNextStep} disabled={finished}>
                                Next
                            </button>
                            <button onClick={handleRandomArray}>
                                Random Array
                            </button>
                        </div>
                        <div className="sortingalgo-custom-array-input">
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Enter numbers (e.g., 5, 23, 1)"
                            />
                            <button onClick={handleCustomArray}>
                                Apply Custom
                            </button>
                        </div>
                        {finished && (
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <div style={{ color: '#28a745', marginBottom: '10px' }}>
                                    Sorting completed! You can generate a new random array or enter custom numbers to start again.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="sortingalgo-algorithm-section">
                    <div className="sortingalgo-algorithm-box">
                        <pre>
                            <span className={step === 0 ? 'highlight' : ''}>
                                {`1. [Initialize]\n\tLAST <- ${last} (entire list assumed unsorted at this point)`}
                            </span>
                            {'\n\n'}
                            <span className={step === 1 ? 'highlight' : ''}>
                                {`2. [Loop on pass index]\n\tRepeat thru step 5 for PASS = 1,2,...${array.length-1}`}
                            </span>
                            {'\n\n'}
                            <span className={step === 2 ? 'highlight' : ''}>
                                {`3. [Initialize exchanges counter for this pass]\n\tEXCHS <- ${exchs}`}
                            </span>
                            {'\n\n'}
                            <span className={step === 3 ? 'highlight' : ''}>
                                {`4. [Perform pairwise comparisons on unsorted elements]\n\tRepeat for I = 1 to ${last-1}\n\t\tIf K[${i-1}] > K[${i}]\n\t\tthen K[${i-1}] <-> K[${i}]\n\t\t\tEXCHS <- EXCHS + 1`}
                            </span>
                            {'\n\n'}
                            <span className={step === 4 ? 'highlight' : ''}>
                                {`5. [Were any exchanges made on this pass?]\n\tIf EXCHS = ${exchs}\n\tthen Return (mission accomplished; return early)\n\telse LAST <- ${last-1} (reduce size of unsorted list)`}
                            </span>
                            {'\n\n'}
                            <span className={step === 6 ? 'highlight' : ''}>
                                {`6. [Finished]\n\tReturn (maximum number of passes required)`}
                            </span>
                        </pre>
                    </div>
                    <div className="sortingalgo-complexity-box">
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
                                    <td>O(n)</td>
                                    <td>O(1)</td>
                                </tr>
                                <tr>
                                    <td>Average</td>
                                    <td>O(n²)</td>
                                    <td>O(1)</td>
                                </tr>
                                <tr>
                                    <td>Worst</td>
                                    <td>O(n²)</td>
                                    <td>O(1)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BubbleSortViz;