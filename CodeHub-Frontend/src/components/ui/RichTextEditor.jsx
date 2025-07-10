import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Type,
  AtSign,
  Smile
} from 'lucide-react';
import { Button } from '../ui';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your comment...",
  maxLength = 2000,
  mentions = [],
  onMention
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [filteredMentions, setFilteredMentions] = useState([]);
  const textareaRef = useRef(null);
  const mentionsRef = useRef(null);

  useEffect(() => {
    if (mentionQuery) {
      const filtered = mentions.filter(mention =>
        mention.username.toLowerCase().includes(mentionQuery.toLowerCase())
      );
      setFilteredMentions(filtered);
      setShowMentions(filtered.length > 0);
    } else {
      setShowMentions(false);
    }
  }, [mentionQuery, mentions]);

  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   before + selectedText + after + 
                   value.substring(end);
    
    onChange(newText);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      insertFormatting('  ');
    }
    
    // Handle @ mentions
    if (e.key === '@') {
      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastWord = textBeforeCursor.split(/\s/).pop();
      
      if (!lastWord || lastWord === '') {
        setMentionQuery('');
        setShowMentions(true);
      }
    }
    
    // Handle mention selection
    if (showMentions && e.key === 'Enter' && filteredMentions.length > 0) {
      e.preventDefault();
      handleMentionSelect(filteredMentions[0]);
    }
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Check for mentions
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  };

  const handleMentionSelect = (mention) => {
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const textAfterCursor = value.substring(cursorPos);
    
    // Find the @ symbol position
    const atPos = textBeforeCursor.lastIndexOf('@');
    
    const newText = value.substring(0, atPos) + 
                   `@${mention.username} ` + 
                   textAfterCursor;
    
    onChange(newText);
    setShowMentions(false);
    setMentionQuery('');
    
    if (onMention) {
      onMention(mention);
    }
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        atPos + mention.username.length + 2,
        atPos + mention.username.length + 2
      );
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertFormatting('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertFormatting('*', '*'), title: 'Italic' },
    { icon: Code, action: () => insertFormatting('`', '`'), title: 'Inline code' },
    { icon: Quote, action: () => insertFormatting('> '), title: 'Quote' },
    { icon: List, action: () => insertFormatting('- '), title: 'Bullet list' },
    { icon: ListOrdered, action: () => insertFormatting('1. '), title: 'Numbered list' },
    { icon: Link, action: () => insertFormatting('[', '](url)'), title: 'Link' },
  ];

  return (
    <div className="relative">
      <div className="border border-slate-600 rounded-lg bg-slate-700 overflow-hidden">
        {/* Toolbar */}
        {isFocused && (
          <div className="flex items-center gap-1 p-2 border-b border-slate-600 bg-slate-800/50">
            {formatButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-600"
                title={button.title}
              >
                <button.icon className="w-4 h-4" />
              </Button>
            ))}
            
            <div className="w-px h-6 bg-slate-600 mx-1" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMentions(!showMentions)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-600"
              title="Mention user"
            >
              <AtSign className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-600"
              title="Emoji (coming soon)"
              disabled
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding to allow mention selection
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent border-0 rounded-0 px-4 py-3 text-white placeholder-slate-400 resize-none focus:ring-0 focus:outline-none"
            rows={isFocused ? 6 : 3}
            maxLength={maxLength}
          />
          
          {/* Character count */}
          <div className="absolute bottom-2 right-3 text-xs text-slate-400">
            {value.length}/{maxLength}
          </div>
        </div>

        {/* Mentions dropdown */}
        {showMentions && (
          <div 
            ref={mentionsRef}
            className="absolute z-50 w-full bg-slate-800 border border-slate-600 rounded-b-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {filteredMentions.length > 0 ? (
              filteredMentions.map((mention) => (
                <button
                  key={mention.id}
                  onClick={() => handleMentionSelect(mention)}
                  className="w-full px-4 py-2 text-left hover:bg-slate-700 flex items-center space-x-2"
                >
                  <img
                    src={mention.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mention.username}`}
                    alt={mention.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <div className="text-white text-sm">@{mention.username}</div>
                    {mention.fullName && (
                      <div className="text-slate-400 text-xs">{mention.fullName}</div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-slate-400 text-sm">
                No users found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help text */}
      {isFocused && (
        <div className="mt-2 text-xs text-slate-400">
          <span className="font-medium">Tip:</span> Use **bold**, *italic*, `code`, {">"} quote, @ to mention users
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
