import { Editor } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import FileExplorer from "../FileExplorer";
import DevNavbar from "./DevNavbar";
import { useEffect, useState } from "react";
import {
  // FileContent,
  findFileContent,
  Show,
  useEditorCode,
  useFilePaths,
  useShowPreview,
} from "@/store/chatStore";
import WebContainer from "./webContainer";
import Terminal from "./Terminal";
import { projectFiles } from "@/store/chatStore";
import { customTheme } from "@/lib/monacoCustomTheme";
import { GeistMono } from "geist/font/mono";

// Helper function to determine language based on file extension
function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
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

const CodeEditor = () => {
  const { showPreview } = useShowPreview();
  const { filePaths } = useFilePaths();
  const [showFileExplorer] = useState(true);
  const { EditorCode, setEditorCode } = useEditorCode();
  const code = findFileContent(EditorCode as projectFiles, filePaths) ?? "";
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [monacoInstance, setMonacoInstance] = useState<typeof monaco | null>(
    null
  );

  useEffect(() => {
    if (editor && monacoInstance) {
      const model = editor.getModel();
      if (model) {
        monacoInstance.editor.setModelLanguage(
          model,
          getLanguageFromPath(filePaths)
        );
      }
    }
  }, [filePaths, editor, showPreview, monacoInstance]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      const filePath = filePaths;
      setEditorCode(filePath, value);
    }
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
                <ResizablePanel minSize={20} maxSize={100} defaultSize={18}>
                  <FileExplorer />
                </ResizablePanel>
              )}
              <ResizableHandle />
              <ResizablePanel minSize={15} maxSize={100} defaultSize={80}>
                <Editor
                  className={GeistMono.className}
                  height="95vh"
                  defaultLanguage={getLanguageFromPath(filePaths)}
                  value={code}
                  onMount={(editor, monaco) => {
                    setEditor(editor);
                    setMonacoInstance(monaco);
                    monaco.editor.defineTheme("custom-chai-theme", customTheme);
                    monaco.editor.setTheme("custom-chai-theme");

                    // Disable all validations for TypeScript/JavaScript
                    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                      {
                        noSemanticValidation: true,
                        noSyntaxValidation: true,
                        noSuggestionDiagnostics: true,
                      }
                    );
                    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                      {
                        noSemanticValidation: true,
                        noSyntaxValidation: true,
                        noSuggestionDiagnostics: true,
                      }
                    );

                    // Disable all markers without modifying the model
                    monaco.editor.setModelMarkers(editor.getModel()!, "", []);
                  }}
                  onChange={handleEditorChange}
                  options={{
                    wordWrap: "on",
                    fontSize: 14,
                    fontFamily: "GeistMono",
                    fontWeight: "400",
                    lineNumbers: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    renderLineHighlight: "all",
                    cursorStyle: "line",
                    automaticLayout: true,
                    padding: { top: 16 },
                    folding: true,
                    bracketPairColorization: {
                      enabled: true,
                    },
                    quickSuggestions: false,
                    parameterHints: { enabled: false },
                    suggestOnTriggerCharacters: false,
                    acceptSuggestionOnEnter: "off",
                    tabCompletion: "off",
                    wordBasedSuggestions: "off",
                  }}
                  beforeMount={(monaco) => {
                    // Load language support before mounting
                    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
                      {
                        jsx: monaco.languages.typescript.JsxEmit.React,
                        jsxFactory: "React.createElement",
                        reactNamespace: "React",
                        allowNonTsExtensions: true,
                        allowJs: true,
                        target: monaco.languages.typescript.ScriptTarget.Latest,
                      }
                    );
                  }}
                />
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

export default CodeEditor;
