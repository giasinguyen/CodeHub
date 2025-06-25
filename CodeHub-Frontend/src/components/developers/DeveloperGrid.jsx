import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import DeveloperCard from './DeveloperCard';
import { Users, Loader } from 'lucide-react';

const DeveloperGrid = ({ 
  developers = [], 
  onDeveloperClick, 
  onLoadMore, 
  hasMore = false, 
  loading = false 
}) => {
  if (developers.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No developers found</h3>
        <p className="text-slate-400">Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Developers</h2>
          <p className="text-slate-400">
            {developers.length} developer{developers.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>      {/* Developer Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 developer-cards-grid"
      >
        {developers.map((developer, index) => (
          <motion.div
            key={developer.id || index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >            <DeveloperCard
              developer={developer}
              onClick={onDeveloperClick}
              showActions={true}
              className="developer-card-equal-height"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loading}
            className="bg-slate-800/50 border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 text-white"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Developers'
            )}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && developers.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg p-6 animate-pulse"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-slate-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-700 rounded"></div>
                <div className="h-3 bg-slate-700 rounded w-5/6"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeveloperGrid;
