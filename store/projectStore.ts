import { create } from 'zustand';
import { projectFiles } from '@/types/webContainerFiles';
import { Message } from './chatStore';

export type Project = {
  id: number;
  projectName: string;
  projectDescription: string;
  createdAt: string;
};

interface projectStore {
  project: Project | null;
  setProject: (project: Project) => void;
  setProjectNull: () => void;
}

export const useProjectStore = create<projectStore>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  setProjectNull: () => set({ project: null }),
}));
