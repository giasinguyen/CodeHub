import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Code, 
  Filter,
  X,
  Briefcase,
  Users,
  Star,
  TrendingUp
} from 'lucide-react';
import { Input, Button, Card } from '../ui';

const DeveloperSearch = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange 
}) => {
  const experienceLevels = [
    { value: '', label: 'All Experience' },
    { value: 'junior', label: 'Junior (0-2 years)' },
    { value: 'mid', label: 'Mid-level (2-5 years)' },
    { value: 'senior', label: 'Senior (5+ years)' }
  ];

  const sortOptions = [
    { value: 'reputation', label: 'Reputation', icon: Star },
    { value: 'contributions', label: 'Contributions', icon: Code },
    { value: 'followers', label: 'Followers', icon: Users },
    { value: 'newest', label: 'Newest', icon: TrendingUp },
    { value: 'name', label: 'Name A-Z', icon: Users }
  ];

  const availabilityOptions = [
    { value: '', label: 'All' },
    { value: 'available', label: 'Available for work' },
    { value: 'busy', label: 'Busy' },
    { value: 'freelance', label: 'Open to freelance' }
  ];

  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'TypeScript',
    'Java', 'Go', 'Rust', 'Docker', 'Kubernetes',
    'AWS', 'React Native', 'Vue.js', 'Angular', 'PHP'
  ];

  const handleSkillToggle = (skill) => {
    const currentSkills = filters.skills || [];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    onFilterChange({ skills: updatedSkills });
  };

  const clearFilters = () => {
    onFilterChange({
      skills: [],
      location: '',
      experience: '',
      availability: '',
      sortBy: 'reputation'
    });
    onSearchChange('');
  };

  const hasActiveFilters = 
    searchTerm || 
    filters.skills?.length > 0 || 
    filters.location || 
    filters.experience || 
    filters.availability ||
    filters.sortBy !== 'reputation';

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <Card.Content className="p-6">
        {/* Main Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search developers by name, skills, or bio..."
              className="pl-12 bg-slate-900/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Quick Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location
            </label>
            <Input
              value={filters.location || ''}
              onChange={(e) => onFilterChange({ location: e.target.value })}
              placeholder="City, Country..."
              className="bg-slate-900/50 border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Briefcase className="inline w-4 h-4 mr-1" />
              Experience
            </label>
            <select
              value={filters.experience || ''}
              onChange={(e) => onFilterChange({ experience: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Availability
            </label>
            <select
              value={filters.availability || ''}
              onChange={(e) => onFilterChange({ availability: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              <Filter className="inline w-4 h-4 mr-1" />
              Sort By
            </label>
            <select
              value={filters.sortBy || 'reputation'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            <Code className="inline w-4 h-4 mr-1" />
            Skills & Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSkills.map(skill => {
              const isSelected = filters.skills?.includes(skill);
              return (
                <motion.button
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  {skill}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Skills Display */}
        {filters.skills?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-slate-400 mb-2">Selected skills:</p>
            <div className="flex flex-wrap gap-2">
              {filters.skills.map(skill => (
                <div
                  key={skill}
                  className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleSkillToggle(skill)}
                    className="text-cyan-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-400">
              {filters.skills?.length > 0 && `${filters.skills.length} skill${filters.skills.length !== 1 ? 's' : ''} selected`}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default DeveloperSearch;
