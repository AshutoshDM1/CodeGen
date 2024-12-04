"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Sidebar from "@/components/worspace/Sidebar";
import AiChat from "@/components/worspace/AiChat";
import CodeEditor from "@/components/worspace/codeEditor";

const Dashboard = () => {
  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/* # This is the Sidebar */}
        <Sidebar />
        {/* # This is the AiChat */}
        <AiChat />
        {/* # This is the Code Area with the code editor monaco */}
        <CodeEditor />
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
