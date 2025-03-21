import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { codebase, useFilePaths } from "@/store/chatStore";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

interface FileTreeProps {
  item: FileItem;
  depth?: number;
  path?: string;
  onFileClick: (filePath: string) => void;
}

const FileTree = ({
  item,
  depth = 0,
  path = "",
  onFileClick,
}: FileTreeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = path ? `${path}/${item.name}` : item.name;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onFileClick(currentPath);
    }
  };

  return (
    <div className="px-2">
      <div
        className="flex items-center gap-1 py-1 hover:bg-neutral-700/50 cursor-pointer rounded-md px-2"
        style={{ paddingLeft: `${depth * 12}px` }}
        onClick={handleClick}
      >
        {item.type === "folder" && (
          <span className="min-w-4 min-h-4">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {item.type === "folder" ? (
          <Folder size={16} className="text-neutral-400" />
        ) : (
          <File size={16} className="text-neutral-400" />
        )}
        <span className="text-sm text-neutral-200 overflow-hidden text-ellipsis whitespace-nowrap">
          {item.name}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            {item.children.map((child, index) => (
              <FileTree
                key={index}
                item={child}
                depth={depth + 1}
                path={currentPath}
                onFileClick={onFileClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FileExplorer = () => {
  const files: FileItem[] = codebase;
  const { setFilePaths } = useFilePaths();

  const onFileClick = (filePath: string) => {
    setFilePaths(filePath);
  };

  return (
    <div className="text-white h-full select-none">
      <div className="p-2 px-3 text-sm text-neutral-200 border-b-[1.5px] border-border mb-2 ">
        File Explorer
      </div>
      {files.map((item, index) => (
        <FileTree key={index} item={item} onFileClick={onFileClick} />
      ))}
    </div>
  );
};

export default FileExplorer;
