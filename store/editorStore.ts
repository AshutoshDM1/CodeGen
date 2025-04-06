import { create } from 'zustand';
import { FileContent, projectFiles } from '@/types/webContainerFiles';
import { defaultProjectFiles } from '@/helper/defaultProjectFiles';
import { cleanCodeContent } from '@/lib/cleanCodeContent';
import { findFileContent } from '@/lib/findFileContent';

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
  setCode: (code: projectFiles) => set({ EditorCode: code }),
  setEditorCode: (filePath, code) =>
    set((state) => {
      // Clean the code before storing it
      const cleanedCode = cleanCodeContent(code);

      const parts = filePath.split('/');
      let current = { ...state.EditorCode };

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
        // Handle root level files with cleaned code
        current[filePath] = { file: { contents: cleanedCode } };
      }

      return { EditorCode: current };
    }),
}));
