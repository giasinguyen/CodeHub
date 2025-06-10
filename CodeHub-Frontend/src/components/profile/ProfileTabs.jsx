import React from 'react';
import { Code2, Activity, Settings } from 'lucide-react';

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => {
  const tabs = [
    {
      id: 'snippets',
      label: 'Snippets',
      icon: Code2,
      count: null // Will be populated by parent component
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Activity
    }
  ];

  // Add settings tab only for own profile
  if (isOwnProfile) {
    tabs.push({
      id: 'settings',
      label: 'Settings',
      icon: Settings
    });
  }

  return (
    <div className="border-b border-slate-700">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && tab.count !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;
