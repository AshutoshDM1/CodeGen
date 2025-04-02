"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getFileIcon } from "@/lib/file-utils";

interface FileUpdateIndicatorProps {
  message?: string;
  variant?: "compact" | "full";
  className?: string;
  filePath?: string;
}

const FileUpdateIndicator = ({
  message = "Updating",
  variant = "full",
  className = "",
  filePath,
}: FileUpdateIndicatorProps) => {
  // Use the full path for the icon if available, otherwise use the filename
  const fileForIcon = filePath;
  const fileIcon = getFileIcon(fileForIcon || "");

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md text-xs ${className}`}
      >
        <Loader2 className="animate-spin h-3 w-3 text-blue-500" />
        <span className="text-zinc-400 font-mono text-xs truncate">
          {filePath}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`flex items-center justify-start gap-3 p-1.5 px-3 bg-gradient-to-r backdrop-blur-xl border border-blue-500/20 rounded-md text-sm w-fit ${className}`}
    >
      <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
      <span className="text-blue-300 font-medium">{message}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 text-blue-400 mb-1 mr-1">{fileIcon}</div>
        <span className="text-zinc-400 font-mono">{filePath}</span>
      </div>
    </motion.div>
  );
};

export { FileUpdateIndicator };
