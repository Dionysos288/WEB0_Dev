import { LanguageOption } from './types';

// Define supported languages for code components
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
	{
		name: 'HTML',
		type: 'html',
		extension: '.html',
	},
	{
		name: 'CSS',
		type: 'css',
		extension: '.css',
	},
	{
		name: 'JavaScript',
		type: 'javascript',
		extension: '.js',
	},
	{
		name: 'React JSX',
		type: 'component',
		extension: '.jsx',
	},
	{
		name: 'React TSX',
		type: 'component',
		extension: '.tsx',
	},
	{
		name: 'Python',
		type: 'python',
		extension: '.py',
	},
	{
		name: 'C#',
		type: 'csharp',
		extension: '.cs',
	},
	{
		name: 'Java',
		type: 'util',
		extension: '.java',
	},
	{
		name: 'C++',
		type: 'util',
		extension: '.cpp',
	},
];

// Default file templates
export const DEFAULT_FILE_TEMPLATES: Record<string, string> = {
	'index.html':
		'<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>My Web Page</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>Welcome to my web page!</p>\n  \n  <script src="script.js"></script>\n</body>\n</html>',
	'styles.css':
		'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}\n\np {\n  color: #666;\n}',
	'script.js':
		'console.log("Script loaded!");\n\n// Add your JavaScript code here\ndocument.addEventListener("DOMContentLoaded", function() {\n  console.log("DOM fully loaded");\n});',
	'App.jsx':
		'import React, { useState } from "react";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="app">\n      <h1>React Counter</h1>\n      <p>Current count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n      <button onClick={() => setCount(count - 1)}>Decrement</button>\n    </div>\n  );\n}\n\nexport default App;',
	'main.py':
		'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
	'Program.cs':
		'using System;\n\nclass Program\n{\n    static void Main(string[] args)\n    {\n        Console.WriteLine("Hello, World!");\n    }\n}',
};
