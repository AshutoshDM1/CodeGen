"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Sidebar from "@/components/worspace/Sidebar";
import AiChat from "@/components/worspace/AiChat";
import CodeEditor from "@/components/worspace/codeEditor";
import { useWebContainer } from "@/hooks/useWebContainer";
import { useEffect, useState } from "react";
import WebContainer from "@/components/worspace/webContainer";

const Dashboard = () => {
  
  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <Sidebar />
        <AiChat />
        <CodeEditor />
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
