import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Palette,
  Bell,
  Code,
  Download,
  Trash2,
  Key,
  Globe,
  Moon,
  Sun,
  Monitor,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Archive,
  Database,
  Zap,
  Heart,
  MessageSquare,
  GitBranch,
  Link,
  Camera,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Card, Button, Input, Loading } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Account Settings
    profile: {
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      githubUsername: user?.githubUsername || '',
      linkedinProfile: user?.linkedinProfile || '',
      twitterHandle: user?.twitterHandle || ''
    },
    // Privacy Settings
    privacy: {
      profileVisibility: 'public', // public, private, friends
      showEmail: false,
      showLocation: true,
      showActivity: true,
      allowMessaging: true,
      showOnlineStatus: true,
      searchIndexing: true
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      commentNotifications: true,
      likeNotifications: true,
      followNotifications: true,
      mentionNotifications: true,
      digestEmails: true,
      securityAlerts: true,
      newsletterSubscription: false
    },
    // Appearance Settings
    appearance: {
      theme: 'dark', // light, dark, auto
      fontSize: 'medium', // small, medium, large
      codeTheme: 'github-dark', // various code themes
      language: 'en', // en, vi, etc.
      compactMode: false,
      animationsEnabled: true,
      highContrast: false
    },
    // Developer Settings
    developer: {
      defaultLanguage: 'javascript',
      autoSave: true,
      showLineNumbers: true,
      wordWrap: true,
      tabSize: 2,
      enableVim: false,
      enableEmmet: true,
      formatOnSave: true,
      autoComplete: true
    },
    // Security Settings
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30, // minutes
      passwordChangeRequired: false,
      trustedDevices: []
    }
  });

  const tabs = [
    { id: 'account', label: 'Account', icon: User, description: 'Personal information and profile' },
    { id: 'privacy', label: 'Privacy', icon: Shield, description: 'Control who can see your information' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage notification preferences' },
    { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Customize the look and feel' },
    { id: 'developer', label: 'Developer', icon: Code, description: 'Code editor and development tools' },
    { id: 'security', label: 'Security', icon: Lock, description: 'Password and security settings' },
    { id: 'data', label: 'Data & Storage', icon: Database, description: 'Manage your data and exports' }
  ];

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...JSON.parse(savedSettings)
      }));
    }
  }, []);

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in real app, save to API)
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Update profile if account settings changed
      if (activeTab === 'account') {
        await updateProfile(settings.profile);
      }
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Settings save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('userSettings');
      window.location.reload();
    }
  };

  const exportData = () => {
    const dataToExport = {
      profile: settings.profile,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codehub-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Username"
            value={settings.profile.username}
            onChange={(e) => handleSettingChange('profile', 'username', e.target.value)}
            placeholder="Enter username"
          />
          <Input
            label="Email"
            type="email"
            value={settings.profile.email}
            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
            placeholder="Enter email"
          />
          <Input
            label="Full Name"
            value={settings.profile.fullName}
            onChange={(e) => handleSettingChange('profile', 'fullName', e.target.value)}
            placeholder="Enter full name"
          />
          <Input
            label="Location"
            value={settings.profile.location}
            onChange={(e) => handleSettingChange('profile', 'location', e.target.value)}
            placeholder="Enter location"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
          <textarea
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
            value={settings.profile.bio}
            onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            value={settings.profile.website}
            onChange={(e) => handleSettingChange('profile', 'website', e.target.value)}
            placeholder="https://your-website.com"
          />
          <Input
            label="GitHub Username"
            value={settings.profile.githubUsername}
            onChange={(e) => handleSettingChange('profile', 'githubUsername', e.target.value)}
            placeholder="github-username"
          />
          <Input
            label="LinkedIn Profile"
            value={settings.profile.linkedinProfile}
            onChange={(e) => handleSettingChange('profile', 'linkedinProfile', e.target.value)}
            placeholder="linkedin.com/in/username"
          />
          <Input
            label="Twitter Handle"
            value={settings.profile.twitterHandle}
            onChange={(e) => handleSettingChange('profile', 'twitterHandle', e.target.value)}
            placeholder="@username"
          />
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Profile Visibility</label>
              <p className="text-xs text-slate-400">Control who can see your profile</p>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={settings.privacy.profileVisibility}
              onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          {[
            { key: 'showEmail', label: 'Show Email Address', desc: 'Display your email on your profile' },
            { key: 'showLocation', label: 'Show Location', desc: 'Display your location on your profile' },
            { key: 'showActivity', label: 'Show Activity', desc: 'Display your recent activity publicly' },
            { key: 'allowMessaging', label: 'Allow Messaging', desc: 'Allow other users to send you messages' },
            { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Display when you are online' },
            { key: 'searchIndexing', label: 'Search Engine Indexing', desc: 'Allow search engines to index your profile' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white">{label}</label>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleSettingChange('privacy', key, !settings.privacy[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.privacy[key] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications', icon: Smartphone },
            { key: 'commentNotifications', label: 'Comment Notifications', desc: 'Notify when someone comments on your snippets', icon: MessageSquare },
            { key: 'likeNotifications', label: 'Like Notifications', desc: 'Notify when someone likes your content', icon: Heart },
            { key: 'followNotifications', label: 'Follow Notifications', desc: 'Notify when someone follows you', icon: User },
            { key: 'mentionNotifications', label: 'Mention Notifications', desc: 'Notify when someone mentions you', icon: Bell },
            { key: 'digestEmails', label: 'Weekly Digest', desc: 'Receive weekly summary emails', icon: Mail },
            { key: 'securityAlerts', label: 'Security Alerts', desc: 'Important security notifications', icon: Shield },
            { key: 'newsletterSubscription', label: 'Newsletter', desc: 'Subscribe to our newsletter', icon: Mail }
          ].map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-slate-400" />
                <div>
                  <label className="text-sm font-medium text-white">{label}</label>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', key, !settings.notifications[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications[key] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Theme & Display</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Theme</label>
              <p className="text-xs text-slate-400">Choose your preferred theme</p>
            </div>
            <div className="flex space-x-2">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'auto', icon: Monitor, label: 'Auto' }
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleSettingChange('appearance', 'theme', value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                    settings.appearance.theme === value
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Font Size</label>
              <p className="text-xs text-slate-400">Adjust text size throughout the app</p>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={settings.appearance.fontSize}
              onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Code Theme</label>
              <p className="text-xs text-slate-400">Choose syntax highlighting theme</p>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={settings.appearance.codeTheme}
              onChange={(e) => handleSettingChange('appearance', 'codeTheme', e.target.value)}
            >
              <option value="github-dark">GitHub Dark</option>
              <option value="github-light">GitHub Light</option>
              <option value="monokai">Monokai</option>
              <option value="solarized">Solarized</option>
              <option value="dracula">Dracula</option>
            </select>
          </div>

          {[
            { key: 'compactMode', label: 'Compact Mode', desc: 'Reduce spacing for more content' },
            { key: 'animationsEnabled', label: 'Animations', desc: 'Enable smooth animations' },
            { key: 'highContrast', label: 'High Contrast', desc: 'Increase contrast for better visibility' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white">{label}</label>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleSettingChange('appearance', key, !settings.appearance[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.appearance[key] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.appearance[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeveloperSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Code Editor Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Default Language</label>
              <p className="text-xs text-slate-400">Default programming language for new snippets</p>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={settings.developer.defaultLanguage}
              onChange={(e) => handleSettingChange('developer', 'defaultLanguage', e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="react">React</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Tab Size</label>
              <p className="text-xs text-slate-400">Number of spaces for indentation</p>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={settings.developer.tabSize}
              onChange={(e) => handleSettingChange('developer', 'tabSize', parseInt(e.target.value))}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </div>

          {[
            { key: 'autoSave', label: 'Auto Save', desc: 'Automatically save changes as you type' },
            { key: 'showLineNumbers', label: 'Line Numbers', desc: 'Show line numbers in code editor' },
            { key: 'wordWrap', label: 'Word Wrap', desc: 'Wrap long lines in code editor' },
            { key: 'enableVim', label: 'Vim Mode', desc: 'Enable Vim keybindings' },
            { key: 'enableEmmet', label: 'Emmet', desc: 'Enable Emmet abbreviations' },
            { key: 'formatOnSave', label: 'Format on Save', desc: 'Automatically format code when saving' },
            { key: 'autoComplete', label: 'Auto Complete', desc: 'Enable intelligent code completion' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white">{label}</label>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleSettingChange('developer', key, !settings.developer[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.developer[key] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.developer[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security & Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Two-Factor Authentication</label>
              <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
            </div>
            <Button
              variant={settings.security.twoFactorEnabled ? "destructive" : "primary"}
              size="sm"
              onClick={() => handleSettingChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
            >
              {settings.security.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Session Timeout</label>
              <p className="text-xs text-slate-400">Automatically log out after inactivity</p>
            </div>
            <select
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={180}>3 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>

          {[
            { key: 'loginAlerts', label: 'Login Alerts', desc: 'Get notified of new login attempts' },
            { key: 'passwordChangeRequired', label: 'Require Password Change', desc: 'Require periodic password changes' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white">{label}</label>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <button
                onClick={() => handleSettingChange('security', key, !settings.security[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security[key] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Export Your Data</label>
              <p className="text-xs text-slate-400">Download a copy of your data</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Reset Settings</label>
              <p className="text-xs text-slate-400">Reset all settings to default values</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetSettings}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-red-400">Delete Account</label>
                <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    toast.error('Account deletion is not implemented yet');
                  }
                }}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'developer':
        return renderDeveloperSettings();
      case 'security':
        return renderSecuritySettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-slate-400">Customize your CodeHub experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs opacity-75 truncate">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700/50">
              <Card.Content className="p-6">
                {renderTabContent()}
                
                {/* Save Button */}
                <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveSettings}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
