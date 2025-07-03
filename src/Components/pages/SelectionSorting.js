import React, { useState, useEffect } from 'react';
import Sketch from 'react-p5';
import './SortingAlgo.css';

class SelectionSort {
    constructor(array) {
        this.array = array.slice();
        this.n = array.length;
        this.i = 0;
        this.j = 1;
        this.minIndex = 0;
        this.step = 0;
        this.finished = false;
        this.history = [];
        this.saveState();
    }

    saveState() {
        this.history.push({
            array: this.array.slice(),
            i: this.i,
            j: this.j,
            minIndex: this.minIndex,
            step: this.step,
            finished: this.finished
        });
    }

    getState() {
        return {
            array: this.array.slice(),
            i: this.i,
            j: this.j,
            minIndex: this.minIndex,
            step: this.step,
            finished: this.finished
        };
    }

    nextStep() {
        if (this.finished) return;

        this.saveState();
        switch (this.step) {
            case 0: // 1. [Initialize]
                this.i = 0;
                this.step = 1;
                break;
            case 1: // 2. [Loop on index]
                if (this.i >= this.n - 1) {
                    this.finished = true;
                    this.step = 5;
                    return;
                }
                this.minIndex = this.i;
                this.j = this.i + 1;
                this.step = 2;
                break;
            case 2: // 3. [Find minimum]
                if (this.j >= this.n) {
                    this.step = 3;
                    break;
                }
                if (this.array[this.j] < this.array[this.minIndex]) {
                    this.minIndex = this.j;
                }
                this.j++;
                break;
            case 3: // 4. [Swap elements]
                if (this.minIndex !== this.i) {
                    let temp = this.array[this.i];
                    this.array[this.i] = this.array[this.minIndex];
                    this.array[this.minIndex] = temp;
                }
                this.step = 4;
                break;
            case 4: // 5. [Increment i]
                this.i++;
                this.step = 1;
                break;
            case 5: // 6. [Finished]
                this.finished = true;
                break;
        }
    }

    prevStep() {
        if (this.history.length > 1) {
            this.history.pop();
            const prevState = this.history[this.history.length - 1];
            this.array = prevState.array.slice();
            this.i = prevState.i;
            this.j = prevState.j;
            this.minIndex = prevState.minIndex;
            this.step = prevState.step;
            this.finished = prevState.finished;
        }
    }
}

const SelectionSortViz = ({ initialArray = [5, 23, 1, 15, 42, 8] }) => {
    const [sorter, setSorter] = useState(new SelectionSort(initialArray));
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
        setSorter(new SelectionSort(newArray));
    };

    const handleCustomArray = () => {
        const parsedArray = customInput.split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));
        if (parsedArray.length > 0) {
            setSorter(new SelectionSort(parsedArray));
            setCustomInput('');
        } else {
            alert('Please enter valid numbers separated by commas');
        }
    };

    const { array, i, j, minIndex, step, finished } = state;

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
            if (idx === i || idx === minIndex) {
                p5.fill(255, 255, 153); // Highlight current i and minIndex
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
                <h2 style={{ textAlign: "center", marginBottom: "0", width: "100%", fontSize: "32px" }}>Selection Sort Visualization</h2>
                <p style={{ marginTop: "5px", marginBottom: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "left", padding: "0 20px" }}>
                    Selection sort is a simple, in-place comparison sorting algorithm that works by repeatedly finding the minimum element from the unsorted portion of the array and swapping it with the first unsorted element. This process is repeated until the entire array is sorted. Use random array to generate random input or use custom array. Then perform selection sort by clicking on next button and visualize the sorting by following algorithm steps.
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
                                {`1. [Initialize]\n\tI <- ${i} (start with first element)`}
                            </span>
                            {'\n\n'}
                            <span className={step === 1 ? 'highlight' : ''}>
                                {`2. [Loop on index]\n\tRepeat thru step 5 for I = 1,2,...,${array.length-1}`}
                            </span>
                            {'\n\n'}
                            <span className={step === 2 ? 'highlight' : ''}>
                                {`3. [Find minimum]\n\tMIN <- K[${i}]\n\tMIN_POS <- ${minIndex}\n\tRepeat for J = ${j-1} to ${array.length-1}`}
                            </span>
                            {'\n\n'}
                            <span className={step === 3 ? 'highlight' : ''}>
                                {`4. [Swap elements]\n\tIf MIN_POS ≠ ${i}\n\tthen K[${i}] <-> K[${minIndex}]`}
                            </span>
                            {'\n\n'}
                            <span className={step === 4 ? 'highlight' : ''}>
                                {`5. [Increment I]\n\tI <- ${i + 1}`}
                            </span>
                            {'\n\n'}
                            <span className={step === 5 ? 'highlight' : ''}>
                                {`6. [Finished]\n\tReturn`}
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
                                    <td>O(n²)</td>
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

export default SelectionSortViz;