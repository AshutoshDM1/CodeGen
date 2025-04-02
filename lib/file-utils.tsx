import React from "react";
import {
  FileIcon,
  PackageIcon,
  CodeIcon,
  FileTextIcon,
  FileJsonIcon,
  FileCogIcon,
  ImageIcon,
  BookIcon,
} from "lucide-react";

/**
 * Returns the appropriate icon component for a given filename
 * based on its file extension
 *
 * @param filename The name of the file
 * @returns React component with the appropriate icon
 */
export const getFileIcon = (filename: string): JSX.Element => {
  if (!filename) return <FileIcon size={20} />;

  // Convert to lowercase for case-insensitive comparison
  const lowerFilename = filename.toLowerCase();

  // Configuration files
  if (
    lowerFilename.includes("config") ||
    lowerFilename.endsWith(".env") ||
    lowerFilename.endsWith(".yml") ||
    lowerFilename.endsWith(".yaml") ||
    lowerFilename.includes(".gitignore") ||
    lowerFilename.includes(".babelrc")
  ) {
    return <FileCogIcon size={20} className="text-gray-300" />;
  }

  // Package files
  if (
    lowerFilename.endsWith("package.json") ||
    lowerFilename.endsWith("package-lock.json")
  ) {
    return <PackageIcon size={20} className="text-yellow-400" />;
  }

  // JavaScript files
  if (
    lowerFilename.endsWith(".js") ||
    lowerFilename.endsWith(".jsx") ||
    lowerFilename.endsWith(".mjs")
  ) {
    return <CodeIcon size={20} className="text-yellow-300" />;
  }

  // TypeScript files
  if (lowerFilename.endsWith(".ts") || lowerFilename.endsWith(".tsx")) {
    return <CodeIcon size={20} className="text-blue-400" />;
  }

  // CSS and style files
  if (
    lowerFilename.endsWith(".css") ||
    lowerFilename.endsWith(".scss") ||
    lowerFilename.endsWith(".less") ||
    lowerFilename.endsWith(".sass")
  ) {
    return <FileIcon size={20} className="text-blue-300" />;
  }

  // HTML files
  if (lowerFilename.endsWith(".html") || lowerFilename.endsWith(".htm")) {
    return <FileIcon size={20} className="text-orange-400" />;
  }

  // JSON files
  if (lowerFilename.endsWith(".json")) {
    return <FileJsonIcon size={20} className="text-amber-300" />;
  }

  // Image files
  if (
    lowerFilename.endsWith(".png") ||
    lowerFilename.endsWith(".jpg") ||
    lowerFilename.endsWith(".jpeg") ||
    lowerFilename.endsWith(".gif") ||
    lowerFilename.endsWith(".svg") ||
    lowerFilename.endsWith(".webp")
  ) {
    return <ImageIcon size={20} className="text-purple-400" />;
  }

  // Text and markdown files
  if (
    lowerFilename.endsWith(".txt") ||
    lowerFilename.endsWith(".md") ||
    lowerFilename.endsWith(".markdown")
  ) {
    return <FileTextIcon size={20} className="text-zinc-300" />;
  }

  // Documentation files
  if (
    lowerFilename.endsWith(".pdf") ||
    lowerFilename.endsWith(".doc") ||
    lowerFilename.endsWith(".docx")
  ) {
    return <BookIcon size={20} className="text-red-400" />;
  }

  // Default fallback
  return <FileIcon size={20} className="text-gray-400" />;
};
