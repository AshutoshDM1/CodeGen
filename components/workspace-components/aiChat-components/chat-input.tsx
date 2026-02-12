/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Paperclip, ArrowUp, Loader2, X } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useEditorCode } from '@/store/editorStore';
import { useShowTab } from '@/store/showTabStore';
import { useTerminalStore } from '@/store/terminalStore';
import { useFilePaths, useFileExplorer } from '@/store/fileExplorerStore';
import { findFileContent } from '@/lib/findFileContent';
import { useCallback, useEffect, useState } from 'react';
import { ShinyButton } from '@/components/magicui/shiny-button';
import { AnimatePresence, motion } from 'framer-motion';
import { messageuser } from '@/helper/messageReact';
import {
  createMessage,
  createProject,
  enhancePromptApi,
  errorHandler,
  sendCode,
  updateCode,
} from '@/services/api';
import { AIMessage } from '@/types/AiResponse';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { projectFiles } from '@/types/webContainerFiles';
export default function ChatInput({ projectId }: { projectId: number | null }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { setFileupdating } = useFilePaths();
  const { messages, addMessage, isLoading, setIsLoading, addAIbeforeMsg, addAIafterMsg } =
    useChatStore();
  const { EditorCode, setEditorCode } = useEditorCode();
  const [inputValue, setInputValue] = useState('');
  const { setFilePaths } = useFilePaths();
  const { addFileByAI } = useFileExplorer();
  const { setShowWorkspace, setShowCode, setShowPreview } = useShowTab();
  const { setIsLoadingWebContainerMessage, setIsLoadingWebContainer } = useTerminalStore(
    (state) => state,
  );
  const { addUpdatingFiles, setUpdatingFiles, setAiThinking } = useChatStore();
  const [enchancedLoadding, setEnchancedLoadding] = useState(false);

  const fetchData = async () => {
    try {
      const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const Files = EditorCode;
      const CurrentFiles = JSON.stringify(Files);
      const prompt = inputValue;
      const messageToAI = {
        role: 'user',
        content: `1. here all the current files which are present ${CurrentFiles} do the changes in the files. User - ${prompt}`,
      };

      messageuser.messages.push(messageToAI);

      const response = await fetch(`${URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageuser),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      // Get the full response text at once
      const fullText = await response.text();

      console.log('===== FULL AI RESPONSE =====');
      console.log('Response length:', fullText.length);
      console.log('First 500 chars:', fullText.substring(0, 500));
      console.log('============================');

      // Show loading while parsing
      setIsLoadingWebContainerMessage('Parsing AI response...');
      setIsLoadingWebContainer(true);
      setAiThinking(false);
      setFileupdating(false);

      const message: AIMessage = {
        beforeMsg: '',
        boltArtifact: {
          title: '',
          fileActions: [],
          shellActions: [],
        },
        afterMsg: '',
      };

      // Parse the full text
      let buffer = fullText;

      // Extract beforeMsg
      const artifactMatch = buffer.match(/<boltArtifact id="([^"]*)" title="([^"]*)">/);
      if (artifactMatch) {
        message.beforeMsg = buffer.split('<boltArtifact')[0].trim();
        message.boltArtifact.title = artifactMatch[2];
        buffer = buffer.substring(buffer.indexOf('<boltArtifact'));
      } else {
        // If no artifact found, the entire response is beforeMsg
        message.beforeMsg = fullText;
        console.warn('No boltArtifact found in response!');
      }

      // Extract file actions - Using a more flexible regex that handles newlines better
      const fileActionRegex = /<boltAction\s+type="file"\s+filePath="([^"]*)"\s*>([\s\S]*?)<\/boltAction>/g;
      let fileMatch;
      
      // Reset regex lastIndex to ensure we start from the beginning
      fileActionRegex.lastIndex = 0;
      
      let matchCount = 0;
      while ((fileMatch = fileActionRegex.exec(buffer)) !== null) {
        matchCount++;
        const filePath = fileMatch[1];
        let content = fileMatch[2];

        console.log(`\n===== FILE MATCH #${matchCount} =====`);
        console.log(`File path: "${filePath}"`);
        console.log(`Raw content length: ${content.length}`);
        console.log(`First 300 chars of raw content:`, content.substring(0, 300));

        // Clean the content - trim all leading and trailing whitespace
        // DO NOT process escape sequences since AI sends plain text
        content = content.trim();

        console.log(`Cleaned content length: ${content.length}`);
        console.log(`First 300 chars of cleaned content:`, content.substring(0, 300));

        // Always update the file content first
        if (filePath && content) {
          console.log(`\n[FileUpdate] Processing: ${filePath}`);
          console.log(`[FileUpdate] Content length: ${content.length}`);
          console.log(`[FileUpdate] First 100 chars:`, content.substring(0, 100));
          
          // Check if file exists BEFORE updating
          const fileExists = findFileContent(EditorCode, filePath);
          console.log(`[FileUpdate] File exists in current state: ${!!fileExists}`);
          
          // If file doesn't exist, create it in file explorer first
          if (!fileExists) {
            const filename = filePath.split('/').pop() || '';
            console.log(`[FileUpdate] Creating new file in explorer: ${filename} at ${filePath}`);
            addFileByAI(filePath, filename);
          }
          
          // Now update the editor code (this will work for both new and existing files)
          console.log(`[FileUpdate] Calling setEditorCode for: ${filePath}`);
          setEditorCode(filePath, content);
          console.log(`[FileUpdate] setEditorCode called successfully`);
          
          addUpdatingFiles([
            {
              action: 'Updated',
              filePath: filePath,
            },
          ]);
          console.log(`[FileUpdate] ✓ File ${fileExists ? 'updated' : 'created'} successfully\n`);
        } else {
          console.warn(`[FileUpdate] ⚠ Skipped file due to missing path or content`);
          console.warn(`[FileUpdate]   Path: "${filePath}", Content length: ${content?.length || 0}`);
        }

        message.boltArtifact.fileActions.push({
          type: 'file',
          filePath,
          content,
        });
        console.log(`============================\n`);
      }

      console.log(`\n===== PARSING COMPLETE =====`);
      console.log(`Total files processed: ${message.boltArtifact.fileActions.length}`);
      console.log(`============================\n`);

      // Extract shell actions
      const shellActionRegex = /<boltAction type="shell">([\s\S]*?)<\/boltAction>/g;
      let shellMatch;
      while ((shellMatch = shellActionRegex.exec(buffer)) !== null) {
        const content = shellMatch[1].trim();
        message.boltArtifact.shellActions.push({
          type: 'shell',
          content,
        });
      }

      // Extract afterMsg
      const artifactEndMatch = buffer.match(/<\/boltArtifact>([\s\S]*)/);
      if (artifactEndMatch) {
        message.afterMsg = artifactEndMatch[1].replace(/^[>\s]+/, '').trim();
      }

      // Add the complete message to chat
      addMessage({
        role: 'assistant',
        content: {
          startingContent: message.beforeMsg,
          projectFiles: message.boltArtifact.fileActions.reduce(
            (acc, file) => {
              if (file.filePath) {
                acc[file.filePath] = {
                  file: {
                    contents: file.content,
                  },
                };
              }
              return acc;
            },
            {} as projectFiles,
          ),
          endingContent: message.afterMsg,
        },
      });
      setIsLoading(false);
      console.log('EditorCode', EditorCode);
      return message;
    } catch (err) {
      setIsLoading(false);
      setIsLoadingWebContainer(false);
      errorHandler(err);
    } finally {
      setFileupdating(true);
      setUpdatingFiles([]);
      setIsLoadingWebContainerMessage('Compiling the project...');
      setIsLoadingWebContainer(true);
      const updatedFilesEvent = new CustomEvent('updated-files');
      window.dispatchEvent(updatedFilesEvent);
      const remountWebcontainerEvent = new CustomEvent('remount-webcontainer');
      window.dispatchEvent(remountWebcontainerEvent);
      setShowPreview();
    }
  };

  // 

  const sendMessage = useCallback(async () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && projectId) {
        try {
          console.log('Sending message to backend:', lastMessage);
          await createMessage(lastMessage.content, 'assistant', projectId);
          await updateCode(projectId, EditorCode);
          console.log('Message sent successfully');
        } catch (error) {
          console.error('Error sending message to backend:', error);
          errorHandler(error);
        }
      }
    }
  }, [messages, projectId, EditorCode]);

  useEffect(() => {
    const handleSendMessage = async () => {
      await sendMessage();
    };
    window.addEventListener('send-message', handleSendMessage);
    return () => {
      window.removeEventListener('send-message', handleSendMessage);
    };
  }, [sendMessage]);

  const handleSubmit = async () => {
    try {
      if (!inputValue.trim()) return;
      setIsLoading(true);
      setInputValue('');
      setAiThinking(true);
      if (projectId === null) {
        if (session?.user?.email) {
          const projectResponse = await createProject(
            session?.user?.email,
            inputValue.split(' ').slice(0, 4).join(' '),
          );
          createMessage(inputValue, 'user', projectResponse.response.id);
          sendCode(projectResponse.response.id, EditorCode);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          router.push(`/workspace/projectId-${projectResponse.response.id}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setShowWorkspace(true);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setShowCode();
        }
      } else {
        addMessage({
          role: 'user',
          content: inputValue,
        });
        createMessage(inputValue, 'user', projectId);
      }
      const message = await fetchData();
      console.log('Here1');
      setFileupdating(true);
      setIsLoading(false);
      if (message) {
        // Slight delay to ensure the message is fully added to the store
        setTimeout(() => {
          const sendMessageEvent = new CustomEvent('send-message');
          window.dispatchEvent(sendMessageEvent);
        }, 300);
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  const enhancePrompt = async (inputValue: string) => {
    try {
      setEnchancedLoadding(true);
      const response: Response | undefined = await enhancePromptApi(inputValue);
      if (!response) throw new Error('No response');
      
      // Get the full text at once
      const enhancedText = await response.text();
      setInputValue(enhancedText);
    } catch (err) {
      errorHandler(err);
    } finally {
      setEnchancedLoadding(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 1,
        }}
        className={`max-w-4xl mx-auto self-center border rounded-lg pt-1 ease-in-out duration-300 backdrop-blur-lg bg-background/95 `}
      >
        {/* Premium Banner */}
        <div className="flex items-center justify-between px-4 pt-2 mb-2 flex-wrap gap-2 ">
          <p className="text-sm text-zinc-100">
            Need more messages? Get higher limits with Premium.
          </p>
          <div className="w-fit flex items-center gap-2">
            <ShinyButton
              disabled={enchancedLoadding}
              onClick={() => enhancePrompt(inputValue)}
              className="min-h-[2.2rem] min-w-[12rem] flex text-black"
            >
              {enchancedLoadding ? (
                <Loader2 className="h-4 w-4 animate-spin self-center" />
              ) : (
                'Enhance Prompt'
              )}
            </ShinyButton>
            <Button
              variant="default"
              size="sm"
              className="h-fit py-2 bg-emerald-400 hover:bg-emerald-500"
            >
              Upgrade Plan
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* Chat Input */}
        <Card className="border-0 bg-transparent">
          <div className="flex flex-col items-start px-1 py-2">
            <div className="flex items-center gap-2 w-full">
              <textarea
                suppressHydrationWarning
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent resize-none min-h-[52px] p-2"
                placeholder="Ask CodeGen AI a question..."
                rows={1}
                style={{ overflow: 'hidden' }}
              />
              <div className="flex items-center gap-2">
                <Button
                  disabled={isLoading}
                  variant="ghost"
                  className="h-8 min-w-20 bg-zinc-900 hover:bg-zinc-800"
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="sr-only">Loading...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowUp className="h-4 w-4" />
                  <span className="sr-only">Submit</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <span className="h-5 w-5 flex items-center justify-center font-bold">⌘</span>
                <span className="sr-only">Command</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
