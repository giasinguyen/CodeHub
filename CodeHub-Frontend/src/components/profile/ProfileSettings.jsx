import React, { useState } from 'react';
import { User, Mail, MapPin, Globe, Github, Twitter, Linkedin, Save, Bell, Shield, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { Button, Input, Card } from '../ui';
import AvatarUpload from './AvatarUpload';
import PasswordChangeModal from './PasswordChangeModal';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProfileSettings = ({ user, onUserUpdate }) => {  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    location: user.location || '',
    websiteUrl: user.websiteUrl || '',
    githubUrl: user.githubUrl || '',
    twitterUrl: user.twitterUrl || '',
    linkedinUrl: user.linkedinUrl || ''
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    emailVisible: user.emailVisible || false,
    activityVisible: user.activityVisible !== false,
    profileSearchable: user.profileSearchable !== false
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user.emailNotifications !== false,
    pushNotifications: user.pushNotifications !== false,
    weeklyDigest: user.weeklyDigest !== false,
    commentNotifications: user.commentNotifications !== false,
    likeNotifications: user.likeNotifications !== false,
    followNotifications: user.followNotifications !== false
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 }
  ];  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    setHasChanges(true);
  };

  const handlePrivacyChange = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const validateProfileData = () => {
    const newErrors = {};

    // Username validation
    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // URL validations
    const urlFields = ['websiteUrl', 'githubUrl', 'twitterUrl', 'linkedinUrl'];
    urlFields.forEach(field => {
      if (profileData[field] && !isValidUrl(profileData[field])) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAvatarUpdate = (imageUrl) => {
    setProfileData(prev => ({
      ...prev,
      avatarUrl: imageUrl
    }));
    setHasChanges(true);
  };

  const handleCoverPhotoUpdate = (imageUrl) => {
    setProfileData(prev => ({
      ...prev,
      coverPhotoUrl: imageUrl
    }));
    setHasChanges(true);
  };

  const saveProfile = async () => {
    if (!validateProfileData()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updateProfile(profileData);
      onUserUpdate(response.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(privacySettings);
      onUserUpdate(response.data);
      toast.success('Privacy settings updated!');
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      toast.error('Failed to update privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(notificationSettings);
      onUserUpdate(response.data);
      toast.success('Notification settings updated!');
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleProfileChange}
          placeholder="Enter your full name"
          icon={User}
        />
        
        <Input
          label="Username"
          name="username"
          value={profileData.username}
          onChange={handleProfileChange}
          placeholder="Enter your username"
          icon={User}
          error={errors.username}
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={profileData.email}
          onChange={handleProfileChange}
          placeholder="Enter your email"
          icon={Mail}
          error={errors.email}
        />
        
        <Input
          label="Location"
          name="location"
          value={profileData.location}
          onChange={handleProfileChange}
          placeholder="Enter your location"
          icon={MapPin}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Bio
        </label>
        <textarea
          name="bio"
          value={profileData.bio}
          onChange={handleProfileChange}
          placeholder="Tell us about yourself"
          rows={4}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Social Links</h4>
        
        <Input
          label="Website"
          name="websiteUrl"
          value={profileData.websiteUrl}
          onChange={handleProfileChange}
          placeholder="https://yourwebsite.com"
          icon={Globe}
        />
        
        <Input
          label="GitHub"
          name="githubUrl"
          value={profileData.githubUrl}
          onChange={handleProfileChange}
          placeholder="https://github.com/username"
          icon={Github}
        />
        
        <Input
          label="Twitter"
          name="twitterUrl"
          value={profileData.twitterUrl}
          onChange={handleProfileChange}
          placeholder="https://twitter.com/username"
          icon={Twitter}
        />
        
        <Input
          label="LinkedIn"
          name="linkedinUrl"
          value={profileData.linkedinUrl}
          onChange={handleProfileChange}
          placeholder="https://linkedin.com/in/username"
          icon={Linkedin}
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={saveProfile}
          isLoading={loading}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Privacy Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <h4 className="font-medium text-white">Email Visibility</h4>
            <p className="text-sm text-slate-400">Allow others to see your email address</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.emailVisible}
              onChange={() => handlePrivacyChange('emailVisible')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <h4 className="font-medium text-white">Activity Visibility</h4>
            <p className="text-sm text-slate-400">Show your activity to other users</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.activityVisible}
              onChange={() => handlePrivacyChange('activityVisible')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <h4 className="font-medium text-white">Profile Searchable</h4>
            <p className="text-sm text-slate-400">Allow your profile to appear in search results</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={privacySettings.profileSearchable}
              onChange={() => handlePrivacyChange('profileSearchable')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={savePrivacySettings}
          isLoading={loading}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Privacy Settings</span>
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
      
      <div className="space-y-4">
        {Object.entries({
          emailNotifications: { title: 'Email Notifications', desc: 'Receive notifications via email' },
          pushNotifications: { title: 'Push Notifications', desc: 'Receive browser push notifications' },
          weeklyDigest: { title: 'Weekly Digest', desc: 'Get a weekly summary of your activity' },
          commentNotifications: { title: 'Comment Notifications', desc: 'Notify when someone comments on your snippets' },
          likeNotifications: { title: 'Like Notifications', desc: 'Notify when someone likes your snippets' },
          followNotifications: { title: 'Follow Notifications', desc: 'Notify when someone follows you' }
        }).map(([key, { title, desc }]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
            <div>
              <h4 className="font-medium text-white">{title}</h4>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings[key]}
                onChange={() => handleNotificationChange(key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={saveNotificationSettings}
          isLoading={loading}
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Notification Settings</span>
        </Button>
      </div>
    </div>
  );
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Security Settings</h3>
      
      <Card>
        <Card.Content className="p-6">
          <h4 className="font-medium text-white mb-2">Change Password</h4>
          <p className="text-slate-400 mb-4">Update your password to keep your account secure</p>
          <Button 
            variant="outline" 
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="p-6">
          <h4 className="font-medium text-white mb-2">Two-Factor Authentication</h4>
          <p className="text-slate-400 mb-4">Add an extra layer of security to your account</p>
          <Button variant="outline">Enable 2FA</Button>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="p-6">
          <h4 className="font-medium text-white mb-2">Active Sessions</h4>
          <p className="text-slate-400 mb-4">Manage your active login sessions</p>
          <Button variant="outline">View Sessions</Button>
        </Card.Content>
      </Card>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
      
      <Card className="border-red-500/20">
        <Card.Content className="p-6">
          <h4 className="font-medium text-white mb-2">Delete Account</h4>
          <p className="text-slate-400 mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
            Delete Account
          </Button>
        </Card.Content>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'danger':
        return renderDangerZone();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Settings Navigation */}
      <div className="lg:col-span-1">
        <Card>
          <Card.Content className="p-0">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card.Content>
        </Card>
      </div>      {/* Settings Content */}
      <div className="lg:col-span-3">
        <Card>
          <Card.Content className="p-6">
            {renderContent()}
          </Card.Content>
        </Card>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default ProfileSettings;
