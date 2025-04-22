import ShowProjectsComponent from '@/components/projectComponent';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { handler as authOptions } from '@/auth';
import { Project } from '@/store/projectStore';
import { getALLProject } from '@/services/api';

export default async function ProjectsPage() {
  type ProjectResponse = {
    data: {
      projectResponse: Project[];
    };
  };
  const session = (await getServerSession(authOptions)) as Session | null;
  const response = (await getALLProject(session?.user?.email || '')) as ProjectResponse | undefined;

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center p-8 bg-black/50 rounded-lg border border-border">
          <h2 className="text-2xl font-bold text-white mb-3">No Projects Found</h2>
          <p className="text-neutral-300 mb-4">
            You don&apos;t have any projects yet or there was an error loading them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ShowProjectsComponent userProjects={response?.data?.projectResponse || []} />
    </>
  );
}
