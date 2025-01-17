import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import FileExplorer from "../FileExplorer";
import DevNavbar from "./DevNavbar";
import { useEffect, useState } from "react";
import {
  findFileContent,
  Show,
  useChatStore,
  useFilePaths,
  useShowPreview,
} from "@/store/chatStore";
import WebContainer from "./webContainer";
import Terminal from "./Terminal";
import { projectFiles } from "@/store/chatStore";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

const CodeEditor = () => {
  const { showPreview } = useShowPreview();
  const { filePaths } = useFilePaths();
  const [showFileExplorer] = useState(true);
  const [value, setValue] = useState(
    findFileContent(projectFiles, filePaths) ?? ""
  );
  useEffect(() => {
    setValue(findFileContent(projectFiles, filePaths) ?? "");
  }, [filePaths]);

  const highlight = (code: string) => {
    return Prism.highlight(
      code,
      Prism.languages[getLanguageFromPath(filePaths)],
      getLanguageFromPath(filePaths)
    );
  };

  const renderLineNumbers = () => {
    const lines = value.split("\n").length;
    return Array.from({ length: lines + 1 }, (_, i) => (
      <div key={i} className="line-number">
        {i + 1}
      </div>
    ));
  };

  return (
    <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
      <div className="h-full">
        <div className="h-[5vh] w-full border-b border-border bg-black">
          <DevNavbar />
        </div>
        <div className="h-[95vh] w-full bg-[#000]">
          {showPreview === Show.CODE ? (
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[95vh]"
            >
              {showFileExplorer && (
                <ResizablePanel minSize={15} maxSize={100} defaultSize={18}>
                  <FileExplorer />
                </ResizablePanel>
              )}
              <ResizableHandle />
              <ResizablePanel minSize={15} maxSize={100} defaultSize={80}>
                <div className="h-[95vh] w-full overflow-auto p-4 pt-0">
                  <div className="relative">
                    <div
                      className="absolute left-0 -top-1 bottom-0 p-4 text-right text-gray-500 select-none"
                      style={{ width: "50px" }}
                    >
                      {renderLineNumbers()}
                    </div>
                    <Editor
                      value={value}
                      onValueChange={(code) => setValue(code)}
                      highlight={highlight}
                      padding={10}
                      style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 16,
                        backgroundColor: "#000",
                        minHeight: "95vh",
                        color: "#fff",
                        marginLeft: "50px",
                      }}
                      className="editor"
                      textareaClassName="editor__textarea"
                      preClassName="editor__pre"
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : null}
          {showPreview === Show.PREVIEW ? <WebContainer /> : null}
          {showPreview === Show.TERMINAL ? <Terminal /> : null}
        </div>
      </div>
    </ResizablePanel>
  );
};

// Helper function to determine language based on file extension
function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "css":
      return "css";
    case "json":
      return "json";
    default:
      return "javascript";
  }
}

export default CodeEditor;
