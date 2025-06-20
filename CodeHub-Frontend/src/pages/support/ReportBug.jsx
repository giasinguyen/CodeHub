import React, { useState } from 'react';
import { 
  Bug, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  X,
  FileText,
  Camera,
  Monitor,
  Smartphone,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, TextArea, Select } from '../../components/ui';
import toast from 'react-hot-toast';

const ReportBug = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    category: '',
    steps: '',
    expected: '',
    actual: '',
    browser: '',
    os: '',
    device: '',
    attachments: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const severityOptions = [
    { value: 'low', label: 'Low - Minor inconvenience', color: 'text-green-600' },
    { value: 'medium', label: 'Medium - Affects functionality', color: 'text-yellow-600' },
    { value: 'high', label: 'High - Major feature broken', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical - App unusable', color: 'text-red-600' }
  ];

  const categoryOptions = [
    { value: 'ui', label: 'User Interface' },
    { value: 'performance', label: 'Performance' },
    { value: 'auth', label: 'Authentication' },
    { value: 'snippets', label: 'Code Snippets' },
    { value: 'search', label: 'Search & Filters' },
    { value: 'profile', label: 'User Profile' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files) => {
    const fileList = Array.from(files);
    const validFiles = fileList.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/json'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported format`);
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles].slice(0, 3) // Max 3 files
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Bug report submitted successfully! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: '',
        steps: '',
        expected: '',
        actual: '',
        browser: '',
        os: '',
        device: '',
        attachments: []
      });
        } catch {
      toast.error('Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/support">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Support
              </Link>
            </Button>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Bug className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Report a Bug
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Help us improve CodeHub by reporting issues you encounter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bug Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Severity *
                  </label>
                  <Select
                    value={formData.severity}
                    onChange={(value) => handleInputChange('severity', value)}
                  >
                    {severityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <div className="flex items-center mt-2 space-x-2">
                    {getSeverityIcon(formData.severity)}
                    <span className={`text-sm ${severityOptions.find(opt => opt.value === formData.severity)?.color}`}>
                      {severityOptions.find(opt => opt.value === formData.severity)?.label}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            {/* Bug Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Bug Description
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Detailed Description *
                  </label>
                  <TextArea
                    placeholder="Describe the bug in detail. What happened? When did it occur?"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Steps to Reproduce
                  </label>
                  <TextArea
                    placeholder="1. Go to... &#10;2. Click on... &#10;3. Scroll down to... &#10;4. See error"
                    value={formData.steps}
                    onChange={(e) => handleInputChange('steps', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expected Behavior
                    </label>
                    <TextArea
                      placeholder="What should have happened?"
                      value={formData.expected}
                      onChange={(e) => handleInputChange('expected', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Actual Behavior
                    </label>
                    <TextArea
                      placeholder="What actually happened?"
                      value={formData.actual}
                      onChange={(e) => handleInputChange('actual', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Environment Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Environment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Browser
                  </label>
                  <Input
                    type="text"
                    placeholder="Chrome 91.0.4472.124"
                    value={formData.browser}
                    onChange={(e) => handleInputChange('browser', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Monitor className="w-4 h-4 inline mr-1" />
                    Operating System
                  </label>
                  <Input
                    type="text"
                    placeholder="Windows 10, macOS 11.4, Ubuntu 20.04"
                    value={formData.os}
                    onChange={(e) => handleInputChange('os', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Smartphone className="w-4 h-4 inline mr-1" />
                    Device
                  </label>
                  <Input
                    type="text"
                    placeholder="Desktop, iPhone 12, Samsung Galaxy S21"
                    value={formData.device}
                    onChange={(e) => handleInputChange('device', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Attachments (Optional)
              </h2>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    Drag and drop files here, or{' '}
                    <label className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                      browse
                      <input
                        type="file"
                        multiple
                        accept="image/*,.txt,.json"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Screenshots, logs, or other relevant files (max 5MB each, up to 3 files)
                  </p>
                </div>
              </div>
              
              {/* Attachment List */}
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.type.startsWith('image/') ? (
                          <Camera className="w-5 h-5 text-green-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                * Required fields
              </p>
              <div className="flex space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/support">Cancel</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ReportBug;
