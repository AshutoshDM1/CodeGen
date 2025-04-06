import { create } from 'zustand';
import { projectFiles } from '@/types/webContainerFiles';
import { Message } from './chatStore';

type project = {
  projectName: string;
  projectId: string;
  projectDescription: string;
  lastUpdatedCode: projectFiles;
  messages: Message[];
};

interface projectStore {
  project: project | null;
  setProject: (project: project) => void;
  setProjectNull: () => void;
}

export const useProjectStore = create<projectStore>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  setProjectNull: () => set({ project: null }),
}));
