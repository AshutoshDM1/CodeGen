import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer>();

  async function main() {
    const webcontainerInstance = await WebContainer.boot();
    setWebcontainer(webcontainerInstance);
  }
  useEffect(() => {
    main();
  }, []);

  return webcontainer;
}
