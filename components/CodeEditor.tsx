"use client";
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  theme?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language = 'python', 
  theme = 'vs-dark',
  readOnly = false 
}: CodeEditorProps) {
  
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Custom "Neural" Theme define if needed
    monaco.editor.defineTheme('neural-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: '8be9fd' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'string', foreground: 'f1fa8c' },
      ],
      colors: {
        'editor.background': '#0a0a0f', // Deep matching brand-bg
        'editor.lineHighlightBackground': '#ffffff05',
        'editorCursor.foreground': '#3b82f6',
        'editor.selectionBackground': '#3b82f620',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#3b82f6',
      }
    });
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0f] shadow-2xl relative group">
      {/* Decorative Border Glow */}
      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <Editor
        height="100%"
        language={language}
        theme="neural-dark"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={<div className="flex items-center justify-center h-full text-[10px] font-bold text-gray-700 uppercase tracking-widest animate-pulse">Initializing Kernel...</div>}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          padding: { top: 24, bottom: 24 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: "on",
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          readOnly: readOnly,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          bracketPairColorization: { enabled: true },
          guides: { indentation: true },
          fontLigatures: true,
        }}
      />
    </div>
  );
}
