import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

// Store the singleton instance and boot promise outside the hook
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootWebContainer() {
      try {
        if (!webcontainerInstance) {
          if (!bootPromise) {
            // Create boot promise if it doesn't exist
            bootPromise = WebContainer.boot();
          }
          // Wait for the existing or new boot promise
          webcontainerInstance = await bootPromise;
        }
        setWebcontainer(webcontainerInstance);
      } catch (error) {
        console.error("Failed to boot WebContainer:", error);
      } finally {
        setLoading(false);
      }
    }

    bootWebContainer();
  }, []);

  return { webcontainer, loading };
}
