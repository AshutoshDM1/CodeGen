import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { useState } from 'react';
import { BookOpen, Flag, FolderClosed, LogOut, PlusIcon, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog';

type User = {
  id: number;
  name: string;
  email: string;
  image: string;
  password: string;
  createdAt: Date;
};

const SidebarMain = () => {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '';

    // Use proxy for Google user images
    if (imagePath.includes('googleusercontent.com')) {
      return `/api/proxy-image?url=${encodeURIComponent(imagePath)}`;
    }

    if (imagePath.startsWith('http')) return imagePath;

    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  const userImageUrl = getImageUrl(user?.image);

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
          <div className="flex justify-between flex-col overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-3">
                <Image src="/codegen.png" alt="logo" width={30} height={40} />
                <h1 className="text-xl font-medium text-zinc-100 mt-1">CodeGen</h1>
              </div>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={userImageUrl}
                    alt={user?.name || ''}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border border-zinc-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-100">Profile</AlertDialogTitle>
                  <div className="flex items-center gap-4 py-2">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={userImageUrl}
                        alt={user?.name || ''}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-zinc-800 text-zinc-100">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-zinc-100">{user?.name || 'User'}</h3>
                      <p className="text-sm text-zinc-400">{user?.email || ''}</p>
                    </div>
                  </div>
                </AlertDialogHeader>
                <div className="mt-4 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel className="bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100">
                    Close
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => signOut()}
                    className="bg-red-900 hover:bg-red-800 text-zinc-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => signOut()} variant="outline" size="icon">
              <LogOut className="w-[15px] h-[15px] font-[300] text-neutral-200" />
            </Button>
          </div>
        </SidebarBody>
      </Sidebar>
    </>
  );
};

export default SidebarMain;
