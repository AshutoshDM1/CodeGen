'use client';
import { useQuery } from '@tanstack/react-query';
import { getMessage } from '@/services/getMessage';
import { toast } from 'sonner';
import { useRef, useEffect } from 'react';
import { ProcessedMessage } from '@/types/messages';

interface MessageManagerProps {
  projectId: string | null;
  onMessagesLoaded: (messages: ProcessedMessage[]) => void;
  children: React.ReactNode;
}

export default function MessageManager({
  projectId,
  onMessagesLoaded,
  children,
}: MessageManagerProps) {
  const prevMessagesRef = useRef<ProcessedMessage[]>([]);

  // Extract numeric project ID
  const numericProjectId = projectId ? parseInt(projectId.split('-')[1]) : null;

  // Fetch messages with React Query
  const {
    data: messages = [],
    isError,
    error,
  } = useQuery({
    queryKey: ['messages', numericProjectId],
    queryFn: () => getMessage(numericProjectId as number),
    enabled: numericProjectId !== null,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  });

  // When messages change, call the onMessagesLoaded callback
  useEffect(() => {
    // Only call onMessagesLoaded if we have messages and they've changed
    if (messages && messages.length > 0) {
      // Compare with previous messages to avoid unnecessary updates
      const prevMessages = prevMessagesRef.current;
      const messagesChanged =
        prevMessages.length !== messages.length ||
        JSON.stringify(prevMessages) !== JSON.stringify(messages);

      if (messagesChanged) {
        prevMessagesRef.current = messages as ProcessedMessage[];
        onMessagesLoaded(messages as ProcessedMessage[]);
      }
    }
  }, [messages, onMessagesLoaded]);

  if (isError) {
    toast.error('Failed to load messages', {
      description: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Render children with messages loaded
  return <>{children}</>;
}
