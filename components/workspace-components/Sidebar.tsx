import { ResizableHandle } from "../ui/resizable";
import NextImage from "next/image";
import { ResizablePanel } from "../ui/resizable";
import AppSidebar from "../AppSidebar";

const Sidebar = () => {
  return (
    <>
      <ResizablePanel
        className="bg-black min-w-[50px] "
        defaultSize={3}
        minSize={3}
        maxSize={10}
      >
        <div className="flex items-center justify-center pt-2">
          <NextImage
            src="https://res.cloudinary.com/dnvl8mqba/image/upload/v1733239329/CodeGen/codegen_kf1lk0.png"
            alt="logo"
            width={30}
            height={30}
          />
        </div>
        <AppSidebar />
      </ResizablePanel>
      <ResizableHandle />
    </>
  );
};

export default Sidebar;
