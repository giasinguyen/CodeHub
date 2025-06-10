import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Star, MapPin, Calendar, Users, ExternalLink, Github, Linkedin, Twitter,
  Mail, Phone, Award, Code, TrendingUp, Heart, MessageCircle, Share2
} from 'lucide-react';
import { Card } from '../ui';
import { SkillBadge, ReputationBadge } from './';

const DeveloperModal = ({ isOpen, onClose, developer }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!developer) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'activity', label: 'Activity' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // Add API call here
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start space-x-6">
                <img
                  src={developer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&background=3b82f6&color=fff&size=120`}
                  alt={developer.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20"
                />
                
                <div className="flex-1 text-white">                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold">{developer.name}</h2>
                    <ReputationBadge reputation={developer.reputation} />
                  </div>
                  <p className="text-xl text-white/90 mb-3">{developer.title}</p>
                  
                  <div className="flex items-center space-x-6 text-white/80 mb-4">
                    {developer.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{developer.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(developer.joinedAt).getFullYear()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{developer.followers || 0} followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{developer.rating || '4.8'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-2 rounded-full font-medium transition-all ${
                        isFollowing 
                          ? 'bg-white/20 text-white hover:bg-white/30' 
                          : 'bg-white text-slate-900 hover:bg-white/90'
                      }`}
                    >
                      <Heart className={`w-4 h-4 inline mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700 bg-slate-800">
              <div className="flex space-x-1 p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Bio */}
                  {developer.bio && (
                    <div>
                      <h3 className="text-white font-semibold mb-3">About</h3>
                      <p className="text-slate-300 leading-relaxed">{developer.bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Skills & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {developer.skills?.map(skill => (
                        <SkillBadge key={skill} skill={skill} />
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-slate-800/50 text-center">
                      <Card.Content className="p-4">
                        <div className="text-2xl font-bold text-blue-400 mb-1">
                          {developer.projects || 12}
                        </div>
                        <div className="text-slate-400 text-sm">Projects</div>
                      </Card.Content>
                    </Card>
                    <Card className="bg-slate-800/50 text-center">
                      <Card.Content className="p-4">
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {developer.contributions || 248}
                        </div>
                        <div className="text-slate-400 text-sm">Contributions</div>
                      </Card.Content>
                    </Card>
                    <Card className="bg-slate-800/50 text-center">
                      <Card.Content className="p-4">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {developer.reviews || 45}
                        </div>
                        <div className="text-slate-400 text-sm">Reviews</div>
                      </Card.Content>
                    </Card>
                    <Card className="bg-slate-800/50 text-center">
                      <Card.Content className="p-4">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                          {developer.experience || '3+'}
                        </div>
                        <div className="text-slate-400 text-sm">Years Exp</div>
                      </Card.Content>
                    </Card>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Contact & Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {developer.email && (
                        <div className="flex items-center space-x-3 text-slate-300">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <span>{developer.email}</span>
                        </div>
                      )}
                      {developer.phone && (
                        <div className="flex items-center space-x-3 text-slate-300">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <span>{developer.phone}</span>
                        </div>
                      )}
                      {developer.socialLinks?.github && (
                        <a 
                          href={developer.socialLinks.github}
                          className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors"
                        >
                          <Github className="w-5 h-5 text-slate-400" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {developer.socialLinks?.linkedin && (
                        <a 
                          href={developer.socialLinks.linkedin}
                          className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-slate-400" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {developer.website && (
                        <a 
                          href={developer.website}
                          className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 text-slate-400" />
                          <span>Portfolio</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="text-center py-12">
                  <Code className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Projects Coming Soon</h3>
                  <p className="text-slate-400">Project showcase will be available in the next update.</p>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Activity Feed Coming Soon</h3>
                  <p className="text-slate-400">Recent activity and contributions will be displayed here.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Reviews Coming Soon</h3>
                  <p className="text-slate-400">Client reviews and testimonials will be shown here.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeveloperModal;
