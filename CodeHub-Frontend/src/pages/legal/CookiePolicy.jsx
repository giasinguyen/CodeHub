import React, { useState } from 'react';
import { 
  Cookie, 
  ArrowLeft, 
  Calendar, 
  Settings, 
  Eye, 
  BarChart3, 
  Shield,
  Globe,
  AlertTriangle,
  CheckCircle,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';

const CookiePolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleCookieToggle = (category) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Shield,
      color: 'text-green-400',
      required: true,
      examples: ['Session management', 'Authentication', 'Security', 'Basic functionality']
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      icon: BarChart3,
      color: 'text-blue-400',
      required: false,
      examples: ['Page views', 'User behavior', 'Performance metrics', 'Error tracking']
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      description: 'These cookies allow us to remember your choices and provide enhanced features.',
      icon: Settings,
      color: 'text-purple-400',
      required: false,
      examples: ['Theme preferences', 'Language settings', 'Layout choices', 'User preferences']
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and track campaign effectiveness.',
      icon: Globe,
      color: 'text-orange-400',
      required: false,
      examples: ['Targeted ads', 'Social media integration', 'Campaign tracking', 'Personalization']
    }
  ];

  const sections = [
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies?',
      icon: Cookie,
      content: `Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings. This can make your next visit easier and the site more useful to you.`
    },
    {
      id: 'how-we-use-cookies',
      title: 'How We Use Cookies',
      icon: Eye,
      content: `We use cookies to enhance your experience on CodeHub, analyze site usage, and provide personalized content. Cookies help us remember your login status, preferences, and provide relevant features based on your activity.`
    },
    {
      id: 'third-party-cookies',
      title: 'Third-Party Cookies',
      icon: Globe,
      content: `Some cookies on our site are set by third-party services that appear on our pages. This includes analytics services, social media plugins, and embedded content. These third parties may use cookies to track your activity across different websites.`
    },
    {
      id: 'managing-cookies',
      title: 'Managing Your Cookie Preferences',
      icon: Settings,
      content: `You can control and manage cookies in various ways. You can delete all cookies that are already on your device and set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site.`
    }
  ];

  const saveCookiePreferences = () => {
    // Here you would typically save the preferences to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    
    // Show success message (you might want to use a proper toast notification)
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
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
                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Cookie Policy
                  </h1>
                  <p className="text-slate-300">
                    How we use cookies and similar technologies on CodeHub
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
            <h2 className="text-xl font-bold text-white mb-4">Understanding Cookies</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              This Cookie Policy explains how CodeHub uses cookies and similar technologies to recognize you when you visit our platform. 
              It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-300 text-sm">
                    By continuing to use CodeHub, you consent to our use of cookies as described in this policy.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Cookie Types and Controls */}
          <Card className="p-8 mb-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-6">Cookie Preferences</h2>
            <p className="text-slate-300 mb-6">
              Manage your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the site to function properly.
            </p>
            
            <div className="space-y-6">
              {cookieTypes.map((cookieType) => {
                const IconComponent = cookieType.icon;
                const isEnabled = cookiePreferences[cookieType.id];
                
                return (
                  <div key={cookieType.id} className="p-6 bg-slate-700/30 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-600/50 rounded-lg">
                          <IconComponent className={`w-5 h-5 ${cookieType.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{cookieType.title}</h3>
                          <p className="text-sm text-slate-300 mt-1">{cookieType.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {cookieType.required ? (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Required
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCookieToggle(cookieType.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isEnabled ? 'bg-blue-500' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-11">
                      <h4 className="text-sm font-medium text-slate-200 mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {cookieType.examples.map((example, index) => (
                          <span key={index} className="text-xs bg-slate-600/50 text-slate-300 px-2 py-1 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={saveCookiePreferences} className="bg-orange-500 hover:bg-orange-600">
                Save Preferences
              </Button>
            </div>
          </Card>

          {/* Detailed Sections */}
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
                      <div className="p-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg">
                        <IconComponent className="w-5 h-5 text-orange-400" />
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

          {/* Browser Settings */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Browser Cookie Settings</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Chrome</h3>
                <p className="text-sm text-slate-300">Settings → Privacy and security → Cookies and other site data</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Firefox</h3>
                <p className="text-sm text-slate-300">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Safari</h3>
                <p className="text-sm text-slate-300">Preferences → Privacy → Cookies and website data</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Edge</h3>
                <p className="text-sm text-slate-300">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Questions About Cookies?</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="flex items-center space-x-2 text-orange-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:privacy@codehub.com" className="hover:underline">
                privacy@codehub.com
              </a>
            </div>
          </Card>

          {/* Related Legal Pages */}
          <Card className="p-6 mt-8 bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Related Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/legal/privacy-policy" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                  <span className="text-slate-300 group-hover:text-white">Privacy Policy</span>
                </div>
              </Link>
              <Link 
                to="/legal/terms-of-service" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-slate-300 group-hover:text-white">Terms of Service</span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
