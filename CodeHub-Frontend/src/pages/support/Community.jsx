import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Hash, 
  TrendingUp, 
  Calendar,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Coffee,
  Award,
  Clock,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input, Badge } from '../../components/ui';

const Community = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock community data
  const communityStats = {
    totalMembers: 12450,
    activeToday: 1250,
    totalPosts: 45600,
    totalSnippets: 23400
  };

  const featuredMembers = [
    {
      id: 1,
      username: 'codecraftsman',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=codecraftsman',
      title: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      snippets: 156,
      followers: 2340,
      reputation: 8750,
      badges: ['Top Contributor', 'Mentor'],
      bio: 'Passionate about clean code and mentoring junior developers.',
      specialties: ['React', 'Node.js', 'TypeScript', 'AWS']
    },
    {
      id: 2,
      username: 'pythonista_pro',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pythonista_pro',
      title: 'Data Science Engineer',
      location: 'Berlin, Germany',
      snippets: 89,
      followers: 1876,
      reputation: 6420,
      badges: ['Python Expert', 'Data Wizard'],
      bio: 'ML enthusiast sharing practical data science solutions.',
      specialties: ['Python', 'TensorFlow', 'Pandas', 'Jupyter']
    },
    {
      id: 3,
      username: 'frontend_ninja',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend_ninja',
      title: 'UI/UX Developer',
      location: 'Tokyo, Japan',
      snippets: 203,
      followers: 1654,
      reputation: 7890,
      badges: ['Design Guru', 'CSS Master'],
      bio: 'Creating beautiful and accessible web experiences.',
      specialties: ['Vue.js', 'CSS', 'Figma', 'Animation']
    }
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best practices for handling async operations in JavaScript',
      author: 'async_master',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=async_master',
      replies: 24,
      likes: 87,
      lastActivity: '2 hours ago',
      tags: ['JavaScript', 'Async', 'Promises'],
      isPinned: true
    },
    {
      id: 2,
      title: 'How to optimize React components for better performance?',
      author: 'react_optimizer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=react_optimizer',
      replies: 18,
      likes: 65,
      lastActivity: '4 hours ago',
      tags: ['React', 'Performance', 'Optimization']
    },
    {
      id: 3,
      title: 'Machine Learning model deployment strategies',
      author: 'ml_engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ml_engineer',
      replies: 31,
      likes: 122,
      lastActivity: '6 hours ago',
      tags: ['Machine Learning', 'Deployment', 'MLOps']
    },
    {
      id: 4,
      title: 'CSS Grid vs Flexbox: When to use what?',
      author: 'css_guru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=css_guru',
      replies: 15,
      likes: 43,
      lastActivity: '8 hours ago',
      tags: ['CSS', 'Layout', 'Grid', 'Flexbox']
    }
  ];

  const events = [
    {
      id: 1,
      title: 'CodeHub Monthly Meetup',
      date: '2025-06-25',
      time: '18:00 EST',
      type: 'Virtual',
      attendees: 245,
      description: 'Join fellow developers for networking and knowledge sharing.'
    },
    {
      id: 2,
      title: 'React Best Practices Workshop',
      date: '2025-06-30',
      time: '14:00 PST',
      type: 'Workshop',
      attendees: 89,
      description: 'Deep dive into React performance optimization techniques.'
    },
    {
      id: 3,
      title: 'Open Source Contribution Day',
      date: '2025-07-05',
      time: '10:00 GMT',
      type: 'Community',
      attendees: 156,
      description: 'Contribute to open source projects and learn from maintainers.'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'discussions', label: 'Discussions', icon: MessageCircle },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
              <Link to="/support">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Support
              </Link>
            </Button>
          </div>
            <div 
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Users className="w-12 h-12 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CodeHub Community
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Connect with developers worldwide, share knowledge, and grow together in our vibrant community
            </p>
            
            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-slate-300">Members</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">{communityStats.activeToday.toLocaleString()}</div>
                <div className="text-slate-300">Active Today</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">{communityStats.totalPosts.toLocaleString()}</div>
                <div className="text-slate-300">Discussions</div>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                <div className="text-2xl font-bold text-white">{communityStats.totalSnippets.toLocaleString()}</div>
                <div className="text-slate-300">Code Snippets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">            {/* Welcome Section */}
            <Card className="p-8 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50">
              <h2 className="text-2xl font-bold text-white mb-4">
                Welcome to the CodeHub Community
              </h2>
              <p className="text-slate-300 mb-6">
                Join thousands of developers sharing code, solving problems, and building amazing projects together. 
                Whether you're a beginner or an expert, there's a place for you here.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start a Discussion
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Find Developers
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Join Events
                </Button>
              </div>
            </Card>

            {/* Featured Members */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6">
                Featured Community Members
              </h2>              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMembers.map((member) => (
                  <Card key={member.id} className="p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex items-start space-x-4">
                      <img
                        src={member.avatar}
                        alt={member.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-white truncate">
                            {member.username}
                          </h3>
                          <Award className="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-sm text-slate-300 mb-2">
                          {member.title}
                        </p>
                        <div className="flex items-center text-sm text-slate-400 mb-3">
                          <MapPin className="w-3 h-3 mr-1" />
                          {member.location}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-4">
                      {member.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {member.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-4">
                        <span>{member.snippets} snippets</span>
                        <span>{member.followers} followers</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Follow
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>            {/* Recent Discussions */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Recent Discussions
                </h2>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {discussions.slice(0, 3).map((discussion) => (
                  <Card key={discussion.id} className="p-4 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50">
                    <div className="flex items-start space-x-4">
                      <img
                        src={discussion.avatar}
                        alt={discussion.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-white">
                            {discussion.title}
                          </h3>
                          {discussion.isPinned && (
                            <Badge variant="outline" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>by {discussion.author}</span>
                          <span>{discussion.lastActivity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {discussion.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{discussion.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{discussion.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-white placeholder-slate-400"
                />
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Discussion
              </Button>
            </div>

            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <Card key={discussion.id} className="p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/80 transition-all">
                  <div className="flex items-start space-x-4">
                    <img
                      src={discussion.avatar}
                      alt={discussion.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-white hover:text-blue-400 cursor-pointer">
                          {discussion.title}
                        </h3>
                        {discussion.isPinned && (
                          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>Started by <span className="font-medium">{discussion.author}</span></span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{discussion.lastActivity}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              <Hash className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{discussion.likes} likes</span>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-white placeholder-slate-400"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  Top Contributors
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                  New Members
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMembers.map((member) => (
                <Card key={member.id} className="p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50">
                  <div className="text-center">
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                    />
                    <h3 className="font-semibold text-white mb-1">
                      {member.username}
                    </h3>
                    <p className="text-sm text-slate-300 mb-2">
                      {member.title}
                    </p>
                    <div className="flex items-center justify-center text-sm text-slate-400 mb-4">
                      <MapPin className="w-3 h-3 mr-1" />
                      {member.location}
                    </div>
                    
                    <div className="flex justify-center space-x-4 text-sm text-slate-300 mb-4">
                      <div className="text-center">
                        <div className="font-semibold">{member.snippets}</div>
                        <div className="text-xs text-slate-400">Snippets</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{member.followers}</div>
                        <div className="text-xs text-slate-400">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{member.reputation}</div>
                        <div className="text-xs text-slate-400">Reputation</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-2 mb-4">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">Follow</Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-1">
                      {member.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Upcoming Community Events
              </h2>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">{event.type}</Badge>
                    <div className="text-right text-sm text-slate-400">
                      <div>{new Date(event.date).toLocaleDateString()}</div>
                      <div>{event.time}</div>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-slate-300 mb-4">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0">Join Event</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>{/* Community Guidelines */}
      <div className="bg-slate-800/30 backdrop-blur-sm border-t border-slate-700/50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Community Guidelines
          </h2>
          <p className="text-slate-300 mb-8">
            Our community thrives on respect, collaboration, and shared learning. 
            Please review our guidelines to ensure a positive experience for everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-500/20 backdrop-blur-sm rounded-lg inline-block mb-3 border border-blue-400/30">
                <Heart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Be Respectful</h3>
              <p className="text-sm text-slate-300">
                Treat all community members with kindness and respect, regardless of their experience level.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-green-500/20 backdrop-blur-sm rounded-lg inline-block mb-3 border border-green-400/30">
                <Coffee className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Share Knowledge</h3>
              <p className="text-sm text-slate-300">
                Help others learn by sharing your knowledge, code snippets, and experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-500/20 backdrop-blur-sm rounded-lg inline-block mb-3 border border-purple-400/30">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Keep Learning</h3>
              <p className="text-sm text-slate-300">
                Stay curious, ask questions, and embrace continuous learning and growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
