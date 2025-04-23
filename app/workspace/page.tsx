'use client';
import { ResizablePanelGroup } from '@/components/ui/resizable';
import Alert from '@/components/workspace-components/Alert';
import AiChat from '@/components/workspace-components/AiChat';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useProjectStore } from '@/store/projectStore';
import { useEditorCode } from '@/store/editorStore';
import { defaultProjectFiles } from '@/helper/defaultProjectFiles';
import { syncFileExplorerFromEditorCode } from '@/lib/syncFileExplorer';
const Dashboard = () => {
  const { setMessages } = useChatStore();
  const { setProjectNull } = useProjectStore();
  const { setCode } = useEditorCode();
  useEffect(() => {
    setMessages([]);
    setCode(defaultProjectFiles);
    syncFileExplorerFromEditorCode(defaultProjectFiles);
    setProjectNull();
  }, []);
  return (
    <>
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="h-screen w-full overflow-hidden"
      >
        <ResizablePanelGroup direction="horizontal" className="h-screen overflow-hidden">
          <Alert />
          <AiChat projectId={null} />
        </ResizablePanelGroup>
      </motion.div>
    </>
  );
};

export default Dashboard;
