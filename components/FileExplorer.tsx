import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useFilePaths,
  useFileExplorerOpenStates,
  useFileExplorer,
} from '@/store/fileExplorerStore';
import { FileItem } from '@/types/fileStructure';

const FileExplorer = () => {
  const { fileExplorer } = useFileExplorer();
  const { setFilePaths } = useFilePaths();

  // Sort function to put folders before files
  const sortItems = (items: FileItem[]) => {
    return [...items].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name); // Alphabetical within same type
      }
      return a.type === 'folder' ? -1 : 1; // Folders before files
    });
  };

  const onFileClick = (filePath: string) => {
    setFilePaths(filePath);
  };

  return (
    <div className="text-white h-full select-none">
      <div className="py-3 px-3  text-neutral-200 border-b-[1.5px] border-border font-[inherit] mb-2 ">
        <h1 className="text-sm tracking-[1px]">File Explorer</h1>
      </div>
      {sortItems(fileExplorer).map((item, index) => (
        <FileTree key={index} item={item} onFileClick={onFileClick} />
      ))}
    </div>
  );
};

export default FileExplorer;

interface FileTreeProps {
  item: FileItem;
  depth?: number;
  path?: string;
  onFileClick: (filePath: string) => void;
}

const FileTree = ({ item, depth = 0, path = '', onFileClick }: FileTreeProps) => {
  const currentPath = path ? `${path}/${item.name}` : item.name;
  const { filePaths } = useFilePaths();
  const { openFolders, setOpenFolder } = useFileExplorerOpenStates();
  const isOpen = openFolders.has(currentPath);
  const isSelected = currentPath === filePaths;

  // Sort function for children
  const sortItems = (items: FileItem[]) => {
    return [...items].sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder') {
      setOpenFolder(currentPath, !isOpen);
    } else {
      onFileClick(currentPath);
    }
  };
  return (
    <div className="px-3 mb-1 ">
      <div
        className={`flex items-center gap-1 py-1 mb-1 hover:bg-blue-200/30 transition-all duration-[5ms] ease-in-out cursor-pointer rounded-md pr-2 ${
          isSelected ? 'bg-blue-600' : ''
        }`}
        style={{ paddingLeft: `${depth * 12}px` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="min-w-4 min-h-4">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {item.type === 'folder' ? (
          <Folder size={16} className="text-neutral-400 min-w-4 min-h-4" />
        ) : (
          <File size={16} className="text-neutral-400 ml-1 min-w-4 min-h-4" />
        )}
        <span className="text-sm pl-1 text-neutral-200 overflow-hidden text-ellipsis whitespace-nowrap">
          {item.name}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {sortItems(item.children).map((child, index) => (
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
