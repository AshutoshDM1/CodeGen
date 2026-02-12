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
      console.log(`[EditorStore] setEditorCode called for: ${filePath}`);
      console.log(`[EditorStore] Code length: ${code.length}`);
      
      // Clean the code before storing it
      const cleanedCode = cleanCodeContent(code);
      
      console.log(`[EditorStore] Cleaned code length: ${cleanedCode.length}`);

      const parts = filePath.split('/');
      let current = { ...state.EditorCode };

      if (parts.length > 1) {
        console.log(`[EditorStore] Nested file detected, parts:`, parts);
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
        console.log(`[EditorStore] ✓ Nested file set: ${fileName}`);
      } else {
        // Handle root level files with cleaned code
        console.log(`[EditorStore] Root level file detected: ${filePath}`);
        console.log(`[EditorStore] Old content:`, current[filePath]?.file?.contents?.substring(0, 100));
        current[filePath] = { file: { contents: cleanedCode } };
        console.log(`[EditorStore] New content:`, current[filePath]?.file?.contents?.substring(0, 100));
        console.log(`[EditorStore] ✓ Root file set at key: ${filePath}`);
        console.log(`[EditorStore] All root keys:`, Object.keys(current));
      }

      // Sync with file explorer after update
      const newState = { EditorCode: current };
      setTimeout(() => syncFileExplorerFromEditorCode(current), 0);
      console.log(`[EditorStore] ✓ State updated and sync scheduled`);
      return newState;
    }),
}));
