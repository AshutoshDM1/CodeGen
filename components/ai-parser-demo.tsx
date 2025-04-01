"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AIMarkdownParser } from "@/components/ui/ai-markdown-parser";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AIParserDemo() {
  const [showAnimations, setShowAnimations] = useState(true);
  const [selectedExample, setSelectedExample] = useState(0);

  // Sample AI-generated content that follows our pattern
  const examples = [
    `I'll create a beautiful food website landing page using React, Tailwind CSS, and Framer Motion.

1. Let's start with the project structure!
2. The following files will be created or modified:
* \`package.json\` (Ensure dependencies are up-to-date)
* \`tailwind.config.js\` (Extend theme for custom styles)
* \`index.html\` (Update page title)
* \`src/App.tsx\` (Implement the landing page structure and content)
* \`src/index.css\` (Add base styles and custom fonts if needed)
3. This landing page will feature a stunning hero section, a display of popular dishes, customer testimonials, and a call to action, all enhanced with smooth animations.`,

    `I'll create a Todo App with authentication using React, Firebase, and Tailwind CSS.

1. First, we'll set up the basic project scaffold.
2. Then we'll implement the following components:
* \`components/Auth/Login.tsx\` (Login form with email/password)
* \`components/Auth/Register.tsx\` (Sign up form for new users)
* \`components/Todo/TodoList.tsx\` (Main component to display all todos)
* \`components/Todo/TodoItem.tsx\` (Individual todo item with edit/delete)
* \`components/Todo/AddTodo.tsx\` (Form to add new todos)
3. Next, we'll set up Firebase authentication and Firestore for data storage.
4. Finally, we'll add proper styling with Tailwind CSS and ensure the app is responsive.`,

    `I'll create a weather application that fetches data from a public API and displays forecasts.

1. Let's structure our application into components.
2. We need to use these libraries:
* \`axios\` (For API requests)
* \`react-query\` (For data fetching and caching)
* \`tailwind-css\` (For styling)
* \`react-icons\` (For weather icons)
3. The application will have:
* Current weather display with temperature, conditions, and location
* 5-day forecast with daily highs and lows
* Search functionality to find weather by city
* Unit toggle between Celsius and Fahrenheit`,
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        AI Markdown Parser Demo
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {examples.map((_, index) => (
            <Button
              key={index}
              variant={selectedExample === index ? "default" : "outline"}
              onClick={() => setSelectedExample(index)}
            >
              Example {index + 1}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="animations"
            checked={showAnimations}
            onCheckedChange={setShowAnimations}
          />
          <Label htmlFor="animations">Show Animations</Label>
        </div>
      </div>

      <Card className="p-6 bg-zinc-900 border-zinc-800">
        <div className="prose prose-invert max-w-none">
          <AIMarkdownParser
            content={examples[selectedExample]}
            animate={showAnimations}
          />
        </div>
      </Card>

      <div className="mt-8 bg-zinc-900 p-4 rounded-md border border-zinc-800">
        <h2 className="text-xl font-semibold mb-2">How It Works</h2>
        <p className="text-zinc-300 mb-4">
          This custom parser recognizes specific patterns in AI-generated
          markdown:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-zinc-300">
          <li>Numbered lists (e.g., "1. First item")</li>
          <li>
            File references with descriptions (e.g., "* `filename.js`
            (description)")
          </li>
          <li>Regular paragraphs</li>
        </ul>
        <p className="mt-4 text-zinc-300">
          Each element gets custom styling and optional animations to create a
          more engaging experience for viewing AI-generated content.
        </p>
      </div>
    </div>
  );
}
