import { customTheme } from "@/lib/monacoCustomTheme";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { code } from "@/lib/code";
import FileExplorer from "../FileExplorer";
import DevNavbar from "./DevNavbar";

const CodeEditor = () => {
  return (
    <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
      <div className="h-full ">
        <div className="h-[5vh] w-full border-b border-border bg-black ">
          <DevNavbar />
        </div>
        <div className="h-[95vh] w-full bg-[#000] ">
          <ResizablePanelGroup direction="horizontal" className="min-h-[95vh] ">
            <ResizablePanel
              className="min-w-[170px]"
              defaultSize={20}
              minSize={15}
              maxSize={60}
            >
              <FileExplorer />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel minSize={15} maxSize={100} defaultSize={80}>
              <Editor
                height="95vh"
                defaultLanguage="typescript"
                defaultValue={code}
                onMount={(editor, monaco) => {
                  monaco.editor.defineTheme("custom-chai-theme", customTheme);
                  monaco.editor.setTheme("custom-chai-theme");
                  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                    {
                      noSemanticValidation: true,
                      noSyntaxValidation: true,
                      noSuggestionDiagnostics: true,
                    }
                  );
                }}
                options={{
                  wordWrap: "on",
                  fontSize: 16,
                  fontFamily: "Mono Lisa",
                  fontWeight: "400",
                  lineNumbers: "on",
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  renderLineHighlight: "all",
                  cursorStyle: "line",
                  automaticLayout: true,
                  padding: { top: 16 },
                  folding: true,
                  bracketPairColorization: {
                    enabled: true,
                  },
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ResizablePanel>
  );
};

export default CodeEditor;
