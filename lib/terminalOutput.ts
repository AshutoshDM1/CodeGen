// Helper function to clean terminal output
export const cleanTerminalOutput = (output: string): string => {
  return output
    .replace(/\x1B\[[0-9;]*[JKmsu]/g, '') // Remove ANSI escape codes
    .replace(/\[1;1H/g, '') // Remove cursor position codes
    .replace(/\[0J/g, '') // Remove clear screen codes
    .replace(/➜/g, '>') // Replace arrow with simple character
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing whitespace
};
