/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from 'react';
import { WebContainer, FileSystemTree } from '@webcontainer/api';
import { useTerminalStore } from '@/store/terminalStore';
import { useProjectStore } from '@/store/projectStore';
import { updateCode } from '@/services/api';
import JSZip from 'jszip';

type DevProcess = {
  kill: () => void;
  output: ReadableStream<string>;
  exit: Promise<number>;
};

export function useWebContainerOperations(webcontainer: WebContainer | null) {
  const addCommand = useTerminalStore((state) => state.addCommand);
  const setUrl = useTerminalStore((state) => state.setUrl);
  const setIsLoading = useTerminalStore((state) => state.setIsLoadingWebContainer);
  const setIsSavingFiles = useTerminalStore((state) => state.setIsSavingFiles);
  const setIsLoadingWebContainer = useTerminalStore((state) => state.setIsLoadingWebContainer);
  const setIsLoadingWebContainerMessage = useTerminalStore(
    (state) => state.setIsLoadingWebContainerMessage,
  );
  const { project } = useProjectStore();

  const devProcessRef = useRef<DevProcess | null>(null);
  const serverReadyRef = useRef(false);

  const startDevServer = useCallback(async () => {
    if (!webcontainer) return;

    const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
    devProcessRef.current = devProcess;

    // Set up server-ready listener only once
    if (!serverReadyRef.current) {
      webcontainer.on('server-ready', (port: number, serverUrl: string) => {
        const cleanUrl = `Server is ready at: ${serverUrl}`;
        addCommand(cleanUrl);
        setUrl(serverUrl);
        setIsLoading(false);
        serverReadyRef.current = true;
        setIsSavingFiles(false);
      });
    }

    // Handle process output
    devProcess.output.pipeTo(
      new WritableStream({
        write(chunk) {
          addCommand(chunk);
        },
      }),
    );
  }, [webcontainer, addCommand, setIsLoading, setIsSavingFiles, setUrl]);

  const remountFiles = useCallback(
    async (editorCode: any) => {
      if (!webcontainer) return;
      try {
        setIsLoadingWebContainerMessage('Recompiling files...');
        setIsLoadingWebContainer(true);
        addCommand('> 📦 Remounting files...');

        // Kill the current dev server if it exists
        if (devProcessRef.current) {
          await devProcessRef.current.kill();
        }

        // Reset server ready state
        serverReadyRef.current = false;

        // Mount the files
        const files = editorCode as unknown as FileSystemTree;

        await webcontainer.mount(files);
        addCommand('> ✅ Files remounted successfully');

        const installProcess = await webcontainer.spawn('npm', ['install']);
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error('Installation failed');
        }

        // Restart the dev server
        await startDevServer();
        addCommand('> 🚀 Restarting development server...');
        setIsLoadingWebContainer(false);
      } catch (error) {
        console.error('Remount failed:', error);
        addCommand('> ❌ Error remounting files: ' + (error as Error).message);
        setIsLoading(false);
        setIsSavingFiles(false);
      } finally {
        setTimeout(() => {
          setIsLoadingWebContainer(false);
        }, 2000);
      }
    },
    [
      webcontainer,
      addCommand,
      setIsLoading,
      setIsSavingFiles,
      startDevServer,
      setIsLoadingWebContainer,
      setIsLoadingWebContainerMessage,
      project,
    ],
  );
  
  const saveFiles = useCallback(
    async (editorCode: any) => {
      if (!webcontainer) return;
      try {
        setIsLoadingWebContainerMessage('Saving files...');
        setIsLoadingWebContainer(true);
        addCommand('> 📦 Saving files...');

        // Kill the current dev server if it exists
        if (devProcessRef.current) {
          await devProcessRef.current.kill();
        }

        // Reset server ready state
        serverReadyRef.current = false;

        // Mount the files
        const files = editorCode as unknown as FileSystemTree;

        // Update code on the server
        const projectId = project?.id;
        if (!projectId) {
          throw new Error('Project ID is undefined');
        }
        const response = await updateCode(projectId, editorCode);
        console.log(response);

        await webcontainer.mount(files);
        addCommand('> ✅ Files saved successfully');

        const installProcess = await webcontainer.spawn('npm', ['install']);
        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          throw new Error('Installation failed');
        }

        // Restart the dev server
        await startDevServer();
        addCommand('> 🚀 Restarting development server...');
        setIsLoadingWebContainer(false);
      } catch (error) {
        console.error('Remount failed:', error);
        addCommand('> ❌ Error remounting files: ' + (error as Error).message);
        setIsLoading(false);
        setIsSavingFiles(false);
      } finally {
        setTimeout(() => {
          setIsLoadingWebContainer(false);
        }, 2000);
      }
    },
    [
      webcontainer,
      addCommand,
      setIsLoading,
      setIsSavingFiles,
      startDevServer,
      setIsLoadingWebContainer,
      setIsLoadingWebContainerMessage,
      project,
    ],
  );

  const npmRunDev = useCallback(async () => {
    try {
      if (!webcontainer) return;
      const devProcess = await webcontainer.spawn('npm', ['run', 'dev']);
      devProcessRef.current = devProcess;
      devProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            addCommand(chunk);
          },
        }),
      );
      addCommand('> 🚀 Running npm run dev...');
    } catch (error) {
      console.error('> ❌ Error running npm run dev:', error);
    }
  }, [webcontainer, addCommand]);

  const npmInstall = useCallback(async () => {
    try {
      if (!webcontainer) return;
      const installProcess = await webcontainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            addCommand(chunk);
          },
        }),
      );
      addCommand('> 🚀 Running npm install...');
    } catch (error) {
      console.error('> ❌ Error running npm install:', error);
    }
  }, [webcontainer, addCommand]);

  const exportProject = useCallback(async () => {
    if (!webcontainer) return;
    try {
      addCommand('> 📦 Preparing project for export...');
      addCommand('> 🔍 Excluding node_modules to reduce file size...');
      const combinedZip = new JSZip();

      // Add each file and directory to the zip directly (except node_modules)
      addCommand('> 📄 Collecting project files...');

      // Function to recursively add files to zip
      const addToZip = async (path: string, zipTarget: JSZip) => {
        const entries = await webcontainer.fs.readdir(path, {
          withFileTypes: true,
        });

        for (const entry of entries) {
          const fullPath = path === '.' ? entry.name : `${path}/${entry.name}`;

          // Skip node_modules
          if (entry.name === 'node_modules') {
            continue;
          }

          if (entry.isDirectory()) {
            // Recursively process directories
            await addToZip(fullPath, zipTarget);
          } else {
            // Add file directly to zip at the correct path
            const content = await webcontainer.fs.readFile(fullPath);
            zipTarget.file(fullPath, content);
          }
        }
      };

      // Start recursive process from root
      await addToZip('.', combinedZip);

      // Generate the combined zip file
      addCommand('> 🔒 Creating ZIP archive without node_modules...');
      const combinedZipBlob = await combinedZip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      addCommand('> ✅ Project export successful (without node_modules)');
      addCommand("> 💡 Run 'npm install' after extracting to install dependencies");

      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(combinedZipBlob);
      link.download = 'project-codebase.zip';

      // Trigger the download
      link.click();

      // Clean up the URL object
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
      addCommand('> ✅ Export completed');
    } catch (error) {
      console.error('Export failed:', error);
      addCommand(`> ❌ Export failed: ${(error as Error).message}`);
      addCommand('> 💡 Tip: Try a simple export with node_modules if this fails');
    }
  }, [webcontainer, addCommand]);


  return {
    startDevServer,
    remountFiles,
    npmRunDev,
    npmInstall,
    exportProject,
    devProcessRef,
    serverReadyRef,
    saveFiles,
  };
}
