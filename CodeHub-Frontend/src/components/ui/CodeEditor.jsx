import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Download, 
  Settings, 
  Palette, 
  Monitor,
  Type,
  Grid,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from './Button';

const CodeEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  placeholder = 'Enter your code here...',
  className = '',
  error = '',
  ...props 
}) => {
  const textareaRef = useRef(null);
  const [settings, setSettings] = useState({
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    showLineNumbers: true,
    wordWrap: false
  });
  const [showSettings, setShowSettings] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(400, textarea.scrollHeight) + 'px';
    }
  }, [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // Toast notification would go here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      html: 'html',
      css: 'css',
      sql: 'sql',
      shell: 'sh'
    };
    return extensions[lang] || 'txt';
  };

  const insertTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = ' '.repeat(settings.tabSize);
      
      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange({ target: { value: newValue } });
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.setSelectionRange(start + settings.tabSize, start + settings.tabSize);
      }, 0);
    }
  };

  const getLineNumbers = () => {
    if (!settings.showLineNumbers) return null;
    
    const lines = value.split('\\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-0 right-0 bg-slate-800 border border-slate-700 rounded-lg p-4 z-10 w-64">
          <h4 className="text-white font-medium mb-3">Editor Settings</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Font Size</label>
              <input
                type="range"
                min="10"
                max="24"
                value={settings.fontSize}
                onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                className="w-full"
              />
              <span className="text-xs text-slate-400">{settings.fontSize}px</span>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-1">Tab Size</label>
              <select
                value={settings.tabSize}
                onChange={(e) => setSettings({...settings, tabSize: parseInt(e.target.value)})}
                className="w-full bg-slate-700 text-white rounded px-2 py-1 text-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Line Numbers</span>
              <button
                type="button"
                onClick={() => setSettings({...settings, showLineNumbers: !settings.showLineNumbers})}
                className={`w-10 h-5 rounded-full ${settings.showLineNumbers ? 'bg-cyan-500' : 'bg-slate-600'} relative transition-colors`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${settings.showLineNumbers ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Word Wrap</span>
              <button
                type="button"
                onClick={() => setSettings({...settings, wordWrap: !settings.wordWrap})}
                className={`w-10 h-5 rounded-full ${settings.wordWrap ? 'bg-cyan-500' : 'bg-slate-600'} relative transition-colors`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${settings.wordWrap ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setShowSettings(false)}
            className="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2 p-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-slate-300">
            {language.toUpperCase()}
          </div>
          <div className="text-xs text-slate-500">
            {value.split('\\n').length} lines
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-400 hover:text-white p-1"
          >
            <Copy className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-slate-400 hover:text-white p-1"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-slate-400 hover:text-white p-1"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="relative flex bg-slate-900 rounded-b-lg border border-slate-700 overflow-hidden">
        {/* Line Numbers */}
        {settings.showLineNumbers && (
          <div className="bg-slate-800 px-3 py-3 text-right select-none">
            {getLineNumbers()?.map(lineNum => (
              <div 
                key={lineNum} 
                className="text-slate-500 text-sm leading-6"
                style={{ fontSize: `${settings.fontSize}px` }}
              >
                {lineNum}
              </div>
            ))}
          </div>
        )}

        {/* Code Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={insertTab}
            placeholder={placeholder}
            className={`
              w-full bg-transparent text-white p-3 resize-none border-none outline-none
              font-mono leading-6 min-h-[400px]
              ${settings.wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'}
              ${error ? 'border-red-500' : 'border-slate-700'}
            `}
            style={{ 
              fontSize: `${settings.fontSize}px`,
              tabSize: settings.tabSize 
            }}
            spellCheck={false}
            {...props}
          />
          
          {/* Placeholder when empty */}
          {!value && (
            <div className="absolute top-3 left-3 text-slate-500 pointer-events-none font-mono">
              {placeholder}
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-1 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
