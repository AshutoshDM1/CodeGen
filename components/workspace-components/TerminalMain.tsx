'use client';
import { useEffect, useRef, useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Terminal as TerminalType } from '@xterm/xterm';
import type { FitAddon as FitAddonType } from '@xterm/addon-fit';
import { WebContainer } from '@webcontainer/api';
import { useWebContainer } from '@/hooks/useWebContainer';
import { useTerminalStore } from '@/store/terminalStore';

const TerminalMain = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<TerminalType | null>(null);
  const fitAddonRef = useRef<FitAddonType | null>(null);
  const [, setIsTerminalReady] = useState(false);
  const promptText = '> ';
  const promptLength = promptText.length;
  const [isClient, setIsClient] = useState(false);
  const { terminal } = useTerminalStore();
  const { webcontainer } = useWebContainer();
  // Track user input separately from terminal contents
  const userInputRef = useRef<string>('');

  useEffect(() => {
    if (xtermRef.current) {
      terminal.map((line) => {
        xtermRef.current?.write(line);
        xtermRef.current?.writeln('');
      });
      // Reset user input after restoring terminal history
      userInputRef.current = '';
    }
  }, [terminal]);

  const executeCTRLC = async () => {
    console.log('executing CTRL + C');
    try {
      // Properly handle CTRL+C signal
      if (xtermRef.current) {
        xtermRef.current?.write('^C');
        xtermRef.current?.writeln('');
        xtermRef.current?.write(promptText);
      }
      // No need to await process.exit here as it's not defined in this context
    } catch (error) {
      console.error('> ❌ Error interrupting process:', error);
    }
  };

  const executeCommand = async (command: string, webcontainer: WebContainer) => {
    // We no longer need to strip ANSI codes since we're using our own buffer
    try {
      if (!webcontainer) {
        if (xtermRef.current) {
          xtermRef.current.writeln('> ❌ Error: WebContainer not available');
          xtermRef.current.write(promptText);
        }
        return;
      }

      // Don't try to execute empty commands
      if (!command) {
        if (xtermRef.current) {
          xtermRef.current.write(promptText);
        }
        return;
      }

      // Split the command string into command and arguments
      const parts = command.split(' ').filter(Boolean); // Remove empty strings
      const cmd = parts[0];
      const args = parts.slice(1);

      console.log('cmd', cmd);
      console.log('args', args);

      // Spawn the process with proper command and arguments
      try {
        const process = await webcontainer.spawn(cmd, args);

        // Pipe the output to the terminal
        process.output.pipeTo(
          new WritableStream({
            write(chunk) {
              // Display in terminal and console
              if (xtermRef.current) {
                // Make sure we properly handle line endings to avoid mixing output with prompt
                const text = chunk.toString();
                xtermRef.current.write(text);
              }
            },
          }),
        );

        // Wait for process to complete
        const exitCode = await process.exit;
        console.log(`Command exited with code ${exitCode}`);
      } catch (spawnError) {
        console.error('> ❌ Error spawning command:', spawnError);
        if (xtermRef.current) {
          xtermRef.current.writeln(`\r\n> ❌ Error: ${spawnError}`);
        }
      }

      // Ensure there's a clean line before showing prompt
      if (xtermRef.current) {
        const buffer = xtermRef.current.buffer.active;
        const lastLine = buffer.getLine(buffer.cursorY)?.translateToString() || '';

        // Only add a new line if the last line doesn't end with a newline
        if (lastLine.length > 0 && !lastLine.endsWith('\n') && !lastLine.endsWith('\r')) {
          xtermRef.current.writeln('');
        }
      }
    } catch (error) {
      console.error('> ❌ Error running the command:', error);
      if (xtermRef.current) {
        xtermRef.current.writeln(`\r\n> ❌ Error: ${error}`);
      }
    } finally {
      if (xtermRef.current) {
        // Ensure we start with a fresh prompt on a new line
        const buffer = xtermRef.current.buffer.active;
        const lastLine = buffer.getLine(buffer.cursorY)?.translateToString() || '';

        if (lastLine.length > 0 && !lastLine.endsWith('\n') && !lastLine.endsWith('\r')) {
          xtermRef.current.writeln('');
        }
        xtermRef.current.write(promptText);
      }
    }
  };
  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize xterm terminal
  useEffect(() => {
    // Only run on client-side and when container ref is available
    if (!isClient || !terminalRef.current || xtermRef.current) return;

    // Dynamically import xterm.js modules
    const loadXterm = async () => {
      try {
        // Import the modules dynamically to avoid SSR issues
        const xtermModule = await import('@xterm/xterm');
        const fitAddonModule = await import('@xterm/addon-fit');
        const webLinksAddonModule = await import('@xterm/addon-web-links');

        // Import CSS without TypeScript checking it
        // @ts-expect-error - CSS import is not typed
        await import('@xterm/xterm/css/xterm.css').catch(() => {
          console.warn('Could not load xterm.css, styling might be affected');
        });

        const Terminal = xtermModule.Terminal;
        const FitAddon = fitAddonModule.FitAddon;
        const WebLinksAddon = webLinksAddonModule.WebLinksAddon;

        // Create terminal instance
        const term = new Terminal({
          cursorBlink: true,
          fontFamily: 'monospace',
          fontSize: 14,
          theme: {
            background: '#000',
            foreground: '#fff',
            cursor: '#aeafad',
            black: '#000000',
            red: '#e51400',
            green: '#339933',
            yellow: '#f9f1a5',
            blue: '#1a85ff',
            magenta: '#d831b0',
            cyan: '#2bbac5',
            white: '#ebebeb',
            brightBlack: '#686868',
            brightRed: '#ff3334',
            brightGreen: '#4ce94c',
            brightYellow: '#f9f1a5',
            brightBlue: '#5555ff',
            brightMagenta: '#ff55ff',
            brightCyan: '#55ffff',
            brightWhite: '#ffffff',
          },
          cursorStyle: 'block',
          convertEol: true,
          scrollback: 5000, // Increase scrollback to store more history
        });

        // Add CSS to hide the scrollbar after terminal is created
        const style = document.createElement('style');
        style.textContent = `
          .xterm-viewport::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            display: none !important;
          }
          .xterm-viewport {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            overflow: hidden !important;
          }
        `;
        document.head.appendChild(style);

        // Create addons
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        const webLinksAddon = new WebLinksAddon();
        term.loadAddon(webLinksAddon);

        // Store refs
        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Safe check for terminal container
        const container = terminalRef.current;
        if (container) {
          // Open terminal
          term.open(container);

          // Focus the terminal
          term.focus();

          // Apply direct styling to hide scrollbars after terminal is opened
          try {
            const viewport = container.querySelector('.xterm-viewport');
            if (viewport instanceof HTMLElement) {
              viewport.style.overflow = 'hidden';
              viewport.style.overflowY = 'hidden';
              viewport.style.scrollbarWidth = 'none';
              // Use setAttribute for non-standard properties
              viewport.setAttribute(
                'style',
                viewport.getAttribute('style') + ' -ms-overflow-style: none;',
              );
            }
          } catch (err) {
            console.error('Failed to apply scrollbar styles:', err);
          }

          // Welcome message
          if (xtermRef.current) {
            terminal.map((line) => {
              xtermRef.current?.write(line);
              xtermRef.current?.writeln('');
            });
          }
          xtermRef.current?.write(promptText);
          // term.write(promptText);

          // Set the terminal as ready
          setIsTerminalReady(true);

          // Wait to ensure container is properly rendered
          setTimeout(() => {
            try {
              if (fitAddon && container) {
                const { width, height } = container.getBoundingClientRect();
                if (width > 0 && height > 0) {
                  fitAddon.fit();
                }
              }
            } catch (err) {
              console.error('Error fitting terminal:', err);
            }
          }, 100);

          // Click handler to focus terminal
          const handleTerminalClick = () => {
            term.focus();
          };

          container.addEventListener('click', handleTerminalClick);

          // Simple key handling - just basic input and newline on Enter
          term.onKey(({ key, domEvent }) => {
            const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

            if (domEvent.key === 'c' && domEvent.ctrlKey) {
              console.log('Ctrl + C detected');
              // Interrupt current operation
              executeCTRLC();
              // Reset user input
              userInputRef.current = '';
              return;
            }

            if (domEvent.key === 'Enter') {
              // Get the command from our tracked user input
              const command = userInputRef.current.trim();
              console.log('command to execute (from buffer):', command);

              // Make sure we start with a fresh line for the next command
              term.writeln('');

              // Only execute if command is not empty
              if (command) {
                if (webcontainer) {
                  executeCommand(command, webcontainer);
                } else {
                  term.writeln('> ❌ Error: WebContainer not available');
                  term.write(promptText);
                }
              } else {
                // If no command, just show the prompt
                term.write(promptText);
              }

              // Reset user input after executing
              userInputRef.current = '';
            } else if (domEvent.key === 'Backspace') {
              // Only allow backspace if there's input to delete
              if (userInputRef.current.length > 0) {
                userInputRef.current = userInputRef.current.slice(0, -1);
                term.write('\b \b');
              }
            } else if (printable) {
              // Add to our tracked input buffer
              userInputRef.current += key;
              term.write(key);
            }
          });

          // Handle window resize
          const handleResize = () => {
            if (fitAddon && container) {
              try {
                const { width, height } = container.getBoundingClientRect();
                if (width > 0 && height > 0) {
                  fitAddon.fit();
                }
              } catch (err) {
                console.error('Error fitting terminal on resize:', err);
              }
            }
          };

          window.addEventListener('resize', handleResize);

          // Handle clear terminal action
          const handleClearTerminal = () => {
            term.clear();
            term.write(promptText);
            term.focus();
          };

          window.addEventListener('clear-terminal', handleClearTerminal);

          return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('clear-terminal', handleClearTerminal);
            container.removeEventListener('click', handleTerminalClick);
            term.dispose();
          };
        }
      } catch (error) {
        console.error('Failed to load xterm.js:', error);
      }
    };

    loadXterm();
  }, [isClient, promptLength, promptText, terminal, webcontainer]);

  // Force fit on visibility change
  useEffect(() => {
    if (!isClient || !terminalRef.current) return;

    const container = terminalRef.current;

    // MutationObserver to detect when terminal becomes visible
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && fitAddonRef.current && container) {
          const { width, height } = container.getBoundingClientRect();
          if (width > 0 && height > 0) {
            try {
              setTimeout(() => {
                fitAddonRef.current?.fit();
                // Refocus terminal after resize
                xtermRef.current?.focus();
              }, 100);
            } catch (err) {
              console.error('Error in mutation observer:', err);
            }
          }
        }
      });
    });

    observer.observe(container, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, [isClient]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="terminal-main"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="terminal-main-container h-full flex flex-col"
      >
        <div className="flex-none flex justify-between items-center gap-y-2 border-b border-border p-4 py-2">
          <div className="flex items-center flex-row gap-x-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
          <div className="flex gap-2">
            <InteractiveHoverButton
              className="font-mono"
              content="Clear"
              onClick={() => {
                window.dispatchEvent(new Event('clear-terminal'));
              }}
            />
          </div>
        </div>
        <div
          ref={terminalRef}
          className="flex-grow terminal-content-area bg-black overflow-hidden"
          style={{
            padding: '8px',
            height: 'calc(100% - 50px)',
            minHeight: '100%',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            backgroundColor: '#000',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalMain;
