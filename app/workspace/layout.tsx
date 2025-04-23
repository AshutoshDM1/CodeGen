'use client';
import { useChatStore } from '@/store/chatStore';
import { useEffect, ReactNode, useRef } from 'react';
import { useWebContainer } from '@/hooks/useWebContainer';
import { useWebContainerOperations } from '@/hooks/useWebContainerOperations';
import { useEditorCode } from '@/store/editorStore';
import { useTerminalStore } from '@/store/terminalStore';
import { FileSystemTree } from '@webcontainer/api';
import { toast } from 'sonner';
import { useFullPreview } from '@/store/showTabStore';
import SidebarMain from '@/components/workspace-components/SidebarMain';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const Layout = ({ children }: { children: ReactNode }) => {
  const { updatingFiles } = useChatStore();
  const { setUpdatedFilesChat } = useChatStore();
  const { fullPreview } = useFullPreview();
  const { webcontainer, loading: webcontainerLoading } = useWebContainer();
  const setIsLoading = useTerminalStore((state) => state.setIsLoadingWebContainer);
  const { EditorCode } = useEditorCode();
  const isInitialized = useRef(false);
  const prevEditorCode = useRef(EditorCode);
  const { setIsLoadingWebContainer } = useTerminalStore((state) => state);
  const {
    startDevServer,
    remountFiles,
    npmRunDev,
    npmInstall,
    exportProject,
    devProcessRef,
    saveFiles,
  } = useWebContainerOperations(webcontainer);

  // Initial setup - only runs once when the WebContainer is first available
  useEffect(() => {
    const setupWebContainer = async () => {
      if (!webcontainer || isInitialized.current) return;
      try {
        const files = EditorCode as unknown as FileSystemTree;
        await webcontainer.mount(files);
        await startDevServer();
        isInitialized.current = true;
        prevEditorCode.current = EditorCode;
        setIsLoadingWebContainer(false);
      } catch (error) {
        console.error('Setup failed:', error);
        setIsLoading(false);
        toast.error('Failed to start WebContainer');
      }
    };
    if (!webcontainerLoading && !isInitialized.current) {
      setupWebContainer();
    }
  }, [
    webcontainer,
    webcontainerLoading,
    EditorCode,
    setIsLoading,
    startDevServer,
    setIsLoadingWebContainer,
  ]);

  useEffect(() => {
    const handleRemount = () => {
      remountFiles(EditorCode);
    };
    const handleNpmRunDev = () => {
      npmRunDev();
    };
    const handleNpmInstall = () => {
      npmInstall();
    };
    const handleExportZip = () => {
      exportProject();
    };
    const handleUpdatedFiles = () => {
      setUpdatedFilesChat(updatingFiles);
    };
    const handleSaveFiles = () => {
      saveFiles(EditorCode);
    };
    window.addEventListener('remount-webcontainer', handleRemount);
    window.addEventListener('npm-run-dev', handleNpmRunDev);
    window.addEventListener('npm-install', handleNpmInstall);
    window.addEventListener('export-project', handleExportZip);
    window.addEventListener('updated-files', handleUpdatedFiles);
    window.addEventListener('save-files', handleSaveFiles);
    return () => {
      window.removeEventListener('remount-webcontainer', handleRemount);
      window.removeEventListener('npm-run-dev', handleNpmRunDev);
      window.removeEventListener('npm-install', handleNpmInstall);
      window.removeEventListener('export-project', handleExportZip);
      window.removeEventListener('updated-files', handleUpdatedFiles);
      window.removeEventListener('save-files', handleSaveFiles);
    };
  }, [
    EditorCode,
    remountFiles,
    npmRunDev,
    npmInstall,
    exportProject,
    updatingFiles,
    setUpdatedFilesChat,
  ]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (devProcessRef.current) {
        devProcessRef.current.kill();
      }
    };
  }, [devProcessRef]);

  return (
    <>
      <div className="flex flex-col h-screen md:hidden overflow-hidden justify-center items-center p-8 bg-transparent text-center">
        <AnimatedGradientBackground />
        <div className="relative mb-6 animate-float">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-indigo-600 drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
            <span className="text-white text-xs">!</span>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
          Desktop Experience Only
        </h2>
        <div className=" backdrop-blur-sm p-5 rounded-xl shadow-xl max-w-md border border-indigo-100 mb-6 text-white ">
          <p className="mb-4 font-medium">
            This powerful development environment requires a larger screen for optimal
            functionality.
          </p>
          <p>
            Please switch to a laptop or desktop computer to access all features and enjoy the
            complete CodeGen experience.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>We&apos;re working on mobile support for the future</span>
        </div>
      </div>
      <div className="h-[100vh] hidden md:flex">
        {!fullPreview ? <SidebarMain /> : null}
        <AnimatedGradientBackground />
        {children}
      </div>
    </>
  );
};

export default Layout;
