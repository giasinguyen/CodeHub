import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star,  
  Lightbulb, 
  Heart, 
  ThumbsUp,
  ArrowLeft,
  Send,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, TextArea, Select } from '../../components/ui';
import toast from 'react-hot-toast';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    email: '',
    category: 'general',
    anonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    {
      id: 'general',
      title: 'General Feedback',
      description: 'Share your thoughts about CodeHub',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: Lightbulb,
      color: 'bg-yellow-500'
    },
    {
      id: 'compliment',
      title: 'Compliment',
      description: 'Tell us what you love about CodeHub',
      icon: Heart,
      color: 'bg-pink-500'
    },
    {
      id: 'suggestion',
      title: 'Suggestion',
      description: 'Ideas to make CodeHub better',
      icon: ThumbsUp,
      color: 'bg-green-500'
    }
  ];

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'ui-ux', label: 'User Interface & Experience' },
    { value: 'performance', label: 'Performance' },
    { value: 'features', label: 'Features & Functionality' },
    { value: 'search', label: 'Search & Discovery' },
    { value: 'community', label: 'Community Features' },
    { value: 'mobile', label: 'Mobile Experience' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeSelect = (type) => {
    setFeedbackType(type);
    setFormData(prev => ({
      ...prev,
      category: type
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Thank you for your feedback! We appreciate your input.');
      
      // Reset form
      setFormData({
        title: '',
        message: '',
        email: '',
        category: 'general',
        anonymous: false
      });
      setRating(0);
      setFeedbackType('general');
      
    } catch {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingEmoji = (value) => {
    if (value <= 2) return <Frown className="w-6 h-6 text-red-500" />;
    if (value <= 3) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Smile className="w-6 h-6 text-green-500" />;
  };

  const selectedType = feedbackTypes.find(type => type.id === feedbackType);
  const IconComponent = selectedType?.icon || MessageSquare;

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
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Send Feedback
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Help us improve CodeHub with your suggestions and feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Type Selection */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Feedback Type
              </h2>
              <div className="space-y-3">
                {feedbackTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        feedbackType === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <TypeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {type.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${selectedType?.color || 'bg-blue-500'}`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedType?.title || 'General Feedback'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedType?.description || 'Share your thoughts about CodeHub'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How would you rate your overall experience?
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <div className="flex items-center space-x-2">
                        {getRatingEmoji(rating)}
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {rating === 1 && 'Poor'}
                          {rating === 2 && 'Fair'}
                          {rating === 3 && 'Good'}
                          {rating === 4 && 'Very Good'}
                          {rating === 5 && 'Excellent'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Brief summary of your feedback"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Feedback *
                  </label>
                  <TextArea
                    placeholder="Tell us about your experience, suggestions, or ideas..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Be specific and provide as much detail as possible to help us understand your feedback.
                  </p>
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Leave your email if you'd like us to follow up on your feedback.
                  </p>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700 dark:text-gray-300">
                    Submit feedback anonymously
                  </label>
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
                      className="min-w-[140px]"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Feedback Matters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">850+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Feature requests received</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">320+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Improvements implemented</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">User satisfaction rate</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
