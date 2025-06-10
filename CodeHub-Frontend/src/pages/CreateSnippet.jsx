import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  X, 
  Upload,
  FileText,
  Globe,
  Lock,
  Users,
  Copy,
  Download,
  Settings,
  Palette,
  Monitor,
  Sparkles,
  Zap,
  Heart,
  Star,
  Layers,
  Terminal,
  Play,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Code,
  BookOpen,
  Tag,
  Hash,
  Image,
  Link,
  Share2,
  GitBranch,
  ChevronDown
} from 'lucide-react';
import { Button, Input, Card, CodeEditor } from '../components/ui';
import { snippetsAPI } from '../services/api';
import { useSnippet } from '../contexts/SnippetContext';
import toast from 'react-hot-toast';

const CreateSnippet = () => {
  const navigate = useNavigate();
  const { createSnippet } = useSnippet();  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    visibility: 'public',
    tags: [],
    mediaUrls: []
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdSnippet, setCreatedSnippet] = useState(null);  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [characterCount, setCharacterCount] = useState({ title: 0, description: 0, code: 0 });
  // Load available languages and tags on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [languagesResponse, tagsResponse] = await Promise.all([
          snippetsAPI.getLanguages(),
          snippetsAPI.getTags()
        ]);
        setAvailableLanguages(languagesResponse.data || []);
        setAvailableTags(tagsResponse.data || []);
      } catch (error) {
        console.error('Failed to load languages/tags:', error);
        // Use default languages if API fails
        setAvailableLanguages([
          'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
          'php', 'ruby', 'go', 'rust', 'html', 'css', 'sql', 'shell'
        ]);
        setAvailableTags(['web', 'api', 'algorithm', 'frontend', 'backend', 'database']);
      }
    };
    
    loadData();
  }, []);

  // Update character counts
  useEffect(() => {
    setCharacterCount({
      title: formData.title.length,
      description: formData.description.length,
      code: formData.code.length
    });
    
    // Update progress based on form completion
    const completedFields = [
      formData.title.trim(),
      formData.description.trim(),
      formData.code.trim(),
      formData.language
    ].filter(Boolean).length;
    setProgress((completedFields / 4) * 100);
  }, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleSuggestedTag = (tag) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const loadTemplate = (type) => {
    const templates = {
      function: {
        title: 'Utility Function',
        description: 'A reusable utility function that...',
        code: `function utilityFunction(param) {
  // Your implementation here
  return param;
}`,
        language: 'javascript',
        tags: ['function', 'utility']
      },
      class: {
        title: 'Class Implementation',
        description: 'A well-structured class that...',
        code: `class MyClass {
  constructor() {
    // Initialize properties
  }
  
  method() {
    // Method implementation
  }
}`,
        language: 'javascript',
        tags: ['class', 'oop']
      },
      api: {
        title: 'API Endpoint',
        description: 'REST API endpoint implementation',
        code: `app.get('/api/resource', async (req, res) => {
  try {
    // Handle request
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`,
        language: 'javascript',
        tags: ['api', 'backend', 'express']
      },
      algorithm: {
        title: 'Algorithm Solution',
        description: 'Efficient algorithm implementation',
        code: `function algorithmSolution(input) {
  // Algorithm logic here
  return result;
}`,
        language: 'javascript',
        tags: ['algorithm', 'problem-solving']
      }
    };

    const template = templates[type];
    if (template) {
      setFormData(prev => ({
        ...prev,
        ...template
      }));
      setShowTemplateModal(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => file.type.startsWith('text/'));
    
    if (textFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          code: event.target.result,
          title: prev.title || textFile.name.replace(/\.[^/.]+$/, '')
        }));
      };
      reader.readAsText(textFile);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }
    
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Remove authorId - backend gets it from authenticated user context
      const snippetData = { ...formData };
      
      const result = await createSnippet(snippetData);
      
      if (result.success) {
        setCreatedSnippet(result.data);
        setShowSuccessModal(true);
      } else {
        setErrors({
          submit: result.error
        });
      }
    } catch (error) {
      console.error('Error creating snippet:', error);
      const message = error.response?.data?.message || 'Failed to create snippet';
      setErrors({
        submit: message
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDraft = async () => {
    if (!formData.title.trim() && !formData.code.trim()) {
      toast.error('Please add at least a title or code to save as draft');
      return;
    }
    
    setIsLoading(true);
    try {
      const draftData = {
        ...formData,
        visibility: 'draft'
      };
      
      await snippetsAPI.createSnippet(draftData);
      toast.success('Draft saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsLoading(false);
    }
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can view this snippet' },
    { value: 'unlisted', label: 'Unlisted', icon: Users, description: 'Only people with the link can view' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Only you can view this snippet' }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                      <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        Create New Snippet
                      </h1>
                      <p className="text-slate-400 mt-1">
                        Share your code with the developer community
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-64 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.round(progress)}% completed
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateModal(true)}
                  className="bg-slate-800/50 backdrop-blur-sm border-slate-600 hover:border-cyan-500 transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                  className="bg-slate-800/50 backdrop-blur-sm border-slate-600 hover:border-cyan-500 transition-all"
                >
                  {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDraft}
                  disabled={isLoading}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {!isPreview ? (
              <motion.form
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Enhanced Title & Description Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                        <Card.Header>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-5 h-5 text-cyan-400" />
                              <h3 className="text-lg font-semibold text-white">Snippet Details</h3>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                              <Info className="w-4 h-4" />
                              <span>Required fields</span>
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Content className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-slate-300">
                                Title *
                              </label>
                              <span className="text-xs text-slate-500">
                                {characterCount.title}/200
                              </span>
                            </div>
                            <Input
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              placeholder="Enter a descriptive title for your snippet..."
                              error={errors.title}
                              disabled={isLoading}
                              className="bg-slate-900/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                              required
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-slate-300">
                                Description *
                              </label>
                              <span className="text-xs text-slate-500">
                                {characterCount.description}/1000
                              </span>
                            </div>
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              placeholder="Describe what your code does, how to use it, and any important notes..."
                              rows={4}
                              className="w-full bg-slate-900/50 border border-slate-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none transition-all"
                              disabled={isLoading}
                              required
                            />
                            {errors.description && (
                              <p className="mt-1 text-sm text-red-400 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.description}
                              </p>
                            )}
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>

                    {/* Enhanced Code Editor */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                        <Card.Header>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Terminal className="w-5 h-5 text-purple-400" />
                              <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <Code className="w-4 h-4" />
                                <span>{characterCount.code} characters</span>
                              </div>
                              <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                disabled={isLoading}
                              >
                                <option value="">Select Language</option>
                                {availableLanguages.map(lang => (
                                  <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Content>
                          <div
                            className={`relative ${isDragging ? 'bg-cyan-500/10 border-cyan-500' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            {isDragging && (
                              <div className="absolute inset-0 bg-cyan-500/20 border-2 border-dashed border-cyan-500 rounded-lg flex items-center justify-center z-10">
                                <div className="text-center">
                                  <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                                  <p className="text-cyan-400 font-medium">Drop your code file here</p>
                                </div>
                              </div>
                            )}
                            <CodeEditor
                              value={formData.code}
                              onChange={handleChange}
                              language={formData.language}
                              placeholder="Paste or type your code here... You can also drag and drop a file!"
                              error={errors.code}
                              name="code"
                              className="min-h-[400px]"
                            />
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  </div>                  {/* Enhanced Sidebar */}
                  <div className="space-y-6">
                    {/* Enhanced Visibility */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                        <Card.Header>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-5 h-5 text-green-400" />
                            <h3 className="text-lg font-semibold text-white">Visibility</h3>
                          </div>
                        </Card.Header>
                        <Card.Content className="space-y-3">
                          {visibilityOptions.map(option => {
                            const Icon = option.icon;
                            return (
                              <motion.label
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                  formData.visibility === option.value
                                    ? 'border-cyan-500 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/20'
                                    : 'border-slate-600 hover:border-slate-500 bg-slate-900/30'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="visibility"
                                  value={option.value}
                                  checked={formData.visibility === option.value}
                                  onChange={handleChange}
                                  className="mt-1 hidden"
                                  disabled={isLoading}
                                />
                                <div className={`p-2 rounded-lg ${
                                  formData.visibility === option.value 
                                    ? 'bg-cyan-500/20 text-cyan-400' 
                                    : 'bg-slate-700 text-slate-400'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-white">{option.label}</span>
                                    {formData.visibility === option.value && (
                                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                                </div>
                              </motion.label>
                            );
                          })}
                        </Card.Content>
                      </Card>
                    </motion.div>

                    {/* Enhanced Tags */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                        <Card.Header>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Tag className="w-5 h-5 text-yellow-400" />
                              <h3 className="text-lg font-semibold text-white">Tags</h3>
                            </div>
                            <span className="text-xs text-slate-500">
                              {formData.tags.length}/5
                            </span>
                          </div>
                        </Card.Header>
                        <Card.Content className="space-y-4">
                          <div className="flex space-x-2">
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a tag..."
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              disabled={isLoading || formData.tags.length >= 5}
                              className="bg-slate-900/50 border-slate-600 focus:border-yellow-500 focus:ring-yellow-500/20"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddTag}
                              disabled={!newTag.trim() || isLoading || formData.tags.length >= 5}
                              className="px-3 border-slate-600 hover:border-yellow-500 hover:bg-yellow-500/10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {/* Suggested Tags */}
                          {availableTags.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-400 mb-2 flex items-center">
                                <Lightbulb className="w-3 h-3 mr-1" />
                                Suggested tags
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {availableTags.slice(0, 6).filter(tag => !formData.tags.includes(tag)).map((tag, index) => (
                                  <motion.button
                                    key={index}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSuggestedTag(tag)}
                                    className="px-2 py-1 bg-slate-700 text-slate-300 rounded-md text-xs hover:bg-yellow-500/20 hover:text-yellow-400 transition-all"
                                    disabled={formData.tags.length >= 5}
                                  >
                                    {tag}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {formData.tags.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-400 flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                Your tags
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                  <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm border border-yellow-500/30"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTag(tag)}
                                      className="ml-2 text-yellow-400 hover:text-red-400 transition-colors"
                                      disabled={isLoading}
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}
                        </Card.Content>
                      </Card>
                    </motion.div>

                    {/* Advanced Options */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all">
                        <Card.Header>
                          <button
                            type="button"
                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                            className="flex items-center justify-between w-full"
                          >
                            <div className="flex items-center space-x-2">
                              <Settings className="w-5 h-5 text-blue-400" />
                              <h3 className="text-lg font-semibold text-white">Advanced Options</h3>
                            </div>
                            <motion.div
                              animate={{ rotate: showAdvancedOptions ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            </motion.div>
                          </button>
                        </Card.Header>
                        <AnimatePresence>
                          {showAdvancedOptions && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <Card.Content className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Repository Link
                                  </label>
                                  <div className="flex space-x-2">
                                    <div className="flex-1 relative">
                                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <input
                                        type="url"
                                        placeholder="https://github.com/..."
                                        className="w-full pl-10 bg-slate-900/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Demo URL
                                  </label>
                                  <div className="flex space-x-2">
                                    <div className="flex-1 relative">
                                      <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <input
                                        type="url"
                                        placeholder="https://demo.example.com"
                                        className="w-full pl-10 bg-slate-900/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Card.Content>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>

                    {/* Submit Error */}
                    {errors.submit && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Card className="border-red-500/50 bg-red-500/10">
                          <Card.Content>
                            <div className="p-3 flex items-center space-x-2">
                              <AlertCircle className="w-5 h-5 text-red-400" />
                              <p className="text-sm text-red-400">{errors.submit}</p>
                            </div>
                          </Card.Content>
                        </Card>
                      </motion.div>
                    )}

                    {/* Enhanced Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border-slate-600">
                        <Card.Content>
                          <div className="space-y-3">
                            <Button
                              type="submit"
                              variant="primary"
                              size="lg"
                              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 shadow-lg shadow-cyan-500/25 transition-all duration-200"
                              isLoading={isLoading}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                  Creating...
                                </div>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 mr-2" />
                                  Create Snippet
                                </>
                              )}
                            </Button>
                            
                            <Button
                              type="button"
                              variant="ghost"
                              size="lg"
                              className="w-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
                              onClick={() => navigate('/snippets')}
                              disabled={isLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Card.Content>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </motion.form>
            ) : (
              // Preview Mode
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                  <Card.Header>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {formData.title || 'Untitled Snippet'}
                        </h2>
                        <p className="text-slate-400">
                          {formData.description || 'No description provided'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">
                          {formData.language || 'No language'}
                        </span>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Content>
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-slate-300">
                        <code>{formData.code || '// No code provided'}</code>
                      </pre>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-md text-sm border border-yellow-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card.Content>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>          {/* Template Selection Modal */}
          <AnimatePresence>
            {showTemplateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Choose a Template</h3>
                        <p className="text-slate-400 text-sm">Get started quickly with a pre-built template</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowTemplateModal(false)}
                      className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'function',
                        title: 'Utility Function',
                        description: 'A reusable utility function template',
                        icon: Code,
                        color: 'from-blue-500 to-cyan-500',
                        popular: true
                      },
                      {
                        id: 'class',
                        title: 'Class Implementation',
                        description: 'Object-oriented class structure',
                        icon: Layers,
                        color: 'from-purple-500 to-pink-500'
                      },
                      {
                        id: 'api',
                        title: 'API Endpoint',
                        description: 'REST API endpoint with error handling',
                        icon: Share2,
                        color: 'from-green-500 to-emerald-500',
                        popular: true
                      },
                      {
                        id: 'algorithm',
                        title: 'Algorithm Solution',
                        description: 'Problem-solving algorithm template',
                        icon: GitBranch,
                        color: 'from-orange-500 to-red-500'
                      }
                    ].map((template) => {
                      const Icon = template.icon;
                      return (
                        <motion.button
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => loadTemplate(template.id)}
                          className="p-4 bg-slate-900/50 border border-slate-600 rounded-xl hover:border-slate-500 transition-all text-left group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 bg-gradient-to-r ${template.color} rounded-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            {template.popular && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                                Popular
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {template.title}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {template.description}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Pro Tip</span>
                    </div>
                    <p className="text-sm text-slate-400">
                      Templates provide a starting point with best practices. You can always customize them to fit your needs!
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Success Modal */}
          <AnimatePresence>
            {showSuccessModal && createdSnippet && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 max-w-md w-full border border-slate-600"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        🎉 Snippet Created!
                      </h3>
                      <p className="text-slate-400 mb-6">
                        Your snippet <span className="text-cyan-400 font-medium">"{createdSnippet.title}"</span> has been successfully created and is now live!
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                        onClick={() => navigate(`/snippets/${createdSnippet.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Snippet
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10"
                          onClick={() => navigate('/snippets')}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Browse
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-slate-600 hover:border-purple-500 hover:bg-purple-500/10"
                          onClick={() => {
                            setShowSuccessModal(false);
                            setCreatedSnippet(null);
                            // Reset form for creating another snippet
                            setFormData({
                              title: '',
                              description: '',
                              code: '',
                              language: 'javascript',
                              visibility: 'public',
                              tags: [],
                              mediaUrls: []
                            });
                            setErrors({});
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          New
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 p-3 bg-slate-900/50 rounded-lg border border-slate-600"
                    >
                      <div className="flex items-center justify-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span>0 likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span>1 view</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>0 stars</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CreateSnippet;
