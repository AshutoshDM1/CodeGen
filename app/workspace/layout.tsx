'use client';
import { useChatStore } from '@/store/chatStore';
import { useEffect, useCallback, ReactNode, useRef } from 'react';
import { useWebContainer } from '@/hooks/useWebContainer';
import { useEditorCode } from '@/store/editorStore';
import { useTerminalStore } from '@/store/terminalStore';
import { FileSystemTree, WebContainer } from '@webcontainer/api';
import JSZip from 'jszip';
import SidebarMain from '@/components/workspace-components/SidebarMain';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { useFullPreview } from '@/store/showTabStore';
import { toast } from 'sonner';

const Layout = ({ children }: { children: ReactNode }) => {
  const { updatingFiles } = useChatStore();
  const { setUpdatedFilesChat } = useChatStore();
  const { fullPreview } = useFullPreview();
  const { webcontainer, loading: webcontainerLoading } = useWebContainer();
  const { setUrl, setIsSavingFiles } = useTerminalStore();
  const setIsLoading = useTerminalStore((state) => state.setIsLoadingWebContainer);
  const { EditorCode } = useEditorCode();
  const addCommand = useTerminalStore((state) => state.addCommand);
  const isInitialized = useRef(false);
  const prevEditorCode = useRef(EditorCode);
  const devProcessRef = useRef<{
    kill: () => void;
    output: ReadableStream<string>;
    exit: Promise<number>;
  } | null>(null);
  const serverReadyRef = useRef(false);
  const { setIsLoadingWebContainer, setIsLoadingWebContainerMessage } = useTerminalStore(
    (state) => state,
  );

  const startDevServer = useCallback(
    async (container: WebContainer) => {
      if (!container) return;

      const devProcess = await container.spawn('npm', ['run', 'dev']);
      devProcessRef.current = devProcess;

      // Set up server-ready listener only once
      if (!serverReadyRef.current) {
        container.on('server-ready', (port: number, serverUrl: string) => {
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
            // const cleanedOutput = cleanTerminalOutput(chunk);
            // if (cleanedOutput) {
            //   addCommand(cleanedOutput);
            // }
            // if (chunk.includes('Error')) {
            //   setIsLoading(false);
            // }
          },
        }),
      );
    },
    [addCommand, setIsLoading, setIsSavingFiles, setUrl],
  );

  // Function to remount files
  const remountFiles = useCallback(async () => {
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
      const files = EditorCode as unknown as FileSystemTree;
      await webcontainer.mount(files);
      addCommand('> ✅ Files remounted successfully');

      const installProcess = await webcontainer.spawn('npm', ['install']);
      // installProcess.output.pipeTo(
      //   new WritableStream({
      //     write(chunk) {
      //       addCommand(chunk);
      //     },
      //   }),
      // );
      const installExitCode = await installProcess.exit;
      if (installExitCode !== 0) {
        throw new Error('Installation failed');
      }
      // Restart the dev server
      await startDevServer(webcontainer);
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
  }, [
    setIsLoadingWebContainer,
    setIsLoadingWebContainerMessage,
    EditorCode,
    addCommand,
    setIsLoading,
    setIsSavingFiles,
    startDevServer,
    webcontainer,
  ]);

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

  // Initial setup - only runs once when the WebContainer is first available
  useEffect(() => {
    const setupWebContainer = async () => {
      if (!webcontainer || isInitialized.current) return;
      try {
        toast.loading('Starting up WebContainer...');
        setIsLoading(true);

        const files = EditorCode as unknown as FileSystemTree;
        await webcontainer.mount(files);

        const installProcess = await webcontainer.spawn('npm', ['install']);
        // installProcess.output.pipeTo(
        //   new WritableStream({
        //     write(chunk) {
        //       addCommand(chunk);
        //     },
        //   }),
        // );
        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error('Installation failed');
        }

        await startDevServer(webcontainer);
        isInitialized.current = true;
        prevEditorCode.current = EditorCode;
        toast.dismiss();
        toast.info('WebContainer started successfully');
      } catch (error) {
        console.error('Setup failed:', error);
        setIsLoading(false);
        toast.dismiss();
        toast.error('Failed to start WebContainer');
      }
    };

    if (!webcontainerLoading && !isInitialized.current) {
      setupWebContainer();
    }
  }, [webcontainer, webcontainerLoading, EditorCode, setIsLoading, startDevServer]);

  const handleExport = useCallback(async () => {
    if (!webcontainer) return;
    try {
      addCommand('> 📦 Preparing project for export...');
      addCommand('> 🔍 Excluding node_modules to reduce file size...');
      // Import JSZip dynamically
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
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

  const handleWebContainerReload = useCallback(async () => {
    if (!webcontainer) return;
    try {
      // Kill current dev process if running
      if (devProcessRef.current) {
        devProcessRef.current.kill();
      }
      setIsLoading(true);
      setIsLoadingWebContainer(true);
      setIsLoadingWebContainerMessage('Rebuilding WebContainer...');
      addCommand('> 🔄 Destroying current WebContainer...');
      await webcontainer.teardown(); // Completely destroy the current WebContainer instance

      // Reset states
      serverReadyRef.current = false;
      setIsLoadingWebContainer(true);

      // Create new WebContainer instance
      addCommand('> 🏗️ Creating new WebContainer instance...');
      const newContainer = await WebContainer.boot();

      // Remount all files
      addCommand('> 📂 Remounting files...');
      await remountFiles();
      addCommand('> ✅ Files remounted successfully');

      // Install dependencies
      addCommand('> 📦 Installing dependencies...');
      await npmInstall();
      addCommand('> ✅ Dependencies installed');

      // Start dev server
      addCommand('> 🚀 Starting development server...');
      await startDevServer(newContainer);

      addCommand('> ✅ WebContainer rebuilt and restarted successfully');
    } catch (error) {
      console.error('Reload failed:', error);
      addCommand(`> ❌ Rebuild failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
      setIsLoadingWebContainer(false);
      setIsLoadingWebContainerMessage('Reloading WebContainer...');
    }
  }, [
    webcontainer,
    remountFiles,
    npmInstall,
    startDevServer,
    addCommand,
    setIsLoadingWebContainer,
  ]);

  // Listen for remount events
  useEffect(() => {
    const handleRemount = () => {
      remountFiles();
    };
    const handleNpmRunDev = () => {
      npmRunDev();
    };
    const handleNpmInstall = () => {
      npmInstall();
    };
    const handleExportZip = () => {
      handleExport();
    };
    const handleUpdatedFiles = () => {
      setUpdatedFilesChat(updatingFiles);
    };
    // Simple export fallback if the main export fails
    const handleSimpleExport = async () => {
      if (!webcontainer) return;
      try {
        addCommand('> 📦 Exporting project with simple method...');
        // Export only src directory which usually contains the source code
        let data;
        try {
          data = await webcontainer.export('src', { format: 'zip' });
          addCommand("> ✅ Exported 'src' directory successfully");
        } catch (e) {
          // If no src directory, try to export everything except node_modules
          console.log(e);
          addCommand("> ℹ️ No 'src' directory found, trying root export");
          data = await webcontainer.export('.', { format: 'zip' });
          addCommand('> ⚠️ Warning: This includes node_modules and may be large');
        }

        const zip = new Blob([data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zip);
        link.download = 'project-export.zip';
        link.click();

        setTimeout(() => {
          URL.revokeObjectURL(link.href);
        }, 100);

        addCommand('> ✅ Simple export completed');
      } catch (error) {
        console.error('Simple export failed:', error);
        addCommand(`> ❌ Simple export failed: ${(error as Error).message}`);
      }
    };

    window.addEventListener('export-project', handleExportZip);
    window.addEventListener('simple-export', handleSimpleExport);
    window.addEventListener('remount-webcontainer', handleRemount);
    window.addEventListener('reload-webcontainer', handleWebContainerReload);
    window.addEventListener('npm-run-dev', handleNpmRunDev);
    window.addEventListener('npm-install', handleNpmInstall);
    window.addEventListener('updated-files', handleUpdatedFiles);

    return () => {
      window.removeEventListener('remount-webcontainer', handleRemount);
      window.removeEventListener('reload-webcontainer', handleWebContainerReload);
      window.removeEventListener('npm-run-dev', handleNpmRunDev);
      window.removeEventListener('npm-install', handleNpmInstall);
      window.removeEventListener('export-project', handleExportZip);
      window.removeEventListener('simple-export', handleSimpleExport);
      window.removeEventListener('updated-files', handleUpdatedFiles);
    };
  }, [webcontainer, remountFiles, npmRunDev, npmInstall, handleExport, addCommand]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (devProcessRef.current) {
        devProcessRef.current.kill();
      }
    };
  }, []);

  return (
    <div className="h-[100vh] flex">
      {!fullPreview ? <SidebarMain /> : null}
      <AnimatedGradientBackground />
      {children}
    </div>
  );
};

export default Layout;
