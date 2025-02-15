interface FileData {
	name: string;
	language: string;
	value: string;
	linkedFiles?: string[];
	type:
		| 'component'
		| 'style'
		| 'util'
		| 'html'
		| 'javascript'
		| 'css'
		| 'python'
		| 'text';
	description?: string;
}

interface Files {
	[key: string]: FileData;
}

const files: Files = {
	'index.html': {
		name: 'index.html',
		language: 'html',
		type: 'html',
		description: 'Main HTML file',
		value: `<div class="container">
    <h1>Welcome to My Web Page</h1>
    <p>This is a sample HTML file.</p>
    <button id="myButton">Click Me</button>
</div>`,
	},
	'styles.css': {
		name: 'styles.css',
		language: 'css',
		type: 'css',
		description: 'Main CSS file',
		value: `/* Main styles */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h1 {
    color: #2c3e50;
    text-align: center;
}

button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #2980b9;
}`,
	},
	'script.js': {
		name: 'script.js',
		language: 'javascript',
		type: 'javascript',
		description: 'Main JavaScript file',
		value: `// Main JavaScript code
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton');
    
    button.addEventListener('click', () => {
        alert('Button clicked!');
    });
});

// Example function
function calculateSum(a, b) {
    return a + b;
}`,
	},
	'App.jsx': {
		name: 'App.jsx',
		language: 'javascript',
		type: 'component',
		linkedFiles: ['App.module.css'],
		description: 'Main component',
		value: `// Write your React component here
// You can use either function or const declaration
const App = () => {
	return (
		<div className="app">
			<h1>Hello World</h1>
			<Button>Click me</Button>
		</div>
	);
}`,
	},
	'Button.jsx': {
		name: 'Button.jsx',
		language: 'javascript',
		type: 'component',
		linkedFiles: ['Button.module.css'],
		description: 'Reusable button component',
		value: `// Example of a reusable button component
const Button = ({ children, ...props }) => {
	return (
		<button className="button" {...props}>
			{children}
		</button>
	);
}`,
	},
	'App.module.css': {
		name: 'App.module.css',
		language: 'css',
		type: 'style',
		description: 'Styles for App component',
		value: `/* Styles for App component */
.app {
	text-align: center;
	padding: 20px;
	font-family: Arial, sans-serif;
}

h1 {
	color: #2c3e50;
	font-size: 2.5em;
}`,
	},
	'Button.module.css': {
		name: 'Button.module.css',
		language: 'css',
		type: 'style',
		description: 'Styles for Button component',
		value: `/* Styles for Button component */
.button {
	background-color: #3498db;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 1em;
	transition: background-color 0.3s;
}

.button:hover {
	background-color: #2980b9;
}`,
	},
	'utils.js': {
		name: 'utils.js',
		language: 'javascript',
		type: 'util',
		description: 'Utility functions',
		value: `// Example utility functions
export const formatDate = (date) => {
	return new Date(date).toLocaleDateString();
};

export const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};`,
	},
	'main.py': {
		name: 'main.py',
		language: 'python',
		type: 'python',
		description: 'Main Python script',
		value: `print("Simple Addition Program")
print("------------------------")

first = input("Enter first number: ")
second = input("Enter second number: ")

try:
    num1 = float(first)
    num2 = float(second)
    sum = num1 + num2
    print(f"{num1} + {num2} = {sum}")
except ValueError:
    print("Please enter valid numbers!")`,
	},
	'utils.py': {
		name: 'utils.py',
		language: 'python',
		type: 'python',
		description: 'Python utility functions',
		value: `print("Grade Calculator")
print("------------------------")

score = input("Enter score (0-100): ")

try:
    num = float(score)
    if 0 <= num <= 100:
        if num >= 90:
            grade = 'A'
        elif num >= 80:
            grade = 'B'
        elif num >= 70:
            grade = 'C'
        elif num >= 60:
            grade = 'D'
        else:
            grade = 'F'
        print(f"Score: {num}")
        print(f"Grade: {grade}")
    else:
        print("Score must be between 0 and 100")
except ValueError:
    print("Please enter a valid number!")`,
	},
	'example.py': {
		name: 'example.py',
		language: 'python',
		type: 'python',
		description: 'Example Python code with classes',
		value: `print("Basic Calculator")
print("------------------------")

first = input("Enter first number: ")
second = input("Enter second number: ")
operation = input("Enter operation (+, -, *, /): ")

try:
    num1 = float(first)
    num2 = float(second)
    
    if operation == '+':
        result = num1 + num2
        print(f"{num1} + {num2} = {result}")
    elif operation == '-':
        result = num1 - num2
        print(f"{num1} - {num2} = {result}")
    elif operation == '*':
        result = num1 * num2
        print(f"{num1} * {num2} = {result}")
    elif operation == '/':
        if num2 == 0:
            print("Error: Cannot divide by zero")
        else:
            result = num1 / num2
            print(f"{num1} / {num2} = {result}")
    else:
        print("Invalid operation. Please use +, -, *, or /")
except ValueError:
    print("Please enter valid numbers!")`,
	},
};

export default files;
