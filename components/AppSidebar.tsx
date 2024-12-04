import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookOpen, Flag, FolderClosed, PlusIcon } from "lucide-react";
const AppSidebar = () => {
  return (
    <>
      <div className="h-full bg-black flex flex-col gap-1 px-4 pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="h-10 w-full flex items-center justify-center ">
                <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px] ">
                  <PlusIcon className="w-[15px] h-[15px] font-[300] " />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="text-[14px] font-[500] text-[#0a0a0a] font-sans ml-2 "
              side="right"
            >
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="h-10 w-full flex items-center justify-center ">
                <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px] ">
                  <BookOpen className="w-[15px] h-[15px] font-[300] " />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="text-[14px] font-[500] text-[#0a0a0a] font-sans ml-2 "
              side="right"
            >
              <p>Library</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="h-10 w-full flex items-center justify-center ">
                <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px] ">
                  <FolderClosed className="w-[15px] h-[15px] font-[300] " />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="text-[14px] font-[500] text-[#0a0a0a] font-sans ml-2 "
              side="right"
            >
              <p>Projects</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <div className="h-10 w-full flex items-center justify-center ">
                <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px] ">
                  <Flag className="w-[15px] h-[15px] font-[300] " />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className="text-[14px] font-[500] text-[#0a0a0a] font-sans ml-2 "
              side="right"
            >
              <p>Feedback</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
};

export default AppSidebar;
