import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Code, 
  FileText, 
  Users, 
  BookOpen,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';

const CreateModal = ({ isOpen, onToggle, className = '' }) => {
  const navigate = useNavigate();

  const createOptions = [
    {
      id: 'snippet',
      title: 'Create Code Snippet',
      description: 'Share your code with the community',
      icon: Code,
      iconColor: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      action: () => {
        navigate('/create-snippet');
        onToggle();
      }
    },
    {
      id: 'article',
      title: 'Write Article',
      description: 'Share your knowledge and experiences',
      icon: FileText,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      action: () => {
        // Navigate to article creation (future feature)
        console.log('Create article - coming soon');
        onToggle();
      }
    },
    {
      id: 'project',
      title: 'Share Project',
      description: 'Showcase your latest project',
      icon: BookOpen,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      action: () => {
        // Navigate to project sharing (future feature)
        console.log('Share project - coming soon');
        onToggle();
      }
    },
    {
      id: 'team',
      title: 'Create Team',
      description: 'Collaborate with other developers',
      icon: Users,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      action: () => {
        // Navigate to team creation (future feature)
        console.log('Create team - coming soon');
        onToggle();
      }
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-md mx-4 bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl shadow-2xl border border-slate-700 dark:border-slate-700 light:border-gray-200 ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 dark:border-slate-700 light:border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">
                  Create Something New
                </h2>
                <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">
                  What would you like to create today?
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-slate-400 hover:text-white dark:hover:text-white light:hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-3">
              {createOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    onClick={option.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 text-left bg-slate-700/50 dark:bg-slate-700/50 light:bg-gray-50 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 rounded-lg border border-slate-600 dark:border-slate-600 light:border-gray-200 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${option.bgColor}`}>
                          <Icon className={`w-5 h-5 ${option.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white dark:text-white light:text-gray-900 group-hover:text-cyan-400 transition-colors">
                            {option.title}
                          </h3>
                          <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-400 light:text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-700/20 dark:bg-slate-700/20 light:bg-gray-50 rounded-b-xl border-t border-slate-700 dark:border-slate-700 light:border-gray-200">
            <p className="text-xs text-slate-500 dark:text-slate-500 light:text-gray-500 text-center">
              More creation options coming soon! 🚀
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateModal;
