import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Code, 
  Star, 
  Users, 
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  ExternalLink,
  Heart,
  MessageSquare,
  Award,
  Zap
} from 'lucide-react';
import { Button, Card } from '../ui';
import SkillBadge from './SkillBadge';
import ReputationBadge from './ReputationBadge';

const DeveloperCard = ({ developer, onClick, variant = 'default', showActions = true }) => {
  const {
    id,
    username,
    fullName,
    avatarUrl,
    bio,
    location,
    skills = [],
    reputation = 0,
    followers = 0,
    following = 0,
    contributions = 0,
    joinedAt,
    isOnline = false,
    lastActive,
    githubUrl,
    twitterUrl,
    linkedinUrl,
    websiteUrl,
    email,
    isVerified = false,
    badges = [],
    recentActivity = []
  } = developer || {};

  const handleCardClick = () => {
    onClick && onClick(developer);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const socialLinks = [
    { icon: Github, url: githubUrl, color: 'text-gray-400 hover:text-white' },
    { icon: Twitter, url: twitterUrl, color: 'text-blue-400 hover:text-blue-300' },
    { icon: Linkedin, url: linkedinUrl, color: 'text-blue-600 hover:text-blue-500' },
    { icon: Globe, url: websiteUrl, color: 'text-green-400 hover:text-green-300' }
  ].filter(link => link.url);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card 
        className={`cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 border-slate-700 hover:border-cyan-500/50 bg-slate-800/50 backdrop-blur-sm ${
          variant === 'featured' ? 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10' : ''
        }`}
        onClick={handleCardClick}
      >
        <Card.Content className="p-6">
          {/* Header with Avatar and Online Status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                  alt={fullName || username}
                  className="w-16 h-16 rounded-full border-2 border-slate-600 group-hover:border-cyan-500 transition-colors"
                />
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                )}
                {isVerified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {fullName || username}
                </h3>
                <p className="text-sm text-slate-400">@{username}</p>
                <ReputationBadge reputation={reputation} />
              </div>
            </div>
            
            {/* Action Buttons */}
            {showActions && (
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-cyan-500/20 hover:text-cyan-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle follow action
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-purple-500/20 hover:text-purple-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle message action
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
              {bio}
            </p>
          )}

          {/* Location and Join Date */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
            {location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            )}
            {joinedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Joined {formatDate(joinedAt)}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 4).map((skill, index) => (
                  <SkillBadge key={index} skill={skill} size="sm" />
                ))}
                {skills.length > 4 && (
                  <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <p className="text-lg font-semibold text-white">{contributions}</p>
              <p className="text-xs text-slate-400">Contributions</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{followers}</p>
              <p className="text-xs text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{following}</p>
              <p className="text-xs text-slate-400">Following</p>
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {badges.slice(0, 3).map((badge, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded text-xs border border-yellow-500/30"
                >
                  {badge}
                </div>
              ))}
            </div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${link.color} transition-colors`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
              
              {lastActive && !isOnline && (
                <span className="text-xs text-slate-500">
                  Active {formatDate(lastActive)}
                </span>
              )}
            </div>
          )}

          {/* Featured Badge */}
          {variant === 'featured' && (
            <div className="absolute top-2 right-2">
              <div className="px-2 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs rounded-full flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Featured</span>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default DeveloperCard;
