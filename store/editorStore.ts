import { create } from 'zustand';
import { FileContent, projectFiles } from '@/types/webContainerFiles';
import { defaultProjectFiles } from '@/helper/defaultProjectFiles';
import { cleanCodeContent } from '@/lib/cleanCodeContent';
import { findFileContent } from '@/lib/findFileContent';
import { syncFileExplorerFromEditorCode } from '@/lib/syncFileExplorer';

interface EditorCodeStore {
  EditorCode: projectFiles;
  getfileCode: (filePath: string) => string;
  setCode: (code: projectFiles) => void;
  setEditorCode: (filePath: string, code: string) => void;
}

export const useEditorCode = create<EditorCodeStore>((set) => ({
  EditorCode: defaultProjectFiles,
  getfileCode: (filePath: string): string => {
    return findFileContent(useEditorCode.getState().EditorCode, filePath) ?? '';
  },
  setCode: (code: projectFiles) => {
    // Update editor code
    set({ EditorCode: code });

    // Sync with file explorer
    syncFileExplorerFromEditorCode(code);
  },
  setEditorCode: (filePath, code) =>
    set((state) => {
      const normalizedPath = filePath.replace(/^\/+|\/+$/g, '').replace(/\/+/g, '/');
      const parts = normalizedPath.split('/').filter(Boolean);
      if (parts.length === 0) return state;

      const cleanedCode = cleanCodeContent(code);
      const current = { ...state.EditorCode };

      if (parts.length > 1) {
        let parentObj = current;

        // Create directory structure if it doesn't exist
        for (let i = 0; i < parts.length - 1; i++) {
          const dirName = parts[i];

          // Check if directory exists, create it if not
          if (!parentObj[dirName]) {
            parentObj[dirName] = { directory: {} };
          } else if (!parentObj[dirName].directory) {
            parentObj[dirName].directory = {};
          }

          // Move to next level
          parentObj = parentObj[dirName].directory as {
            [key: string]: FileContent;
          };
        }

        // Set the file at the final level with cleaned code
        const fileName = parts[parts.length - 1];
        parentObj[fileName] = { file: { contents: cleanedCode } };
      } else {
        // Handle root level files with cleaned code (e.g. package.json, index.html)
        current[parts[0]] = { file: { contents: cleanedCode } };
      }
      const newState = { EditorCode: current };
      setTimeout(() => syncFileExplorerFromEditorCode(current), 0);
      return newState;
    }),
}));