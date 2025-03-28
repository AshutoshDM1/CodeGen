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
  useTerminalStore,
} from "@/store/chatStore";

import WebContainer from "./webContainer";
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
import { Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalMain from "./TerminalMain";

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
  const { isSavingFiles, setIsSavingFiles } = useTerminalStore();
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
  const { showPreview, showWorkspace, setShowWorkspace } = useShowPreview();
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
    <>
      {showWorkspace ? (
        <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="h-full"
          >
            <div className="min-h-[5vh] w-full border-b border-border bg-black">
              <DevNavbar setShowWorkspace={setShowWorkspace} />
            </div>

            <div className="h-[95vh] w-full bg-[#000]">
              <AnimatePresence mode="wait">
                {showPreview === Show.CODE && (
                  <motion.div
                    key="code-editor"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="min-h-[95vh]"
                    >
                      {showFileExplorer && (
                        <ResizablePanel
                          minSize={20}
                          maxSize={100}
                          defaultSize={18}
                        >
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
                                        onChange={(e) =>
                                          setFileName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            fileName.trim()
                                          ) {
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
                                            newFolderExplorer(
                                              folderName.trim()
                                            );
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
                                        onChange={(e) =>
                                          setFolderName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            folderName.trim()
                                          ) {
                                            newFolderExplorer(
                                              folderName.trim()
                                            );
                                            setFolderName("");
                                            setFolderPopoverOpen(false);
                                          }
                                        }}
                                      />
                                      <Button
                                        className="bg-transparent text-white"
                                        onClick={() => {
                                          if (folderName.trim()) {
                                            newFolderExplorer(
                                              folderName.trim()
                                            );
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
                                        onChange={(e) =>
                                          setNewItemName(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                          if (
                                            e.key === "Enter" &&
                                            newItemName.trim()
                                          ) {
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
                      <ResizablePanel
                        minSize={15}
                        maxSize={100}
                        defaultSize={80}
                      >
                        <div className="py-2 px-3 text- text-neutral-200 border-b-[1.5px] border-border font-[inherit]  flex items-center justify-between">
                          <h1 className="text-md">{filePaths}</h1>
                          <button
                            disabled={isSavingFiles}
                            onClick={() => {
                              setIsSavingFiles(true);
                              const event = new CustomEvent(
                                "remount-webcontainer",
                                {
                                  detail: { files: EditorCode },
                                }
                              );
                              window.dispatchEvent(event);
                            }}
                            className="py-1 px-3 rounded-md bg-gradient-to-r from-emerald-700 to-cyan-500 text-white duration-&lsqb;300ms&rsqb; hover:shadow-lg hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
                          >
                            <h1 className="text-md">Save</h1>
                            {isSavingFiles ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              </>
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <Editor
                          className={GeistMono.className}
                          height="95vh"
                          defaultLanguage={getLanguageFromPath(filePaths)}
                          value={code}
                          loading={
                            <div className="h-full w-full flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
                                <p className="text-sm text-neutral-400">
                                  Initializing editor...
                                </p>
                              </div>
                            </div>
                          }
                          onMount={(editor, monaco) => {
                            setEditor(editor);
                            setMonacoInstance(monaco);
                            monaco.editor.defineTheme(
                              "custom-chai-theme",
                              customTheme
                            );
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
                            monaco.editor.setModelMarkers(
                              editor.getModel()!,
                              "",
                              []
                            );
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
                                target:
                                  monaco.languages.typescript.ScriptTarget
                                    .Latest,
                              }
                            );
                          }}
                        />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </motion.div>
                )}
                {showPreview === Show.PREVIEW && (
                  <motion.div
                    key="preview"
                    className="h-full w-full"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <WebContainer />
                  </motion.div>
                )}
                {showPreview === Show.TERMINAL && (
                  <motion.div
                    key="terminal"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <TerminalMain />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </ResizablePanel>
      ) : null}
    </>
  );
};

export default CodeEditor;
