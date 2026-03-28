const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');

const TRACKS = {
  python: {
    name: "Python Mastery",
    chapters: ["Foundations", "Logic Control", "Data Structures", "Functional Synthesis", "Mastery"]
  },
  javascript: {
    name: "JS Architecture",
    chapters: ["Basics", "Functional Logic", "Objects & Arrays", "Asynchronous Systems", "Architecture"]
  },
  dsa: {
    name: "Algorithmic Expeditions",
    chapters: ["Linear Structures", "Non-Linear Patterns", "Search & Sort", "Optimization"]
  },
  node: {
    name: "Backend Engineering",
    chapters: ["Node Internals", "Server Synthesis", "Data Streams", "Security Logic"]
  },
  react: {
    name: "React Architecture",
    chapters: ["Components & Props", "State & Hooks", "Lifecycle & Effects", "Routing & Context", "Patterns"]
  },
  html: {
    name: "Structural Synthesis",
    chapters: ["Foundations", "Semantic Markup", "Forms & Inputs", "SEO & Optimization", "Mastery"]
  },
  css: {
    name: "Visual Engineering",
    chapters: ["Layout & Box Model", "Flexbox & Grid", "Animations", "Responsive Design", "Architecture"]
  }
};

const pythonLessons = [
  {
    title: "Variables",
    slug: "python-1",
    chapter: "Basics",
    track: "python",
    order: 1,
    xpReward: 50,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `Variables are used to store data in a program. Think of them as labeled boxes where you can keep information.

Example:
name = "Alex"
age = 21

We use variables to store values like user names, product prices, and calculation results.`,
    examples: [
      {
        title: "Basic Variables",
        code: `x = 10
y = 20
print(x + y)`,
        explanation: "This script stores two numbers in variables 'x' and 'y' and prints their sum."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create variables a=5 and b=10. Print their sum.",
        starterCode: "a = 5\nb = 10\n# Print sum below\n",
        testCases: [{ input: "", expected: "15" }],
        hints: ["Use the + operator for addition."]
      }
    ]
  },
  {
    title: "Data Types",
    slug: "python-2",
    chapter: "Basics",
    track: "python",
    order: 2,
    xpReward: 50,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `Python supports different data types to handle various kinds of information:

- **int**: Whole numbers (10, -5)
- **float**: Decimal numbers (3.14)
- **str**: Text in quotes ("hello")
- **bool**: True or False values`,
    examples: [
      {
        title: "Types Example",
        code: `x = 10
y = "hello"
print(type(x))
print(type(y))`,
        explanation: "The 'type()' function tells you what kind of data is stored in a variable."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create a string variable 'city' with value 'Mumbai' and print it.",
        starterCode: "city = \nprint(city)",
        testCases: [{ input: "", expected: "Mumbai" }],
        hints: ["Don't forget to put Mumbai in quotes."]
      }
    ]
  },
  {
    title: "Input & Output",
    slug: "python-3",
    chapter: "Basics",
    track: "python",
    order: 3,
    xpReward: 60,
    metadata: { difficulty: "Beginner", estimatedTime: "20 min" },
    theory: `Interaction is key! Use input() to take data from the user and print() to show it on the screen.`,
    examples: [
      {
        title: "User Input",
        code: `name = input("Enter name: ")
print("Hello", name)`,
        explanation: "This takes a name from the keyboard and prints a personalized greeting."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Take a name as input and print it.",
        starterCode: "val = input('Name: ')\n",
        testCases: [{ input: "Alex", expected: "Alex" }]
      }
    ]
  },
  {
    title: "Operators",
    slug: "python-4",
    chapter: "Basics",
    track: "python",
    order: 4,
    xpReward: 60,
    metadata: { difficulty: "Beginner", estimatedTime: "20 min" },
    theory: `Operators are symbols used for math and logic:

- **+**: Add  
- **-**: Subtract  
- *****: Multiply  
- **/**: Divide`,
    examples: [
      {
        title: "Math Module",
        code: `a = 10
b = 5
print(a * b)`,
        explanation: "Simple multiplication of two variables."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Multiply 7 and 8 and print the result.",
        starterCode: "res = 7 * 8\n",
        testCases: [{ input: "", expected: "56" }]
      }
    ]
  },
  {
    title: "If Else",
    slug: "python-5",
    chapter: "Logic",
    track: "python",
    order: 5,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "25 min" },
    theory: `Decision making allows your code to branch. If a condition is true, run one block; otherwise, run another.`,
    examples: [
      {
        title: "Check number",
        code: `x = 10
if x > 5:
    print("Big")`,
        explanation: "Only prints 'Big' if x is actually greater than 5."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print 'Even' if x is 10, else 'Odd'.",
        starterCode: "x = 10\n",
        testCases: [{ input: "", expected: "Even" }]
      }
    ]
  },
  {
    title: "Loops (for)",
    slug: "python-6",
    chapter: "Logic",
    track: "python",
    order: 6,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "25 min" },
    theory: `Loops allow you to repeat a block of code multiple times without rewriting it.`,
    examples: [
      {
        title: "Loop range",
        code: `for i in range(5):
    print(i)`,
        explanation: "Prints numbers from 0 to 4 using the range function."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Loop through range(3) and print each number.",
        starterCode: "for i in range(3):\n    # print here",
        testCases: [{ input: "", expected: "0 1 2" }]
      }
    ]
  },
  {
    title: "While Loop",
    slug: "python-7",
    chapter: "Logic",
    track: "python",
    order: 7,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "25 min" },
    theory: `A while loop runs as long as a condition stays True.`,
    examples: [
      {
        title: "Counter",
        code: `i = 0
while i < 3:
    print(i)
    i += 1`,
        explanation: "Repeats until i becomes 3."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print 0 and 1 using a while loop.",
        starterCode: "i = 0\nwhile i < 2:\n    # code",
        testCases: [{ input: "", expected: "0 1" }]
      }
    ]
  },
  {
    title: "Functions",
    slug: "python-8",
    chapter: "Functions",
    track: "python",
    order: 8,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Functions allow you to group code into reusable blocks.`,
    examples: [
      {
        title: "Greetings",
        code: `def greet(name):
    print("Hello", name)`,
        explanation: "Defines a function that takes a name and prints it."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Define a function 'call()' that prints 'Hi'.",
        starterCode: "def call():\n    ",
        testCases: [{ input: "", expected: "Hi" }]
      }
    ]
  },
  {
    title: "Lists",
    slug: "python-9",
    chapter: "Data Structures",
    track: "python",
    order: 9,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Lists store a collection of items in a single variable.`,
    examples: [
      {
        title: "Inventory",
        code: `nums = [10, 20, 30]
print(nums[0])`,
        explanation: "Accesses the first item (at index 0) of the list."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print the first element of [1, 2, 3].",
        starterCode: "l = [1, 2, 3]\n",
        testCases: [{ input: "", expected: "1" }]
      }
    ]
  },
  {
    title: "Dictionaries",
    slug: "python-10",
    chapter: "Data Structures",
    track: "python",
    order: 10,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Dictionaries store data in Key:Value pairs, like a real dictionary.`,
    examples: [
      {
        title: "Profiles",
        code: `user = {"name": "Alex", "age": 25}
print(user["name"])`,
        explanation: "Accesses the value for the key 'name'."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print the value of 'a' in {'a': 1}.",
        starterCode: "d = {'a': 1}\n",
        testCases: [{ input: "", expected: "1" }]
      }
    ]
  },
  {
    title: "Sets",
    slug: "python-11",
    chapter: "Data Structures",
    track: "python",
    order: 11,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Sets are collections of unique items. No duplicates allowed!`,
    examples: [
      {
        title: "Uniques",
        code: `s = {1, 2, 2, 3}
print(s)`,
        explanation: "The duplicate 2 is automatically removed."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create a set {1, 1} and print it.",
        starterCode: "s = {1, 1}\n",
        testCases: [{ input: "", expected: "{1}" }]
      }
    ]
  },
  {
    title: "Tuples",
    slug: "python-12",
    chapter: "Data Structures",
    track: "python",
    order: 12,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Tuples are like lists, but they cannot be changed after creation.`,
    examples: [
      {
        title: "Coordinates",
        code: `t = (10, 20)
print(t[0])`,
        explanation: "Accessing items works just like lists."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print index 0 of (5, 6).",
        starterCode: "t = (5, 6)\n",
        testCases: [{ input: "", expected: "5" }]
      }
    ]
  },
  {
    title: "File Handling",
    slug: "python-13",
    chapter: "Advanced",
    track: "python",
    order: 13,
    xpReward: 90,
    metadata: { difficulty: "Professional", estimatedTime: "40 min" },
    theory: `Learn how to read from and write to text files on your computer.`,
    examples: [
      {
        title: "Writing",
        code: `f = open("msg.txt", "w")
f.write("Hi")
f.close()`,
        explanation: "Creates a file and writes text to it."
      }
    ],
    exercises: []
  },
  {
    title: "Error Handling",
    slug: "python-14",
    chapter: "Advanced",
    track: "python",
    order: 14,
    xpReward: 90,
    metadata: { difficulty: "Professional", estimatedTime: "40 min" },
    theory: `Prevent your program from crashing when something goes wrong.`,
    examples: [
      {
        title: "Safety",
        code: `try:
    print(10/0)
except:
    print("Cannot divide by zero")`,
        explanation: "Catches the error instead of crashing."
      }
    ],
    exercises: []
  },
  {
    title: "Classes",
    slug: "python-15",
    chapter: "OOP",
    track: "python",
    order: 15,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "45 min" },
    theory: `Classes are blueprints for creating objects with data and behavior.`,
    examples: [
      {
        title: "Pet Class",
        code: `class Dog:
    def bark(self):
        print("Woof!")`,
        explanation: "Defines a Dog blueprint with a bark behavior."
      }
    ],
    exercises: []
  },
  {
    title: "Inheritance",
    slug: "python-16",
    chapter: "OOP",
    track: "python",
    order: 16,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "45 min" },
    theory: `Inheritance allows a class to take on features from another class.`,
    examples: [
      {
        title: "Animals",
        code: `class Animal: pass
class Cat(Animal): pass`,
        explanation: "Cat inherits from Animal."
      }
    ],
    exercises: []
  },
  {
    title: "Decorators",
    slug: "python-17",
    chapter: "Advanced",
    track: "python",
    order: 17,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Special functions that can modify the behavior of other functions.`,
    examples: [],
    exercises: []
  },
  {
    title: "Generators",
    slug: "python-18",
    chapter: "Advanced",
    track: "python",
    order: 18,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Functions that return an iterator that yields one value at a time.`,
    examples: [],
    exercises: []
  },
  {
    title: "Async Programming",
    slug: "python-19",
    chapter: "Advanced",
    track: "python",
    order: 19,
    xpReward: 120,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Write code that can handle multiple tasks at once without blocking.`,
    examples: [],
    exercises: []
  },
  {
    title: "Final Project",
    slug: "python-20",
    chapter: "Project",
    track: "python",
    order: 20,
    xpReward: 200,
    metadata: { difficulty: "Professional", estimatedTime: "120 min" },
    theory: `Bring everything together to build a functional Python project.`,
    examples: [],
    exercises: []
  }
];

const javascriptLessons = [
  {
    title: "Variables",
    slug: "js-1",
    chapter: "Basics",
    track: "javascript",
    order: 1,
    xpReward: 50,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `Variables are used to store data in JavaScript. Think of them as containers for information.

In modern JavaScript, we use:
- **let**: Use this when the value might change later.
- **const**: Use this for values that stay the same (constant).

Example:
let name = "Alex"
const age = 21`,
    examples: [
      {
        title: "Basic Variables",
        code: `let a = 10
let b = 20
console.log(a + b)`,
        explanation: "This script stores two numbers and prints their sum to the console."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create variables a=5 and b=15. Print their sum.",
        starterCode: "let a = 5;\nlet b = 15;\n// console.log sum below\n",
        testCases: [{ input: "", expected: "20" }],
        hints: ["Use console.log() to see the output."],
        solution: "let a = 5;\nlet b = 15;\nconsole.log(a + b);"
      }
    ]
  },
  {
    title: "Data Types",
    slug: "js-2",
    chapter: "Basics",
    track: "javascript",
    order: 2,
    xpReward: 50,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `JavaScript variables can hold different types of data:

- **Number**: 10, 3.14
- **String**: "hello", 'world' (text in quotes)
- **Boolean**: true or false
- **Array**: [1, 2, 3] (a list of items)
- **Object**: {name: "Alex"} (key-value pairs)`,
    examples: [
      {
        title: "Checking Types",
        code: `let x = 10
let y = "hello"
console.log(typeof x)
console.log(typeof y)`,
        explanation: "The 'typeof' operator allows you to check what kind of data is in a variable."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create a string variable 'city' with value 'Mumbai' and print it.",
        starterCode: "let city = \nconsole.log(city)",
        testCases: [{ input: "", expected: "Mumbai" }],
        hints: ["Strings must be inside quotes."]
      }
    ]
  },
  {
    title: "Input & Output",
    slug: "js-3",
    chapter: "Basics",
    track: "javascript",
    order: 3,
    xpReward: 60,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `The most common way to show output in JavaScript is using console.log().`,
    examples: [
      {
        title: "Simple Output",
        code: `console.log("Hello World")`,
        explanation: "This sends the text 'Hello World' to the developer console."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print 'Coding' using console.log().",
        starterCode: "",
        testCases: [{ input: "", expected: "Coding" }]
      }
    ]
  },
  {
    title: "Operators",
    slug: "js-4",
    chapter: "Basics",
    track: "javascript",
    order: 4,
    xpReward: 60,
    metadata: { difficulty: "Beginner", estimatedTime: "20 min" },
    theory: `Operators perform math and logic operations:

- **+**: Add  
- **-**: Subtract  
- *****: Multiply  
- **/**: Divide`,
    examples: [
      {
        title: "Math Operations",
        code: `let a = 10
let b = 5
console.log(a * b)`,
        explanation: "Multiplies two numbers and prints the result."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Multiply 6 and 7 and print the result.",
        starterCode: "let res = 6 * 7\n",
        testCases: [{ input: "", expected: "42" }]
      }
    ]
  },
  {
    title: "If Else",
    slug: "js-5",
    chapter: "Logic",
    track: "javascript",
    order: 5,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "25 min" },
    theory: `If-else statements allow your code to take different paths based on conditions.`,
    examples: [
      {
        title: "Check Value",
        code: `let x = 10
if (x > 5) {
  console.log("Big")
}`,
        explanation: "Runs the code inside the braces only if the condition in the parentheses is true."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print 'Over' if x is 20, else 'Under'.",
        starterCode: "let x = 20;\n",
        testCases: [{ input: "", expected: "Over" }]
      }
    ]
  },
  {
    title: "Loops (for)",
    slug: "js-6",
    chapter: "Logic",
    track: "javascript",
    order: 6,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "25 min" },
    theory: `Loops are used to run the same code multiple times, usually with a counter.`,
    examples: [
      {
        title: "Standard Loop",
        code: `for (let i = 0; i < 5; i++) {
  console.log(i)
}`,
        explanation: "Prints numbers from 0 to 4. 'i++' adds 1 to the counter after each run."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Loop through i=0 to 2 and print 'Loop'.",
        starterCode: "for(let i=0; i<3; i++){\n  // code\n}",
        testCases: [{ input: "", expected: "Loop Loop Loop" }]
      }
    ]
  },
  {
    title: "While Loop",
    slug: "js-7",
    chapter: "Logic",
    track: "javascript",
    order: 7,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "25 min" },
    theory: `While loops run as long as a condition is true. Be careful not to create infinite loops!`,
    examples: [
      {
        title: "While Counter",
        code: `let i = 0
while (i < 3) {
  console.log(i)
  i++
}`,
        explanation: "Repeats the block until 'i' is no longer less than 3."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print 'Hi' twice using a while loop.",
        starterCode: "let i = 0;\nwhile(i < 2){\n  // code\n}",
        testCases: [{ input: "", expected: "Hi Hi" }]
      }
    ]
  },
  {
    title: "Functions",
    slug: "js-8",
    chapter: "Functions",
    track: "javascript",
    order: 8,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Functions are blocks of code designed to perform a particular task.`,
    examples: [
      {
        title: "Declaration",
        code: `function greet() {
  console.log("Hello")
}`,
        explanation: "Defines a reusable function named 'greet'."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Define function 'say()' that prints 'JS'.",
        starterCode: "function say(){\n  ",
        testCases: [{ input: "", expected: "JS" }]
      }
    ]
  },
  {
    title: "Arrays",
    slug: "js-9",
    chapter: "Data Structures",
    track: "javascript",
    order: 9,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Arrays are used to store multiple values in a single variable.`,
    examples: [
      {
        title: "List Access",
        code: `let arr = [10, 20, 30]
console.log(arr[0])`,
        explanation: "Arrays are zero-indexed, meaning the first item is at index 0."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print the first item of [7, 8].",
        starterCode: "let a = [7, 8];\n",
        testCases: [{ input: "", expected: "7" }]
      }
    ]
  },
  {
    title: "Objects",
    slug: "js-10",
    chapter: "Data Structures",
    track: "javascript",
    order: 10,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Objects allow you to store data as properties (keys) and values.`,
    examples: [
      {
        title: "User Data",
        code: `let user = {name: "Alex", age: 25}
console.log(user.name)`,
        explanation: "Use dot notation (obj.key) to access values."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print user.id for {id: 5}.",
        starterCode: "let user = {id: 5};\n",
        testCases: [{ input: "", expected: "5" }]
      }
    ]
  },
  {
    title: "DOM Basics",
    slug: "js-11",
    chapter: "Web",
    track: "javascript",
    order: 11,
    xpReward: 90,
    metadata: { difficulty: "Professional", estimatedTime: "40 min" },
    theory: `The DOM (Document Object Model) allows JavaScript to interact with HTML elements.`,
    examples: [
      {
        title: "Change Text",
        code: `document.getElementById("demo").innerText = "Hello"`,
        explanation: "Finds an element by its ID and changes its text content."
      }
    ],
    exercises: []
  },
  {
    title: "Events",
    slug: "js-12",
    chapter: "Web",
    track: "javascript",
    order: 12,
    xpReward: 90,
    metadata: { difficulty: "Professional", estimatedTime: "40 min" },
    theory: `Events are 'things' that happen to HTML elements, like clicks or key presses.`,
    examples: [
      {
        title: "Click Handler",
        code: `button.onclick = () => {
  console.log("Clicked!")
}`,
        explanation: "Sets up a function that runs whenever the button is clicked."
      }
    ],
    exercises: []
  },
  {
    title: "Promises",
    slug: "js-13",
    chapter: "Async",
    track: "javascript",
    order: 13,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "45 min" },
    theory: `Promises represent the eventual completion (or failure) of an asynchronous task.`,
    examples: [
      {
        title: "Construction",
        code: `const p = new Promise((res) => res("Done"))
p.then(val => console.log(val))`,
        explanation: "Creates a promise that succeeds immediately with the value 'Done'."
      }
    ],
    exercises: []
  },
  {
    title: "Async/Await",
    slug: "js-14",
    chapter: "Async",
    track: "javascript",
    order: 14,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "45 min" },
    theory: `Async/Await makes asynchronous code look and behave a bit more like synchronous code.`,
    examples: [
      {
        title: "Async Function",
        code: `async function fetchData() {
  return "Data received"
}`,
        explanation: "The 'async' keyword ensures the function returns a Promise."
      }
    ],
    exercises: []
  },
  {
    title: "Fetch API",
    slug: "js-15",
    chapter: "Async",
    track: "javascript",
    order: 15,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Fetch is the modern way to make network requests (like getting data from an API).`,
    examples: [
      {
        title: "API Call",
        code: `fetch("https://api.example.com/data")
  .then(res => res.json())`,
        explanation: "Requests data from a URL and converts the response to JSON."
      }
    ],
    exercises: []
  },
  {
    title: "Closures",
    slug: "js-16",
    chapter: "Advanced",
    track: "javascript",
    order: 16,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `A closure gives you access to an outer function’s scope from an inner function.`,
    examples: [],
    exercises: []
  },
  {
    title: "ES6 Features",
    slug: "js-17",
    chapter: "Advanced",
    track: "javascript",
    order: 17,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Modern JavaScript features like Arrow Functions, Template Literals, and Destructuring.`,
    examples: [],
    exercises: []
  },
  {
    title: "Modules",
    slug: "js-18",
    chapter: "Advanced",
    track: "javascript",
    order: 18,
    xpReward: 120,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Modules allow you to break your code into separate files and import them where needed.`,
    examples: [],
    exercises: []
  },
  {
    title: "Error Handling",
    slug: "js-19",
    chapter: "Advanced",
    track: "javascript",
    order: 19,
    xpReward: 120,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Handle errors gracefully using try...catch blocks to keep your app running.`,
    examples: [],
    exercises: []
  },
  {
    title: "Final Project",
    slug: "js-20",
    chapter: "Project",
    track: "javascript",
    order: 20,
    xpReward: 200,
    metadata: { difficulty: "Professional", estimatedTime: "120 min" },
    theory: `Combine everything you've learned to build a real-world JavaScript application.`,
    examples: [],
    exercises: []
  }
];

const reactLessons = [
  {
    title: "What is React",
    slug: "react-1",
    chapter: "Basics",
    track: "react",
    order: 1,
    xpReward: 50,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `React is a JavaScript library used to build professional user interfaces.

Instead of updating the entire page when something changes (which is slow), React only updates the specific parts that need it. This makes your apps fast and smooth.

React is used for:
- Popular websites (like Facebook and Netflix)
- Complex dashboards
- Mobile apps`,
    examples: [
      {
        title: "Simple Component",
        code: `function App() {
  return <h1>Hello React</h1>
}`,
        explanation: "A basic React component that returns a heading. Components are the building blocks of React."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create a component that shows 'Welcome to CodeBuddy'.",
        starterCode: "function Welcome() {\n  return (\n    // return text here\n  );\n}",
        testCases: [{ input: "", expected: "Welcome to CodeBuddy" }],
        hints: ["Use an <h1> or <p> tag inside the return."],
        solution: "function Welcome() {\n  return (\n    <h1>Welcome to CodeBuddy</h1>\n  );\n}"
      }
    ]
  },
  {
    title: "JSX",
    slug: "react-2",
    chapter: "Basics",
    track: "react",
    order: 2,
    xpReward: 50,
    metadata: { difficulty: "Beginner", estimatedTime: "15 min" },
    theory: `JSX (JavaScript XML) is a syntax extension that allows you to write HTML-like code directly inside your JavaScript files. It makes building UI structure much easier.`,
    examples: [
      {
        title: "JSX Variable",
        code: `const element = <h1>Hello CodeBuddy</h1>`,
        explanation: "Storing a piece of UI (JSX) inside a standard JavaScript variable."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create JSX that shows 'React is fun'.",
        starterCode: "const msg = \n",
        testCases: [{ input: "", expected: "React is fun" }]
      }
    ]
  },
  {
    title: "Components",
    slug: "react-3",
    chapter: "Basics",
    track: "react",
    order: 3,
    xpReward: 60,
    metadata: { difficulty: "Beginner", estimatedTime: "20 min" },
    theory: `Components are independent, reusable pieces of UI. You can build a large app by combining many small components, like building with Lego blocks.`,
    examples: [
      {
        title: "Nested Components",
        code: `function Header() {
  return <h1>My App</h1>
}

function Main() {
  return <Header />
}`,
        explanation: "The Main component uses (renders) the Header component inside it."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create a component 'Info' that displays a paragraph.",
        starterCode: "function Info(){\n  return (\n    <p>This is info</p>\n  )\n}",
        testCases: [{ input: "", expected: "This is info" }]
      }
    ]
  },
  {
    title: "Props",
    slug: "react-4",
    chapter: "Basics",
    track: "react",
    order: 4,
    xpReward: 60,
    metadata: { difficulty: "Beginner", estimatedTime: "20 min" },
    theory: `Props (short for properties) are how you pass data from a parent component to a child component. This makes components dynamic and customizable.`,
    examples: [
      {
        title: "Using Props",
        code: `function Greeting(props) {
  return <h1>Hello, {props.name}</h1>
}`,
        explanation: "The Greeting component receives 'name' as a property and displays it using curly braces."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Access 'pro' from props and display it.",
        starterCode: "function Show(props){\n  return <h1>{props.pro}</h1>\n}",
        testCases: [{ input: "", expected: "Active" }]
      }
    ]
  },
  {
    title: "State",
    slug: "react-5",
    chapter: "Core",
    track: "react",
    order: 5,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `While Props are for passing data, State is for data that changes over time (like a counter or a user's input). We use the 'useState' hook to manage this.`,
    examples: [
      {
        title: "Counter Hook",
        code: `const [count, setCount] = useState(0)`,
        explanation: "Initialize 'count' at 0. Use 'setCount' to update it later."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Initialize state 'val' to 10.",
        starterCode: "const [val, setVal] = useState()",
        testCases: [{ input: "", expected: "10" }]
      }
    ]
  },
  {
    title: "Events",
    slug: "react-6",
    chapter: "Core",
    track: "react",
    order: 6,
    xpReward: 70,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `Handling events in React is similar to standard HTML, but with camelCase naming (like onClick instead of onclick).`,
    examples: [
      {
        title: "Button Click",
        code: `<button onClick={() => alert("Button Clicked!")}>Click Me</button>`,
        explanation: "An arrow function runs the alert whenever the user clicks the button."
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Print 'Hi' on button click.",
        starterCode: "<button onClick={() => console.log()}>Btn</button>",
        testCases: [{ input: "", expected: "Hi" }]
      }
    ]
  },
  {
    title: "Conditional Rendering",
    slug: "react-7",
    chapter: "Core",
    track: "react",
    order: 7,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `You can use standard JavaScript logic (like 'if' statements or ternary operators) to show different UI based on data.`,
    examples: [
      {
        title: "Ternary Display",
        code: `{isLoggedIn ? <h1>Welcome Back!</h1> : <h1>Please Login</h1>}`,
        explanation: "If isLoggedIn is true, show a welcome message; otherwise, show the login prompt."
      }
    ],
    exercises: []
  },
  {
    title: "Lists & Keys",
    slug: "react-8",
    chapter: "Core",
    track: "react",
    order: 8,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "30 min" },
    theory: `To show multiple items, we use the .map() function. Each item in a list needs a unique 'key' prop to help React track it.`,
    examples: [
      {
        title: "Item List",
        code: `items.map(item => <li key={item.id}>{item.name}</li>)`,
        explanation: "Iterates through the items array and creates a list element for each."
      }
    ],
    exercises: []
  },
  {
    title: "Forms",
    slug: "react-9",
    chapter: "Core",
    track: "react",
    order: 9,
    xpReward: 80,
    metadata: { difficulty: "Intermediate", estimatedTime: "35 min" },
    theory: `In React, we usually keep the input value in the component's state. This is called a 'Controlled Component'.`,
    examples: [
      {
        title: "Controlled Input",
        code: `<input value={name} onChange={(e) => setName(e.target.value)} />`,
        explanation: "Updating the 'name' state every time the user types in the input."
      }
    ],
    exercises: []
  },
  {
    title: "useEffect",
    slug: "react-10",
    chapter: "Hooks",
    track: "react",
    order: 10,
    xpReward: 90,
    metadata: { difficulty: "Professional", estimatedTime: "40 min" },
    theory: `The useEffect hook allows you to perform 'side effects' like fetching data or setting up timers after your component renders.`,
    examples: [
      {
        title: "Mount Effect",
        code: `useEffect(() => {
  console.log("Component Mounted")
}, [])`,
        explanation: "The empty array [] means this code will only run once, right after the first render."
      }
    ],
    exercises: []
  },
  {
    title: "Fetching Data",
    slug: "react-11",
    chapter: "Hooks",
    track: "react",
    order: 11,
    xpReward: 90,
    metadata: { difficulty: "Professional", estimatedTime: "45 min" },
    theory: `You can use the native fetch API inside a useEffect hook to load data from an external API into your component.`,
    examples: [
      {
        title: "Data Loader",
        code: `useEffect(() => {
  fetch("https://api.com/users").then(res => res.json()).then(data => setUsers(data))
}, [])`,
        explanation: "Requests user data when the component loads and stores it in the 'users' state."
      }
    ],
    exercises: []
  },
  {
    title: "Custom Hooks",
    slug: "react-12",
    chapter: "Hooks",
    track: "react",
    order: 12,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Custom hooks allow you to extract component logic into reusable functions. They always start with the word 'use'.`,
    examples: [],
    exercises: []
  },
  {
    title: "Context API",
    slug: "react-13",
    chapter: "State",
    track: "react",
    order: 13,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Context API allows you to share data like themes or user settings across your entire app without passing props manually at every level.`,
    examples: [],
    exercises: []
  },
  {
    title: "Routing",
    slug: "react-14",
    chapter: "Routing",
    track: "react",
    order: 14,
    xpReward: 100,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `React apps are usually 'Single Page Applications'. We use library tools like React Router to show different pages based on the URL.`,
    examples: [],
    exercises: []
  },
  {
    title: "Performance Optimization",
    slug: "react-15",
    chapter: "Advanced",
    track: "react",
    order: 15,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "60 min" },
    theory: `Learn techniques like Memoization and Lazy Loading to keep your React applications running at peak performance.`,
    examples: [],
    exercises: []
  },
  {
    title: "Testing",
    slug: "react-16",
    chapter: "Advanced",
    track: "react",
    order: 16,
    xpReward: 110,
    metadata: { difficulty: "Professional", estimatedTime: "60 min" },
    theory: `Writing tests ensures your components work as expected and helps prevent bugs as your app grows larger.`,
    examples: [],
    exercises: []
  },
  {
    title: "Error Handling",
    slug: "react-17",
    chapter: "Advanced",
    track: "react",
    order: 17,
    xpReward: 120,
    metadata: { difficulty: "Professional", estimatedTime: "60 min" },
    theory: `Use Error Boundaries and try/catch logic to handle unexpected crashes gracefully and show a friendly fallback UI.`,
    examples: [],
    exercises: []
  },
  {
    title: "Deployment",
    slug: "react-18",
    chapter: "Advanced",
    track: "react",
    order: 18,
    xpReward: 120,
    metadata: { difficulty: "Professional", estimatedTime: "50 min" },
    theory: `Learn how to build your project for production and host it on professional platforms like Vercel or Netlify.`,
    examples: [],
    exercises: []
  },
  {
    title: "Build a Project",
    slug: "react-19",
    chapter: "Project",
    track: "react",
    order: 19,
    xpReward: 150,
    metadata: { difficulty: "Professional", estimatedTime: "120 min" },
    theory: `Build a small, functional app like a Todo List or Weather App to practice your core React skills.`,
    examples: [],
    exercises: []
  },
  {
    title: "Final Project",
    slug: "react-20",
    chapter: "Project",
    track: "react",
    order: 20,
    xpReward: 200,
    metadata: { difficulty: "Professional", estimatedTime: "180 min" },
    theory: `Create a professional-grade React application for your portfolio using advanced state, routing, and API integration.`,
    examples: [],
    exercises: []
  }
];


const htmlLessons = [
  {
    title: "What is HTML",
    slug: "html-1",
    chapter: "Basics",
    order: 1,
    xpReward: 50,
    theory: `HTML is used to create the structure of a web page. It defines elements like headings, paragraphs, images, and links. Every website uses HTML.`,
    examples: [
      {
        title: "Basic Page",
        code: `<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>`,
        explanation: "Basic HTML structure"
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Create a page with a heading 'Welcome'.",
        starterCode: "",
        testCases: [{ input: "", expected: "Welcome" }],
        hints: ["Use <h1>Welcome</h1>"],
        solution: "<h1>Welcome</h1>"
      }
    ]
  },
  {
    title: "HTML Structure",
    slug: "html-2",
    chapter: "Basics",
    order: 2,
    xpReward: 50,
    theory: `HTML pages have a hierarchical structure: \n- html: The root element\n- head: Contains metadata\n- body: Contains visible content`,
    examples: [
      {
        title: "Structure",
        code: `<html>\n  <head></head>\n  <body></body>\n</html>`,
        explanation: "Basic layout"
      }
    ],
    exercises: []
  },
  {
    title: "Headings & Paragraphs",
    slug: "html-3",
    chapter: "Basics",
    order: 3,
    xpReward: 60,
    theory: `Use headings (h1-h6) and paragraphs (p) to display text properly on your webpage.`,
    examples: [
      {
        title: "Text",
        code: `<h1>Title</h1>\n<p>This is a paragraph</p>`,
        explanation: "Displays text"
      }
    ],
    exercises: []
  },
  {
    title: "Links",
    slug: "html-4",
    chapter: "Basics",
    order: 4,
    xpReward: 60,
    theory: `Links (anchor tags) connect different pages on the web together.`,
    examples: [
      {
        title: "Link",
        code: `<a href="https://google.com">Visit Site</a>`,
        explanation: "Creates a clickable link"
      }
    ],
    exercises: []
  },
  {
    title: "Images",
    slug: "html-5",
    chapter: "Basics",
    order: 5,
    xpReward: 60,
    theory: `Images display pictures. Always include an 'alt' attribute for accessibility.`,
    examples: [
      {
        title: "Image",
        code: `<img src="image.jpg" alt="Description" />`,
        explanation: "Displays an image"
      }
    ],
    exercises: []
  },
  {
    title: "Lists",
    slug: "html-6",
    chapter: "Basics",
    order: 6,
    xpReward: 70,
    theory: `Lists show multiple items using <ul> (unordered) or <ol> (ordered).`,
    examples: [
      {
        title: "List",
        code: `<ul>\n  <li>Item 1</li>\n</ul>`,
        explanation: "Unordered list"
      }
    ],
    exercises: []
  },
  {
    title: "Tables",
    slug: "html-7",
    chapter: "Basics",
    order: 7,
    xpReward: 70,
    theory: `Tables display structured data in rows and columns.`,
    examples: [
      {
        title: "Table",
        code: `<table>\n  <tr><td>Data Cell</td></tr>\n</table>`,
        explanation: "Simple table layout"
      }
    ],
    exercises: []
  },
  {
    title: "Forms",
    slug: "html-8",
    chapter: "Forms",
    order: 8,
    xpReward: 80,
    theory: `Forms allow you to collect user input like text, emails, and passwords.`,
    examples: [
      {
        title: "Form",
        code: `<form>\n  <input type="text" placeholder="Name" />\n</form>`,
        explanation: "Basic input form"
      }
    ],
    exercises: []
  },
  {
    title: "Input Types",
    slug: "html-9",
    chapter: "Forms",
    order: 9,
    xpReward: 80,
    theory: `Different input types like email, number, and date exist in HTML5.`,
    examples: [
      {
        title: "Inputs",
        code: `<input type="email" />`,
        explanation: "Email validation input"
      }
    ],
    exercises: []
  },
  {
    title: "Semantic Tags",
    slug: "html-10",
    chapter: "Semantic",
    order: 10,
    xpReward: 90,
    theory: `Semantic tags like <header> and <main> tell the browser about the content's meaning.`,
    examples: [
      {
        title: "Semantic",
        code: `<header></header>\n<main></main>`,
        explanation: "Professional layout structure"
      }
    ],
    exercises: []
  },
  { title: "Div & Span", slug: "html-11", chapter: "Layout", order: 11, xpReward: 90, theory: `Generic containers used for grouping and styling elements.`, examples: [], exercises: [] },
  { title: "Class & ID", slug: "html-12", chapter: "Layout", order: 12, xpReward: 90, theory: `Global attributes used to identify and target elements for CSS/JS.`, examples: [], exercises: [] },
  { title: "Audio & Video", slug: "html-13", chapter: "Media", order: 13, xpReward: 100, theory: `Native elements to embed multimedia directly into the page.`, examples: [], exercises: [] },
  { title: "Iframes", slug: "html-14", chapter: "Media", order: 14, xpReward: 100, theory: `Embed other documents or websites inside your current page.`, examples: [], exercises: [] },
  { title: "Meta Tags", slug: "html-15", chapter: "SEO", order: 15, xpReward: 110, theory: `Metadata used by search engines to index and rank your site.`, examples: [], exercises: [] },
  { title: "Accessibility", slug: "html-16", chapter: "SEO", order: 16, xpReward: 110, theory: `Techniques to make your site usable for people with disabilities.`, examples: [], exercises: [] },
  { title: "Best Practices", slug: "html-17", chapter: "Advanced", order: 17, xpReward: 120, theory: `Guidelines for writing clean, efficient, and valid HTML code.`, examples: [], exercises: [] },
  { title: "HTML Project", slug: "html-18", chapter: "Project", order: 18, xpReward: 150, theory: `Build a functional webpage structure from scratch.`, examples: [], exercises: [] },
  { title: "Portfolio Page", slug: "html-19", chapter: "Project", order: 19, xpReward: 180, theory: `Apply your structural knowledge to build a professional portfolio.`, examples: [], exercises: [] },
  { title: "Final Project", slug: "html-20", chapter: "Project", order: 20, xpReward: 200, theory: `Complete the final HTML architectural certification project.`, examples: [], exercises: [] }
];

const cssLessons = [
  {
    title: "What is CSS",
    slug: "css-1",
    chapter: "Basics",
    order: 1,
    xpReward: 50,
    theory: `CSS (Cascading Style Sheets) is used to style web pages. It controls colors, layouts, spacing, and design.`,
    examples: [
      {
        title: "Basic Styling",
        code: `h1 {\n  color: blue;\n}`,
        explanation: "Changes text color of headings"
      }
    ],
    exercises: [
      {
        exerciseIndex: 0,
        problem: "Change text color of a heading to red.",
        starterCode: "h1 {\n  \n}",
        testCases: [{ input: "", expected: "color: red" }],
        hints: ["Use the 'color' property."],
        solution: "h1 {\n  color: red;\n}"
      }
    ]
  },
  {
    title: "Selectors",
    slug: "css-2",
    chapter: "Basics",
    order: 2,
    xpReward: 50,
    theory: `Selectors are patterns used to select the elements you want to style. Examples include element, class, and id.`,
    examples: [
      {
        title: "Class Selector",
        code: `.box {\n  background: black;\n}`,
        explanation: "Targets all elements with the class 'box'"
      }
    ],
    exercises: []
  },
  {
    title: "Colors & Background",
    slug: "css-3",
    chapter: "Basics",
    order: 3,
    xpReward: 60,
    theory: `CSS allows you to set foreground colors and background colors for any element.`,
    examples: [
      {
        title: "Background",
        code: `body {\n  background: lightblue;\n}`,
        explanation: "Sets entire page background"
      }
    ],
    exercises: []
  },
  {
    title: "Box Model",
    slug: "css-4",
    chapter: "Layout",
    order: 4,
    xpReward: 60,
    theory: `Every element is a box. It consists of: Margin, Border, Padding, and Content.`,
    examples: [
      {
        title: "Box",
        code: `.box {\n  margin: 10px;\n  padding: 20px;\n}`,
        explanation: "Internal and external spacing"
      }
    ],
    exercises: []
  },
  {
    title: "Display",
    slug: "css-5",
    chapter: "Layout",
    order: 5,
    xpReward: 70,
    theory: `The display property controls how elements are rendered relative to each other (block, inline, flex, grid).`,
    examples: [
      {
        title: "Display",
        code: `div {\n  display: flex;\n}`,
        explanation: "Activates Flexbox layout"
      }
    ],
    exercises: []
  },
  {
    title: "Flexbox",
    slug: "css-6",
    chapter: "Layout",
    order: 6,
    xpReward: 70,
    theory: `Flexbox is a 1-dimensional layout system used to align and distribute items in a container.`,
    examples: [
      {
        title: "Flex",
        code: `.container {\n  display: flex;\n  justify-content: center;\n}`,
        explanation: "Centers items horizontally"
      }
    ],
    exercises: []
  },
  {
    title: "Grid",
    slug: "css-7",
    chapter: "Layout",
    order: 7,
    xpReward: 80,
    theory: `CSS Grid is a 2-dimensional grid-based layout system that handles both rows and columns.`,
    examples: [
      {
        title: "Grid",
        code: `.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n}`,
        explanation: "Creates a 2-column grid"
      }
    ],
    exercises: []
  },
  {
    title: "Position",
    slug: "css-8",
    chapter: "Layout",
    order: 8,
    xpReward: 80,
    theory: `The position property defines how an element is placed in the document (static, relative, absolute, fixed).`,
    examples: [
      {
        title: "Position",
        code: `.box {\n  position: absolute;\n  top: 0;\n}`,
        explanation: "Pins element to top"
      }
    ],
    exercises: []
  },
  {
    title: "Typography",
    slug: "css-9",
    chapter: "Design",
    order: 9,
    xpReward: 80,
    theory: `Style your text with font-family, font-size, line-height, and font-weight properties.`,
    examples: [
      {
        title: "Text",
        code: `p {\n  font-size: 18px;\n}`,
        explanation: "Increases readability"
      }
    ],
    exercises: []
  },
  {
    title: "Spacing",
    slug: "css-10",
    chapter: "Design",
    order: 10,
    xpReward: 90,
    theory: `Master the art of whitespace using margin, padding, and gap properties.`,
    examples: [],
    exercises: []
  },
  { title: "Responsive Design", slug: "css-11", chapter: "Responsive", order: 11, xpReward: 90, theory: `Approach that makes sites look great on all device sizes.`, examples: [], exercises: [] },
  { title: "Media Queries", slug: "css-12", chapter: "Responsive", order: 12, xpReward: 90, theory: `Rules that apply specific CSS based on screen dimensions.`, examples: [], exercises: [] },
  { title: "Transitions", slug: "css-13", chapter: "Animation", order: 13, xpReward: 100, theory: `Smooth property changes over a specified duration.`, examples: [], exercises: [] },
  { title: "Animations", slug: "css-14", chapter: "Animation", order: 14, xpReward: 100, theory: `Complex movement and state changes using @keyframes.`, examples: [], exercises: [] },
  { title: "Transforms", slug: "css-15", chapter: "Animation", order: 15, xpReward: 110, theory: `Modify elements with rotation, scaling, and skewing.`, examples: [], exercises: [] },
  { title: "CSS Variables", slug: "css-16", chapter: "Advanced", order: 16, xpReward: 110, theory: `Reusable custom properties for efficient design management.`, examples: [], exercises: [] },
  { title: "Best Practices", slug: "css-17", chapter: "Advanced", order: 17, xpReward: 120, theory: `Modern CSS architecture patterns for scalable styling.`, examples: [], exercises: [] },
  { title: "Tailwind Basics", slug: "css-18", chapter: "Advanced", order: 18, xpReward: 120, theory: `Utility-first CSS patterns for rapid iteration.`, examples: [], exercises: [] },
  { title: "Build Layout", slug: "css-19", chapter: "Project", order: 19, xpReward: 150, theory: `Create a professional web layout from a design.`, examples: [], exercises: [] },
  { title: "Final Project", slug: "css-20", chapter: "Project", order: 20, xpReward: 200, theory: `Complete the final visual engineering certification project.`, examples: [], exercises: [] }
];

const nodeLessons = [
  {
    title: "What is Node.js",
    slug: "node-1",
    chapter: "Basics",
    order: 1,
    xpReward: 50,
    theory: `Node.js lets you run JavaScript outside the browser. It is used to build highly scalable servers and APIs.`,
    examples: [{ title: "Simple Server", code: `console.log("Server running")`, explanation: "Basic Node program" }],
    exercises: [{ problem: "Print 'Hello from Node' in console.", lang: "javascript", starterCode: "", expectedOutput: "Hello from Node", testCases: [{ input: "", expected: "Hello from Node" }] }]
  },
  { title: "Modules", slug: "node-2", chapter: "Basics", order: 2, xpReward: 50, theory: `Modules allow you to split your backend logic into clean, manageable files.`, examples: [], exercises: [] },
  { title: "File System", slug: "node-3", chapter: "Core", order: 3, xpReward: 60, theory: `Modern Node applications frequently interact with the local file system for storage.`, examples: [], exercises: [] },
  { title: "HTTP Server", slug: "node-4", chapter: "Core", order: 4, xpReward: 70, theory: `Create your own native server using the built-in 'http' module.`, examples: [], exercises: [] },
  { title: "Express.js", slug: "node-5", chapter: "Core", order: 5, xpReward: 80, theory: `The professional standard for building web servers and APIs professionally.`, examples: [], exercises: [] },
  { title: "Routing", slug: "node-6", chapter: "Core", order: 6, xpReward: 80, theory: `Organize your API endpoints logically with optimized routing structures.`, examples: [], exercises: [] },
  { title: "Middleware", slug: "node-7", chapter: "Core", order: 7, xpReward: 90, theory: `Inject custom logic into the request/response lifecycle.`, examples: [], exercises: [] },
  { title: "REST API", slug: "node-8", chapter: "API", order: 8, xpReward: 100, theory: `Build modern, representational state transfer services.`, examples: [], exercises: [] },
  { title: "MongoDB", slug: "node-9", chapter: "Database", order: 9, xpReward: 100, theory: `Integrated persistence layers for modern backend architectures.`, examples: [], exercises: [] },
  { title: "Authentication", slug: "node-10", chapter: "Security", order: 10, xpReward: 110, theory: `Implement secure login systems and access protocols.`, examples: [], exercises: [] },
  { title: "Error Handling", slug: "node-11", chapter: "Advanced", order: 11, xpReward: 110, theory: `Server-side error management for architectural resilience.`, examples: [], exercises: [] },
  { title: "Environment Variables", slug: "node-12", chapter: "Advanced", order: 12, xpReward: 110, theory: `Securely store secrets and server configurations in .env files.`, examples: [], exercises: [] },
  { title: "File Uploads", slug: "node-13", chapter: "Advanced", order: 13, xpReward: 120, theory: `Handle binary data and file streams securely.`, examples: [], exercises: [] },
  { title: "WebSockets", slug: "node-14", chapter: "Advanced", order: 14, xpReward: 120, theory: `Synchronous, real-time communication for dynamic platforms.`, examples: [], exercises: [] },
  { title: "Deployment", slug: "node-15", chapter: "Project", order: 15, xpReward: 150, theory: `Transition your Node server from local to professional production environments.`, examples: [], exercises: [] }
];

const dsaLessons = [
  {
    title: "Arrays",
    slug: "dsa-1",
    chapter: "Basics",
    order: 1,
    xpReward: 50,
    theory: `Arrays are the most fundamental data structure for storing contiguous elements.`,
    examples: [{ title: "Array", code: `let arr = [1,2,3]`, explanation: "Basic contiguous array" }],
    exercises: [{ problem: "Find sum of array [1,2,3].", lang: "javascript", starterCode: "let arr = [1,2,3];\n// console.log sum of arr\n", expectedOutput: "6", testCases: [{ input: "", expected: "6" }] }]
  },
  { title: "Strings", slug: "dsa-2", chapter: "Basics", order: 2, xpReward: 50, theory: `Efficiently manipulate and search textual data arrays.`, examples: [], exercises: [] },
  { title: "Searching", slug: "dsa-3", chapter: "Core", order: 3, xpReward: 60, theory: `Algorithms to locate elements within your architectural structure.`, examples: [], exercises: [] },
  { title: "Sorting", slug: "dsa-4", chapter: "Core", order: 4, xpReward: 70, theory: `Organize data into optimized sequences for search efficiency.`, examples: [], exercises: [] },
  { title: "Stacks", slug: "dsa-5", chapter: "Structures", order: 5, xpReward: 80, theory: `LIFO (Last-In, First-Out) structures for operational tracking.`, examples: [], exercises: [] },
  { title: "Queues", slug: "dsa-6", chapter: "Structures", order: 6, xpReward: 80, theory: `FIFO (First-In, First-Out) architectures for request streams.`, examples: [], exercises: [] },
  { title: "Linked List", slug: "dsa-7", chapter: "Structures", order: 7, xpReward: 90, theory: `Dynamic node structures that represent linked data paths.`, examples: [], exercises: [] },
  { title: "Trees", slug: "dsa-8", chapter: "Structures", order: 8, xpReward: 100, theory: `Hierarchical structural models for complex data organization.`, examples: [], exercises: [] },
  { title: "Graphs", slug: "dsa-9", chapter: "Structures", order: 9, xpReward: 110, theory: `Representing complex node relationships and network protocols.`, examples: [], exercises: [] },
  { title: "Recursion", slug: "dsa-10", chapter: "Core", order: 10, xpReward: 110, theory: `Self-referencing logic for complex algorithmic synthesis.`, examples: [], exercises: [] },
  { title: "Dynamic Programming", slug: "dsa-11", chapter: "Advanced", order: 11, xpReward: 120, theory: `Architectural optimization of complex repeating sub-problems.`, examples: [], exercises: [] },
  { title: "Greedy", slug: "dsa-12", chapter: "Advanced", order: 12, xpReward: 120, theory: `Choosing local optimal solutions at every architectural node.`, examples: [], exercises: [] },
  { title: "Sliding Window", slug: "dsa-13", chapter: "Advanced", order: 13, xpReward: 130, theory: `Dynamic window techniques for efficient sub-array analysis.`, examples: [], exercises: [] },
  { title: "Backtracking", slug: "dsa-14", chapter: "Advanced", order: 14, xpReward: 130, theory: `Systematic traversal of all possible algorithmic paths.`, examples: [], exercises: [] },
  { title: "Final Practice", slug: "dsa-15", chapter: "Project", order: 15, xpReward: 200, theory: `Synthesize your DSA logic to pass the professional level assessment.`, examples: [], exercises: [] }
];

const generateLessons = (trackKey) => {
  if (trackKey === 'python') return pythonLessons;
  if (trackKey === 'javascript') return javascriptLessons;
  if (trackKey === 'react') return reactLessons;
  
  const lessonSource = {
    'html': htmlLessons,
    'css': cssLessons,
    'node': nodeLessons,
    'dsa': dsaLessons
  }[trackKey];

  if (lessonSource) {
    return lessonSource.map(l => ({
      ...l,
      track: trackKey,
      metadata: {
        difficulty: l.order <= 5 ? "Beginner" : l.order <= 12 ? "Intermediate" : "Professional",
        estimatedTime: l.order <= 5 ? "15 min" : l.order <= 12 ? "25 min" : "45 min"
      }
    }));
  }

  // Fallback for any other track
  const lessons = [];
  const config = TRACKS[trackKey];
  const count = trackKey === 'dsa' || trackKey === 'node' ? 15 : 20;

  for (let i = 1; i <= count; i++) {
    const chapterIdx = Math.min(Math.floor((i - 1) / 4), config.chapters.length - 1);
    const chapter = config.chapters[chapterIdx];
    const xpReward = 50 + (i - 1) * 10;
    const time = 15 + (i % 3) * 5;

    lessons.push({
      title: `${config.name} Unit ${String(i).padStart(2, '0')}`,
      slug: `${trackKey}-${i}`,
      track: trackKey,
      chapter: chapter,
      order: i,
      xpReward: xpReward,
      metadata: {
        difficulty: i <= 5 ? "Beginner" : i <= 12 ? "Intermediate" : "Professional",
        estimatedTime: `${time} min`
      },
      theory: `# ${config.name} Phase ${i}\n\nThis architectural unit covers key concepts in **${chapter}**. \n\n### Core Logic\nMastering the fundamentals of ${trackKey} requires dedicated synthesis of logic and data. In this module, we explore high-performance patterns for structural efficiency.`,
      examples: [
        {
          title: "Code Example",
          code: trackKey === 'python' ? `def solve():\n    return "Module ${i} Active"` : `const solve = () => "Module ${i} Active";`,
          explanation: `A base-level demonstration of ${trackKey} logic for module ${i}.`
        }
      ],
      exercises: [
        {
          exerciseIndex: 0,
          problem: `Implement a function that returns the string "MODULE_${i}_SYNCHRONIZED".`,
          starterCode: trackKey === 'python' ? `def synchro():\n    # Your logic here\n    pass` : `function synchro() {\n    // Your logic here\n}`,
          testCases: [
            { input: "", expected: `MODULE_${i}_SYNCHRONIZED` }
          ],
          hints: [`Return the EXACT string "MODULE_${i}_SYNCHRONIZED".`]
        }
      ]
    });
  }

  return lessons;
};

const dsaChallenges = [
  {
    title: "Bubble Sort Implementation",
    difficulty: "Intermediate",
    topic: "DSA",
    lang: "javascript",
    xpReward: 100,
    desc: "Implement a function bubbleSort(arr) that sorts an array in ascending order.",
    starterCode: "function bubbleSort(arr) {\n  // Your logic here\n  return arr;\n}",
    testCases: [{ input: "[5, 3, 8, 1]", expected: "[1, 3, 5, 8]" }],
    hints: ["Compare adjacent elements and swap them if they are in the wrong order."]
  },
  {
    title: "Binary Search",
    difficulty: "Intermediate",
    topic: "DSA",
    lang: "javascript",
    xpReward: 120,
    desc: "Implement binary search to find an element in a sorted array.",
    starterCode: "function binarySearch(arr, target) {\n  // return index or -1\n}",
    testCases: [{ input: "[1, 2, 3, 4], 3", expected: "2" }]
  }
];

const jsChallenges = [
  {
    title: "Deep Clone Object",
    difficulty: "Professional",
    topic: "JavaScript",
    lang: "javascript",
    xpReward: 150,
    desc: "Create a function deepClone(obj) that returns a deep copy of an object.",
    starterCode: "function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj)); // Improve this\n}",
    testCases: [{ input: "{a:1, b:{c:2}}", expected: "{a:1, b:{c:2}}" }]
  },
  {
    title: "Asynchronous Retry",
    difficulty: "Professional",
    topic: "JavaScript",
    lang: "javascript",
    xpReward: 200,
    desc: "Write a function withRetry(fn, retries) that attempts to execute an async function multiple times.",
    starterCode: "async function withRetry(fn, limit) {\n  // Logic\n}",
    testCases: []
  }
];

const reactChallenges = [
  {
    title: "Custom Hook: useLocalStorage",
    difficulty: "Intermediate",
    topic: "React",
    lang: "javascript",
    xpReward: 100,
    desc: "Implement a custom hook useLocalStorage(key, initialValue) to sync state with localStorage.",
    starterCode: "function useLocalStorage(key, initialValue) {\n  // logic\n}",
    testCases: []
  }
];

const nodeChallenges = [
  {
    title: "Simple File Server",
    difficulty: "Intermediate",
    topic: "Node",
    lang: "javascript",
    xpReward: 100,
    desc: "Use the 'fs' module to read a file and return its content.",
    starterCode: "const fs = require('fs');\nfunction readFileContent(path) {\n  return fs.readFileSync(path, 'utf8');\n}",
    testCases: []
  }
];

async function seedMaster() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('⚛️  NEURAL LINK ESTABLISHED TO DATA CLUSTER.');

    // 1. Purge Legacy Dataframes
    await Lesson.deleteMany({});
    await Challenge.deleteMany({});
    console.log('🗑️  LEGACY DATAFRAMES PURGED.');

    // 2. Generate and Insert Track Modules
    for (const trackKey of Object.keys(TRACKS)) {
      const lessons = generateLessons(trackKey);
      await Lesson.insertMany(lessons);
      console.log(`✅ ${TRACKS[trackKey].name}: ${lessons.length} Modules Online.`);
    }

    // 3. Inject Practice Challenges
    await Challenge.insertMany([...dsaChallenges, ...jsChallenges, ...reactChallenges, ...nodeChallenges]);
    console.log('⚡ PRACTICE ARENA SYNCHRONIZED.');

    console.log('--- CURRICULUM SYNCHRONIZATION COMPLETE ---');
    process.exit();
  } catch (err) {
    console.error('❌ CRITICAL SEED FAILURE:', err);
    process.exit(1);
  }
}

seedMaster();
