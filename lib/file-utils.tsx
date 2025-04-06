import React from 'react';
import {
  FileIcon,
  PackageIcon,
  CodeIcon,
  FileTextIcon,
  FileJsonIcon,
  FileCogIcon,
  ImageIcon,
  BookIcon,
} from 'lucide-react';

export const getFileIcon = (filename: string): JSX.Element => {
  if (!filename) return <FileIcon size={20} />;

  const lowerFilename = filename.toLowerCase();

  if (
    lowerFilename.includes('config') ||
    lowerFilename.includes('config') ||
    lowerFilename.endsWith('.env') ||
    lowerFilename.endsWith('.yml') ||
    lowerFilename.endsWith('.yaml') ||
    lowerFilename.includes('.gitignore') ||
    lowerFilename.includes('.babelrc')
  ) {
    return <FileCogIcon size={20} className="text-gray-300" />;
  }

  if (lowerFilename.endsWith('package.json') || lowerFilename.endsWith('package-lock.json')) {
    return <PackageIcon size={20} className="text-yellow-400" />;
  }

  if (
    lowerFilename.endsWith('.js') ||
    lowerFilename.endsWith('.jsx') ||
    lowerFilename.endsWith('.mjs')
  ) {
    return <CodeIcon size={20} className="text-yellow-300" />;
  }

  if (lowerFilename.endsWith('.ts') || lowerFilename.endsWith('.tsx')) {
    return <CodeIcon size={20} className="text-blue-400" />;
  }

  if (
    lowerFilename.endsWith('.css') ||
    lowerFilename.endsWith('.scss') ||
    lowerFilename.endsWith('.less') ||
    lowerFilename.endsWith('.sass')
  ) {
    return <FileIcon size={20} className="text-blue-300" />;
  }

  if (lowerFilename.endsWith('.html') || lowerFilename.endsWith('.htm')) {
    return <FileIcon size={20} className="text-orange-400" />;
  }

  if (lowerFilename.endsWith('.json')) {
    return <FileJsonIcon size={20} className="text-amber-300" />;
  }

  if (
    lowerFilename.endsWith('.png') ||
    lowerFilename.endsWith('.jpg') ||
    lowerFilename.endsWith('.jpeg') ||
    lowerFilename.endsWith('.gif') ||
    lowerFilename.endsWith('.svg') ||
    lowerFilename.endsWith('.webp')
  ) {
    return <ImageIcon size={20} className="text-purple-400" />;
  }

  if (
    lowerFilename.endsWith('.txt') ||
    lowerFilename.endsWith('.md') ||
    lowerFilename.endsWith('.markdown')
  ) {
    return <FileTextIcon size={20} className="text-zinc-300" />;
  }

  if (
    lowerFilename.endsWith('.pdf') ||
    lowerFilename.endsWith('.doc') ||
    lowerFilename.endsWith('.docx')
  ) {
    return <BookIcon size={20} className="text-red-400" />;
  }

  return <FileIcon size={20} className="text-gray-400" />;
};
