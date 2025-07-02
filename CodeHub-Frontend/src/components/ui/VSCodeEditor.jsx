import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Copy, 
  Download, 
  Search,
  Code2,
  Maximize2,
  Minimize2,
  X,
  Monitor
} from 'lucide-react';
import Button from './Button';
import toast from 'react-hot-toast';

const VSCodeEditor = ({ 
  value = '', 
  onChange, 
  language = 'javascript', 
  className = '',
  error = '',
  readOnly = false
}) => {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showMinimap, setShowMinimap] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [currentLine, setCurrentLine] = useState(1);
  const [currentColumn, setCurrentColumn] = useState(1);
  const [wordCount, setWordCount] = useState(0);

  // Language configurations
  const languageConfigs = {
    javascript: { icon: '🟨', color: '#f7df1e', ext: 'js' },
    typescript: { icon: '🔷', color: '#3178c6', ext: 'ts' },
    python: { icon: '🐍', color: '#3776ab', ext: 'py' },
    java: { icon: '☕', color: '#ed8b00', ext: 'java' },
    cpp: { icon: '⚡', color: '#00599c', ext: 'cpp' },
    csharp: { icon: '🟣', color: '#239120', ext: 'cs' },
    php: { icon: '🐘', color: '#777bb4', ext: 'php' },
    ruby: { icon: '💎', color: '#cc342d', ext: 'rb' },
    go: { icon: '🐹', color: '#00add8', ext: 'go' },
    rust: { icon: '🦀', color: '#000000', ext: 'rs' },
    html: { icon: '🌐', color: '#e34f26', ext: 'html' },
    css: { icon: '🎨', color: '#1572b6', ext: 'css' },
    sql: { icon: '🗄️', color: '#336791', ext: 'sql' },
    shell: { icon: '🐚', color: '#89e051', ext: 'sh' },
    json: { icon: '📄', color: '#000000', ext: 'json' },
    yaml: { icon: '📋', color: '#cb171e', ext: 'yml' },
    markdown: { icon: '📝', color: '#083fa1', ext: 'md' },
    dockerfile: { icon: '🐳', color: '#2496ed', ext: 'dockerfile' },
    docker: { icon: '🐳', color: '#2496ed', ext: 'dockerfile' }
  };

  // Normalize language to lowercase and get config
  const normalizedLanguage = language.toLowerCase();
  const currentLangConfig = languageConfigs[normalizedLanguage] || languageConfigs.javascript;

  // Debug log to check if language prop updates
  useEffect(() => {
    console.log('VSCodeEditor language prop changed to:', language);
    console.log('Normalized language:', normalizedLanguage);
    console.log('Current language config:', currentLangConfig);
  }, [language, normalizedLanguage, currentLangConfig]);

  // Monaco Editor configuration
  const editorOptions = {
    minimap: { enabled: showMinimap },
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Fira Code, Cascadia Code, Consolas, monospace',
    tabSize: 2,
    lineNumbers: 'on',
    wordWrap: 'off',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    renderWhitespace: 'none',
    autoClosingBrackets: 'always',
    fontLigatures: true,
    theme: 'vs-dark',
    readOnly: readOnly,
    selectOnLineNumbers: true,
    roundedSelection: false,
    cursorStyle: 'line',
    cursorBlinking: 'blink',
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'always',
    matchBrackets: 'always',
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
    cursorSmoothCaretAnimation: 'on'
  };

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleDownload();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setShowSearch(!showSearch);
    });

    // Update cursor position and stats
    editor.onDidChangeCursorPosition((e) => {
      setCurrentLine(e.position.lineNumber);
      setCurrentColumn(e.position.column);
    });

    // Focus the editor
    editor.focus();
  };

  // Handle editor change
  const handleEditorChange = (newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue || '', name: 'code' } });
    }
    
    // Update word count
    const words = newValue && newValue.trim() ? newValue.trim().split(/\s+/).length : 0;
    setWordCount(words);
  };

  // Handle language changes dynamically
  useEffect(() => {
    if (editorRef.current) {
      const monaco = window.monaco;
      if (monaco) {
        const model = editorRef.current.getModel();
        if (model) {
          // Update the model's language using normalized language
          monaco.editor.setModelLanguage(model, normalizedLanguage);
        }
      }
    }
  }, [normalizedLanguage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Code copied to clipboard!');
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippet.${currentLangConfig.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
      toast.success('Code formatted!');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 100);
  };

  const EditorContainer = isFullscreen ? 'div' : 'div';
  const containerClasses = isFullscreen 
    ? 'fixed inset-0 z-50 bg-slate-900 flex flex-col'
    : `relative ${className}`;

  return (
    <EditorContainer className={containerClasses}>
      {/* VSCode-style title bar */}
      <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700 px-4 py-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentLangConfig.icon}</span>
            <span className="text-sm font-medium text-white">
              snippet.{currentLangConfig.ext}
            </span>
            <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="text-slate-400 hover:text-white p-1.5"
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="text-slate-400 hover:text-white p-1.5"
            title="Format code"
          >
            <Code2 className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-400 hover:text-white p-1.5"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-slate-400 hover:text-white p-1.5"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-4 bg-slate-600 mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white p-1.5"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="bg-slate-700 border-b border-slate-600 px-4 py-2">
          <div className="flex items-center space-x-3 max-w-md">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Replace..."
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 bg-slate-900 overflow-hidden">
        <Editor
          height={isFullscreen ? "100%" : "500px"}
          language={normalizedLanguage}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          theme="vs-dark"
          loading={
            <div className="flex items-center justify-center h-full bg-slate-900 text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-2"></div>
                <p>Loading Monaco Editor...</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Status bar */}
      <div className="bg-cyan-600 text-white px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <span>{currentLangConfig.icon}</span>
            <span className="font-medium">{language.toUpperCase()}</span>
          </span>
          
          <span>
            Ln {currentLine}, Col {currentColumn}
          </span>
          
          <span>
            {value.split('\n').length} lines
          </span>
          
          <span>
            {value.length} characters
          </span>
          
          <span>
            {wordCount} words
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span className="flex items-center space-x-1">
            <Monitor className="w-3 h-3" />
            <span>Dark+</span>
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 mx-4 mb-4 rounded-lg">
          {error}
        </div>
      )}
    </EditorContainer>
  );
};

export default VSCodeEditor;
