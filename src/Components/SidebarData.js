import React from "react";
import HouseIcon from '@mui/icons-material/House';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DataArrayIcon from '@mui/icons-material/DataArray';
import SortIcon from '@mui/icons-material/Sort';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import QuizIcon from '@mui/icons-material/Quiz';
import InsightsIcon from '@mui/icons-material/Insights';
import ParkIcon from '@mui/icons-material/Park';
import ViewListIcon from '@mui/icons-material/ViewList';
import QueueIcon from '@mui/icons-material/Queue';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HeightIcon from '@mui/icons-material/Height';
import GraphIcon from '@mui/icons-material/AccountTree';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const SidebarData = [
{
    title: "Play Games",
    icon: <SportsEsportsIcon />,
    link: "/home",
},

{
    title: "Data Structure",
    icon: <DataArrayIcon />,
    subtopics: [
        { name: "Stack", link: "/datastructure/stack", icon: <ViewListIcon /> },
        { name: "Queue", link: "/datastructure/queue", icon: <QueueIcon /> },
      ],
},

{
    title: "Sorting",
    icon: <SortIcon />,
    subtopics: [
        { name: "Bubble Sort", link: "/sorting/bubble-sort", icon: <SwapVertIcon /> },
        { name: "Insertion Sort", link: "/sorting/insertion-sort", icon: <ArrowUpwardIcon /> },
        { name: "Selection Sort", link: "/sorting/selection-sort", icon: <FilterListIcon /> },
      ],
},

{
    title: "Tree Algorithms",
    icon: <ParkIcon />,
    subtopics: [
        { name: "Traversal Methods", link: "/tree/traversal-methods", icon: <AccountTreeIcon /> },
        { name: "Height/Depth of Binary Tree", link: "/tree/height-depth", icon: <HeightIcon /> },
      ],
},

{
    title: "Graph Algorithms",
    icon: <InsightsIcon />,
    subtopics: [
        { name: "DFS", link: "/graph/dfs", icon: <ArrowDownwardIcon /> },
        { name: "BFS", link: "/graph/bfs", icon: <ArrowForwardIcon /> },
      ],
},

{
    title: "Quiz",
    icon: <QuizIcon />,
    link: "/games/quiz"
}

]