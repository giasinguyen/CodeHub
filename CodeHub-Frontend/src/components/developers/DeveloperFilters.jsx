import React from 'react';
import { motion } from 'framer-motion';
import { Grid, List, SortAsc, SortDesc, Filter } from 'lucide-react';
import { Button, Card } from '../ui';

const DeveloperFilters = ({ 
  filters, 
  onFilterChange, 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <Card.Content className="p-4">
        {/* View Mode Toggle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            View Mode
          </label>
          <div className="flex bg-slate-900/50 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="text-sm">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-cyan-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm">List</span>
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300 flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            Quick Filters
          </h4>
          
          <div className="space-y-2">
            <Button
              variant={filters.availability === 'available' ? 'primary' : 'ghost'}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onFilterChange({ 
                availability: filters.availability === 'available' ? '' : 'available' 
              })}
            >
              🟢 Available for work
            </Button>
            
            <Button
              variant={filters.experience === 'senior' ? 'primary' : 'ghost'}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onFilterChange({ 
                experience: filters.experience === 'senior' ? '' : 'senior' 
              })}
            >
              🎯 Senior developers
            </Button>
            
            <Button
              variant={filters.sortBy === 'newest' ? 'primary' : 'ghost'}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onFilterChange({ 
                sortBy: filters.sortBy === 'newest' ? 'reputation' : 'newest' 
              })}
            >
              ⭐ New members
            </Button>
          </div>
        </div>

        {/* Sort Direction */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Sort Direction</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Toggle sort direction logic would go here
                // For now, we'll just show the icon
              }}
              className="p-2"
            >
              <SortAsc className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default DeveloperFilters;
