'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessage } from '@/services/getMessage';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/store/chatStore';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

interface MessageManagerProps {
  projectId: string | null;
  onMessagesLoaded: (messages: any[]) => void;
  children: React.ReactNode;
}

export default function MessageManager({
  projectId,
  onMessagesLoaded,
  children,
}: MessageManagerProps) {
  const queryClient = useQueryClient();
  const prevMessagesRef = useRef<any[]>([]);

  // Extract numeric project ID
  const numericProjectId = projectId ? parseInt(projectId.split('-')[1]) : null;

  // Fetch messages with React Query
  const {
    data: messages = [],
    isLoading,
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
        prevMessagesRef.current = messages;
        onMessagesLoaded(messages);
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
