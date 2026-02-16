export function cleanCodeContent(content: string): string {
  
  // Remove any boltAction tags and trim all whitespace
  const cleaned = content
    .replace(/\s*<\/boltAction>\s*$/, '') // Remove trailing boltAction tag if any
    .trim(); // Trim all leading and trailing whitespace
  
  return cleaned;
}
