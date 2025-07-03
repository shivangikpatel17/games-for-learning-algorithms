import React, { useState, useRef, useEffect } from 'react';
import "./App.css";
import Sidebar from "./Components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/pages/Home";
import Queue from "./Components/pages/Queue";
import Stack from "./Components/pages/Stack";
import BubbleSortViz from './Components/pages/BubbleSorting';
import InsertionSort from "./Components/pages/InsertionSorting";
import SelectionSort from "./Components/pages/SelectionSorting";
import DFS from "./Components/pages/DFS";
import BFS from "./Components/pages/BFS";
import UntangleGraph from './Components/pages/PlannerGraph';
import DataStructureGame from './Components/pages/Datastructure';
import StackGame from './Components/pages/StackGame';
import QueueGame from './Components/pages/QueueGame';
import Quiz from "./Components/pages/Quiz";
import SortingGame from './Components/pages/SortingGame';
import BubbleSortGame from './Components/pages/BubbleSortGame';
import InsertionSortGame from './Components/pages/InsertionSortGame';
import SelectionSortGame from './Components/pages/SelectionSortGame';
import TreeTraversalMethods from './Components/pages/TreeTraversalMethods';
import HeightDepthTree from './Components/pages/HeightDepthTree';
import GraphGames from './Components/pages/GraphGames';
import DFSGames from './Components/pages/DFSGames';
import BFSGames from './Components/pages/BFSGames';

function App() {
  const initialArray = [64, 34, 25, 12, 22, 11, 90];

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/datastructure/queue" element={<Queue />} />
          <Route path="/datastructure/stack" element={<Stack />} />
          <Route path="/datastructure/options" element={<DataStructureGame />} />
          <Route path="/sortinggame" element={<SortingGame />} />
          <Route path="/bubble-sort-game" element={<BubbleSortGame />} />
          <Route path="/insertion-sort-game" element={<InsertionSortGame />} />
          <Route path="/selection-sort-game" element={<SelectionSortGame />} />
          <Route path="/sorting/bubble-sort" element={<BubbleSortViz initialArray={initialArray} />} />
          <Route path="/sorting/insertion-sort" element={<InsertionSort />} />
          <Route path="/sorting/selection-sort" element={<SelectionSort />} />
          <Route path="/graph/dfs" element={<DFS />} />
          <Route path="/graph/bfs" element={<BFS />} />
          <Route path="/graphs/untangle" element={<UntangleGraph />} />
          <Route path="/graphs" element={<GraphGames />} />
          <Route path="/graphs/dfsgames" element={<DFSGames />} />
          <Route path="/graphs/bfsgames" element={<BFSGames />} />
          <Route path="/games/quiz" element={<Quiz />} />
          <Route path="/datastructure" element={<DataStructureGame />} />
          <Route path="/stackgame" element={<StackGame />} />
          <Route path="/queuegame" element={<QueueGame />} />
          <Route path="/tree/traversal-methods" element={<TreeTraversalMethods />} />
          <Route path="/tree/height-depth" element={<HeightDepthTree />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;