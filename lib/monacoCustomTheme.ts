export const customTheme = {
  base: 'vs-dark' as const,
  inherit: false,
  rules: [
    { token: 'comment', foreground: 'dcdcdc', fontStyle: 'italic' },
    { token: 'keyword', foreground: '#df769b', fontStyle: 'normal' },
    { token: 'string', foreground: '49e9a6' },
    { token: 'number', foreground: '7060eb' },
    { token: 'variable', foreground: 'e4b781' },
    { token: 'function', foreground: '#df769b', fontStyle: 'bold' },
    { token: 'type', foreground: 'd67e5c', fontStyle: 'normal' },
    { token: 'tag', foreground: 'e66533', fontStyle: 'normal' },
    { token: 'class-name', foreground: '4EC9B0' },
    { token: 'html.tag', foreground: 'e66533' },
    { token: 'html.attribute.name', foreground: '66ccff' },
    { token: 'html.attribute.value', foreground: '99ff66' },
    { token: 'css.property', foreground: 'ffcc00' },
    { token: 'css.value', foreground: '00ffcc' },
  ],
  colors: {
    'editor.background': '#000000',
    'editor.foreground': '#becfda',
    'editorLineNumber.foreground': '#4d6c80',
    'editorLineNumber.activeForeground': '#61a6d1',
    'editorCursor.foreground': '#EA7773',
    'editor.selectionBackground': '#1679b6cc',
    'editor.lineHighlightBackground': '#003c61ee',
    'editor.lineHighlightBorder': '#003c61',
    'editorIndentGuide.background': '#183c53',
    'editorIndentGuide.activeBackground': '#28658a',
  },
};
