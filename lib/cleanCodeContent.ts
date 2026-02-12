export function cleanCodeContent(content: string): string {
  // Since we're now receiving plain text from AI (not HTML-escaped),
  // we should do minimal cleaning - just remove any XML artifacts and trim
  console.log('cleanCodeContent - Input length:', content.length);
  console.log('cleanCodeContent - First 200 chars:', content.substring(0, 200));
  
  // Remove any boltAction tags and trim all whitespace
  const cleaned = content
    .replace(/\s*<\/boltAction>\s*$/, '') // Remove trailing boltAction tag if any
    .trim(); // Trim all leading and trailing whitespace
  
  console.log('cleanCodeContent - Output length:', cleaned.length);
  console.log('cleanCodeContent - First 200 chars:', cleaned.substring(0, 200));
  
  return cleaned;
}
