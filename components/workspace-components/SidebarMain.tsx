import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { useState } from 'react';
import { BookOpen, Flag, FolderClosed, PlusIcon } from 'lucide-react';
import Image from 'next/image';
const SidebarMain = () => {
  const links = [
    {
      label: 'New Chat',
      href: '/workspace',
      icon: (
        <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px]">
          <PlusIcon className="w-[15px] h-[15px] font-[300] text-neutral-200" />
        </div>
      ),
    },
    {
      label: 'Projects',
      href: '/workspace/projects',
      icon: (
        <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px]">
          <BookOpen className="w-[15px] h-[15px] font-[300] text-neutral-200" />
        </div>
      ),
    },
    {
      label: 'Workspace',
      href: '/workspace/default',
      icon: (
        <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px]">
          <FolderClosed className="w-[15px] h-[15px] font-[300] text-neutral-200" />
        </div>
      ),
    },
    {
      label: 'Feedback',
      href: '#',
      icon: (
        <div className="border-[1.5px] border-zinc-700 hover:bg-zinc-700 rounded-lg p-[7px]">
          <Flag className="w-[15px] h-[15px] font-[300] text-neutral-200" />
        </div>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-black border-r border-zinc-700">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2  mb-3">
                <Image src="/codegen.png" alt="logo" width={30} height={40} />
                <h1 className="text-xl font-medium text-zinc-100 mt-1">CodeGen</h1>
              </div>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
};

export default SidebarMain;
