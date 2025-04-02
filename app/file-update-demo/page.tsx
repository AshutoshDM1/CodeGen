"use client";

import { useState, useEffect } from "react";
import { FileUpdateIndicator } from "@/components/ui/file-update-indicator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function FileUpdateDemoPage() {
  const [updatingFiles, setUpdatingFiles] = useState<string[]>([
    "src/App.tsx",
    "package.json",
    "tailwind.config.js",
  ]);

  const [demoMode, setDemoMode] = useState<"sequence" | "static" | "multiple">(
    "static"
  );

  useEffect(() => {
    // Demo animation sequence
    if (demoMode === "sequence") {
      const files = [
        "src/App.tsx",
        "src/components/Header.tsx",
        "src/styles/global.css",
        "package.json",
        "public/index.html",
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        setUpdatingFiles([files[currentIndex]]);
        currentIndex = (currentIndex + 1) % files.length;
      }, 2000);

      return () => clearInterval(interval);
    }

    if (demoMode === "multiple") {
      // Show multiple files updating at once
      setUpdatingFiles([
        "src/App.tsx",
        "src/components/Button.tsx",
        "src/styles/main.css",
        "package.json",
      ]);
    }

    if (demoMode === "static") {
      // Just show one file
      setUpdatingFiles(["src/App.tsx"]);
    }
  }, [demoMode]);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">File Update Indicator Demo</h1>

      <div className="flex gap-4 mb-8">
        <Button
          variant={demoMode === "static" ? "default" : "outline"}
          onClick={() => setDemoMode("static")}
        >
          Static Demo
        </Button>
        <Button
          variant={demoMode === "sequence" ? "default" : "outline"}
          onClick={() => setDemoMode("sequence")}
        >
          Sequence Demo
        </Button>
        <Button
          variant={demoMode === "multiple" ? "default" : "outline"}
          onClick={() => setDemoMode("multiple")}
        >
          Multiple Files Demo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Full Style</h2>
          <div className="space-y-3">
            {updatingFiles.map((file) => (
              <FileUpdateIndicator key={file} filename={file} variant="full" />
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Compact Style</h2>
          <div className="space-y-2">
            {updatingFiles.map((file) => (
              <FileUpdateIndicator
                key={file}
                filename={file}
                variant="compact"
              />
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4">In Context</h2>
          <div className="rounded-md bg-zinc-950 p-4 border border-zinc-800">
            <div className="prose prose-invert max-w-none">
              <p>
                I'll create a beautiful food website landing page using React,
                Tailwind CSS, and Framer Motion.
              </p>
              <ol className="space-y-2 pl-6">
                <li>Let's start with the project structure!</li>
                <li>The following files will be created or modified:</li>
              </ol>

              <div className="mt-4 pl-8 space-y-3">
                {updatingFiles.map((file) => (
                  <FileUpdateIndicator
                    key={file}
                    filename={file}
                    message={file.includes("App.tsx") ? "Update" : "Create"}
                  />
                ))}
              </div>

              <p className="mt-4">
                This landing page will feature a stunning hero section, a
                display of popular dishes, customer testimonials, and a call to
                action, all enhanced with smooth animations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
