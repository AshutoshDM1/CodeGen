import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";
import { useState } from "react";

interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

interface FileTreeProps {
  item: FileItem;
  depth?: number;
}

const FileTree = ({ item, depth = 0 }: FileTreeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-2">
      <div
        className="flex items-center gap-1 py-1 hover:bg-neutral-700/50 cursor-pointer rounded-md px-2 "
        style={{ paddingLeft: `${depth * 12}px` }}
        onClick={() => item.type === "folder" && setIsOpen(!isOpen)}
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
      {isOpen &&
        item.children?.map((child, index) => (
          <FileTree key={index} item={child} depth={depth + 1} />
        ))}
    </div>
  );
};

const FileExplorer = () => {
  const files: FileItem[] = [
    {
      name: "app",
      type: "folder",
      children: [
        {
          name: "components",
          type: "folder",
          children: [{ name: "navbar.tsx", type: "file" }],
        },
        { name: "layout.tsx", type: "file" },
      ],
    },
  ];

  return (
    <div className="text-white h-full select-none ">
      <div className="p-2 px-3 text-sm text-neutral-400 border-b-[1.5px] border-border mb-2 ">
        Files
      </div>
      {files.map((item, index) => (
        <FileTree key={index} item={item} />
      ))}
    </div>
  );
};

export default FileExplorer;
