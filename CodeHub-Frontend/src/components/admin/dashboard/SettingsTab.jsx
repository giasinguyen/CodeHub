import React from 'react';
import { Button, Card } from '../../ui';

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
      
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Maintenance Mode</label>
              <p className="text-gray-400 text-sm">Enable maintenance mode to prevent user access</p>
            </div>
            <Button className="bg-orange-600 hover:bg-orange-700">
              Toggle
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">User Registration</label>
              <p className="text-gray-400 text-sm">Allow new users to register</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              Enabled
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Content Moderation</label>
              <p className="text-gray-400 text-sm">Require approval for new content</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Configure
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsTab;
