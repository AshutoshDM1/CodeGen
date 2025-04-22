import { useFullPreview } from '@/store/showTabStore';
import { useTerminalStore } from '@/store/terminalStore';
import { motion, AnimatePresence } from 'framer-motion';
import WebContainerLoading from './WebContainerLoading';
import { useEditorCode } from '@/store/editorStore';
const WebContainer = () => {
  const { url } = useTerminalStore();
  const { EditorCode } = useEditorCode();
  const { isLoadingWebContainer, isLoadingWebContainerMessage } = useTerminalStore(
    (state) => state,
  );
  const { setFullPreview } = useFullPreview();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="webcontainer"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="h-full w-full relative"
      >
        <AnimatePresence mode="wait">
          {isLoadingWebContainer ? (
            <WebContainerLoading key="loading" message={isLoadingWebContainerMessage} />
          ) : url ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full w-full "
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between gap-2 px-4 py-2 bg-black border-b border-border"
              >
                <div className="w-[50%] items-center gap-2 hidden 2xl:flex">
                  <div className="w-full flex items-center gap-1 px-3 py-1.5 bg-[#111] rounded-md flex-1 max-w-2xl">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="w-full text-sm text-neutral-300 truncate">
                      http://localhost:5173
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const event = new CustomEvent('reload-webcontainer');
                      window.dispatchEvent(event);
                    }}
                    className="hidden items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-[#111] rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                    Reload WebContainer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const event = new CustomEvent('remount-webcontainer');
                      window.dispatchEvent(event);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-[#111] rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                    Refresh
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFullPreview(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-300 hover:text-white bg-[#111] rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 7l5 5-5 5V7m13 0l5 5-5 5V7" />
                    </svg>
                    Full Screen
                  </motion.button>
                </div>
              </motion.div>
              <div className="h-[calc(100vh-102px)] w-full overflow-y-auto ai-chat-scrollbar">
                <motion.iframe
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  height={'100%'}
                  width={'100%'}
                  src={url}
                  allow="cross-origin-isolated"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-purple-900 to-black p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mb-6"
              >
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-blue-500"
                >
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                  />
                  <motion.path
                    d="M12 8v4m0 4h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-semibold text-white mb-2"
              >
                WebContainer is not live
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-300 text-center max-w-md"
              >
                The preview environment needs to be initialized. Click the button below to install
                dependencies and start the server.
              </motion.p>
              <motion.button
                onClick={() => {
                  const event = new CustomEvent('remount-webcontainer', {
                    detail: { files: EditorCode },
                  });
                  window.dispatchEvent(event);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-md flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                Install dependencies & Run Server
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default WebContainer;
