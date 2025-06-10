import React from 'react';
import { Star, MapPin, Calendar, Users, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react';
import { Card } from '../ui';
import { SkillBadge, ReputationBadge } from './';

const DeveloperList = ({ developers, loading, onDeveloperClick }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-slate-800/50 animate-pulse">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {developers.map((developer, index) => (
        <motion.div
          key={developer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className="bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group border border-slate-700/50 hover:border-blue-500/30"
            onClick={() => onDeveloperClick?.(developer)}
          >
            <Card.Content className="p-6">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={developer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name)}&background=3b82f6&color=fff&size=64`}
                    alt={developer.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-600 group-hover:ring-blue-500/50 transition-all duration-300"
                  />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {developer.name}
                        </h3>
                        <ReputationBadge reputation={developer.reputation} />
                      </div>
                      <p className="text-slate-300 font-medium mb-1">{developer.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
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
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 bg-slate-700/50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{developer.rating || '4.8'}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {developer.bio && (
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {developer.bio}
                    </p>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {developer.skills?.slice(0, 6).map(skill => (
                      <SkillBadge key={skill} skill={skill} size="sm" />
                    ))}
                    {developer.skills?.length > 6 && (
                      <span className="text-slate-400 text-xs bg-slate-700/50 px-2 py-1 rounded-full">
                        +{developer.skills.length - 6} more
                      </span>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-slate-400">
                      <div>
                        <span className="text-white font-medium">{developer.projects || 12}</span>
                        <span className="ml-1">projects</span>
                      </div>
                      <div>
                        <span className="text-white font-medium">{developer.contributions || 248}</span>
                        <span className="ml-1">contributions</span>
                      </div>
                      <div>
                        <span className="text-white font-medium">{developer.experience || '3+'}</span>
                        <span className="ml-1">years exp</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-2">
                      {developer.socialLinks?.github && (
                        <a
                          href={developer.socialLinks.github}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-white transition-colors p-1"
                          title="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {developer.socialLinks?.linkedin && (
                        <a
                          href={developer.socialLinks.linkedin}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {developer.socialLinks?.twitter && (
                        <a
                          href={developer.socialLinks.twitter}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-blue-400 transition-colors p-1"
                          title="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {developer.website && (
                        <a
                          href={developer.website}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-white transition-colors p-1"
                          title="Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DeveloperList;
