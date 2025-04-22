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
  const { setIsLoadingWebContainer} = useTerminalStore(
    (state) => state,
  );
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
    <div className="h-[100vh] flex">
      {!fullPreview ? <SidebarMain /> : null}
      <AnimatedGradientBackground />
      {children}
    </div>
  );
};

export default Layout;
