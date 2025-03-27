import { useTerminalStore } from "@/store/chatStore";
import { AnimatedSpan, Terminal } from "../magicui/terminal";
import { useState } from "react";
import { Input } from "../ui/input";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { motion, AnimatePresence } from "framer-motion";


const TerminalMain = () => {
  const terminal = useTerminalStore((state) => state.terminal);
  const addCommand = useTerminalStore((state) => state.addCommand);
  const clearTerminal = useTerminalStore((state) => state.clearTerminal);
  const showTerminalInput = useTerminalStore(
    (state) => state.showTerminalInput
  );
  const [command, setCommand] = useState("");


  // Helper function to determine if a line is a URL
  const isUrl = (text: string) => text.includes("Server is ready at:");

  // Helper function to determine if a line is a command
  const isCommand = (text: string) => text.startsWith(">");

  // Helper function to style the terminal line
  const getLineStyle = (text: string) => {
    if (isUrl(text)) return "text-blue-500 hover:underline cursor-pointer";
    if (isCommand(text)) return "text-yellow-500";
    if (text.toLowerCase().includes("error")) return "text-red-500";
    return "text-green-500";
  };

  // Helper function to handle URL clicks
  const handleLineClick = (text: string) => {
    if (isUrl(text)) {
      const url = text.split("Server is ready at: ")[1];
      window.open(url, "_blank");
    }
  };



  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="terminal"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        <Terminal className="relative">
          <div className="absolute top-2 right-0 flex gap-2">
            <InteractiveHoverButton
              content="npm run dev"
              // onClick={handleSaveAndRemount}
            />
            <InteractiveHoverButton
            className="w-[140px]"
              content="npm install"
              onHoverText="Install dependencies"
              // onClick={handleSaveAndRemount}
            />
            <InteractiveHoverButton
              className="font-mono"
              content="Clear"
              onHoverText="Clear terminal"
              onClick={clearTerminal}
            />
          </div>
          {terminal.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null; // Skip empty lines

            return (
              <div
                key={index}
                onClick={() => handleLineClick(trimmedLine)}
                className={`${getLineStyle(
                  trimmedLine
                )} cursor-pointer break-words whitespace-pre-wrap max-w-full`}
              >
                <AnimatedSpan delay={index * 50}>
                  <span>{trimmedLine}</span>
                </AnimatedSpan>
              </div>
            );
          })}
          {!showTerminalInput && (
            <div className="flex items-center gap-2">
              <h1>Codegen $</h1>
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCommand(`> ${command}`);
                    setCommand("");
                  }
                }}
                className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 cursor-text focus-visible:outline-none"
                type="text"
                value={command}
                placeholder="Enter a command"
                onChange={(e) => setCommand(e.target.value)}
              />
            </div>
          )}
        </Terminal>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalMain;
