import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Users
} from 'lucide-react';
import { Button, Input, Card } from '../components/ui';
import { snippetsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreateSnippet = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    visibility: 'public',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  // Load available languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await snippetsAPI.getLanguages();
        setAvailableLanguages(response.data || []);
      } catch (error) {
        console.error('Failed to load languages:', error);
        // Use default languages if API fails
        setAvailableLanguages([
          'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
          'php', 'ruby', 'go', 'rust', 'html', 'css', 'sql', 'shell'
        ]);
      }
    };
    
    loadLanguages();
  }, []);

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
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
      
      const response = await snippetsAPI.createSnippet(snippetData);
      
      toast.success('Snippet created successfully!');
      navigate(`/snippets/${response.data.id}`);
    } catch (error) {
      console.error('Error creating snippet:', error);
      const message = error.response?.data?.message || 'Failed to create snippet';
      toast.error(message);
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
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Create New Snippet
              </h1>
              <p className="text-slate-400">
                Share your code with the developer community
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleDraft}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-white">Snippet Details</h3>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <Input
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title for your snippet..."
                    error={errors.title}
                    disabled={isLoading}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what your code does, how to use it, and any important notes..."
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      disabled={isLoading}
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>
                </Card.Content>
              </Card>

              {/* Code Editor */}
              <Card>
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Code</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="bg-slate-700 border border-slate-600 text-white px-3 py-1 rounded text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  {isPreview ? (
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <pre className="text-sm text-slate-300 overflow-x-auto">
                        <code>{formData.code || 'No code to preview...'}</code>
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Paste or type your code here..."
                        rows={20}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm resize-none"
                        disabled={isLoading}
                        required
                      />
                      {errors.code && (
                        <p className="mt-1 text-sm text-red-400">{errors.code}</p>
                      )}
                    </div>
                  )}
                </Card.Content>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Visibility */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-white">Visibility</h3>
                </Card.Header>
                <Card.Content className="space-y-3">
                  {visibilityOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.visibility === option.value
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.visibility === option.value}
                          onChange={handleChange}
                          className="mt-1"
                          disabled={isLoading}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-white">{option.label}</span>
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </Card.Content>
              </Card>

              {/* Tags */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold text-white">Tags</h3>
                </Card.Header>
                <Card.Content className="space-y-3">
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
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || isLoading}
                      className="px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-slate-700 text-slate-300 px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-slate-400 hover:text-red-400 transition-colors"
                            disabled={isLoading}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Card.Content>
              </Card>

              {/* Submit Error */}
              {errors.submit && (
                <Card>
                  <Card.Content>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-sm text-red-400">{errors.submit}</p>
                    </div>
                  </Card.Content>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <Card.Content>
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      <Code2 className="w-4 h-4 mr-2" />
                      {isLoading ? 'Creating...' : 'Create Snippet'}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      className="w-full"
                      onClick={() => navigate('/dashboard')}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSnippet;
