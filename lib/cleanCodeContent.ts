export function cleanCodeContent(content: string): string {
  return content
    .replace(/^>?\s*/, '') // Remove leading '>' and whitespace
    .replace(/\s*<\/boltAction>\s*$/, '') // Remove trailing boltAction tag
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\([^\\])/g, '$1')
    .replace(/\\"/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;lt;/g, '<')
    .replace(/&amp;gt;/g, '>')
    .replace(/\{&gt;/g, '{>')
    .replace(/&lt;\}/g, '<}')
    .replace(/=&gt;/g, '=>')
    .trim();
}
