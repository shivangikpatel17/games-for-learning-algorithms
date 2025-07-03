// Function to shuffle array and return new array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to shuffle options and update correctAnswer
const shuffleQuestionOptions = (question) => {
  const correctOption = question.options[question.correctAnswer];
  const shuffledOptions = shuffleArray(question.options);
  const newCorrectAnswer = shuffledOptions.indexOf(correctOption);
  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer
  };
};

// Shuffle options for all questions
const shuffleAllQuestions = (questionsObj) => {
  const shuffled = {};
  for (const category in questionsObj) {
    shuffled[category] = {};
    for (const level in questionsObj[category]) {
      shuffled[category][level] = questionsObj[category][level].map(shuffleQuestionOptions);
    }
  }
  return shuffled;
};

// Original questions object
const originalQuestions = {
  stack: {
    beginner: [
      {
        text: "What is a Stack in data structures?",
        options: ["A linear data structure following LIFO", "A linear data structure following FIFO", "A non-linear data structure", "A sorted data structure"],
        correctAnswer: 0,
        explanation: "A Stack is a linear data structure that follows the Last In, First Out (LIFO) principle, where the last element added is the first to be removed."
      },
      {
        text: "What operation adds an element to a Stack?",
        options: ["Push", "Pop", "Peek", "Enqueue"],
        correctAnswer: 0,
        explanation: "The push operation adds an element to the top of the Stack."
      },
      {
        text: "What does the pop operation do in a Stack?",
        options: ["Removes the top element", "Adds an element", "Returns the top element without removing", "Clears the Stack"],
        correctAnswer: 0,
        explanation: "The pop operation removes and returns the top element of the Stack."
      },
      {
        text: "What is the time complexity of the push operation in a Stack?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The push operation has O(1) time complexity as it adds an element to the top."
      },
      {
        text: "What happens when you pop an empty Stack?",
        options: ["Stack underflow", "Stack overflow", "Returns null", "No effect"],
        correctAnswer: 0,
        explanation: "Popping an empty Stack causes a stack underflow error."
      },
      {
        text: "What is the purpose of the peek operation in a Stack?",
        options: ["Returns the top element without removing", "Removes the top element", "Adds an element", "Checks if Stack is empty"],
        correctAnswer: 0,
        explanation: "The peek operation returns the top element without removing it."
      },
      {
        text: "Which data structure can implement a Stack?",
        options: ["Array", "Linked List", "Both Array and Linked List", "Tree"],
        correctAnswer: 2,
        explanation: "A Stack can be implemented using either an Array or a Linked List."
      },
      {
        text: "What is the space complexity of a Stack with n elements?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The space complexity is O(n) as it stores n elements."
      },
      {
        text: "What is a common application of a Stack?",
        options: ["Function call management", "Task scheduling", "Breadth-first search", "Priority queue"],
        correctAnswer: 0,
        explanation: "Stacks manage function calls in recursion, storing return addresses and local variables."
      },
      {
        text: "What does LIFO stand for in the context of a Stack?",
        options: ["Last In, First Out", "Last In, First Ordered", "Linear Input, First Out", "Last Input, Full Output"],
        correctAnswer: 0,
        explanation: "LIFO stands for Last In, First Out, describing the order of element removal."
      },
      {
        text: "In an array-based Stack, what indicates a full Stack?",
        options: ["Top equals array size - 1", "Top equals 0", "Top equals array size", "Top is null"],
        correctAnswer: 0,
        explanation: "The Stack is full when the top index equals the array size minus 1."
      },
      {
        text: "What operation checks if a Stack is empty?",
        options: ["isEmpty", "isFull", "peek", "pop"],
        correctAnswer: 0,
        explanation: "The isEmpty operation checks if a Stack has no elements."
      },
      {
        text: "What is the time complexity of the peek operation in a Stack?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The peek operation has O(1) time complexity as it accesses the top element."
      },
      {
        text: "Where are elements added and removed in a Stack?",
        options: ["At the top", "At the bottom", "In the middle", "Randomly"],
        correctAnswer: 0,
        explanation: "Elements are added (pushed) and removed (popped) at the top."
      },
      {
        text: "What is the initial value of the top index in an array-based Stack?",
        options: ["-1", "0", "1", "Null"],
        correctAnswer: 0,
        explanation: "The top index is initially -1, indicating an empty Stack."
      },
      {
        text: "Which operation is NOT associated with a Stack?",
        options: ["Push", "Pop", "Enqueue", "Peek"],
        correctAnswer: 2,
        explanation: "Enqueue is a Queue operation, not a Stack operation."
      },
      {
        text: "What is a disadvantage of an array-based Stack?",
        options: ["Fixed size", "Slow operations", "High space complexity", "No LIFO support"],
        correctAnswer: 0,
        explanation: "An array-based Stack has a fixed size, limiting the number of elements."
      },
      {
        text: "What is an advantage of a linked list-based Stack?",
        options: ["Dynamic size", "Faster operations", "Less memory usage", "Fixed size"],
        correctAnswer: 0,
        explanation: "A linked list-based Stack can grow dynamically."
      },
      {
        text: "What is a real-world use of a Stack?",
        options: ["Undo functionality", "Print job scheduling", "Level-order traversal", "Load balancing"],
        correctAnswer: 0,
        explanation: "Stacks are used in undo functionality to store previous states."
      },
      {
        text: "What is the top of the Stack?",
        options: ["The last element added", "The first element added", "The middle element", "The largest element"],
        correctAnswer: 0,
        explanation: "The top is the last element added, following LIFO."
      }
    ],
    medium: [
      {
        text: "How can a Stack check for balanced parentheses?",
        options: ["Push opening, pop on closing", "Push closing, pop on opening", "Use two Stacks", "Not possible"],
        correctAnswer: 0,
        explanation: "Push opening parentheses and pop when a matching closing parenthesis is found."
      },
      {
        text: "What is the time complexity of checking balanced parentheses using a Stack?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each character is processed once, resulting in O(n) time complexity."
      },
      {
        text: "How can a Stack evaluate a postfix expression?",
        options: ["Push operands, pop for operators", "Push operators, pop for operands", "Use two Stacks", "Not possible"],
        correctAnswer: 0,
        explanation: "Operands are pushed, and operators pop operands, compute, and push the result."
      },
      {
        text: "What is the time complexity of evaluating a postfix expression?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each character is processed once, resulting in O(n) time complexity."
      },
      {
        text: "How can two Stacks be implemented in a single array?",
        options: ["Grow from opposite ends", "Use middle as divider", "Use linked lists", "Not possible"],
        correctAnswer: 0,
        explanation: "Two Stacks grow from opposite ends towards the center."
      },
      {
        text: "What happens if two Stacks in a single array meet?",
        options: ["Stack overflow", "Stack underflow", "No effect", "Array splits"],
        correctAnswer: 0,
        explanation: "Meeting in the middle indicates a stack overflow."
      },
      {
        text: "How can a Stack convert infix to postfix expression?",
        options: ["Push operators, pop based on precedence", "Push operands, pop for operators", "Use two Stacks", "Not possible"],
        correctAnswer: 0,
        explanation: "Operators are pushed and popped based on precedence."
      },
      {
        text: "What is the time complexity of infix to postfix conversion?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each character is processed once, resulting in O(n) time complexity."
      },
      {
        text: "What is a monotonic Stack used for?",
        options: ["Maintaining sorted order", "Reversing elements", "Balancing parentheses", "Postfix evaluation"],
        correctAnswer: 0,
        explanation: "A monotonic Stack maintains elements in sorted order, useful for problems like next greater element."
      },
      {
        text: "What is the time complexity of finding the next greater element using a Stack?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each element is pushed and popped at most once, resulting in O(n) time complexity."
      },
      {
        text: "How can a Stack implement recursion iteratively?",
        options: ["Store function call states", "Store results", "Store base cases", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack stores function call states to simulate recursion."
      },
      {
        text: "What is the space complexity of iterative factorial using a Stack?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The Stack stores n states, resulting in O(n) space complexity."
      },
      {
        text: "How can a Stack be used in browser history?",
        options: ["Store visited pages", "Store cookies", "Store cache", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack stores visited pages for back navigation."
      },
      {
        text: "What is the time complexity of checking a palindrome using a Stack?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Pushing and popping characters takes O(n) time."
      },
      {
        text: "What is the space complexity of a Stack for backtracking?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The Stack may store up to n states, resulting in O(n) space complexity."
      },
      {
        text: "How can a Stack reverse a string?",
        options: ["Push all characters, pop all", "Push half, pop half", "Use two Stacks", "Not possible"],
        correctAnswer: 0,
        explanation: "Push all characters and pop them to reverse the string."
      },
      {
        text: "What is the time complexity of reversing a string using a Stack?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Pushing and popping n characters takes O(n) time."
      },
      {
        text: "What is a disadvantage of a Stack compared to a Queue?",
        options: ["Limited access order", "Slower operations", "Higher space complexity", "No applications"],
        correctAnswer: 0,
        explanation: "A Stack's LIFO order limits access compared to a Queue's FIFO."
      },
      {
        text: "How can a Stack be used in expression evaluation?",
        options: ["Handle operator precedence", "Store final results", "Sort operands", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack handles operator precedence in expressions like postfix or infix."
      },
      {
        text: "Why is a Stack used in depth-first search?",
        options: ["Explores deeper paths first", "Explores all neighbors first", "Reduces memory", "Improves time complexity"],
        correctAnswer: 0,
        explanation: "A Stack ensures deeper paths are explored first in DFS."
      }
    ],
    hard: [
      {
        text: "What is the time complexity of implementing a Stack using two Queues for push?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Push is costly, requiring O(n) to move elements between Queues."
      },
      {
        text: "How can a Stack find the largest rectangle in a histogram?",
        options: ["Store increasing heights", "Store decreasing heights", "Store all heights", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack stores indices of increasing heights to compute the largest rectangle."
      },
      {
        text: "What is the time complexity of the histogram rectangle algorithm?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each bar is pushed and popped at most once, resulting in O(n) time."
      },
      {
        text: "How can a Stack implement a min-Stack with O(1) min retrieval?",
        options: ["Use two Stacks", "Use one Stack", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "Two Stacks track elements and minimums for O(1) min retrieval."
      },
      {
        text: "What is the space complexity of a min-Stack?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Two Stacks may store n elements, resulting in O(n) space complexity."
      },
      {
        text: "How can a Stack solve the stock span problem?",
        options: ["Store previous prices", "Store current prices", "Store differences", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack stores indices of previous prices to compute spans."
      },
      {
        text: "What is the time complexity of the stock span problem?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each price is processed once, resulting in O(n) time."
      },
      {
        text: "How can a Stack implement a Queue?",
        options: ["Use two Stacks", "Use one Stack", "Use a linked list", "Not possible"],
        correctAnswer: 0,
        explanation: "Two Stacks reverse the order during enqueue or dequeue."
      },
      {
        text: "What is the time complexity of dequeue in a Queue using two Stacks?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Dequeue is O(1) if enqueue is costly."
      },
      {
        text: "How can a Stack solve the trapping rainwater problem?",
        options: ["Store indices of bars", "Store heights", "Store water levels", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack stores indices to compute trapped water."
      },
      {
        text: "What is the time complexity of the trapping rainwater problem?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each bar is pushed and popped at most once, resulting in O(n) time."
      },
      {
        text: "What is the cache locality impact on Stack performance?",
        options: ["High locality improves performance", "Low locality reduces performance", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Array-based Stacks have high cache locality, improving performance."
      },
      {
        text: "How can a Stack be used in a sliding window maximum problem?",
        options: ["Store indices of decreasing elements", "Store increasing elements", "Store all elements", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack (or deque) stores indices of decreasing elements."
      },
      {
        text: "What is the time complexity of the sliding window maximum?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each element is pushed and popped at most once, resulting in O(n) time."
      },
      {
        text: "How can a Stack handle concurrent access?",
        options: ["Use locks", "Use Queues", "Use arrays", "Not possible"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe access in a multithreaded environment."
      },
      {
        text: "What is the overhead of locks in a Stack?",
        options: ["Increased latency", "Reduced memory", "Improved locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "How can a Stack implement iterative DFS?",
        options: ["Store nodes to explore", "Store visited nodes", "Store paths", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack stores nodes to explore, simulating recursion."
      },
      {
        text: "What is the space complexity of iterative DFS using a Stack?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The Stack may store n nodes, resulting in O(n) space."
      },
      {
        text: "How can a Stack validate a binary search tree?",
        options: ["Store inorder traversal", "Store preorder traversal", "Store postorder traversal", "Not possible"],
        correctAnswer: 0,
        explanation: "A Stack performs iterative inorder traversal to validate a BST."
      },
      {
        text: "What is the time complexity of BST validation using a Stack?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each node is processed once, resulting in O(n) time."
      }
    ]
  },

  queue: {
    beginner: [
      {
        text: "What is a Queue in data structures?",
        options: ["A linear data structure following FIFO", "A linear data structure following LIFO", "A non-linear data structure", "A sorted data structure"],
        correctAnswer: 0,
        explanation: "A Queue follows the First In, First Out (FIFO) principle, where the first element added is the first to be removed."
      },
      {
        text: "What operation adds an element to a Queue?",
        options: ["Enqueue", "Dequeue", "Peek", "Push"],
        correctAnswer: 0,
        explanation: "The enqueue operation adds an element to the rear of the Queue."
      },
      {
        text: "What does the dequeue operation do in a Queue?",
        options: ["Removes the front element", "Adds an element", "Returns the front element", "Clears the Queue"],
        correctAnswer: 0,
        explanation: "The dequeue operation removes and returns the front element of the Queue."
      },
      {
        text: "What is the time complexity of the enqueue operation in a Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue has O(1) time complexity as it adds an element to the rear."
      },
      {
        text: "What happens when you dequeue an empty Queue?",
        options: ["Queue underflow", "Queue overflow", "Returns null", "No effect"],
        correctAnswer: 0,
        explanation: "Dequeuing an empty Queue causes a queue underflow error."
      },
      {
        text: "What is the purpose of the peek operation in a Queue?",
        options: ["Returns the front element without removing", "Removes the front element", "Adds an element", "Checks if Queue is empty"],
        correctAnswer: 0,
        explanation: "The peek operation returns the front element without removing it."
      },
      {
        text: "Which data structure can implement a Queue?",
        options: ["Array", "Linked List", "Both Array and Linked List", "Tree"],
        correctAnswer: 2,
        explanation: "A Queue can be implemented using either an Array or a Linked List."
      },
      {
        text: "What is the space complexity of a Queue with n elements?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The space complexity is O(n) as it stores n elements."
      },
      {
        text: "What is a common application of a Queue?",
        options: ["Task scheduling", "Function call management", "Depth-first search", "Expression evaluation"],
        correctAnswer: 0,
        explanation: "Queues are used in task scheduling, such as in operating systems for managing processes."
      },
      {
        text: "What does FIFO stand for in the context of a Queue?",
        options: ["First In, First Out", "First In, First Ordered", "Fast Input, First Out", "First Input, Full Output"],
        correctAnswer: 0,
        explanation: "FIFO stands for First In, First Out, describing the order of element removal."
      },
      {
        text: "In an array-based Queue, what indicates a full Queue?",
        options: ["Rear equals array size - 1", "Rear equals 0", "Rear equals array size", "Rear is null"],
        correctAnswer: 0,
        explanation: "The Queue is full when the rear index equals the array size minus 1."
      },
      {
        text: "What operation checks if a Queue is empty?",
        options: ["isEmpty", "isFull", "peek", "dequeue"],
        correctAnswer: 0,
        explanation: "The isEmpty operation checks if a Queue has no elements."
      },
      {
        text: "What is the time complexity of the peek operation in a Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The peek operation has O(1) time complexity as it accesses the front element."
      },
      {
        text: "Where are elements added and removed in a Queue?",
        options: ["Added at rear, removed at front", "Added at front, removed at rear", "Added and removed at front", "Randomly"],
        correctAnswer: 0,
        explanation: "Elements are enqueued at the rear and dequeued at the front."
      },
      {
        text: "What is the initial value of the front index in an array-based Queue?",
        options: ["0", "-1", "1", "Null"],
        correctAnswer: 0,
        explanation: "The front index is initially 0, indicating the first position."
      },
      {
        text: "Which operation is NOT associated with a Queue?",
        options: ["Enqueue", "Dequeue", "Push", "Peek"],
        correctAnswer: 2,
        explanation: "Push is a Stack operation, not a Queue operation."
      },
      {
        text: "What is a disadvantage of an array-based Queue?",
        options: ["Fixed size", "Slow operations", "High space complexity", "No FIFO support"],
        correctAnswer: 0,
        explanation: "An array-based Queue has a fixed size, limiting the number of elements."
      },
      {
        text: "What is an advantage of a linked list-based Queue?",
        options: ["Dynamic size", "Faster operations", "Less memory usage", "Fixed size"],
        correctAnswer: 0,
        explanation: "A linked list-based Queue can grow dynamically."
      },
      {
        text: "What is a real-world use of a Queue?",
        options: ["Print job scheduling", "Undo functionality", "Depth-first search", "Expression evaluation"],
        correctAnswer: 0,
        explanation: "Queues manage print jobs in order, ensuring FIFO processing."
      },
      {
        text: "What is the front of the Queue?",
        options: ["The first element added", "The last element added", "The middle element", "The largest element"],
        correctAnswer: 0,
        explanation: "The front is the first element added, following FIFO."
      }
    ],
    medium: [
      {
        text: "What is a circular Queue?",
        options: ["A Queue that reuses empty space", "A Queue with a circular linked list", "A Queue with a fixed front", "A Queue with no rear"],
        correctAnswer: 0,
        explanation: "A circular Queue reuses space by connecting the rear to the front, improving efficiency."
      },
      {
        text: "What is the primary advantage of a circular Queue over a linear Queue?",
        options: ["Better space utilization", "Faster operations", "Less memory usage", "Dynamic size"],
        correctAnswer: 0,
        explanation: "A circular Queue utilizes space more efficiently by reusing freed space."
      },
      {
        text: "What is the time complexity of the enqueue operation in a circular Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue in a circular Queue has O(1) time complexity."
      },
      {
        text: "How is a Queue used in breadth-first search (BFS)?",
        options: ["Stores nodes to explore level by level", "Stores visited nodes", "Stores paths", "Not used in BFS"],
        correctAnswer: 0,
        explanation: "A Queue stores nodes to explore level by level, ensuring FIFO order."
      },
      {
        text: "What is the space complexity of BFS using a Queue?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The Queue may store up to n nodes, resulting in O(n) space complexity."
      },
      {
        text: "What is a priority Queue?",
        options: ["A Queue where elements have priorities", "A Queue with a fixed size", "A Queue with a circular structure", "A Queue with LIFO order"],
        correctAnswer: 0,
        explanation: "A priority Queue dequeues elements based on their priority, not just FIFO."
      },
      {
        text: "What is the time complexity of enqueue in a priority Queue using a binary heap?",
        options: ["O(log n)", "O(1)", "O(n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue requires O(log n) to maintain the heap property."
      },
      {
        text: "How can a Queue be used in round-robin scheduling?",
        options: ["Stores processes in order", "Stores process priorities", "Stores execution results", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores processes to allocate fixed time slices in order."
      },
      {
        text: "What is the time complexity of process scheduling in round-robin using a Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue and dequeue operations for scheduling are O(1)."
      },
      {
        text: "What is a double-ended Queue (deque)?",
        options: ["A Queue allowing operations at both ends", "A Queue with dynamic size", "A Queue with priority", "A circular Queue"],
        correctAnswer: 0,
        explanation: "A deque allows adding and removing elements at both the front and rear."
      },
      {
        text: "What is the time complexity of adding an element to the front of a deque?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Adding to the front of a deque is O(1) with proper implementation."
      },
      {
        text: "How can a Queue simulate a printer queue?",
        options: ["Stores print jobs in order", "Stores printer status", "Stores ink levels", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores print jobs to process them in FIFO order."
      },
      {
        text: "What is the space complexity of a printer queue simulation using a Queue?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The Queue stores n print jobs, resulting in O(n) space complexity."
      },
      {
        text: "How can a Queue be used in a sliding window protocol?",
        options: ["Stores packets for transmission", "Stores acknowledgments", "Stores error logs", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue manages packets in order for transmission."
      },
      {
        text: "What is the time complexity of packet processing in a sliding window protocol?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue and dequeue operations for packets are O(1)."
      },
      {
        text: "What is a disadvantage of a linear array-based Queue compared to a circular Queue?",
        options: ["Wasted space after dequeue", "Slower operations", "Higher complexity", "No FIFO support"],
        correctAnswer: 0,
        explanation: "Linear Queues waste space after dequeuing, unlike circular Queues."
      },
      {
        text: "How can a Queue be implemented using two Stacks?",
        options: ["Reverse order during dequeue", "Reverse order during enqueue", "Use one Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "Two Stacks can simulate a Queue by reversing order during dequeue."
      },
      {
        text: "What is the time complexity of enqueue in a Queue implemented using two Stacks?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue is O(1) if dequeue is made costly."
      },
      {
        text: "What is the benefit of using a Queue in process synchronization?",
        options: ["Ensures ordered execution", "Reduces memory usage", "Improves cache locality", "Eliminates locks"],
        correctAnswer: 0,
        explanation: "A Queue ensures processes execute in a defined order."
      },
      {
        text: "How can a Queue be used in a traffic light simulation?",
        options: ["Stores vehicles waiting", "Stores light states", "Stores timers", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores vehicles waiting at a traffic light in FIFO order."
      }
    ],
    hard: [
      {
        text: "What is the time complexity of the dequeue operation in a Queue implemented using two Stacks?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Dequeue is costly, requiring O(n) to move elements between Stacks."
      },
      {
        text: "How can a Queue be used to implement a load balancer?",
        options: ["Distributes tasks to servers", "Stores server states", "Stores client requests", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue distributes tasks fairly across servers in FIFO order."
      },
      {
        text: "What is the time complexity of task distribution in a load balancer using a Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue and dequeue operations for task distribution are O(1)."
      },
      {
        text: "How is a priority Queue used in Dijkstra's algorithm?",
        options: ["Stores vertices by distance", "Stores edges", "Stores paths", "Not used"],
        correctAnswer: 0,
        explanation: "A priority Queue extracts the vertex with the minimum distance."
      },
      {
        text: "What is the time complexity of Dijkstra's algorithm using a priority Queue?",
        options: ["O((V+E) log V)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "Using a priority Queue, Dijkstra's algorithm runs in O((V+E) log V) time."
      },
      {
        text: "How can a Queue implement a message queue system?",
        options: ["Stores messages for processing", "Stores acknowledgments", "Stores error logs", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores messages in order for asynchronous processing."
      },
      {
        text: "What is the space complexity of a message queue system using a Queue?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "The Queue stores n messages, resulting in O(n) space complexity."
      },
      {
        text: "How can a Queue implement an LRU cache eviction policy?",
        options: ["Stores least recently used items", "Stores most recently used items", "Stores random items", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores items with the least recently used at the front for eviction."
      },
      {
        text: "What is the time complexity of LRU cache operations using a Queue and hash map?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Using a Queue and hash map, cache operations are O(1)."
      },
      {
        text: "How can a Queue handle concurrent access in a multithreaded environment?",
        options: ["Uses locks for thread safety", "Uses Stacks", "Uses arrays", "Not possible"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe enqueue and dequeue operations."
      },
      {
        text: "What is the overhead of using locks in a Queue?",
        options: ["Increased latency", "Reduced memory usage", "Improved cache locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "How does a Queue solve the producer-consumer problem?",
        options: ["Acts as a buffer", "Stores producer states", "Stores consumer states", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue acts as a buffer between producers and consumers."
      },
      {
        text: "What is the time complexity of operations in the producer-consumer problem using a Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue and dequeue operations are O(1)."
      },
      {
        text: "How can a Queue implement level-order traversal of a binary tree?",
        options: ["Stores nodes level by level", "Stores leaf nodes", "Stores root nodes", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores nodes to process them level by level."
      },
      {
        text: "What is the time complexity of level-order traversal using a Queue?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each node is processed once, resulting in O(n) time."
      },
      {
        text: "How can a Queue solve the sliding window maximum problem?",
        options: ["Uses a deque to store indices", "Uses a Stack", "Uses an array", "Not used"],
        correctAnswer: 0,
        explanation: "A deque stores indices of decreasing elements for efficient maximum retrieval."
      },
      {
        text: "What is the time complexity of the sliding window maximum problem using a deque?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Each element is pushed and popped at most once, resulting in O(n) time."
      },
      {
        text: "What is the impact of cache locality on Queue performance?",
        options: ["Low locality reduces performance", "High locality improves performance", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Linked list-based Queues have low cache locality, reducing performance."
      },
      {
        text: "How can a Queue be used in job scheduling for a CPU?",
        options: ["Stores jobs in order", "Stores job priorities", "Stores execution results", "Not used"],
        correctAnswer: 0,
        explanation: "A Queue stores jobs to process them in FIFO order."
      },
      {
        text: "What is the time complexity of job scheduling using a Queue?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Enqueue and dequeue operations for scheduling are O(1)."
      }
    ]
  },

  'bubble-sort': {
    beginner: [
      {
        text: "What is Bubble Sort?",
        options: ["A comparison-based sorting algorithm", "A divide-and-conquer algorithm", "A non-comparison-based algorithm", "A graph traversal algorithm"],
        correctAnswer: 0,
        explanation: "Bubble Sort is a comparison-based algorithm that repeatedly swaps adjacent elements if they are in the wrong order."
      },
      {
        text: "What is the main operation in Bubble Sort?",
        options: ["Swapping adjacent elements", "Dividing the array", "Merging subarrays", "Selecting a pivot"],
        correctAnswer: 0,
        explanation: "Bubble Sort swaps adjacent elements to move larger elements to the end."
      },
      {
        text: "What is the worst-case time complexity of Bubble Sort?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Bubble Sort requires O(n²) comparisons and swaps in the worst case."
      },
      {
        text: "What is the best-case time complexity of Bubble Sort?",
        options: ["O(n)", "O(n²)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "In the best case (sorted array), optimized Bubble Sort requires O(n) comparisons."
      },
      {
        text: "What is the space complexity of Bubble Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Bubble Sort is in-place, requiring only O(1) extra space."
      },
      {
        text: "Is Bubble Sort a stable sorting algorithm?",
        options: ["Yes", "No", "Sometimes", "Depends on implementation"],
        correctAnswer: 0,
        explanation: "Bubble Sort is stable, preserving the relative order of equal elements."
      },
      {
        text: "What does it mean for Bubble Sort to be in-place?",
        options: ["Sorts within the array", "Uses extra array", "Divides array", "Merges subarrays"],
        correctAnswer: 0,
        explanation: "Bubble Sort sorts within the array using constant extra space."
      },
      {
        text: "What happens in each pass of Bubble Sort?",
        options: ["Largest element moves to end", "Smallest element moves to start", "Array is divided", "Pivot is selected"],
        correctAnswer: 0,
        explanation: "Each pass moves the largest unsorted element to the end."
      },
      {
        text: "How many passes does Bubble Sort require for n elements?",
        options: ["n-1", "n", "n/2", "log n"],
        correctAnswer: 0,
        explanation: "Bubble Sort requires n-1 passes to fully sort n elements."
      },
      {
        text: "What is the purpose of a flag in optimized Bubble Sort?",
        options: ["Detects if array is sorted", "Counts swaps", "Selects pivot", "Divides array"],
        correctAnswer: 0,
        explanation: "A flag checks if no swaps occurred, indicating the array is sorted."
      },
      {
        text: "Which array is best suited for Bubble Sort?",
        options: ["Already sorted", "Reverse sorted", "Random order", "All equal elements"],
        correctAnswer: 0,
        explanation: "An already sorted array requires O(n) time with optimization."
      },
      {
        text: "Which array is worst for Bubble Sort?",
        options: ["Reverse sorted", "Already sorted", "Random order", "All equal elements"],
        correctAnswer: 0,
        explanation: "A reverse sorted array requires maximum swaps, taking O(n²) time."
      },
      {
        text: "What is a disadvantage of Bubble Sort?",
        options: ["High time complexity", "High space complexity", "Not stable", "Not in-place"],
        correctAnswer: 0,
        explanation: "Bubble Sort's O(n²) time complexity makes it inefficient for large datasets."
      },
      {
        text: "What is an advantage of Bubble Sort?",
        options: ["Simple implementation", "Efficient for large datasets", "High space complexity", "Not stable"],
        correctAnswer: 0,
        explanation: "Bubble Sort is simple to understand and implement."
      },
      {
        text: "Can Bubble Sort be used for linked lists?",
        options: ["Yes", "No", "Only with arrays", "Only with trees"],
        correctAnswer: 0,
        explanation: "Bubble Sort can be adapted for linked lists by swapping node values."
      },
      {
        text: "What is the time complexity of Bubble Sort for a linked list?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Bubble Sort on a linked list still requires O(n²) time."
      },
      {
        text: "What happens when Bubble Sort is applied to an array of equal elements?",
        options: ["O(n) time", "O(n²) time", "O(log n) time", "No swaps needed"],
        correctAnswer: 0,
        explanation: "Equal elements require O(n) time with no swaps in optimized Bubble Sort."
      },
      {
        text: "Which data structure is typically used for Bubble Sort?",
        options: ["Array", "Linked List", "Tree", "Graph"],
        correctAnswer: 0,
        explanation: "Bubble Sort is typically implemented using an array for simplicity."
      },
      {
        text: "Why is Bubble Sort rarely used in practice?",
        options: ["Inefficient for large datasets", "Complex implementation", "High space complexity", "Not stable"],
        correctAnswer: 0,
        explanation: "Bubble Sort's O(n²) time complexity is inefficient for large datasets."
      },
      {
        text: "What is the role of comparisons in Bubble Sort?",
        options: ["Determine swap necessity", "Divide array", "Merge subarrays", "Select pivot"],
        correctAnswer: 0,
        explanation: "Comparisons determine if adjacent elements need to be swapped."
      }
    ],
    medium: [
      {
        text: "How can Bubble Sort be optimized to terminate early?",
        options: ["Use a flag to check swaps", "Use recursion", "Use a pivot", "Divide array"],
        correctAnswer: 0,
        explanation: "A flag stops the algorithm if no swaps occur, indicating a sorted array."
      },
      {
        text: "What is the impact of early termination on Bubble Sort's best-case time complexity?",
        options: ["Reduces to O(n)", "Remains O(n²)", "Reduces to O(log n)", "No impact"],
        correctAnswer: 0,
        explanation: "Early termination allows Bubble Sort to achieve O(n) in the best case."
      },
      {
        text: "How can Bubble Sort be modified to sort in descending order?",
        options: ["Change comparison operator", "Use extra array", "Use recursion", "Select pivot"],
        correctAnswer: 0,
        explanation: "Changing the comparison operator from < to > sorts in descending order."
      },
      {
        text: "What is the time complexity of Bubble Sort for descending order?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The time complexity remains O(n²) regardless of sorting order."
      },
      {
        text: "How does Bubble Sort handle duplicate elements?",
        options: ["Preserves their order", "Removes duplicates", "Requires extra space", "Not possible"],
        correctAnswer: 0,
        explanation: "Bubble Sort is stable, preserving the order of duplicate elements."
      },
      {
        text: "What is the impact of duplicates on Bubble Sort's performance?",
        options: ["No significant impact", "Increases time complexity", "Reduces time complexity", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Duplicates do not significantly affect Bubble Sort's performance."
      },
      {
        text: "How can Bubble Sort be implemented recursively?",
        options: ["Perform one pass, recurse", "Divide array, recurse", "Merge subarrays", "Not possible"],
        correctAnswer: 0,
        explanation: "Recursive Bubble Sort performs one pass and recurses on the remaining elements."
      },
      {
        text: "What is the space complexity of recursive Bubble Sort?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Recursive Bubble Sort uses O(n) space due to the recursion stack."
      },
      {
        text: "How can Bubble Sort handle floating-point numbers?",
        options: ["Use epsilon for comparisons", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "An epsilon value handles floating-point precision issues in comparisons."
      },
      {
        text: "What is the time complexity of Bubble Sort with floating-point numbers?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The time complexity remains O(n²) for floating-point numbers."
      },
      {
        text: "How can Bubble Sort be used to sort strings?",
        options: ["Use lexicographical comparison", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "Bubble Sort uses lexicographical comparison for strings."
      },
      {
        text: "What is the space complexity of Bubble Sort when sorting strings?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Bubble Sort for strings is in-place, requiring O(1) extra space."
      },
      {
        text: "How can Bubble Sort sort custom objects?",
        options: ["Use a comparison function", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "A comparison function defines the sorting criteria for objects."
      },
      {
        text: "What is the advantage of using a comparison function in Bubble Sort?",
        options: ["Flexible sorting criteria", "Improved time complexity", "Reduced memory usage", "Faster swaps"],
        correctAnswer: 0,
        explanation: "A comparison function allows sorting based on custom criteria."
      },
      {
        text: "What is the impact of cache locality on Bubble Sort performance?",
        options: ["High locality improves performance", "Low locality reduces performance", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Sequential array access in Bubble Sort improves cache performance."
      },
      {
        text: "Can Bubble Sort be parallelized effectively?",
        options: ["No, it's inherently sequential", "Yes, using multiple threads", "Yes, using recursion", "Yes, using extra arrays"],
        correctAnswer: 0,
        explanation: "Bubble Sort's sequential nature makes parallelization inefficient."
      },
      {
        text: "What is the effect of array size on Bubble Sort performance?",
        options: ["Quadratic increase in time", "Linear increase in time", "Logarithmic increase", "No effect"],
        correctAnswer: 0,
        explanation: "Time complexity increases quadratically with array size."
      },
      {
        text: "How does Bubble Sort perform with nearly sorted arrays?",
        options: ["O(n) with optimization", "O(n²) always", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Optimized Bubble Sort achieves O(n) for nearly sorted arrays."
      },
      {
        text: "What is a practical use case for Bubble Sort?",
        options: ["Small or nearly sorted arrays", "Large datasets", "Distributed systems", "Real-time systems"],
        correctAnswer: 0,
        explanation: "Bubble Sort is practical for small or nearly sorted arrays due to simplicity."
      },
      {
        text: "How does Bubble Sort compare to Selection Sort in terms of stability?",
        options: ["Bubble Sort is stable", "Selection Sort is stable", "Both are stable", "Neither is stable"],
        correctAnswer: 0,
        explanation: "Bubble Sort is stable, while Selection Sort is not."
      }
    ],
    hard: [
      {
        text: "What is the total number of comparisons in Bubble Sort for n elements in the worst case?",
        options: ["n(n-1)/2", "n²", "n log n", "n"],
        correctAnswer: 0,
        explanation: "Bubble Sort performs n(n-1)/2 comparisons in the worst case."
      },
      {
        text: "What is the number of swaps in Bubble Sort for a reverse sorted array?",
        options: ["n(n-1)/2", "n²", "n", "n log n"],
        correctAnswer: 0,
        explanation: "A reverse sorted array requires n(n-1)/2 swaps in the worst case."
      },
      {
        text: "How can Bubble Sort be optimized for arrays with few inversions?",
        options: ["Use a flag for early termination", "Use recursion", "Use a pivot", "Not possible"],
        correctAnswer: 0,
        explanation: "A flag allows early termination for arrays with few inversions."
      },
      {
        text: "What is the time complexity of Bubble Sort for an array with k inversions?",
        options: ["O(n + k)", "O(n²)", "O(k log n)", "O(n)"],
        correctAnswer: 0,
        explanation: "With optimization, Bubble Sort takes O(n + k) for k inversions."
      },
      {
        text: "How can Bubble Sort reduce unnecessary comparisons?",
        options: ["Track last swap position", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "Tracking the last swap position reduces comparisons in subsequent passes."
      },
      {
        text: "What is the impact of tracking the last swap position in Bubble Sort?",
        options: ["Reduces comparisons", "Reduces swaps", "Changes to O(n log n)", "Increases space complexity"],
        correctAnswer: 0,
        explanation: "Tracking the last swap position reduces unnecessary comparisons."
      },
      {
        text: "Is Bubble Sort suitable for external sorting?",
        options: ["No, it's inefficient", "Yes, for small chunks", "Yes, with recursion", "Yes, with extra arrays"],
        correctAnswer: 0,
        explanation: "Bubble Sort is inefficient for external sorting due to high time complexity."
      },
      {
        text: "How does Bubble Sort's cache performance compare to Insertion Sort?",
        options: ["Similar cache performance", "Better than Insertion Sort", "Worse than Insertion Sort", "No impact"],
        correctAnswer: 0,
        explanation: "Both have similar cache performance due to sequential array access."
      },
      {
        text: "How can Bubble Sort handle concurrent access in a multithreaded environment?",
        options: ["Use locks for swaps", "Use separate arrays", "Use recursion", "Not practical"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe swaps, but parallelization is inefficient."
      },
      {
        text: "What is the overhead of using locks in Bubble Sort?",
        options: ["Increased latency", "Reduced memory usage", "Improved locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "Is Bubble Sort suitable for distributed systems?",
        options: ["No, it's inefficient", "Yes, for small chunks", "Yes, with recursion", "Yes, with extra arrays"],
        correctAnswer: 0,
        explanation: "Bubble Sort is inefficient for distributed systems due to sequential nature."
      },
      {
        text: "What is the impact of data distribution on Bubble Sort performance?",
        options: ["Affects best-case performance", "No impact", "Affects space complexity", "Affects stability"],
        correctAnswer: 0,
        explanation: "Data distribution affects best-case performance (e.g., sorted vs. reverse sorted)."
      },
      {
        text: "How can Bubble Sort detect if an array is already sorted?",
        options: ["Check for no swaps", "Check for comparisons", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "No swaps in a pass indicate the array is sorted."
      },
      {
        text: "What is the time complexity of checking if an array is sorted using Bubble Sort?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "One pass with no swaps takes O(n) time to confirm a sorted array."
      },
      {
        text: "How does Bubble Sort perform with sparse arrays?",
        options: ["No special impact", "Better performance", "Worse performance", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Sparse arrays do not significantly impact Bubble Sort's performance."
      },
      {
        text: "What is the impact of Bubble Sort on cache misses?",
        options: ["Low due to sequential access", "High due to random access", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Sequential access reduces cache misses in Bubble Sort."
      },
      {
        text: "What is Cocktail Sort in relation to Bubble Sort?",
        options: ["Bidirectional Bubble Sort", "Recursive Bubble Sort", "Parallel Bubble Sort", "Not related"],
        correctAnswer: 0,
        explanation: "Cocktail Sort is a bidirectional variant of Bubble Sort."
      },
      {
        text: "What is the time complexity of Cocktail Sort?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Cocktail Sort has the same O(n²) time complexity as Bubble Sort."
      },
      {
        text: "How does Bubble Sort compare to Insertion Sort for small arrays?",
        options: ["Insertion Sort is faster", "Bubble Sort is faster", "Similar performance", "Depends on data"],
        correctAnswer: 0,
        explanation: "Insertion Sort is faster due to fewer swaps for small arrays."
      },
      {
        text: "What is the primary reason Bubble Sort is used for educational purposes?",
        options: ["Simplicity and clarity", "High efficiency", "Low space complexity", "Parallelization"],
        correctAnswer: 0,
        explanation: "Bubble Sort's simplicity makes it ideal for teaching sorting concepts."
      }
    ]
  },


  'insertion-sort': {
    beginner: [
      {
        text: "What is Insertion Sort?",
        options: ["A comparison-based sorting algorithm", "A divide-and-conquer algorithm", "A non-comparison-based algorithm", "A graph traversal algorithm"],
        correctAnswer: 0,
        explanation: "Insertion Sort builds a sorted array by inserting each element into its correct position."
      },
      {
        text: "What is the main operation in Insertion Sort?",
        options: ["Inserting elements in sorted position", "Swapping adjacent elements", "Dividing the array", "Selecting a pivot"],
        correctAnswer: 0,
        explanation: "Insertion Sort inserts each element into the correct position in the sorted portion."
      },
      {
        text: "What is the worst-case time complexity of Insertion Sort?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Insertion Sort requires O(n²) comparisons and shifts in the worst case."
      },
      {
        text: "What is the best-case time complexity of Insertion Sort?",
        options: ["O(n)", "O(n²)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "In the best case (sorted array), Insertion Sort requires O(n) comparisons."
      },
      {
        text: "What is the space complexity of Insertion Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Insertion Sort is in-place, requiring only O(1) extra space."
      },
      {
        text: "Is Insertion Sort a stable sorting algorithm?",
        options: ["Yes", "No", "Sometimes", "Depends on implementation"],
        correctAnswer: 0,
        explanation: "Insertion Sort is stable, preserving the relative order of equal elements."
      },
      {
        text: "What does it mean for Insertion Sort to be in-place?",
        options: ["Sorts within the array", "Uses extra array", "Divides array", "Merges subarrays"],
        correctAnswer: 0,
        explanation: "Insertion Sort sorts within the array using constant extra space."
      },
      {
        text: "Where is the sorted portion in Insertion Sort?",
        options: ["At the beginning", "At the end", "In the middle", "Randomly"],
        correctAnswer: 0,
        explanation: "The sorted portion grows at the beginning of the array."
      },
      {
        text: "How many elements are compared during each insertion in Insertion Sort?",
        options: ["Up to i elements", "All n elements", "One element", "Log n elements"],
        correctAnswer: 0,
        explanation: "Each insertion compares the current element with up to i elements in the sorted portion."
      },
      {
        text: "What is the purpose of shifting in Insertion Sort?",
        options: ["Make space for insertion", "Swap adjacent elements", "Divide array", "Merge subarrays"],
        correctAnswer: 0,
        explanation: "Shifting elements makes space for the current element to be inserted."
      },
      {
        text: "Which array is best suited for Insertion Sort?",
        options: ["Already sorted", "Reverse sorted", "Random order", "All equal elements"],
        correctAnswer: 0,
        explanation: "An already sorted array requires O(n) time with minimal shifts."
      },
      {
        text: "Which array is worst for Insertion Sort?",
        options: ["Reverse sorted", "Already sorted", "Random order", "All equal elements"],
        correctAnswer: 0,
        explanation: "A reverse sorted array requires maximum shifts, taking O(n²) time."
      },
      {
        text: "What is a disadvantage of Insertion Sort?",
        options: ["High time complexity", "High space complexity", "Not stable", "Not in-place"],
        correctAnswer: 0,
        explanation: "Insertion Sort's O(n²) time complexity is inefficient for large datasets."
      },
      {
        text: "What is an advantage of Insertion Sort?",
        options: ["Efficient for small arrays", "Efficient for large datasets", "High space complexity", "Not stable"],
        correctAnswer: 0,
        explanation: "Insertion Sort is efficient for small or nearly sorted arrays."
      },
      {
        text: "Can Insertion Sort be used for linked lists?",
        options: ["Yes", "No", "Only with arrays", "Only with trees"],
        correctAnswer: 0,
        explanation: "Insertion Sort is well-suited for linked lists due to easy insertion."
      },
      {
        text: "What is the time complexity of Insertion Sort for a linked list?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Insertion Sort on a linked list requires O(n²) time for comparisons and insertions."
      },
      {
        text: "What happens when Insertion Sort is applied to an array of equal elements?",
        options: ["O(n) time", "O(n²) time", "O(log n) time", "No shifts needed"],
        correctAnswer: 0,
        explanation: "Equal elements require O(n) time with minimal shifts."
      },
      {
        text: "Which data structure is typically used for Insertion Sort?",
        options: ["Array", "Linked List", "Tree", "Graph"],
        correctAnswer: 0,
        explanation: "Insertion Sort is typically implemented using an array for simplicity."
      },
      {
        text: "Why is Insertion Sort preferred for small datasets?",
        options: ["Low overhead", "High time complexity", "High space complexity", "Not stable"],
        correctAnswer: 0,
        explanation: "Insertion Sort has low overhead, making it efficient for small datasets."
      },
      {
        text: "How does Insertion Sort differ from Bubble Sort?",
        options: ["Fewer shifts in Insertion Sort", "More comparisons in Insertion Sort", "Insertion Sort is not stable", "Bubble Sort is faster"],
        correctAnswer: 0,
        explanation: "Insertion Sort requires fewer shifts compared to Bubble Sort's swaps."
      }
    ],
    medium: [
      {
        text: "How can Insertion Sort be optimized using binary search?",
        options: ["Find insertion position", "Swap elements", "Divide array", "Not possible"],
        correctAnswer: 0,
        explanation: "Binary search reduces comparison time by finding the insertion position efficiently."
      },
      {
        text: "What is the time complexity of Insertion Sort with binary search?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Binary search reduces comparisons to O(log n) per insertion, but shifting still makes it O(n²)."
      },
      {
        text: "How can Insertion Sort be modified to sort in descending order?",
        options: ["Change comparison operator", "Use extra array", "Use recursion", "Select pivot"],
        correctAnswer: 0,
        explanation: "Changing the comparison operator from < to > sorts in descending order."
      },
      {
        text: "What is the time complexity of Insertion Sort for descending order?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The time complexity remains O(n²) regardless of sorting order."
      },
      {
        text: "How does Insertion Sort handle duplicate elements?",
        options: ["Preserves their order", "Removes duplicates", "Requires extra space", "Not possible"],
        correctAnswer: 0,
        explanation: "Insertion Sort is stable, preserving the order of duplicate elements."
      },
      {
        text: "What is the impact of duplicates on Insertion Sort's performance?",
        options: ["No significant impact", "Increases time complexity", "Reduces time complexity", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Duplicates do not significantly affect Insertion Sort's performance."
      },
      {
        text: "How can Insertion Sort be implemented recursively?",
        options: ["Insert one element, recurse", "Divide array, recurse", "Merge subarrays", "Not possible"],
        correctAnswer: 0,
        explanation: "Recursive Insertion Sort inserts one element and recurses on the remaining elements."
      },
      {
        text: "What is the space complexity of recursive Insertion Sort?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Recursive Insertion Sort uses O(n) space due to the recursion stack."
      },
      {
        text: "How can Insertion Sort handle floating-point numbers?",
        options: ["Use epsilon for comparisons", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "An epsilon value handles floating-point precision issues in comparisons."
      },
      {
        text: "What is the time complexity of Insertion Sort with floating-point numbers?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The time complexity remains O(n²) for floating-point numbers."
      },
      {
        text: "How can Insertion Sort be used to sort strings?",
        options: ["Use lexicographical comparison", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "Insertion Sort uses lexicographical comparison for strings."
      },
      {
        text: "What is the space complexity of Insertion Sort when sorting strings?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Insertion Sort for strings is in-place, requiring O(1) extra space."
      },
      {
        text: "How can Insertion Sort sort custom objects?",
        options: ["Use a comparison function", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "A comparison function defines the sorting criteria for objects."
      },
      {
        text: "What is the advantage of using a comparison function in Insertion Sort?",
        options: ["Flexible sorting criteria", "Improved time complexity", "Reduced memory usage", "Faster shifts"],
        correctAnswer: 0,
        explanation: "A comparison function allows sorting based on custom criteria."
      },
      {
        text: "What is the impact of cache locality on Insertion Sort performance?",
        options: ["High locality improves performance", "Low locality reduces performance", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Sequential array access in Insertion Sort improves cache performance."
      },
      {
        text: "Can Insertion Sort be parallelized effectively?",
        options: ["No, it's inherently sequential", "Yes, using multiple threads", "Yes, using recursion", "Yes, using extra arrays"],
        correctAnswer: 0,
        explanation: "Insertion Sort's sequential nature makes parallelization inefficient."
      },
      {
        text: "Why is Insertion Sort efficient for nearly sorted arrays?",
        options: ["Fewer shifts required", "Fewer comparisons", "Better cache locality", "Lower space complexity"],
        correctAnswer: 0,
        explanation: "Nearly sorted arrays require fewer shifts, reducing time complexity."
      },
      {
        text: "What is a practical use case for Insertion Sort?",
        options: ["Small or nearly sorted arrays", "Large datasets", "Distributed systems", "Real-time systems"],
        correctAnswer: 0,
        explanation: "Insertion Sort is practical for small or nearly sorted arrays."
      },
      {
        text: "How does Insertion Sort perform with nearly sorted arrays?",
        options: ["O(n) time", "O(n²) time", "O(n log n) time", "O(1) time"],
        correctAnswer: 0,
        explanation: "Nearly sorted arrays require O(n) time due to minimal shifts."
      },
      {
        text: "How does Insertion Sort compare to Bubble Sort for small arrays?",
        options: ["Insertion Sort is faster", "Bubble Sort is faster", "Similar performance", "Depends on data"],
        correctAnswer: 0,
        explanation: "Insertion Sort is faster due to fewer shifts compared to Bubble Sort's swaps."
      }
    ],
    hard: [
      {
        text: "What is the total number of comparisons in Insertion Sort for n elements in the worst case?",
        options: ["n(n-1)/2", "n²", "n log n", "n"],
        correctAnswer: 0,
        explanation: "Insertion Sort performs n(n-1)/2 comparisons in the worst case."
      },
      {
        text: "What is the number of shifts in Insertion Sort for a reverse sorted array?",
        options: ["n(n-1)/2", "n²", "n", "n log n"],
        correctAnswer: 0,
        explanation: "A reverse sorted array requires n(n-1)/2 shifts in the worst case."
      },
      {
        text: "How can Insertion Sort be optimized for large arrays?",
        options: ["Use binary search for insertion", "Use recursion", "Use extra array", "Not possible"],
        correctAnswer: 0,
        explanation: "Binary search reduces comparison time for finding the insertion position."
      },
      {
        text: "What is the impact of binary search on Insertion Sort's performance?",
        options: ["Reduces comparisons, not shifts", "Reduces shifts, not comparisons", "Reduces both", "No impact"],
        correctAnswer: 0,
        explanation: "Binary search reduces comparisons to O(log n) per insertion, but shifts remain O(n)."
      },
      {
        text: "How is Insertion Sort used in hybrid sorting algorithms?",
        options: ["For small subarrays in Quick Sort", "For large datasets", "For distributed systems", "Not used"],
        correctAnswer: 0,
        explanation: "Insertion Sort is used for small subarrays in Quick Sort to reduce overhead."
      },
      {
        text: "What is the typical threshold size for using Insertion Sort in hybrid Quick Sort?",
        options: ["10-20 elements", "100 elements", "1000 elements", "1 element"],
        correctAnswer: 0,
        explanation: "Insertion Sort is typically used for subarrays of 10-20 elements in Quick Sort."
      },
      {
        text: "How does Insertion Sort's cache performance compare to Bubble Sort?",
        options: ["Similar cache performance", "Better than Bubble Sort", "Worse than Bubble Sort", "No impact"],
        correctAnswer: 0,
        explanation: "Both have similar cache performance due to sequential array access."
      },
      {
        text: "How can Insertion Sort handle concurrent access in a multithreaded environment?",
        options: ["Use locks for shifts", "Use separate arrays", "Use recursion", "Not practical"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe shifts, but parallelization is inefficient."
      },
      {
        text: "What is the overhead of using locks in Insertion Sort?",
        options: ["Increased latency", "Reduced memory usage", "Improved locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "Is Insertion Sort suitable for distributed systems?",
        options: ["No, it's inefficient", "Yes, for small chunks", "Yes, with recursion", "Yes, with extra arrays"],
        correctAnswer: 0,
        explanation: "Insertion Sort is inefficient for distributed systems due to its sequential nature."
      },
      {
        text: "What is the impact of array size on Insertion Sort performance?",
        options: ["Quadratic increase in time", "Linear increase in time", "Logarithmic increase", "No impact"],
        correctAnswer: 0,
        explanation: "Time complexity increases quadratically with array size."
      },
      {
        text: "How can Insertion Sort detect if an array is already sorted?",
        options: ["Check for no shifts", "Check for comparisons", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "No shifts in a pass indicate the array is sorted."
      },
      {
        text: "What is the time complexity of checking if an array is sorted using Insertion Sort?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "One pass with no shifts takes O(n) time to confirm a sorted array."
      },
      {
        text: "How does Insertion Sort perform with sparse arrays?",
        options: ["No special impact", "Better performance", "Worse performance", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Sparse arrays do not significantly impact Insertion Sort's performance."
      },
      {
        text: "What is the impact of Insertion Sort on cache misses?",
        options: ["Low due to sequential access", "High due to random access", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Sequential access reduces cache misses in Insertion Sort."
      },
      {
        text: "How is Insertion Sort related to Shell Sort?",
        options: ["Shell Sort extends Insertion Sort", "Shell Sort is unrelated", "Shell Sort is recursive", "Shell Sort is parallel"],
        correctAnswer: 0,
        explanation: "Shell Sort extends Insertion Sort by using gaps to sort sublists."
      },
      {
        text: "What is the time complexity of Shell Sort compared to Insertion Sort?",
        options: ["Better than O(n²)", "Same as O(n²)", "O(n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Shell Sort's time complexity is better than O(n²), depending on the gap sequence."
      },
      {
        text: "How does Insertion Sort compare to Selection Sort for small arrays?",
        options: ["Insertion Sort is faster", "Selection Sort is faster", "Similar performance", "Depends on data"],
        correctAnswer: 0,
        explanation: "Insertion Sort is faster due to fewer shifts compared to Selection Sort."
      },
      {
        text: "Is Insertion Sort suitable for external sorting?",
        options: ["Yes, for small chunks", "No, it's inefficient", "Yes, with recursion", "Yes, with extra arrays"],
        correctAnswer: 0,
        explanation: "Insertion Sort can be used for small chunks in external sorting."
      },
      {
        text: "What is the primary reason Insertion Sort is used for educational purposes?",
        options: ["Simplicity and efficiency for small arrays", "High efficiency for large datasets", "Low space complexity", "Parallelization"],
        correctAnswer: 0,
        explanation: "Insertion Sort's simplicity and efficiency for small arrays make it ideal for teaching."
      }
    ]
  },


  'selection-sort': {
    beginner: [
      {
        text: "What is Selection Sort?",
        options: ["A comparison-based sorting algorithm", "A divide-and-conquer algorithm", "A non-comparison-based algorithm", "A graph traversal algorithm"],
        correctAnswer: 0,
        explanation: "Selection Sort repeatedly selects the smallest element from the unsorted portion and places it at the beginning."
      },
      {
        text: "What is the main operation in Selection Sort?",
        options: ["Finding the minimum element", "Inserting elements", "Swapping adjacent elements", "Dividing the array"],
        correctAnswer: 0,
        explanation: "Selection Sort finds the minimum element in the unsorted portion and swaps it with the first element."
      },
      {
        text: "What is the worst-case time complexity of Selection Sort?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Selection Sort requires O(n²) comparisons in the worst case."
      },
      {
        text: "What is the best-case time complexity of Selection Sort?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Selection Sort always requires O(n²) comparisons, even in the best case."
      },
      {
        text: "What is the space complexity of Selection Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Selection Sort is in-place, requiring only O(1) extra space."
      },
      {
        text: "Is Selection Sort a stable sorting algorithm?",
        options: ["No", "Yes", "Sometimes", "Depends on implementation"],
        correctAnswer: 0,
        explanation: "Selection Sort is not stable, as it may swap equal elements, disrupting their relative order."
      },
      {
        text: "What does it mean for Selection Sort to be in-place?",
        options: ["Sorts within the array", "Uses extra array", "Divides array", "Merges subarrays"],
        correctAnswer: 0,
        explanation: "Selection Sort sorts within the array using constant extra space."
      },
      {
        text: "Where is the sorted portion in Selection Sort?",
        options: ["At the beginning", "At the end", "In the middle", "Randomly"],
        correctAnswer: 0,
        explanation: "The sorted portion grows at the beginning of the array."
      },
      {
        text: "How many swaps does Selection Sort perform for n elements?",
        options: ["At most n-1", "n²", "n log n", "n/2"],
        correctAnswer: 0,
        explanation: "Selection Sort performs at most n-1 swaps, one per pass."
      },
      {
        text: "What is the purpose of finding the minimum in Selection Sort?",
        options: ["Place it in the sorted portion", "Insert it in the middle", "Divide the array", "Merge subarrays"],
        correctAnswer: 0,
        explanation: "The minimum is swapped to the beginning of the unsorted portion."
      },
      {
        text: "Which array is best suited for Selection Sort?",
        options: ["No significant difference", "Already sorted", "Reverse sorted", "All equal elements"],
        correctAnswer: 0,
        explanation: "Selection Sort's performance is consistent, with O(n²) time for all cases."
      },
      {
        text: "Which array is worst for Selection Sort?",
        options: ["No significant difference", "Already sorted", "Reverse sorted", "All equal elements"],
        correctAnswer: 0,
        explanation: "Selection Sort's time complexity is O(n²) regardless of the input."
      },
      {
        text: "What is a disadvantage of Selection Sort?",
        options: ["High time complexity", "High space complexity", "Stable sorting", "Complex implementation"],
        correctAnswer: 0,
        explanation: "Selection Sort's O(n²) time complexity is inefficient for large datasets."
      },
      {
        text: "What is an advantage of Selection Sort?",
        options: ["Minimal swaps", "Efficient for large datasets", "High space complexity", "Stable sorting"],
        correctAnswer: 0,
        explanation: "Selection Sort minimizes swaps, performing at most n-1 swaps."
      },
      {
        text: "Can Selection Sort be used for linked lists?",
        options: ["Yes", "No", "Only with arrays", "Only with trees"],
        correctAnswer: 0,
        explanation: "Selection Sort can be adapted for linked lists by swapping node values."
      },
      {
        text: "What is the time complexity of Selection Sort for a linked list?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Selection Sort on a linked list requires O(n²) time for comparisons and swaps."
      },
      {
        text: "What happens when Selection Sort is applied to an array of equal elements?",
        options: ["O(n²) time", "O(n) time", "O(log n) time", "No swaps needed"],
        correctAnswer: 0,
        explanation: "Equal elements still require O(n²) comparisons, though swaps may be minimal."
      },
      {
        text: "Which data structure is typically used for Selection Sort?",
        options: ["Array", "Linked List", "Tree", "Graph"],
        correctAnswer: 0,
        explanation: "Selection Sort is typically implemented using an array for simplicity."
      },
      {
        text: "Why is Selection Sort rarely used in practice?",
        options: ["Inefficient for large datasets", "Complex implementation", "High space complexity", "Stable sorting"],
        correctAnswer: 0,
        explanation: "Selection Sort's O(n²) time complexity is inefficient for large datasets."
      },
      {
        text: "What is the role of comparisons in Selection Sort?",
        options: ["Find the minimum element", "Insert elements", "Swap adjacent elements", "Divide array"],
        correctAnswer: 0,
        explanation: "Comparisons identify the minimum element in the unsorted portion."
      }
    ],
    medium: [
      {
        text: "How can Selection Sort be modified to sort in descending order?",
        options: ["Find maximum instead of minimum", "Use extra array", "Use recursion", "Select pivot"],
        correctAnswer: 0,
        explanation: "Finding the maximum element instead of the minimum sorts in descending order."
      },
      {
        text: "What is the time complexity of Selection Sort for descending order?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The time complexity remains O(n²) regardless of sorting order."
      },
      {
        text: "How does Selection Sort handle duplicate elements?",
        options: ["May disrupt their order", "Preserves their order", "Removes duplicates", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Selection Sort is not stable, so it may disrupt the order of duplicates."
      },
      {
        text: "What is the impact of duplicates on Selection Sort's performance?",
        options: ["No significant impact", "Increases time complexity", "Reduces time complexity", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Duplicates do not significantly affect Selection Sort's performance."
      },
      {
        text: "How can Selection Sort be implemented recursively?",
        options: ["Find minimum, recurse", "Divide array, recurse", "Merge subarrays", "Not possible"],
        correctAnswer: 0,
        explanation: "Recursive Selection Sort finds the minimum and recurses on the remaining elements."
      },
      {
        text: "What is the space complexity of recursive Selection Sort?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Recursive Selection Sort uses O(n) space due to the recursion stack."
      },
      {
        text: "How can Selection Sort handle floating-point numbers?",
        options: ["Use epsilon for comparisons", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "An epsilon value handles floating-point precision issues in comparisons."
      },
      {
        text: "What is the time complexity of Selection Sort with floating-point numbers?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "The time complexity remains O(n²) for floating-point numbers."
      },
      {
        text: "How can Selection Sort be used to sort strings?",
        options: ["Use lexicographical comparison", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "Selection Sort uses lexicographical comparison for strings."
      },
      {
        text: "What is the space complexity of Selection Sort when sorting strings?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Selection Sort for strings is in-place, requiring O(1) extra space."
      },
      {
        text: "How can Selection Sort sort custom objects?",
        options: ["Use a comparison function", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "A comparison function defines the sorting criteria for objects."
      },
      {
        text: "What is the advantage of using a comparison function in Selection Sort?",
        options: ["Flexible sorting criteria", "Improved time complexity", "Reduced memory usage", "Fewer swaps"],
        correctAnswer: 0,
        explanation: "A comparison function allows sorting based on custom criteria."
      },
      {
        text: "What is the impact of cache locality on Selection Sort performance?",
        options: ["Low locality reduces performance", "High locality improves performance", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Non-sequential access to find the minimum reduces cache performance."
      },
      {
        text: "Can Selection Sort be parallelized effectively?",
        options: ["No, it's inherently sequential", "Yes, using multiple threads", "Yes, using recursion", "Yes, using extra arrays"],
        correctAnswer: 0,
        explanation: "Selection Sort's sequential nature makes parallelization inefficient."
      },
      {
        text: "How does Selection Sort perform with nearly sorted arrays?",
        options: ["O(n²) time", "O(n) time", "O(n log n) time", "O(1) time"],
        correctAnswer: 0,
        explanation: "Selection Sort always takes O(n²) time, even for nearly sorted arrays."
      },
      {
        text: "What is a practical use case for Selection Sort?",
        options: ["When minimizing swaps is critical", "Large datasets", "Distributed systems", "Real-time systems"],
        correctAnswer: 0,
        explanation: "Selection Sort is useful when minimizing swaps is more important than overall speed."
      },
      {
        text: "How does Selection Sort compare to Insertion Sort in terms of stability?",
        options: ["Insertion Sort is stable", "Selection Sort is stable", "Both are stable", "Neither is stable"],
        correctAnswer: 0,
        explanation: "Insertion Sort is stable, while Selection Sort is not."
      },
      {
        text: "How does Selection Sort compare to Bubble Sort for small arrays?",
        options: ["Selection Sort is faster", "Bubble Sort is faster", "Similar performance", "Depends on data"],
        correctAnswer: 0,
        explanation: "Selection Sort is faster due to fewer swaps compared to Bubble Sort."
      },
      {
        text: "What is the effect of array size on Selection Sort performance?",
        options: ["Quadratic increase in time", "Linear increase in time", "Logarithmic increase", "No effect"],
        correctAnswer: 0,
        explanation: "Time complexity increases quadratically with array size."
      },
      {
        text: "Why is Selection Sort efficient when swap operations are costly?",
        options: ["Minimizes swaps", "Minimizes comparisons", "Better cache locality", "Lower space complexity"],
        correctAnswer: 0,
        explanation: "Selection Sort performs at most n-1 swaps, minimizing swap operations."
      }
    ],
    hard: [
      {
        text: "What is the total number of comparisons in Selection Sort for n elements?",
        options: ["n(n-1)/2", "n²", "n log n", "n"],
        correctAnswer: 0,
        explanation: "Selection Sort performs n(n-1)/2 comparisons to find the minimum each pass."
      },
      {
        text: "What is the maximum number of swaps in Selection Sort for n elements?",
        options: ["n-1", "n²", "n log n", "n/2"],
        correctAnswer: 0,
        explanation: "Selection Sort performs at most n-1 swaps, one per pass."
      },
      {
        text: "Can Selection Sort be optimized for nearly sorted arrays?",
        options: ["No, performance is consistent", "Yes, using binary search", "Yes, using recursion", "Yes, using extra arrays"],
        correctAnswer: 0,
        explanation: "Selection Sort's performance is O(n²) regardless of input order."
      },
      {
        text: "How can Selection Sort be modified to make it stable?",
        options: ["Shift elements instead of swapping", "Use extra array", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "Shifting elements instead of swapping can make Selection Sort stable."
      },
      {
        text: "What is the time complexity of stable Selection Sort?",
        options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Stable Selection Sort still requires O(n²) time due to shifting."
      },
      {
        text: "What is the space complexity of stable Selection Sort?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation: "Stable Selection Sort remains in-place with O(1) extra space."
      },
      {
        text: "How does Selection Sort's cache performance compare to Insertion Sort?",
        options: ["Worse than Insertion Sort", "Better than Insertion Sort", "Similar cache performance", "No impact"],
        correctAnswer: 0,
        explanation: "Selection Sort has worse cache performance due to non-sequential minimum searches."
      },
      {
        text: "How can Selection Sort handle concurrent access in a multithreaded environment?",
        options: ["Use locks for swaps", "Use separate arrays", "Use recursion", "Not practical"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe swaps, but parallelization is inefficient."
      },
      {
        text: "What is the overhead of using locks in Selection Sort?",
        options: ["Increased latency", "Reduced memory usage", "Improved locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "Is Selection Sort suitable for distributed systems?",
        options: ["No, it's inefficient", "Yes, for small chunks", "Yes, with recursion", "Yes, with extra arrays"],
        correctAnswer: 0,
        explanation: "Selection Sort is inefficient for distributed systems due to its sequential nature."
      },
      {
        text: "What is the impact of data distribution on Selection Sort performance?",
        options: ["No significant impact", "Affects best-case performance", "Affects space complexity", "Affects stability"],
        correctAnswer: 0,
        explanation: "Data distribution has no significant impact, as Selection Sort is O(n²) always."
      },
      {
        text: "How can Selection Sort detect if an array is already sorted?",
        options: ["Check for no swaps", "Check for comparisons", "Use recursion", "Not possible"],
        correctAnswer: 0,
        explanation: "No swaps in a pass indicate the array is sorted."
      },
      {
        text: "What is the time complexity of checking if an array is sorted using Selection Sort?",
        options: ["O(n²)", "O(n)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "Selection Sort always takes O(n²) to process, even to check sortedness."
      },
      {
        text: "How does Selection Sort perform with sparse arrays?",
        options: ["No special impact", "Better performance", "Worse performance", "Requires extra space"],
        correctAnswer: 0,
        explanation: "Sparse arrays do not significantly impact Selection Sort's performance."
      },
      {
        text: "What is the impact of Selection Sort on cache misses?",
        options: ["High due to non-sequential access", "Low due to sequential access", "No impact", "Depends on size"],
        correctAnswer: 0,
        explanation: "Non-sequential access for minimum search increases cache misses."
      },
      {
        text: "How does Selection Sort compare to Bubble Sort in terms of swaps?",
        options: ["Selection Sort has fewer swaps", "Bubble Sort has fewer swaps", "Similar swaps", "Depends on data"],
        correctAnswer: 0,
        explanation: "Selection Sort has at most n-1 swaps, fewer than Bubble Sort."
      },
      {
        text: "Is Selection Sort suitable for external sorting?",
        options: ["No, it's inefficient", "Yes, for small chunks", "Yes, with recursion", "Yes, with extra arrays"],
        correctAnswer: 0,
        explanation: "Selection Sort is inefficient for external sorting due to high time complexity."
      },
      {
        text: "What is the primary reason Selection Sort is used for educational purposes?",
        options: ["Simplicity and minimal swaps", "High efficiency", "Low space complexity", "Parallelization"],
        correctAnswer: 0,
        explanation: "Selection Sort's simplicity and minimal swaps make it ideal for teaching."
      },
      {
        text: "How can Selection Sort be used in finding the kth smallest element?",
        options: ["Run k passes", "Use recursion", "Use extra array", "Not possible"],
        correctAnswer: 0,
        explanation: "Running k passes of Selection Sort finds the kth smallest element."
      },
      {
        text: "What is the time complexity of finding the kth smallest element using Selection Sort?",
        options: ["O(nk)", "O(n²)", "O(n log n)", "O(n)"],
        correctAnswer: 0,
        explanation: "Running k passes requires O(nk) time to find the kth smallest element."
      }
    ]
  },


  dfs: {
    beginner: [
      {
        text: "What is Depth-First Search (DFS)?",
        options: ["A graph traversal algorithm exploring as far as possible along each branch", "A graph traversal algorithm exploring all neighbors first", "A sorting algorithm", "A shortest path algorithm"],
        correctAnswer: 0,
        explanation: "DFS explores as far as possible along each branch before backtracking, used for graph traversal."
      },
      {
        text: "Which data structure is typically used to implement DFS?",
        options: ["Stack", "Queue", "Heap", "Array"],
        correctAnswer: 0,
        explanation: "DFS uses a Stack, either implicitly (via recursion) or explicitly (iterative), to explore deeper paths."
      },
      {
        text: "What is the time complexity of DFS for a graph with V vertices and E edges?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS explores each vertex and edge once, resulting in O(V + E) time complexity."
      },
      {
        text: "What is the space complexity of recursive DFS for a graph with V vertices?",
        options: ["O(V)", "O(1)", "O(E)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "Recursive DFS uses O(V) space for the recursion stack in the worst case."
      },
      {
        text: "Can DFS be implemented iteratively?",
        options: ["Yes", "No", "Only for trees", "Only for directed graphs"],
        correctAnswer: 0,
        explanation: "DFS can be implemented iteratively using an explicit Stack."
      },
      {
        text: "What is a common application of DFS?",
        options: ["Finding connected components", "Finding shortest paths", "Sorting vertices", "Balancing trees"],
        correctAnswer: 0,
        explanation: "DFS is used to find connected components in a graph by exploring all reachable vertices."
      },
      {
        text: "What does DFS do when it reaches a dead end?",
        options: ["Backtracks", "Restarts", "Stops", "Explores neighbors"],
        correctAnswer: 0,
        explanation: "DFS backtracks to the most recent unvisited vertex when it reaches a dead end."
      },
      {
        text: "Which graph representation is suitable for DFS?",
        options: ["Adjacency List", "Adjacency Matrix", "Both Adjacency List and Matrix", "Edge List"],
        correctAnswer: 2,
        explanation: "DFS can use either an Adjacency List or Matrix, though Adjacency Lists are often more efficient."
      },
      {
        text: "What is the time complexity of DFS using an Adjacency Matrix?",
        options: ["O(V²)", "O(V + E)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "With an Adjacency Matrix, checking neighbors takes O(V) per vertex, resulting in O(V²) time."
      },
      {
        text: "What is the purpose of marking vertices in DFS?",
        options: ["Avoid revisiting vertices", "Count vertices", "Sort vertices", "Find shortest paths"],
        correctAnswer: 0,
        explanation: "Marking vertices prevents revisiting, avoiding infinite loops in cyclic graphs."
      },
      {
        text: "Can DFS be used on directed graphs?",
        options: ["Yes", "No", "Only on undirected graphs", "Only on trees"],
        correctAnswer: 0,
        explanation: "DFS can be applied to both directed and undirected graphs."
      },
      {
        text: "What is a key difference between DFS and BFS?",
        options: ["DFS explores deeper paths first", "DFS uses a Queue", "DFS is slower", "DFS finds shortest paths"],
        correctAnswer: 0,
        explanation: "DFS explores deeper paths first, while BFS explores level by level."
      },
      {
        text: "What happens if DFS is applied to a disconnected graph?",
        options: ["Requires multiple starts", "Fails to traverse", "Only visits one component", "Sorts components"],
        correctAnswer: 0,
        explanation: "DFS must be run from each unvisited vertex to cover all components."
      },
      {
        text: "What is the role of recursion in DFS?",
        options: ["Simulates a Stack", "Divides the graph", "Merges components", "Finds shortest paths"],
        correctAnswer: 0,
        explanation: "Recursion in DFS uses the call stack to simulate a Stack for exploration."
      },
      {
        text: "Can DFS detect cycles in a graph?",
        options: ["Yes", "No", "Only in trees", "Only in directed graphs"],
        correctAnswer: 0,
        explanation: "DFS can detect cycles by checking for back edges to visited vertices."
      },
      {
        text: "What is a preorder traversal in the context of DFS on a tree?",
        options: ["Visit root, then children", "Visit children, then root", "Visit root last", "Visit leaves only"],
        correctAnswer: 0,
        explanation: "Preorder traversal visits the root before its children."
      },
      {
        text: "What is the space complexity of iterative DFS?",
        options: ["O(V)", "O(1)", "O(E)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "Iterative DFS uses a Stack that may store up to V vertices, resulting in O(V) space."
      },
      {
        text: "What is a limitation of DFS?",
        options: ["Cannot find shortest paths", "High space complexity", "Cannot detect cycles", "Only works on trees"],
        correctAnswer: 0,
        explanation: "DFS does not guarantee the shortest path in unweighted graphs."
      },
      {
        text: "What type of graph is DFS most efficient for?",
        options: ["Sparse graphs", "Dense graphs", "Complete graphs", "Weighted graphs"],
        correctAnswer: 0,
        explanation: "DFS is efficient for sparse graphs with fewer edges, especially with Adjacency Lists."
      },
      {
        text: "What is the primary use of DFS in a tree?",
        options: ["Traversal", "Sorting", "Shortest path", "Balancing"],
        correctAnswer: 0,
        explanation: "DFS is used to traverse or search a tree, visiting nodes in a specific order."
      }
    ],
    medium: [
      {
        text: "How can DFS be used to find connected components in an undirected graph?",
        options: ["Run DFS from each unvisited vertex", "Run DFS once", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "Running DFS from each unvisited vertex identifies all vertices in each component."
      },
      {
        text: "What is the time complexity of finding connected components using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS explores all vertices and edges once, taking O(V + E) time."
      },
      {
        text: "How can DFS detect a cycle in an undirected graph?",
        options: ["Check for back edges", "Check for self-loops", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "A back edge to a visited vertex (not the parent) indicates a cycle."
      },
      {
        text: "How can DFS detect a cycle in a directed graph?",
        options: ["Track vertices in recursion stack", "Check for self-loops", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "A back edge to a vertex in the recursion stack indicates a cycle."
      },
      {
        text: "What is the time complexity of cycle detection using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "Cycle detection visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How can DFS be used for topological sorting?",
        options: ["Order vertices by finish time", "Order by discovery time", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS orders vertices by their finish time in a DAG for topological sorting."
      },
      {
        text: "What is the time complexity of topological sorting using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "Topological sorting visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "What is a prerequisite for topological sorting using DFS?",
        options: ["Graph must be a DAG", "Graph must be cyclic", "Graph must be undirected", "Graph must be complete"],
        correctAnswer: 0,
        explanation: "Topological sorting requires a Directed Acyclic Graph (DAG)."
      },
      {
        text: "How can DFS find strongly connected components in a directed graph?",
        options: ["Use Kosaraju's algorithm", "Run DFS once", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "Kosaraju's algorithm uses two DFS runs to find strongly connected components."
      },
      {
        text: "What is the time complexity of Kosaraju's algorithm?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "Kosaraju's algorithm runs DFS twice, taking O(V + E) time."
      },
      {
        text: "How can DFS be used to find a path between two vertices?",
        options: ["Track visited vertices", "Use a Queue", "Sort vertices", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS can find a path by exploring until the target vertex is reached."
      },
      {
        text: "What is the time complexity of path finding using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS explores vertices and edges until the target is found, taking O(V + E) time."
      },
      {
        text: "How can DFS be used in maze solving?",
        options: ["Explore paths until exit", "Find shortest path", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS explores paths in a maze until the exit is found, backtracking as needed."
      },
      {
        text: "What is the space complexity of DFS in maze solving?",
        options: ["O(V)", "O(1)", "O(E)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "DFS may store up to V cells in the recursion stack, resulting in O(V) space."
      },
      {
        text: "How can DFS be used to detect bipartite graphs?",
        options: ["Color vertices during traversal", "Count edges", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS colors vertices with two colors; a conflict indicates the graph is not bipartite."
      },
      {
        text: "What is the time complexity of bipartite graph detection using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How does DFS handle weighted graphs?",
        options: ["Ignores weights", "Uses weights for paths", "Requires a Heap", "Not applicable"],
        correctAnswer: 0,
        explanation: "DFS ignores edge weights, as it focuses on exploration, not shortest paths."
      },
      {
        text: "What is the advantage of iterative DFS over recursive DFS?",
        options: ["Avoids stack overflow", "Faster execution", "Less memory", "Better for cycles"],
        correctAnswer: 0,
        explanation: "Iterative DFS avoids stack overflow for very deep graphs."
      },
      {
        text: "How can DFS be used in backtracking algorithms?",
        options: ["Explore all possibilities", "Find shortest paths", "Sort solutions", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS explores all possible solutions, backtracking when necessary."
      },
      {
        text: "What is the time complexity of DFS in backtracking for n-Queens?",
        options: ["O(n!)", "O(n²)", "O(n)", "O(1)"],
        correctAnswer: 0,
        explanation: "DFS for n-Queens explores up to n! permutations in the worst case."
      }
    ],
    hard: [
      {
        text: "How can DFS be used to find articulation points in a graph?",
        options: ["Track discovery and low-link values", "Count edges", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS tracks discovery and low-link values to identify articulation points."
      },
      {
        text: "What is the time complexity of finding articulation points using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How can DFS find bridges in a graph?",
        options: ["Compare discovery and low-link values", "Count edges", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS identifies bridges when a vertex's low-link value exceeds its parent's discovery time."
      },
      {
        text: "What is the time complexity of finding bridges using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How can DFS be used in Tarjan's algorithm for strongly connected components?",
        options: ["Track low-link values", "Use a Queue", "Count vertices", "Not possible"],
        correctAnswer: 0,
        explanation: "Tarjan's algorithm uses DFS to track low-link values for SCCs."
      },
      {
        text: "What is the time complexity of Tarjan's algorithm?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "Tarjan's algorithm runs DFS once, taking O(V + E) time."
      },
      {
        text: "How can DFS optimize memory usage in large graphs?",
        options: ["Use iterative DFS", "Use recursion", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "Iterative DFS reduces memory by avoiding recursion stack overhead."
      },
      {
        text: "What is the impact of graph density on DFS performance?",
        options: ["Higher density increases edge processing", "No impact", "Lower density increases time", "Affects space only"],
        correctAnswer: 0,
        explanation: "Denser graphs increase edge processing time in DFS."
      },
      {
        text: "How can DFS be used in game tree search?",
        options: ["Explore all possible moves", "Find shortest path", "Sort moves", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS explores all possible moves, backtracking to evaluate outcomes."
      },
      {
        text: "What is the time complexity of DFS in game tree search with branching factor b and depth d?",
        options: ["O(b^d)", "O(b*d)", "O(d^b)", "O(b+d)"],
        correctAnswer: 0,
        explanation: "DFS explores up to b^d nodes in a game tree."
      },
      {
        text: "How can DFS handle concurrent access in a multithreaded environment?",
        options: ["Use locks for vertex marking", "Use a Queue", "Use recursion", "Not practical"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe vertex marking, but parallel DFS is complex."
      },
      {
        text: "What is the overhead of locks in DFS?",
        options: ["Increased latency", "Reduced memory", "Improved locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "How can DFS be used to find the longest path in a DAG?",
        options: ["Track path lengths during traversal", "Use a Queue", "Sort vertices", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS tracks the longest path from each vertex in a DAG."
      },
      {
        text: "What is the time complexity of finding the longest path in a DAG using DFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "DFS visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How can DFS be used in constraint satisfaction problems?",
        options: ["Explore variable assignments", "Find shortest paths", "Sort constraints", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS explores all possible variable assignments, backtracking on conflicts."
      },
      {
        text: "What is the time complexity of DFS for a CSP with n variables and d domain size?",
        options: ["O(d^n)", "O(n*d)", "O(n^d)", "O(n+d)"],
        correctAnswer: 0,
        explanation: "DFS explores up to d^n combinations in the worst case."
      },
      {
        text: "How does DFS compare to BFS for path finding in unweighted graphs?",
        options: ["DFS is less efficient", "BFS is less efficient", "Same efficiency", "Depends on graph"],
        correctAnswer: 0,
        explanation: "DFS may explore longer paths, while BFS guarantees the shortest path."
      },
      {
        text: "How can DFS be used to compute a graph's diameter?",
        options: ["Find longest path between vertices", "Count edges", "Use a Queue", "Not possible"],
        correctAnswer: 0,
        explanation: "DFS finds the longest path from each vertex to compute the diameter."
      },
      {
        text: "What is the time complexity of computing a graph's diameter using DFS?",
        options: ["O(V(V + E))", "O(V + E)", "O(V²)", "O(E log V)"],
        correctAnswer: 0,
        explanation: "Running DFS from each vertex takes O(V(V + E)) time."
      },
      {
        text: "What is the primary reason DFS is used for graph traversal?",
        options: ["Simplicity and flexibility", "Guaranteed shortest paths", "Low space complexity", "Parallelization"],
        correctAnswer: 0,
        explanation: "DFS's simplicity and flexibility make it ideal for many graph problems."
      }
    ]
  },


  bfs: {
    beginner: [
      {
        text: "What is Breadth-First Search (BFS)?",
        options: ["A graph traversal algorithm exploring all neighbors first", "A graph traversal algorithm exploring as far as possible along each branch", "A sorting algorithm", "A shortest path algorithm for weighted graphs"],
        correctAnswer: 0,
        explanation: "BFS explores all neighbors of a vertex before moving to the next level, used for graph traversal."
      },
      {
        text: "Which data structure is typically used to implement BFS?",
        options: ["Queue", "Stack", "Heap", "Array"],
        correctAnswer: 0,
        explanation: "BFS uses a Queue to process vertices level by level in FIFO order."
      },
      {
        text: "What is the time complexity of BFS for a graph with V vertices and E edges?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS explores each vertex and edge once, resulting in O(V + E) time complexity."
      },
      {
        text: "What is the space complexity of BFS for a graph with V vertices?",
        options: ["O(V)", "O(1)", "O(E)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "BFS uses a Queue that may store up to V vertices, resulting in O(V) space."
      },
      {
        text: "Can BFS be implemented iteratively?",
        options: ["Yes", "No", "Only for trees", "Only for directed graphs"],
        correctAnswer: 0,
        explanation: "BFS is typically implemented iteratively using a Queue."
      },
      {
        text: "What is a common application of BFS?",
        options: ["Finding shortest paths in unweighted graphs", "Finding connected components", "Topological sorting", "Cycle detection"],
        correctAnswer: 0,
        explanation: "BFS finds the shortest path in unweighted graphs by exploring level by level."
      },
      {
        text: "What does BFS do when it processes a vertex?",
        options: ["Enqueues its unvisited neighbors", "Backtracks to parent", "Sorts neighbors", "Stops traversal"],
        correctAnswer: 0,
        explanation: "BFS enqueues all unvisited neighbors of the current vertex for exploration."
      },
      {
        text: "Which graph representation is suitable for BFS?",
        options: ["Adjacency List", "Adjacency Matrix", "Both Adjacency List and Matrix", "Edge List"],
        correctAnswer: 2,
        explanation: "BFS can use either an Adjacency List or Matrix, though Adjacency Lists are often more efficient."
      },
      {
        text: "What is the time complexity of BFS using an Adjacency Matrix?",
        options: ["O(V²)", "O(V + E)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "With an Adjacency Matrix, checking neighbors takes O(V) per vertex, resulting in O(V²) time."
      },
      {
        text: "What is the purpose of marking vertices in BFS?",
        options: ["Avoid revisiting vertices", "Count vertices", "Sort vertices", "Find shortest paths"],
        correctAnswer: 0,
        explanation: "Marking vertices prevents revisiting, avoiding infinite loops in cyclic graphs."
      },
      {
        text: "Can BFS be used on directed graphs?",
        options: ["Yes", "No", "Only on undirected graphs", "Only on trees"],
        correctAnswer: 0,
        explanation: "BFS can be applied to both directed and undirected graphs."
      },
      {
        text: "What is a key difference between BFS and DFS?",
        options: ["BFS explores level by level", "BFS uses a Stack", "BFS is slower", "BFS cannot detect cycles"],
        correctAnswer: 0,
        explanation: "BFS explores level by level, while DFS explores deeper paths first."
      },
      {
        text: "What happens if BFS is applied to a disconnected graph?",
        options: ["Requires multiple starts", "Fails to traverse", "Only visits one component", "Sorts components"],
        correctAnswer: 0,
        explanation: "BFS must be run from each unvisited vertex to cover all components."
      },
      {
        text: "What is the role of the Queue in BFS?",
        options: ["Stores vertices to explore", "Stores visited vertices", "Stores edges", "Stores paths"],
        correctAnswer: 0,
        explanation: "The Queue stores vertices to be explored in FIFO order."
      },
      {
        text: "Can BFS detect cycles in a graph?",
        options: ["Yes", "No", "Only in trees", "Only in directed graphs"],
        correctAnswer: 0,
        explanation: "BFS can detect cycles by checking if a visited vertex is encountered again (not via the parent)."
      },
      {
        text: "What is a level-order traversal in the context of BFS on a tree?",
        options: ["Visit nodes level by level", "Visit nodes in preorder", "Visit nodes in postorder", "Visit leaves only"],
        correctAnswer: 0,
        explanation: "Level-order traversal visits nodes level by level, achieved using BFS."
      },
      {
        text: "What is the space complexity of BFS in a tree?",
        options: ["O(w)", "O(h)", "O(n)", "O(1)"],
        correctAnswer: 0,
        explanation: "BFS stores up to w nodes (width of the tree) in the Queue, resulting in O(w) space."
      },
      {
        text: "What is a limitation of BFS compared to DFS?",
        options: ["Higher space complexity", "Cannot find shortest paths", "Cannot detect cycles", "Slower execution"],
        correctAnswer: 0,
        explanation: "BFS requires more space due to storing all vertices at a level."
      },
      {
        text: "What type of graph is BFS most efficient for?",
        options: ["Sparse graphs", "Dense graphs", "Complete graphs", "Weighted graphs"],
        correctAnswer: 0,
        explanation: "BFS is efficient for sparse graphs with fewer edges, especially with Adjacency Lists."
      },
      {
        text: "What is the primary use of BFS in a tree?",
        options: ["Level-order traversal", "Preorder traversal", "Postorder traversal", "Balancing"],
        correctAnswer: 0,
        explanation: "BFS is used for level-order traversal, visiting nodes level by level."
      }
    ],
    medium: [
      {
        text: "How can BFS be used to find connected components in an undirected graph?",
        options: ["Run BFS from each unvisited vertex", "Run BFS once", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "Running BFS from each unvisited vertex identifies all vertices in each component."
      },
      {
        text: "What is the time complexity of finding connected components using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS explores all vertices and edges once, taking O(V + E) time."
      },
      {
        text: "How can BFS detect a cycle in an undirected graph?",
        options: ["Check for visited neighbors", "Check for self-loops", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "A visited neighbor (not the parent) indicates a cycle in an undirected graph."
      },
      {
        text: "How can BFS detect a cycle in a directed graph?",
        options: ["Track visited vertices per BFS run", "Check for self-loops", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS can detect cycles by checking for visited vertices in the same BFS run."
      },
      {
        text: "What is the time complexity of cycle detection using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "Cycle detection visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How can BFS find the shortest path in an unweighted graph?",
        options: ["Track parent vertices", "Sort vertices", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS tracks parent vertices to reconstruct the shortest path."
      },
      {
        text: "What is the time complexity of finding the shortest path using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS explores vertices and edges once, taking O(V + E) time."
      },
      {
        text: "How can BFS be used to find the distance between two vertices?",
        options: ["Count levels during traversal", "Use a Stack", "Sort vertices", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS counts the number of levels to the target vertex, representing the distance."
      },
      {
        text: "What is the time complexity of finding the distance using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS explores vertices and edges once, taking O(V + E) time."
      },
      {
        text: "How can BFS be used in maze solving?",
        options: ["Find shortest path to exit", "Explore deepest paths", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS finds the shortest path to the exit by exploring level by level."
      },
      {
        text: "What is the space complexity of BFS in maze solving?",
        options: ["O(V)", "O(1)", "O(E)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "BFS may store up to V cells in the Queue, resulting in O(V) space."
      },
      {
        text: "How can BFS be used to detect bipartite graphs?",
        options: ["Color vertices level by level", "Count edges", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS colors vertices with two colors; a conflict indicates the graph is not bipartite."
      },
      {
        text: "What is the time complexity of bipartite graph detection using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How does BFS handle weighted graphs?",
        options: ["Cannot find shortest paths", "Uses weights for paths", "Requires a Heap", "Not applicable"],
        correctAnswer: 0,
        explanation: "BFS cannot find shortest paths in weighted graphs; Dijkstra's algorithm is needed."
      },
      {
        text: "What is the advantage of BFS over DFS for shortest path finding?",
        options: ["Guarantees shortest path", "Lower space complexity", "Faster execution", "Better for cycles"],
        correctAnswer: 0,
        explanation: "BFS guarantees the shortest path in unweighted graphs by exploring level by level."
      },
      {
        text: "How can BFS be used in social network analysis?",
        options: ["Find shortest connections", "Find deepest connections", "Sort users", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS finds the shortest connection (degrees of separation) between users."
      },
      {
        text: "What is the time complexity of finding shortest connections in a social network using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS explores vertices and edges once, taking O(V + E) time."
      },
      {
        text: "How can BFS be used in level-order traversal of a binary tree?",
        options: ["Process nodes level by level", "Process nodes in preorder", "Process nodes in postorder", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS processes nodes level by level, achieving level-order traversal."
      },
      {
        text: "What is the time complexity of level-order traversal using BFS?",
        options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
        correctAnswer: 0,
        explanation: "BFS visits each node once, taking O(n) time for a tree with n nodes."
      },
      {
        text: "How can BFS be used to find the diameter of a tree?",
        options: ["Run BFS twice", "Run BFS once", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "Run BFS from any node to find the farthest node, then from that node to find the diameter."
      }
    ],
    hard: [
      {
        text: "What is the time complexity of finding a tree's diameter using BFS?",
        options: ["O(V)", "O(V²)", "O(E log V)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "Two BFS runs on a tree (with E = V-1) take O(V) time."
      },
      {
        text: "How can BFS be used to find the minimum number of moves in a puzzle?",
        options: ["Treat states as vertices", "Sort states", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS explores puzzle states level by level to find the minimum moves."
      },
      {
        text: "What is the time complexity of solving a puzzle with BFS?",
        options: ["O(b^d)", "O(b*d)", "O(d^b)", "O(b+d)"],
        correctAnswer: 0,
        explanation: "BFS explores up to b^d states, where b is the branching factor and d is the depth."
      },
      {
        text: "How can BFS be used in flood-fill algorithms?",
        options: ["Replace colors level by level", "Explore deepest paths", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS replaces colors in a connected region level by level."
      },
      {
        text: "What is the time complexity of a flood-fill algorithm using BFS?",
        options: ["O(V)", "O(V²)", "O(E log V)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "BFS visits each pixel (vertex) once, taking O(V) time."
      },
      {
        text: "How can BFS be used to find the shortest path in a grid with obstacles?",
        options: ["Explore valid neighbors", "Sort grid cells", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS explores valid neighboring cells to find the shortest path."
      },
      {
        text: "What is the time complexity of finding the shortest path in a grid using BFS?",
        options: ["O(V)", "O(V²)", "O(E log V)", "O(V + E)"],
        correctAnswer: 0,
        explanation: "BFS visits each cell once, taking O(V) time for a grid."
      },
      {
        text: "How can BFS optimize memory usage in large graphs?",
        options: ["Use a deque for Queue", "Use recursion", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "A deque-based Queue can optimize memory for BFS implementations."
      },
      {
        text: "What is the impact of graph density on BFS performance?",
        options: ["Higher density increases edge processing", "No impact", "Lower density increases time", "Affects space only"],
        correctAnswer: 0,
        explanation: "Denser graphs increase edge processing time in BFS."
      },
      {
        text: "How can BFS handle concurrent access in a multithreaded environment?",
        options: ["Use locks for vertex marking", "Use a Stack", "Use recursion", "Not practical"],
        correctAnswer: 0,
        explanation: "Locks ensure thread-safe vertex marking, but parallel BFS is complex."
      },
      {
        text: "What is the overhead of locks in BFS?",
        options: ["Increased latency", "Reduced memory", "Improved locality", "No overhead"],
        correctAnswer: 0,
        explanation: "Locks introduce latency due to synchronization."
      },
      {
        text: "How can BFS be used in network broadcasting?",
        options: ["Propagate messages level by level", "Sort nodes", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS ensures messages reach all nodes in the minimum number of steps."
      },
      {
        text: "What is the time complexity of network broadcasting using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS visits each vertex and edge once, taking O(V + E) time."
      },
      {
        text: "How can BFS be used to find the shortest cycle in an unweighted graph?",
        options: ["Run BFS from each vertex", "Run BFS once", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "Running BFS from each vertex finds the shortest cycle involving that vertex."
      },
      {
        text: "What is the time complexity of finding the shortest cycle using BFS?",
        options: ["O(V(V + E))", "O(V + E)", "O(V²)", "O(E log V)"],
        correctAnswer: 0,
        explanation: "Running BFS from each vertex takes O(V(V + E)) time."
      },
      {
        text: "How can BFS be used in web crawlers?",
        options: ["Explore links level by level", "Explore deepest links", "Sort pages", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS explores web pages level by level, ensuring closer pages are crawled first."
      },
      {
        text: "What is the time complexity of a web crawler using BFS?",
        options: ["O(V + E)", "O(V²)", "O(E log V)", "O(V)"],
        correctAnswer: 0,
        explanation: "BFS visits each page and link once, taking O(V + E) time."
      },
      {
        text: "How does BFS compare to DFS for level-order traversal?",
        options: ["BFS is more suitable", "DFS is more suitable", "Same suitability", "Neither is suitable"],
        correctAnswer: 0,
        explanation: "BFS is ideal for level-order traversal as it processes nodes level by level."
      },
      {
        text: "How can BFS be used to find the maximum flow in a network?",
        options: ["Used in Ford-Fulkerson with BFS", "Sort edges", "Use a Stack", "Not possible"],
        correctAnswer: 0,
        explanation: "BFS is used in the Ford-Fulkerson algorithm (Edmonds-Karp) to find augmenting paths."
      },
      {
        text: "What is the time complexity of the Edmonds-Karp algorithm using BFS?",
        options: ["O(VE²)", "O(V + E)", "O(V²)", "O(E log V)"],
        correctAnswer: 0,
        explanation: "Edmonds-Karp uses BFS, resulting in O(VE²) time for maximum flow."
      }
    ]
  }
};

// Export the shuffled questions
export const questions = shuffleAllQuestions(originalQuestions);