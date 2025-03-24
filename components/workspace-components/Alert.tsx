import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";

export default function Alert() {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl bg-gradient-to-r from-cyan-500 to-green-500 text-transparent bg-clip-text font-bold">
            Welcome to the Development Preview
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <span className="text-gray-200">
              Thank you for checking out our application! We want to inform you
              that this version is currently in active development and some
              features might be incomplete or under construction.
            </span>
            <span className="block text-cyan-500">
              For a complete demonstration of all planned features and
              functionality, we encourage you to visit my other project on my
              portfolio{" "}
              <a
                href="https://elitedev.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:underline"
              >
                Elitedev.tech
              </a>
            </span>
            <span className="block text-gray-200">
              While you&apos;re welcome to explore this development version,
              please note that you might encounter some limitations or
              unfinished features. We&apos;re working hard to bring all planned
              functionality to life!
            </span>
            <span className="block text-cyan-500">
              I am working on it and will deploy the full version as soon as
              possible. This app will be completed by{" "}
              <span className="text-green-500 font-bold">28th March 2025</span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-cyan-500/20 hover:bg-cyan-500/10">
            Close
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <a
              href="https://elitedev.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:opacity-90"
            >
              Visit Portfolio
            </a>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


