'use client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function SonnerDemo() {
  const [, setIsLoading] = useState(false);

  const simulateAsyncOperation = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <>
      <div className="min-h-screen p-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Sonner Toast Demo</h1>
            <p className="text-muted-foreground">
              A showcase of different toast types and configurations
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Basic Toasts</CardTitle>
              <CardDescription>Simple toast notifications with different types</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => toast('This is a default toast')}>
                Default Toast
              </Button>
              <Button variant="outline" onClick={() => toast.success('Successfully saved!')}>
                Success Toast
              </Button>
              <Button variant="outline" onClick={() => toast.error('Something went wrong!')}>
                Error Toast
              </Button>
              <Button variant="outline" onClick={() => toast.warning('Please check your input')}>
                Warning Toast
              </Button>
              <Button variant="outline" onClick={() => toast.info('New update available')}>
                Info Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.promise(simulateAsyncOperation(), {
                    loading: 'Loading...',
                    success: 'Successfully loaded!',
                    error: 'Failed to load',
                  })
                }
              >
                Promise Toast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Toasts</CardTitle>
              <CardDescription>Toasts with custom actions and configurations</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  toast('Event has been created', {
                    action: {
                      label: 'Undo',
                      onClick: () => {
                        toast.success('Action undone!');
                        console.log('Undo clicked');
                      },
                    },
                  })
                }
              >
                With Action
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Custom duration', {
                    duration: 5000,
                  })
                }
              >
                Custom Duration
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Custom position', {
                    position: 'top-right',
                  })
                }
              >
                Custom Position
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('With description', {
                    description: 'This is a detailed description of the toast message.',
                  })
                }
              >
                With Description
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Rich content', {
                    description: 'This toast has rich content',
                    action: {
                      label: 'Action',
                      onClick: () => {
                        toast.success('Action completed!');
                        console.log('Action clicked');
                      },
                    },
                    duration: 5000,
                  })
                }
              >
                Rich Content
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Dismissible', {
                    dismissible: true,
                  })
                }
              >
                Dismissible
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loading States</CardTitle>
              <CardDescription>Toasts with loading states and progress</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const toastId = toast.loading('Loading...');
                  setTimeout(() => {
                    toast.dismiss(toastId);
                    toast.success('Loaded successfully!');
                  }, 2000);
                }}
              >
                Loading to Success
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const toastId = toast.loading('Processing...');
                  setTimeout(() => {
                    toast.dismiss(toastId);
                    toast.error('Processing failed!');
                  }, 2000);
                }}
              >
                Loading to Error
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const toastId = toast.loading('Uploading...', {
                    description: 'Please wait while we upload your file',
                  });
                  setTimeout(() => {
                    toast.dismiss(toastId);
                    toast.success('File uploaded successfully!', {
                      description: 'Your file has been uploaded to the server',
                    });
                  }, 2000);
                }}
              >
                Loading with Description
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const toastId = toast.loading('Processing payment...', {
                    description: 'Please do not close this window',
                  });
                  setTimeout(() => {
                    toast.dismiss(toastId);
                    toast.error('Payment failed!', {
                      description: 'There was an error processing your payment',
                    });
                  }, 2000);
                }}
              >
                Loading with Error
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Styling</CardTitle>
              <CardDescription>Toasts with custom styling and themes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  toast('Custom style', {
                    style: {
                      background: '#333',
                      color: '#fff',
                      border: '1px solid #666',
                    },
                  })
                }
              >
                Custom Style
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Custom class', {
                    className: 'bg-primary text-primary-foreground',
                  })
                }
              >
                Custom Class
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Gradient style', {
                    style: {
                      background:
                        'linear-gradient(90deg, rgba(0,255,252,1) 0%, rgba(0,157,155,1) 0%, rgba(0,59,58,1) 12%, rgba(0,0,0,1) 17%, rgba(0,0,0,1) 36%, rgba(0,0,0,1) 59%, rgba(0,0,0,1) 83%, rgba(20,112,60,1) 92%, rgba(23,128,68,1) 94%, rgba(29,164,87,1) 100%, rgba(45,253,135,1) 100%)',
                      color: '#fff',
                      border: 'none',
                    },
                  })
                }
              >
                Gradient Style
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Glass effect', {
                    style: {
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    },
                  })
                }
              >
                Glass Effect
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Toasts</CardTitle>
              <CardDescription>Toasts with interactive elements and callbacks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  toast('Interactive toast', {
                    action: {
                      label: 'Confirm',
                      onClick: () => toast.success('Confirmed!'),
                    },
                    cancel: {
                      label: 'Cancel',
                      onClick: () => toast.error('Cancelled!'),
                    },
                  })
                }
              >
                With Actions
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Custom icon', {
                    icon: '🚀',
                    description: 'This toast has a custom icon',
                  })
                }
              >
                Custom Icon
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast('Multiple actions', {
                    action: {
                      label: 'Save',
                      onClick: () => {
                        toast.success('Saved!');
                        toast.info('Shared!');
                      },
                    },
                  })
                }
              >
                Multiple Actions
              </Button>
        <Button
          variant="outline"
          onClick={() =>
                  toast('With progress', {
                    description: 'Uploading file...',
                    duration: 5000,
              action: {
                      label: 'Cancel',
                      onClick: () => toast.error('Upload cancelled'),
              },
            })
          }
        >
                With Progress
        </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-screen w-w-full bg-black">{/* <AnimationDemo /> */}</div>
    </>
  );
}
