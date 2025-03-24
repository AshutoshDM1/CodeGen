"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Alert from "@/components/workspace-components/Alert";
import AiChat from "@/components/workspace-components/AiChat";
import CodeEditor from "@/components/workspace-components/codeEditor";
import Sidebar from "@/components/workspace-components/Sidebar";

const Dashboard = () => {
  return (
    <div className="h-screen w-full">
      <Alert />
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <Sidebar />
        <AiChat />
        <CodeEditor />
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;
