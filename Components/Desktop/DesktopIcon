
import React from 'react';
import { FileText, FileCode, FileWarning, Globe } from 'lucide-react';

const icons = {
  txt: FileText,
  md: FileCode,
  log: FileWarning,
  app: Globe
};

export default function DesktopIcon({ file, onDoubleClick }) {
  const IconComponent = icons[file.type] || FileText;

  return (
    <div
      className="flex flex-col items-center justify-center text-center p-2 rounded-lg hover:bg-white/20 cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <IconComponent className="w-12 h-12 text-white" />
      <span className="mt-2 text-sm text-white break-words w-20">{file.name}</span>
    </div>
  );
}
