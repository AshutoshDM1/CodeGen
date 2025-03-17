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
      <>
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Welcome to the Development Preview of CodeGen Made Ashutosh
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4">
                  <p>
                    Thank you for checking out our application! We want to inform
                    you that this version is currently in active development and
                    some features might be incomplete or under construction.
                  </p>
                  <p>
                    For a complete demonstration of all planned features and
                    functionality, we encourage you to visit{" "}
                    <a
                      href="https://bolt.new"
                      className="text-primary font-medium hover:underline"
                    >
                      bolt.new
                    </a>
                    . There, you&apos;ll find a fully functional version that
                    showcases the final product we&apos;re working towards.
                  </p>
                  <p>
                    While you&apos;re welcome to explore this development version,
                    please note that you might encounter some limitations or
                    unfinished features. We&apos;re working hard to bring all
                    planned functionality to life!
                  </p>
                </div>
                <span className="text-red-600 ">
                  {" "}
                  due to Computer hardware issues I was not able to deploy the
                  full version of the application (I am using my old laptop for
                  development)
                </span>{" "}
                <span className="text-green-500">
                  For a complete demonstration of all planned features and
                  functionality, we encourage you to visit my other project on my
                  portfolio{" "}
                  <span className="text-blue-500 underline ">
                    <a
                      href="https://elitedev.tech"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Elitedev.tech
                    </a>
                  </span>
                  {"   "}
                </span>
                There, you&apos;ll find a fully functional version that showcases
                the final product we&apos;re working towards. While you&apos;re
                welcome to explore this development version, please note that you
                might encounter some limitations or unfinished features.
                We&apos;re working hard to bring all planned functionality to
                life!
                <span className="text-green-500">
                  {" "}
                  I am working on it and will deploy the full version as soon as
                  possible This app will be completed till{" "}
                  <span className="text-orange-500 font-bold text-lg  ">
                    28th March 2025.
                  </span>
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction asChild>
                <a
                  href="https://elitedev.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit portfolio for other projects
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  };
