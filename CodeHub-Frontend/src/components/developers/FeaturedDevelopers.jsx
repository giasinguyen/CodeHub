import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '../ui';
import DeveloperCard from './DeveloperCard';

const FeaturedDevelopers = ({ developers, onDeveloperClick }) => {
  if (!developers || developers.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border-slate-600">
      <Card.Header>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Featured Developers</h2>
            <p className="text-slate-400 text-sm">Top contributors and active community members</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developers.slice(0, 3).map((developer, index) => (
            <motion.div
              key={developer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DeveloperCard
                developer={developer}
                onClick={onDeveloperClick}
                variant="featured"
                showActions={false}
              />
            </motion.div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default FeaturedDevelopers;
