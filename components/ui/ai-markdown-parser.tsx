"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileIcon, CheckIcon, PackageIcon, CodeIcon } from "lucide-react";

interface AIMarkdownParserProps {
  content: string;
  animate?: boolean;
}

export const AIMarkdownParser = ({
  content,
  animate = true,
}: AIMarkdownParserProps) => {
  const [parsedContent, setParsedContent] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const parsed = parseAIContent(content, animate);
    setParsedContent(parsed);
  }, [content, animate]);

  return (
    <div className="ai-markdown-parser prose prose-invert max-w-none">
      {parsedContent}
    </div>
  );
};

// Main parser function
const parseAIContent = (content: string, animate: boolean): JSX.Element[] => {
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  const parsedElements: JSX.Element[] = [];

  let inNumberedList = false;
  let inFileList = false;
  let listItems: JSX.Element[] = [];
  let fileItems: JSX.Element[] = [];
  let currentIndex = 0;

  // Process each line
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Check for numbered list (e.g., "1. Item")
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s(.+)$/);

    // Check for file list items (e.g., "* `filename.js`")
    const fileListMatch = trimmedLine.match(/^\*\s`([^`]+)`\s*(.*)$/);

    if (numberedMatch) {
      const [_, number, text] = numberedMatch;

      // If this is the first numbered item, start a new list
      if (!inNumberedList) {
        inNumberedList = true;

        // If we were in a file list, close it first
        if (inFileList) {
          parsedElements.push(
            <motion.div
              key={`file-list-${currentIndex}`}
              initial={animate ? { opacity: 0, y: 10 } : undefined}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: currentIndex * 0.1,
              }}
              className="pl-6 mb-4"
            >
              {fileItems}
            </motion.div>
          );
          fileItems = [];
          inFileList = false;
          currentIndex++;
        }
      }

      // Add the numbered item
      listItems.push(
        <motion.div
          key={`step-${number}`}
          initial={animate ? { opacity: 0, x: -10 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{
            duration: 0.5,
            delay: animate ? 0.2 + parseInt(number) * 0.1 : 0,
          }}
          className="flex items-start gap-3 mb-2"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 font-semibold text-sm">
            {number}
          </div>
          <div className="flex-1">{text}</div>
        </motion.div>
      );
    } else if (fileListMatch) {
      const [_, filename, description] = fileListMatch;

      // If this is the first file item, start a new file list
      if (!inFileList) {
        inFileList = true;

        // If we were in a numbered list, close it first
        if (inNumberedList) {
          parsedElements.push(
            <motion.div
              key={`numbered-list-${currentIndex}`}
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              {listItems}
            </motion.div>
          );
          listItems = [];
          inNumberedList = false;
          currentIndex++;
        }
      }

      // Determine file type and icon
      const fileIcon = getFileIcon(filename);

      // Add the file item
      fileItems.push(
        <motion.div
          key={`file-${filename}`}
          initial={animate ? { opacity: 0, x: -5 } : undefined}
          animate={animate ? { opacity: 1, x: 0 } : undefined}
          transition={{
            duration: 0.3,
            delay: animate ? 0.1 * fileItems.length : 0,
          }}
          className="flex items-center gap-2 mb-2 border border-zinc-800 rounded-md p-2 bg-zinc-900/50"
        >
          <div className="text-zinc-400">{fileIcon}</div>
          <div>
            <code className="text-sm font-mono text-emerald-300">
              {filename}
            </code>
            {description && (
              <p className="text-xs text-zinc-400">{description}</p>
            )}
          </div>
        </motion.div>
      );
    } else {
      // Process any pending lists before adding a regular paragraph
      if (inNumberedList) {
        parsedElements.push(
          <motion.div
            key={`numbered-list-${currentIndex}`}
            initial={animate ? { opacity: 0 } : undefined}
            animate={animate ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            {listItems}
          </motion.div>
        );
        listItems = [];
        inNumberedList = false;
        currentIndex++;
      }

      if (inFileList) {
        parsedElements.push(
          <motion.div
            key={`file-list-${currentIndex}`}
            initial={animate ? { opacity: 0, y: 10 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: currentIndex * 0.1 }}
            className="pl-6 mb-4"
          >
            {fileItems}
          </motion.div>
        );
        fileItems = [];
        inFileList = false;
        currentIndex++;
      }

      // Add regular paragraph
      parsedElements.push(
        <motion.p
          key={`p-${index}`}
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: currentIndex * 0.1 }}
          className="mb-4"
        >
          {trimmedLine}
        </motion.p>
      );
      currentIndex++;
    }
  });

  // Process any remaining list items
  if (inNumberedList && listItems.length > 0) {
    parsedElements.push(
      <motion.div
        key={`numbered-list-${currentIndex}`}
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        {listItems}
      </motion.div>
    );
    currentIndex++;
  }

  if (inFileList && fileItems.length > 0) {
    parsedElements.push(
      <motion.div
        key={`file-list-${currentIndex}`}
        initial={animate ? { opacity: 0, y: 10 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay: currentIndex * 0.1 }}
        className="pl-6 mb-4"
      >
        {fileItems}
      </motion.div>
    );
  }

  return parsedElements;
};

// Helper to get appropriate icon for file type
const getFileIcon = (filename: string) => {
  if (filename.endsWith("package.json")) {
    return <PackageIcon size={16} />;
  } else if (
    filename.endsWith(".js") ||
    filename.endsWith(".ts") ||
    filename.endsWith(".tsx") ||
    filename.endsWith(".jsx")
  ) {
    return <CodeIcon size={16} />;
  } else if (
    filename.endsWith(".css") ||
    filename.endsWith(".scss") ||
    filename.endsWith(".less")
  ) {
    return <FileIcon size={16} />;
  } else if (filename.endsWith(".html")) {
    return <FileIcon size={16} />;
  } else if (filename.endsWith(".json")) {
    return <FileIcon size={16} />;
  } else {
    return <FileIcon size={16} />;
  }
};
