import { Code2, Layout, Share, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import { Show, useShowPreview } from "@/store/chatStore";
const DevNavbar = () => {
  const { setShowPreview, setShowCode, setShowTerminal, showPreview } =
    useShowPreview();
  return (
    <div className="py-2 flex items-center justify-between px-4">
      <div className="flex items-center gap-1">
        {/* Left side - Collapse button and navigation items */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-neutral-400 hover:text-white"
        >
          <span className="text-lg">≫</span>
        </Button>

        <div className="flex items-center gap-2 ml-2">
          <NavItem
            active={showPreview === Show.PREVIEW}
            onClick={setShowPreview}
            icon={<Layout size={16} />}
            label="Preview"
          />
          <NavItem
            active={showPreview === Show.CODE}
            onClick={setShowCode}
            icon={<Code2 size={16} />}
            label="Code"
          />
          <NavItem
            active={showPreview === Show.TERMINAL}
            onClick={setShowTerminal}
            icon={<Terminal size={16} />}
            label="Console"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Right side - Action buttons */}
        <div className="flex items-center justify-center rounded-md px-3 py-2 hover:bg-foreground/10 cursor-pointer">
          <Share className="h-5 w-5" />
        </div>
        <Button
          variant="default"
          className="bg-white hover:bg-neutral-200 text-black rounded-md px-3 py-1 text-sm font-medium"
        >
          Deploy
        </Button>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        hover:bg-foreground/10
        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm
        ${active ? " text-white" : "text-neutral-400 hover:text-white"}
      `}
    >
      {icon}
      {label}
    </button>
  );
};

export default DevNavbar;
