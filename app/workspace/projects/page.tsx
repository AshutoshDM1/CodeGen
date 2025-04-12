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

  return (
    <>
      <ShowProjectsComponent userProjects={response?.data?.projectResponse || []} />
    </>
  );
}
