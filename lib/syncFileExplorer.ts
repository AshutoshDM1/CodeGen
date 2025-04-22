import { projectFiles, FileContent } from '@/types/webContainerFiles';
import { FileItem } from '@/types/fileStructure';
import { useFileExplorer } from '@/store/fileExplorerStore';

/**
 * Converts EditorCode structure to FileExplorer structure and updates the store
 * @param editorCode - The EditorCode structure from editorStore
 */
export function syncFileExplorerFromEditorCode(editorCode: projectFiles): void {
  // Convert editorCode to fileExplorer structure
  const fileExplorerItems = convertEditorCodeToFileExplorer(editorCode);

  // Update the file explorer store
  const { setFileExplorer } = useFileExplorer.getState();
  setFileExplorer(fileExplorerItems);
}

/**
 * Converts EditorCode structure to FileExplorer structure
 * @param editorCode - The EditorCode structure from editorStore
 * @returns The FileExplorer structure
 */
export function convertEditorCodeToFileExplorer(editorCode: projectFiles): FileItem[] {
  const result: FileItem[] = [];

  // Process each item in the editor code
  Object.entries(editorCode).forEach(([key, value]) => {
    if (value.file) {
      // This is a file
      result.push({
        name: key,
        type: 'file',
      });
    } else if (value.directory) {
      // This is a directory
      result.push({
        name: key,
        type: 'folder',
        children: processDirectory(value.directory),
      });
    }
  });

  return result;
}

/**
 * Recursively processes a directory structure
 * @param directory - The directory object from EditorCode
 * @returns The FileExplorer structure for this directory
 */
function processDirectory(directory: Record<string, FileContent>): FileItem[] {
  const result: FileItem[] = [];

  Object.entries(directory).forEach(([key, value]) => {
    if (value.file) {
      // This is a file
      result.push({
        name: key,
        type: 'file',
      });
    } else if (value.directory) {
      // This is a directory
      result.push({
        name: key,
        type: 'folder',
        children: processDirectory(value.directory),
      });
    }
  });

  return result;
}
