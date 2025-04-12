'use client';
import { ResizableHandle, ResizablePanel } from '../ui/resizable';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { useChatStore, Message, AIResponse } from '@/store/chatStore';
import NavbarAiChat from './aiChat-components/Navbar.aiChat';
import ChatInput from './aiChat-components/chat-input';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TypewriterEffectSmooth } from '../ui/typewriter-effect';
import { MorphingText } from '../magicui/morphing-text';
import { AIMarkdownParser } from '../ui/ai-markdown-parser';
import { Switch } from '../ui/switch';
import { FileUpdateIndicator } from '../ui/file-update-indicator';
import { useUpdatingFiles } from '@/store/fileExplorerStore';
import MessageManager from './MessageManager';
import React from 'react';

const AiChat = ({
  projectId,
  messagesEndRef,
}: {
  projectId: string | null;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}) => {
  const { messages, setMessages, addMessage } = useChatStore();
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [useCustomParser, setUseCustomParser] = useState(true);
  const { updatingFiles, aiThinking } = useUpdatingFiles();

  const handleMessagesLoaded = React.useCallback(
    (loadedMessages: any[]) => {
      if (!loadedMessages || loadedMessages.length === 0) return;

      // Transform messages to the expected format if needed
      try {
        const transformedMessages = loadedMessages.map((msg) => (msg.message ? msg.message : msg));
        setMessages(transformedMessages);
      } catch (error) {
        console.error('Error transforming messages:', error);
      }
    },
    [setMessages],
  );

  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  const renderContent = (message: Message) => {
    if (message.role === 'user') {
      return (
        <>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-zinc-100 mt-3 whitespace-pre-wrap normal-case "
          >
            {typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content)}
          </motion.p>
        </>
      );
    }

    // Handle case when message.content is a string
    if (typeof message.content === 'string') {
      return (
        <div className="prose prose-invert">
          {useCustomParser ? (
            <AIMarkdownParser content={message.content} animate={showTypewriter} />
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          )}
        </div>
      );
    }

    // Now we can safely cast to AIResponse since we've handled the string case
    const content = message.content as AIResponse;
    return (
      <div className="space-y-4 rounded-lg">
        {content && content.startingContent && (
          <div className="prose prose-invert">
            {useCustomParser ? (
              <>
                <AIMarkdownParser content={content.startingContent} animate={showTypewriter} />
              </>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.startingContent}</ReactMarkdown>
            )}
          </div>
        )}
        {content &&
          content.updatedFiles &&
          content.updatedFiles.map((file, index) => (
            <FileUpdateIndicator
              key={index}
              filePath={file.filePath}
              message={'Updated'}
              loading={false}
            />
          ))}
        {updatingFiles.length > 0 && (
          <div className="flex flex-col justify-center ml-8 gap-2 my-3">
            {updatingFiles.slice(0, -1).map((file, index) => (
              <FileUpdateIndicator
                key={index}
                filePath={file.filePath}
                message={'Updated'}
                loading={false}
              />
            ))}
            {updatingFiles.slice(-1).map((file, index) => (
              <FileUpdateIndicator
                key={index}
                filePath={file.filePath}
                message={file.action}
                loading={true}
              />
            ))}
          </div>
        )}

        {content && content.endingContent && (
          <div className="prose prose-invert max-w-none mt-4">
            {useCustomParser ? (
              <AIMarkdownParser content={content.endingContent} animate={showTypewriter} />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.endingContent}</ReactMarkdown>
            )}
          </div>
        )}
      </div>
    );
  };

  const words = [
    {
      text: 'Start',
    },
    {
      text: 'the',
    },
    {
      text: 'conversation',
    },
    {
      text: 'with',
    },
  ];

  return (
    <>
      <MessageManager projectId={projectId} onMessagesLoaded={handleMessagesLoaded}>
        <AnimatePresence mode="wait" initial={true}>
          <ResizablePanel defaultSize={47} minSize={27} maxSize={67} key="resizable-panel">
            <div className="flex flex-col h-full items-center px-6 py-4 ease-in-out duration-300 overflow-x-hidden ai-chat-scrollbar ">
              <div className="w-full flex items-center justify-between ">
                <NavbarAiChat projectId={projectId} />
                {/* Display options */}
                <div className="items-center gap-4 hidden ">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="custom-parser"
                      checked={useCustomParser}
                      onCheckedChange={setUseCustomParser}
                      className="data-[state=checked]:bg-blue-500"
                    />
                    <span className="text-xs text-zinc-300">Custom Parser</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="typewriter-mode"
                      checked={showTypewriter}
                      onCheckedChange={setShowTypewriter}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span className="text-xs text-zinc-300">Animations</span>
                  </div>
                </div>
              </div>
              <div
                className={`h-full w-full max-w-4xl mx-auto flex flex-col text-white ${
                  projectId === null ? 'justify-center' : 'justify-between'
                } pr-5 ai-chat-scrollbar`}
              >
                {projectId === null ? (
                  <motion.div
                    key="welcome-screen"
                    className="flex flex-col items-center justify-center"
                  >
                    <TypewriterEffectSmooth words={words} />
                    <MorphingText texts={['Your AI assistant', 'Codegen AI']} />
                  </motion.div>
                ) : null}

                <div className={`${projectId === null ? 'hidden' : ''}  space-y-4 mt-5 re`}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={`message-${index}-${message.role}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className={`flex items-start gap-5 p-5 rounded-lg ${
                        message.role === 'assistant' ? 'backdrop-blur-md bg-zinc-900/20' : ''
                      }`}
                    >
                      <Avatar>
                        <AvatarImage
                          className="rounded-full h-8 w-9"
                          src={message.role === 'user' ? '/user.jpg' : '/codegen.png'}
                          alt={message.role}
                        />
                        <AvatarFallback>{message.role === 'user' ? 'CN' : 'AI'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-sm">{renderContent(message)}</div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} className="h-[10px]" />
                </div>
                <div
                  className={`${
                    projectId === null ? 'hidden' : ''
                  } w-full mx-auto flex flex-col items-center justify-center ml-8 gap-2 my-3`}
                >
                  {aiThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center justify-center self-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-6 h-6">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-[pulse_1s_ease-in-out_0.2s_infinite] ml-1" />
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-[pulse_1s_ease-in-out_0.4s_infinite] ml-1" />
                          </div>
                        </div>
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_2s_linear_infinite] font-semibold">
                          Codegen AI is thinking...
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
                <ChatInput projectId={projectId} />
              </div>
            </div>
          </ResizablePanel>
          {projectId === null ? null : <ResizableHandle key="resizable-handle" />}
        </AnimatePresence>
      </MessageManager>
    </>
  );
};

export default AiChat;
