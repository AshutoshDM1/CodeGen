"use client";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Sidebar from "@/components/worspace/Sidebar";
import AiChat from "@/components/worspace/AiChat";
import CodeEditor from "@/components/worspace/codeEditor";
import Alert from "./components/Alert";

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
