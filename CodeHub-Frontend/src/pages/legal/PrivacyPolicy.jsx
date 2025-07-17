import React, { useState } from 'react';
import { 
  Shield, 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Lock, 
  Database, 
  Share2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Users,
  Globe,
  Mail,
  Cookie
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: `We collect information you provide directly to us, such as when you create an account, post content, or contact us. This includes your username, email address, profile information, and any content you share on the platform. We also automatically collect certain information about your device and usage of our service.`
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: Settings,
      content: `We use the information we collect to provide, maintain, and improve our services, communicate with you, monitor and analyze usage and trends, and protect against harmful or unauthorized activities. We may also use your information to personalize your experience and provide relevant content.`
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Share2,
      content: `We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform, conducting business, or serving users.`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: `We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: Cookie,
      content: `We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences. For more details, see our Cookie Policy.`
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: CheckCircle,
      content: `You have the right to access, update, or delete your personal information. You can also opt out of certain communications and control how your information is used. Contact us if you wish to exercise these rights or have questions about your data.`
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Calendar,
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your personal information, subject to legal requirements.`
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Globe,
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information when it is transferred internationally.`
    }
  ];

  const dataTypes = [
    {
      category: 'Account Information',
      items: ['Username', 'Email address', 'Profile picture', 'Bio and profile details'],
      icon: Users,
      color: 'text-blue-400'
    },
    {
      category: 'Content Data',
      items: ['Code snippets', 'Comments', 'Likes and favorites', 'Activity history'],
      icon: Database,
      color: 'text-green-400'
    },
    {
      category: 'Usage Information',
      items: ['IP address', 'Browser type', 'Device information', 'Usage patterns'],
      icon: Eye,
      color: 'text-orange-400'
    },
    {
      category: 'Communication Data',
      items: ['Support messages', 'Feedback submissions', 'Email communications'],
      icon: Mail,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-800/50 shadow-sm border-b border-slate-700">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link to="/support">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Support
                </Link>
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Privacy Policy
                  </h1>
                  <p className="text-slate-300">
                    How we collect, use, and protect your personal information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Last Updated */}
          <Card className="p-4 mb-8 bg-slate-800/50 border-slate-700">
            <div className="flex items-center space-x-2 text-slate-300">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Last updated: June 21, 2025</span>
            </div>
          </Card>

          {/* Introduction */}
          <Card className="p-8 mb-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Your Privacy Matters</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              At CodeHub, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-slate-300 leading-relaxed">
              By using CodeHub, you consent to the data practices described in this policy.
            </p>
          </Card>

          {/* Data We Collect */}
          <Card className="p-8 mb-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Types of Data We Collect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataTypes.map((dataType) => {
                const IconComponent = dataType.icon;
                return (
                  <div key={dataType.category} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <IconComponent className={`w-5 h-5 ${dataType.color}`} />
                      <h3 className="font-semibold text-white">{dataType.category}</h3>
                    </div>
                    <ul className="space-y-1">
                      {dataType.items.map((item, index) => (
                        <li key={index} className="text-sm text-slate-300 flex items-center">
                          <div className="w-1 h-1 bg-slate-500 rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Privacy Sections */}
          <div className="space-y-4">
            {sections.map((section) => {
              const IconComponent = section.icon;
              const isExpanded = expandedSection === section.id;
              
              return (
                <Card key={section.id} className="bg-slate-800/50 border-slate-700">
                  <button
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors rounded-lg"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg">
                        <IconComponent className="w-5 h-5 text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="pl-11">
                        <p className="text-slate-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Privacy Controls */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Privacy Controls</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              You have control over your privacy settings and can manage how your information is used:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Account Settings</h3>
                </div>
                <p className="text-sm text-slate-300">Manage your profile visibility and data sharing preferences</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Privacy Dashboard</h3>
                </div>
                <p className="text-sm text-slate-300">View and download your data, or request account deletion</p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Privacy Questions?</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="flex items-center space-x-2 text-green-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:giasinguyentran@gmail.com" className="hover:underline">
                giasinguyentran@gmail.com
              </a>
            </div>
          </Card>

          {/* Related Legal Pages */}
          <Card className="p-6 mt-8 bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Related Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/legal/terms-of-service" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-slate-300 group-hover:text-white">Terms of Service</span>
                </div>
              </Link>
              <Link 
                to="/legal/cookie-policy" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Cookie className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
                  <span className="text-slate-300 group-hover:text-white">Cookie Policy</span>
                </div>
              </Link>
              <Link 
                to="/legal/licenses" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                  <span className="text-slate-300 group-hover:text-white">Licenses</span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
