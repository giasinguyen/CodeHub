import React from 'react';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Trash2,
  X,
  RefreshCw
} from 'lucide-react';
import { Button, Input } from '../ui';

const FavoriteFilters = ({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  selectedFavorites,
  onBulkRemove,
  onClearSelection,
  filteredCount,
  onClearSearch
}) => {
  const filterOptions = [
    { value: 'all', label: 'All Favorites' },
    { value: 'bookmarked', label: 'Bookmarked' },
    { value: 'high-priority', label: 'High Priority' },
    { value: 'recent', label: 'Recent (7 days)' },
    { value: 'with-notes', label: 'With Notes' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'language', label: 'Language' },
    { value: 'author', label: 'Author' }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
      {/* Top Row - Search and View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm font-medium">View:</span>
          <div className="flex bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-red-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row - Filters and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Actions and Results Count */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          {/* Results Count */}
          <div className="text-sm text-slate-400">
            {filteredCount} favorite{filteredCount !== 1 ? 's' : ''}
            {searchTerm && (
              <span className="text-slate-500"> for "{searchTerm}"</span>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedFavorites.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">
                {selectedFavorites.length} selected
              </span>
              <Button
                onClick={onBulkRemove}
                variant="danger"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </Button>
              <Button
                onClick={onClearSelection}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || filterBy !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
          <span className="text-xs text-slate-400 font-medium">Active filters:</span>
          {searchTerm && (
            <div className="flex items-center space-x-1 bg-red-500/20 text-red-300 px-2 py-1 rounded-md text-xs">
              <span>Search: "{searchTerm}"</span>
              <button
                onClick={onClearSearch}
                className="hover:text-red-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filterBy !== 'all' && (
            <div className="flex items-center space-x-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-xs">
              <span>Filter: {filterOptions.find(opt => opt.value === filterBy)?.label}</span>
              <button
                onClick={() => setFilterBy('all')}
                className="hover:text-blue-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteFilters;
