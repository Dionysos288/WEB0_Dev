interface Language {
	value: string;
	language: string;
	type:
		| 'component'
		| 'style'
		| 'util'
		| 'html'
		| 'javascript'
		| 'css'
		| 'python'
		| 'text'
		| 'csharp'
		| 'java'
		| 'php'
		| 'go'
		| 'c'
		| 'cpp'
		| 'rust'
		| 'ruby'
		| 'kotlin'
		| 'swift'
		| 'typescript';
	description?: string;
}

interface Files {
	[key: string]: Language;
}

const files: Files = {
	'index.html': {
		value: `<!DOCTYPE html>
<html>
<head>
	<title>My Web Page</title>
</head>
<body>
	<h1>Hello, World!</h1>
	<p>Welcome to my web page.</p>
</body>
</html>`,
		language: 'html',
		type: 'html',
		description: 'Main HTML file',
	},
	'styles.css': {
		value: `body {
	font-family: Arial, sans-serif;
	margin: 0;
	padding: 20px;
	background-color: #f0f0f0;
}

h1 {
	color: #333;
}`,
		language: 'css',
		type: 'css',
		description: 'CSS styles',
	},
	'script.js': {
		value: `document.addEventListener('DOMContentLoaded', () => {
	console.log('Page loaded!');
});`,
		language: 'javascript',
		type: 'javascript',
		description: 'JavaScript code',
	},
	'App.jsx': {
		value: `function App() {
	const [count, setCount] = React.useState(0);

	return (
		<div style={{ textAlign: 'center', padding: '20px' }}>
			<h1>React Counter</h1>
			<p>Count: {count}</p>
			<Button onClick={() => setCount(count + 1)}>
				Increment
			</Button>
		</div>
	);
}`,
		language: 'javascript',
		type: 'component',
		description: 'Main React component',
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
    font-family: 'Arial';

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
		value: `def main():
    # Get user input
    name = input("What's your name? ")
    age = input("How old are you? ")
    
    # Print personalized message
    print(f"Hello, {name}!")
    print(f"You are {age} years old.")
    
    # Simple calculation
    future_age = int(age) + 10
    print(f"In 10 years, you will be {future_age} years old.")

if __name__ == "__main__":
    main()`,
		language: 'python',
		type: 'python',
		description: 'Python main file',
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
	'Program.cs': {
		value: `using System;

class Program {
    static void Main(string[] args) {
        // Get user input
        Console.Write("What's your name? ");
        string name = Console.ReadLine();
        
        Console.Write("How old are you? ");
        string ageInput = Console.ReadLine();
        
        // Parse age and calculate future age
        if (int.TryParse(ageInput, out int age)) {
            int futureAge = age + 10;
            
            // Print results
            Console.WriteLine($"Hello, {name}!");
            Console.WriteLine($"You are {age} years old.");
            Console.WriteLine($"In 10 years, you will be {futureAge} years old.");
        } else {
            Console.WriteLine("Invalid age input!");
        }
    }
}`,
		language: 'csharp',
		type: 'csharp',
		description: 'C# main file',
	},
	'DataStructures.cs': {
		name: 'DataStructures.cs',
		language: 'csharp',
		type: 'csharp',
		description: 'C# Data Structures Example',
		value: `using System;
using System.Collections.Generic;
using System.Linq;

class DataStructures
{
    static void Main()
    {
        Console.WriteLine("C# Data Structures Demo");
        Console.WriteLine("------------------------");

        // List demonstration
        Console.WriteLine("\n1. List Example:");
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
        numbers.Add(6);
        Console.WriteLine($"List: {string.Join(", ", numbers)}");
        Console.WriteLine($"First number: {numbers.First()}");
        Console.WriteLine($"Last number: {numbers.Last()}");

        // Dictionary demonstration
        Console.WriteLine("\n2. Dictionary Example:");
        Dictionary<string, int> ages = new Dictionary<string, int>
        {
            {"Alice", 25},
            {"Bob", 30},
            {"Charlie", 35}
        };
        foreach (var pair in ages)
        {
            Console.WriteLine($"{pair.Key} is {pair.Value} years old");
        }

        // Stack demonstration
        Console.WriteLine("\n3. Stack Example:");
        Stack<string> stack = new Stack<string>();
        stack.Push("First");
        stack.Push("Second");
        stack.Push("Third");
        Console.WriteLine($"Popped: {stack.Pop()}");
        Console.WriteLine($"Peek at next: {stack.Peek()}");

        // Queue demonstration
        Console.WriteLine("\n4. Queue Example:");
        Queue<string> queue = new Queue<string>();
        queue.Enqueue("First");
        queue.Enqueue("Second");
        queue.Enqueue("Third");
        Console.WriteLine($"Dequeued: {queue.Dequeue()}");
        Console.WriteLine($"Peek at next: {queue.Peek()}");

        // LINQ demonstration
        Console.WriteLine("\n5. LINQ Example:");
        var evenNumbers = numbers.Where(n => n % 2 == 0);
        Console.WriteLine($"Even numbers: {string.Join(", ", evenNumbers)}");
        Console.WriteLine($"Sum of all numbers: {numbers.Sum()}");
        Console.WriteLine($"Average: {numbers.Average()}");
    }
}`,
	},
	'OOP.cs': {
		name: 'OOP.cs',
		language: 'csharp',
		type: 'csharp',
		description: 'C# Object-Oriented Programming',
		value: `using System;

// Base class
abstract class Animal
{
    public string Name { get; protected set; }
    
    public Animal(string name)
    {
        Name = name;
    }
    
    public abstract void MakeSound();
    
    public virtual void Describe()
    {
        Console.WriteLine($"I am {Name}");
    }
}

// Derived class
class Dog : Animal
{
    public string Breed { get; private set; }
    
    public Dog(string name, string breed) : base(name)
    {
        Breed = breed;
    }
    
    public override void MakeSound()
    {
        Console.WriteLine("Woof!");
    }
    
    public override void Describe()
    {
        base.Describe();
        Console.WriteLine($"I am a {Breed} dog");
    }
}

// Interface
interface IPlayful
{
    void Play();
}

// Class implementing interface
class Puppy : Dog, IPlayful
{
    public Puppy(string name, string breed) : base(name, breed) { }
    
    public void Play()
    {
        Console.WriteLine($"{Name} is playing with a ball!");
    }
}

class Program
{
    static void Main()
    {
        Console.WriteLine("C# OOP Demo");
        Console.WriteLine("------------------------");
        
        // Create instances
        Dog dog = new Dog("Rex", "German Shepherd");
        Puppy puppy = new Puppy("Max", "Golden Retriever");
        
        // Demonstrate inheritance
        Console.WriteLine("\n1. Inheritance Example:");
        dog.Describe();
        dog.MakeSound();
        
        // Demonstrate polymorphism
        Console.WriteLine("\n2. Polymorphism Example:");
        Animal animal = dog;
        animal.MakeSound();
        
        // Demonstrate interface
        Console.WriteLine("\n3. Interface Example:");
        puppy.Describe();
        puppy.Play();
        
        // Demonstrate type checking
        Console.WriteLine("\n4. Type Checking Example:");
        if (puppy is Animal)
        {
            Console.WriteLine($"{puppy.Name} is an Animal");
        }
        if (puppy is IPlayful)
        {
            Console.WriteLine($"{puppy.Name} is Playful");
        }
    }
}`,
	},
	'AsyncAwait.cs': {
		name: 'AsyncAwait.cs',
		language: 'csharp',
		type: 'csharp',
		description: 'C# Async/Await Example',
		value: `using System;
using System.Threading.Tasks;

class AsyncDemo
{
    static async Task Main()
    {
        Console.WriteLine("C# Async/Await Demo");
        Console.WriteLine("------------------------");

        Console.WriteLine("Starting async operations...");
        
        // Simulate multiple async operations
        Task<string> task1 = SimulateAsyncWork("Task 1", 2);
        Task<string> task2 = SimulateAsyncWork("Task 2", 3);
        Task<string> task3 = SimulateAsyncWork("Task 3", 1);

        // Wait for all tasks to complete
        Console.WriteLine("Waiting for tasks to complete...");
        await Task.WhenAll(task1, task2, task3);

        // Process results
        Console.WriteLine($"\nResults:");
        Console.WriteLine(await task1);
        Console.WriteLine(await task2);
        Console.WriteLine(await task3);

        // Demonstrate exception handling
        Console.WriteLine("\nTesting error handling:");
        try
        {
            await SimulateAsyncError();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Caught error: {ex.Message}");
        }

        Console.WriteLine("\nAsync demo completed!");
    }

    static async Task<string> SimulateAsyncWork(string taskName, int seconds)
    {
        Console.WriteLine($"Starting {taskName}");
        await Task.Delay(seconds * 1000); // Simulate work
        return $"{taskName} completed after {seconds} seconds";
    }

    static async Task SimulateAsyncError()
    {
        await Task.Delay(1000); // Simulate some work
        throw new Exception("Simulated async error");
    }
}`,
	},
	'Main.java': {
		value: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Get user input
        System.out.print("What's your name? ");
        String name = scanner.nextLine();
        
        System.out.print("How old are you? ");
        String ageInput = scanner.nextLine();
        
        try {
            int age = Integer.parseInt(ageInput);
            int futureAge = age + 10;
            
            // Print results
            System.out.println("Hello, " + name + "!");
            System.out.println("You are " + age + " years old.");
            System.out.println("In 10 years, you will be " + futureAge + " years old.");
        } catch (NumberFormatException e) {
            System.out.println("Invalid age input!");
        }
        
        scanner.close();
    }
}`,
		language: 'java',
		type: 'java',
		description: 'Java main file',
	},
	'index.js': {
		value: `const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask questions sequentially
function askQuestion(question) {
    return new Promise(resolve => {
        readline.question(question, answer => {
            resolve(answer);
        });
    });
}

async function main() {
    try {
        // Get user input
        const name = await askQuestion("What's your name? ");
        const ageStr = await askQuestion("How old are you? ");
        
        // Parse age and calculate future age
        const age = parseInt(ageStr);
        if (isNaN(age)) {
            console.log("Invalid age input!");
            return;
        }
        
        const futureAge = age + 10;
        
        // Print results
        console.log(\`Hello, \${name}!\`);
        console.log(\`You are \${age} years old.\`);
        console.log(\`In 10 years, you will be \${futureAge} years old.\`);
    } finally {
        readline.close();
    }
}

main();`,
		language: 'javascript',
		type: 'javascript',
		description: 'Node.js main file',
	},
	'index.php': {
		value: `<?php
// Get user input
echo "What's your name? ";
$name = trim(fgets(STDIN));

echo "How old are you? ";
$age = trim(fgets(STDIN));

// Check if age is valid
if (is_numeric($age)) {
    $futureAge = intval($age) + 10;
    
    // Print results
    echo "Hello, $name!\n";
    echo "You are $age years old.\n";
    echo "In 10 years, you will be $futureAge years old.\n";
} else {
    echo "Invalid age input!\n";
}`,
		language: 'php',
		type: 'php',
		description: 'PHP main file',
	},
	'main.go': {
		value: `package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	// Get user input
	fmt.Print("What's your name? ")
	name, _ := reader.ReadString('\\n')
	name = strings.TrimSpace(name)

	fmt.Print("How old are you? ")
	ageInput, _ := reader.ReadString('\\n')
	ageInput = strings.TrimSpace(ageInput)

	// Parse age and calculate future age
	age, err := strconv.Atoi(ageInput)
	if err != nil {
		fmt.Println("Invalid age input!")
		return
	}

	futureAge := age + 10

	// Print results
	fmt.Printf("Hello, %s!\n", name)
	fmt.Printf("You are %d years old.\n", age)
	fmt.Printf("In 10 years, you will be %d years old.\n", futureAge)
}`,
		language: 'go',
		type: 'go',
		description: 'Go main file',
	},
	'main.c': {
		value: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME 100

int main() {
    char name[MAX_NAME];
    char age_str[10];
    int age;
    
    // Get user input
    printf("What's your name? ");
    fgets(name, MAX_NAME, stdin);
    name[strcspn(name, "\\n")] = 0; // Remove newline
    
    printf("How old are you? ");
    fgets(age_str, 10, stdin);
    
    // Parse age
    age = atoi(age_str);
    if (age <= 0) {
        printf("Invalid age input!\\n");
        return 1;
    }
    
    int future_age = age + 10;
    
    // Print results
    printf("Hello, %s!\\n", name);
    printf("You are %d years old.\\n", age);
    printf("In 10 years, you will be %d years old.\\n", future_age);
    
    return 0;
}`,
		language: 'c',
		type: 'c',
		description: 'C main file',
	},
	'main.cpp': {
		value: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::string age_str;
    int age;
    
    // Get user input
    std::cout << "What's your name? ";
    std::getline(std::cin, name);
    
    std::cout << "How old are you? ";
    std::getline(std::cin, age_str);
    
    try {
        age = std::stoi(age_str);
        int future_age = age + 10;
        
        // Print results
        std::cout << "Hello, " << name << "!" << std::endl;
        std::cout << "You are " << age << " years old." << std::endl;
        std::cout << "In 10 years, you will be " << future_age << " years old." << std::endl;
    } catch (const std::exception&) {
        std::cout << "Invalid age input!" << std::endl;
        return 1;
    }
    
    return 0;
}`,
		language: 'cpp',
		type: 'cpp',
		description: 'C++ main file',
	},
	'main.rs': {
		value: `use std::io::{self, Write};

fn main() {
    // Get user input
    print!("What's your name? ");
    io::stdout().flush().unwrap();
    let mut name = String::new();
    io::stdin().read_line(&mut name).unwrap();
    let name = name.trim();
    
    print!("How old are you? ");
    io::stdout().flush().unwrap();
    let mut age_str = String::new();
    io::stdin().read_line(&mut age_str).unwrap();
    
    // Parse age and calculate future age
    match age_str.trim().parse::<i32>() {
        Ok(age) => {
            let future_age = age + 10;
            
            // Print results
            println!("Hello, {}!", name);
            println!("You are {} years old.", age);
            println!("In 10 years, you will be {} years old.", future_age);
        }
        Err(_) => {
            println!("Invalid age input!");
        }
    }
}`,
		language: 'rust',
		type: 'rust',
		description: 'Rust main file',
	},
	'main.rb': {
		value: `# Get user input
print "What's your name? "
name = gets.chomp

print "How old are you? "
age_str = gets.chomp

# Parse age and calculate future age
begin
    age = Integer(age_str)
    future_age = age + 10
    
    # Print results
    puts "Hello, #{name}!"
    puts "You are #{age} years old."
    puts "In 10 years, you will be #{future_age} years old."
rescue ArgumentError
    puts "Invalid age input!"
end`,
		language: 'ruby',
		type: 'ruby',
		description: 'Ruby main file',
	},
	'Main.kt': {
		value: `import java.util.Scanner

fun main() {
    val scanner = Scanner(System.in)
    
    // Get user input
    print("What's your name? ")
    val name = scanner.nextLine()
    
    print("How old are you? ")
    val ageStr = scanner.nextLine()
    
    try {
        val age = ageStr.toInt()
        val futureAge = age + 10
        
        // Print results
        println("Hello, $name!")
        println("You are $age years old.")
        println("In 10 years, you will be $futureAge years old.")
    } catch (e: NumberFormatException) {
        println("Invalid age input!")
    } finally {
        scanner.close()
    }
}`,
		language: 'kotlin',
		type: 'kotlin',
		description: 'Kotlin main file',
	},
	'main.swift': {
		value: `// Get user input
print("What's your name? ", terminator: "")
guard let name = readLine() else {
    print("Error reading name")
    exit(1)
}

print("How old are you? ", terminator: "")
guard let ageStr = readLine(),
      let age = Int(ageStr) else {
    print("Invalid age input!")
    exit(1)
}

// Calculate future age
let futureAge = age + 10

// Print results
print("Hello, \\(name)!")
print("You are \\(age) years old.")
print("In 10 years, you will be \\(futureAge) years old.")`,
		language: 'swift',
		type: 'swift',
		description: 'Swift main file',
	},
	'index.ts': {
		value: `import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function main(): Promise<void> {
    try {
        // Get user input
        const name: string = await askQuestion("What's your name? ");
        const ageStr: string = await askQuestion("How old are you? ");
        
        // Parse age and calculate future age
        const age: number = parseInt(ageStr);
        if (isNaN(age)) {
            console.log("Invalid age input!");
            return;
        }
        
        const futureAge: number = age + 10;
        
        // Print results
        console.log(\`Hello, \${name}!\`);
        console.log(\`You are \${age} years old.\`);
        console.log(\`In 10 years, you will be \${futureAge} years old.\`);
    } finally {
        rl.close();
    }
}

main();`,
		language: 'typescript',
		type: 'typescript',
		description: 'TypeScript main file',
	},
};

export default files;
