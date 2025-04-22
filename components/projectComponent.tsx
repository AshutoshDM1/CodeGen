'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderClosed, Plus, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagicCard } from './magicui/magic-card';
import { Project } from '@/store/projectStore';
import { toast } from 'sonner';
import { deleteProject } from '@/services/api';

// Hook to handle hydration issues
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

const ShowProjectsComponent = ({ userProjects }: { userProjects: Project[] }) => {
  const [projects, setProjects] = useState<Project[]>(userProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy] = useState<'name' | 'date'>('date');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const fallbackDate = '2023-01-01';
  const hasMounted = useHasMounted();

  const filteredProjects = projects
    .filter((project) => project.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.projectName.localeCompare(b.projectName);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id));
    toast.success('Project deleted successfully');
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] w-full text-white p-4 overflow-auto terminal-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for a project..."
            className="w-full pl-10 bg-[#141414] border-none text-zinc-300 placeholder:text-zinc-600 h-12 rounded-lg focus:ring-0 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#141414] rounded-lg relative group hover:bg-[#1A1A1A] transition-all duration-200"
            >
              <MagicCard gradientColor={'#262626'}>
                <Link href={`/workspace/projectId-${project.id}`} className="block p-6 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-[#1A1A1A] rounded-lg group-hover:bg-[#202020] transition-colors">
                        <FolderClosed className="w-6 h-6 text-zinc-400 group-hover:text-zinc-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                          {project.projectName}
                        </h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-[#202020]"
                        onClick={async (e) => {
                          e.preventDefault();
                          await deleteProject(project.id);
                          setProjectToDelete(project.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <span className="sr-only">Delete project</span>
                        <Trash2 className="h-5 w-5 text-zinc-500 hover:text-zinc-300" />
                      </Button>
                    </div>

                    <div className="flex-grow bg-[#1A1A1A]/30 rounded-lg p-4 mb-3 hover:bg-[#1A1A1A]/50 transition-colors">
                      {project.projectDescription ? (
                        <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                          {project.projectDescription}
                        </p>
                      ) : (
                        <p className="text-sm text-zinc-500 italic">No description provided</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {!hasMounted
                          ? 'Created'
                          : project.createdAt
                            ? `Created ${new Date(project.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                              })}`
                            : `Created ${new Date(fallbackDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                              })}`}
                      </span>
                      <div className="text-xs px-2 py-1 bg-[#202020] rounded-full text-zinc-400 group-hover:bg-[#262626] transition-colors">
                        Open Project →
                      </div>
                    </div>
                  </div>
                </Link>
              </MagicCard>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-sm font-medium text-zinc-300 mb-2">
              {searchQuery ? 'No matching projects found' : 'No projects yet'}
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first project to get started'}
            </p>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-lg hover:bg-[#202020] text-sm text-zinc-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
          </motion.div>
        )}

        {isDeleteModalOpen && projectToDelete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#141414] p-4 rounded-lg max-w-sm w-full mx-4"
            >
              <h3 className="text-sm font-medium text-zinc-200 mb-2">Delete Project</h3>
              <p className="text-xs text-zinc-500 mb-4">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProjectToDelete(null);
                  }}
                  className="text-xs hover:bg-[#202020]"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProject(projectToDelete)}
                  className="text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProjectsComponent;
