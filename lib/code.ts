export const code = `"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NavbarAiChat from "@/components/worspace/aiChat/Navbar.aiChat";
import AppSidebar from "@/components/worspace/AppSidebar";
import NextImage from "next/image";
import Editor, { Monaco } from "@monaco-editor/react";

const customTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: 'dcdcdc', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'df769b', fontStyle: 'bold' },
    { token: 'string', foreground: '49e9a6' },
    { token: 'number', foreground: '7060eb' },
    { token: 'variable', foreground: 'e4b781' },
    { token: 'function', foreground: '16a3b6', fontStyle: 'bold' },
    { token: 'type', foreground: 'd67e5c', fontStyle: 'italic' },
    { token: 'tag', foreground: 'e66533', fontStyle: 'bold' }
  ],
  colors: {
    'editor.background': '#010107',
    'editor.foreground': '#becfda',
    'editorLineNumber.foreground': '#4d6c80',
    'editorLineNumber.activeForeground': '#61a6d1',
    'editorCursor.foreground': '#EA7773',
    'editor.selectionBackground': '#1679b6cc',
    'editor.lineHighlightBackground': '#003c61ee',
    'editor.lineHighlightBorder': '#003c61',
    'editorIndentGuide.background': '#183c53',
    'editorIndentGuide.activeBackground': '#28658a'
  }
};

const Dashboard = () => {
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme('custom-chai-theme', customTheme);
  };

  return (
    <div className="h-screen w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      {/* # This Side Bar */}
        <ResizablePanel
          className="bg-black min-w-[50px] "
          defaultSize={3}
          minSize={3}
          maxSize={10}
        >
          <div className="flex items-center justify-center pt-2">
            <NextImage
              src="https://res.cloudinary.com/dnvl8mqba/image/upload/v1733239329/CodeGen/codegen_kf1lk0.png"
              alt="logo"
              width={30}
              height={30}
            />
          </div>
          <AppSidebar />
        </ResizablePanel>
        <ResizableHandle />
        {/* # This is the AI content */}
        <ResizablePanel defaultSize={47} minSize={27} maxSize={67}>
          <div className="flex flex-col h-full items-center p-6">
            <NavbarAiChat />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        {/* # This is the Code Area with the code editor monaco */}
        <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
          <div className="flex h-full items-center justify-center p-6">
            <Editor
              height="100vh"
              defaultLanguage="typescript"
              defaultValue="// Your code here"
              theme="custom-chai-theme"
              beforeMount={handleEditorWillMount}
              options={{
                fontSize: 14,
                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                cursorStyle: 'line',
                automaticLayout: true,
                padding: { top: 16 },
                folding: true,
                bracketPairColorization: {
                  enabled: true
                }
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Dashboard;`
