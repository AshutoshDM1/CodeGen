import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { debounce } from 'lodash'; // Make sure lodash is installed

// Store the singleton instance and boot promise outside the hook
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;
let mountedFiles = new Set<string>(); // Track which files have been mounted

// Debounce the remount function to prevent rapid consecutive remounts
const debouncedRemount = debounce(async (container: WebContainer, files: any) => {
  try {
    await container.mount(files);
    console.log('Files mounted successfully (debounced)');
  } catch (error) {
    console.error('Failed to mount files:', error);
  }
}, 1000); // 1 second debounce time

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootWebContainer() {
      try {
        if (!webcontainerInstance) {
          if (!bootPromise) {
            console.log('Creating new WebContainer boot promise');
            // Create boot promise if it doesn't exist
            bootPromise = WebContainer.boot();
          }
          // Wait for the existing or new boot promise
          webcontainerInstance = await bootPromise;
          console.log('WebContainer instance created');
        } else {
          console.log('Reusing existing WebContainer instance');
        }
        setWebcontainer(webcontainerInstance);
      } catch (error) {
        console.error('Failed to boot WebContainer:', error);
        // Reset the promises so we can try again
        webcontainerInstance = null;
        bootPromise = null;
      } finally {
        setLoading(false);
      }
    }

    bootWebContainer();

    // Clean up the WebContainer when the component unmounts
    return () => {
      // We don't tear down the instance here to allow reuse
      // But we do clean up our state
      setWebcontainer(null);
    };
  }, []);

  return {
    webcontainer,
    loading,
    mountedFiles,
    debouncedRemount,
  };
}
