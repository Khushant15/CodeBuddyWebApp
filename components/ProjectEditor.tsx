"use client";
import React from 'react';
import Editor from '@monaco-editor/react';

interface ProjectEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export default function ProjectEditor({ value, onChange, language = 'javascript' }: ProjectEditorProps) {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-white/5 bg-[#1e1e1e] shadow-2xl">
      <Editor
        height="100%"
        defaultLanguage={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Fira Code, monospace',
          padding: { top: 20 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden'
          }
        }}
      />
    </div>
  );
}
