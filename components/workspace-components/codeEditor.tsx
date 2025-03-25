import { Editor } from "@monaco-editor/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as monaco from "monaco-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import FileExplorer from "../FileExplorer";
import DevNavbar from "./DevNavbar";
import { useEffect, useState, useCallback } from "react";
import {
  findFileContent,
  Show,
  useEditorCode,
  useFilePaths,
  useShowPreview,
  useFileExplorer,
  useFileExplorerState,
} from "@/store/chatStore";

import WebContainer from "./webContainer";
import Terminal from "./Terminal";
import { projectFiles } from "@/store/chatStore";
import { customTheme } from "@/lib/monacoCustomTheme";
import { GeistMono } from "geist/font/mono";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const CodeEditor = () => {
  const { filePaths, fileupdating } = useFilePaths();
  const { openFolders } = useFileExplorerState();
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [FolderPopoverOpen, setFolderPopoverOpen] = useState(false);
  const [FilePopoverOpen, setFilePopoverOpen] = useState(false);
  const [RenamePopoverOpen, setRenamePopoverOpen] = useState(false);
  const [RenameFolderPopoverOpen, setRenameFolderPopoverOpen] = useState(false);
  const getLanguageFromPath = useCallback(
    (path: string): string => {
      if (fileupdating === true) {
        return "javascriptttt";
      }
      const ext = path.split(".").pop()?.toLowerCase();
      switch (ext) {
        case "js":
          return "javascript";
        case "jsx":
          return "javascript";
        case "ts":
          return "typescript";
        case "tsx":
          return "typescript";
        case "css":
          return "css";
        case "json":
          return "json";
        default:
          return "javascript";
      }
    },
    [fileupdating]
  );
  const {
    addFileExplorer,
    deleteFileExplorer,
    renameFileExplorer,
    renameFolderExplorer,
    newFolderExplorer,
  } = useFileExplorer();
  const [showFileExplorer] = useState(true);
  const { showPreview } = useShowPreview();
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
  }, [filePaths, editor, showPreview, monacoInstance, getLanguageFromPath]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      const filePath = filePaths;
      setEditorCode(filePath, value);
    }
  };
  const { toast } = useToast();
  const handleFolderRename = (newName: string) => {
    const currentPath = Array.from(openFolders).pop();
    if (!currentPath) {
      toast({
        variant: "destructive",
        title: "No folder is currently open. Please open a folder first.",
      });
      setRenameFolderPopoverOpen(false);
      return;
    }

    if (newName.trim()) {
      renameFolderExplorer(currentPath, newName.trim());
      setNewFolderName("");
      setRenameFolderPopoverOpen(false);
      toast({
        title: `Folder renamed to ${newName}`,
      });
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
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <FileExplorer />
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem asChild>
                        <Popover
                          open={FilePopoverOpen}
                          onOpenChange={setFilePopoverOpen}
                        >
                          <PopoverTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none w-full hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            New File
                          </PopoverTrigger>
                          <PopoverContent className="w-60">
                            <div className="flex flex-col gap-2">
                              <Input
                                type="text"
                                placeholder="File Name"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && fileName.trim()) {
                                    addFileExplorer(fileName.trim());
                                    setFileName("");
                                    setFilePopoverOpen(false);
                                  }
                                }}
                              />
                              <Button
                                className="bg-transparent text-white"
                                onClick={() => {
                                  if (folderName.trim()) {
                                    newFolderExplorer(folderName.trim());
                                    setFolderName("");
                                    setFolderPopoverOpen(false);
                                  }
                                }}
                              >
                                Press Enter to Create
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </ContextMenuItem>
                      <ContextMenuItem asChild>
                        <Popover
                          open={FolderPopoverOpen}
                          onOpenChange={setFolderPopoverOpen}
                        >
                          <PopoverTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none w-full hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            New Folder
                          </PopoverTrigger>
                          <PopoverContent className="w-60">
                            <div className="flex flex-col gap-2">
                              <Input
                                type="text"
                                placeholder="Folder Name"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && folderName.trim()) {
                                    newFolderExplorer(folderName.trim());
                                    setFolderName("");
                                    setFolderPopoverOpen(false);
                                  }
                                }}
                              />
                              <Button
                                className="bg-transparent text-white"
                                onClick={() => {
                                  if (folderName.trim()) {
                                    newFolderExplorer(folderName.trim());
                                    setFolderName("");
                                    setFolderPopoverOpen(false);
                                  }
                                }}
                              >
                                Press Enter to Create
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </ContextMenuItem>
                      <ContextMenuItem asChild>
                        <Popover
                          open={RenamePopoverOpen}
                          onOpenChange={setRenamePopoverOpen}
                        >
                          <PopoverTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none w-full hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            Rename File
                          </PopoverTrigger>
                          <PopoverContent className="w-60">
                            <div className="flex flex-col gap-2">
                              <Input
                                type="text"
                                placeholder="New File Name"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && newItemName.trim()) {
                                    renameFileExplorer(
                                      filePaths,
                                      newItemName.trim()
                                    );
                                    setNewItemName("");
                                    setRenamePopoverOpen(false);
                                  }
                                }}
                              />
                              <Button
                                className="bg-transparent text-white"
                                onClick={() => {
                                  if (newItemName.trim()) {
                                    renameFileExplorer(
                                      filePaths,
                                      newItemName.trim()
                                    );
                                    setNewItemName("");
                                    setRenamePopoverOpen(false);
                                  }
                                }}
                              >
                                Press Enter to Rename File
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </ContextMenuItem>
                      <ContextMenuItem asChild>
                        <Popover
                          open={RenameFolderPopoverOpen}
                          onOpenChange={setRenameFolderPopoverOpen}
                        >
                          <PopoverTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none w-full hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            Rename Folder
                          </PopoverTrigger>
                          <PopoverContent className="w-60">
                            <div className="flex flex-col gap-2">
                              <Input
                                type="text"
                                placeholder="New Folder Name"
                                value={newFolderName}
                                onChange={(e) =>
                                  setNewFolderName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    newFolderName.trim()
                                  ) {
                                    handleFolderRename(newFolderName);
                                  }
                                }}
                              />
                              <Button
                                className="bg-transparent text-white"
                                onClick={() => {
                                  if (newFolderName.trim()) {
                                    handleFolderRename(newFolderName);
                                  }
                                }}
                              >
                                Press Enter to Rename Folder
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          deleteFileExplorer(filePaths);
                        }}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
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
                    // renderLineHighlight: "all",
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
