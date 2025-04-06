'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFileIcon } from '@/lib/file-utils';

interface AIMarkdownParserProps {
  content: string;
  animate?: boolean;
  updatingFiles?:
    | string[]
    | Array<{ filename: string; action: string; filePath?: string }>
    | Array<{ action: string; filePath: string }>;
}

export const AIMarkdownParser = ({ content, animate = true }: AIMarkdownParserProps) => {
  const [parsedContent, setParsedContent] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const parsed = parseAIContent(content, animate);
    setParsedContent(parsed);
  }, [content, animate]);

  // Check for file lists in the content and try to extract them even if they don't match the regex
  useEffect(() => {
    // This is a backup approach to extract file references if the regex fails
    if (content && content.includes('*') && content.includes('`')) {
      const lines = content.split('\n');
      const fileLines = lines.filter(
        (line) => line.includes('*') && line.includes('`') && line.trim().startsWith('*'),
      );

      // Additional detection for the specific bulleted format with 3 spaces
      const aiStyleRegex = /^\s*\*\s{3}`([^`]+)`\s*(.*)$/;

      // If we found file lines in a format our parser might have missed, we can handle them here
      if (fileLines.length > 0) {
        // Try to extract file paths using the AI style format
        const extractedFiles = fileLines
          .map((line) => {
            const match = line.match(aiStyleRegex);
            if (match) {
              return match[1]; // Return the filename
            }
            return null;
          })
          .filter(Boolean);

        if (extractedFiles.length > 0) {
        }
      }
    }
  }, [content]);

  return <div className="ai-markdown-parser prose prose-invert max-w-none">{parsedContent}</div>;
};

// Main parser function
const parseAIContent = (content: string, animate: boolean): JSX.Element[] => {
  const lines = content.split('\n').filter((line) => line.trim() !== '');
  const parsedElements: JSX.Element[] = [];

  let inNumberedList = false;
  let inFileList = false;
  let listItems: JSX.Element[] = [];
  let fileItems: JSX.Element[] = [];
  let currentIndex = 0;

  // Process each line
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Enhanced detection for any bullet points with backticks
    // This will handle all variations of the AI's file listing format
    const bulletWithFile =
      trimmedLine.startsWith('*') && trimmedLine.includes('`') && !trimmedLine.includes('```');

    // Check for numbered list (e.g., "1. Item")
    const numberedMatch = trimmedLine.match(/^(\d+)\.\s(.+)$/);

    // Check for file list items that start with an asterisk (e.g., "* `file.js`")
    // Also handle format with multiple spaces after asterisk (e.g., "*   `file.js`")
    const fileListMatch = trimmedLine.match(/^\*\s{1,3}(?:\\?`|`)([^`]+)(?:\\?`|`)\s*(.*)$/);

    // Special check for the exact format AI often uses: "*   `filename.js`"
    const aiStyleMatch = fileListMatch
      ? null
      : trimmedLine.match(/^\*\s{3}(?:\\?`|`)([^`]+)(?:\\?`|`)\s*(.*)$/);

    // If we found an AI-style match but no regular match, use the AI-style match
    const actualFileListMatch = fileListMatch || aiStyleMatch;

    // Check for standalone file paths (e.g., "`file.js`")
    const standaloneFileMatch =
      !bulletWithFile && !actualFileListMatch
        ? trimmedLine.match(/^(?:\\?`|`)([^`]+)(?:\\?`|`)\s*(.*)$/)
        : null;

    // Check if the line is a file reference
    const isFileReference = actualFileListMatch || standaloneFileMatch;

    // Extract filename and description from either match
    let filename = '';
    let description = '';
    if (actualFileListMatch) {
      [, filename, description] = actualFileListMatch;
    } else if (standaloneFileMatch) {
      [, filename, description] = standaloneFileMatch;
    }

    if (numberedMatch) {
      const [, number, text] = numberedMatch;

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
            </motion.div>,
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
        </motion.div>,
      );
    } else if (isFileReference) {
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
            </motion.div>,
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
          className="flex items-center gap-3 mb-3 border rounded-md p-3 transition-colors bg-transparent"
        >
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 p-2 rounded-md flex items-center justify-center w-10 h-10">
            {fileIcon}
          </div>
          <div className="flex-1">
            <code className="text-sm font-mono text-emerald-300 font-semibold">{filename}</code>
            {description && <p className="text-xs text-zinc-400 mt-1">{description}</p>}
          </div>
        </motion.div>,
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
          </motion.div>,
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
          </motion.div>,
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
        </motion.p>,
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
      </motion.div>,
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
      </motion.div>,
    );
  }

  return parsedElements;
};
