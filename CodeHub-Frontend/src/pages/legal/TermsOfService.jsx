import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  Shield, 
  Users, 
  Gavel, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Globe,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';

const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: `By accessing and using CodeHub, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of the CodeHub platform, including all content, services, and products available at or through the website.`
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: Globe,
      content: `CodeHub is a platform for developers to share, discover, and collaborate on code snippets. Our service includes features such as code sharing, user profiles, community discussions, and various tools to enhance the developer experience.`
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: Users,
      content: `To access certain features of CodeHub, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.`
    },
    {
      id: 'content-guidelines',
      title: 'Content Guidelines',
      icon: Shield,
      content: `Users are responsible for the content they post on CodeHub. You agree not to post content that is illegal, harmful, threatening, abusive, defamatory, or otherwise objectionable. We reserve the right to remove any content that violates these guidelines.`
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Lock,
      content: `You retain ownership of any intellectual property rights that you hold in content you submit to CodeHub. By submitting content, you grant CodeHub a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content on the platform.`
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Eye,
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.`
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses',
      icon: AlertTriangle,
      content: `You may not use CodeHub for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any local, state, national, or international law while using the service.`
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: Gavel,
      content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
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
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Terms of Service
                  </h1>
                  <p className="text-slate-300">
                    Please read these terms carefully before using CodeHub
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
            <h2 className="text-xl font-bold text-white mb-4">Welcome to CodeHub</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your use of CodeHub and the services offered by CodeHub. 
              By using our service, you agree to these terms.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Please read these Terms carefully. If you do not agree to these Terms, you should not use CodeHub.
            </p>
          </Card>

          {/* Terms Sections */}
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
                      <div className="p-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-400" />
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

          {/* Contact Information */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex items-center space-x-2 text-blue-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:legal@codehub.com" className="hover:underline">
                legal@codehub.com
              </a>
            </div>
          </Card>

          {/* Additional Legal Pages */}
          <Card className="p-6 mt-8 bg-slate-800/50 border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Related Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                to="/legal/cookie-policy" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
                  <span className="text-slate-300 group-hover:text-white">Cookie Policy</span>
                </div>
              </Link>
              <Link 
                to="/legal/licenses" 
                className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
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

export default TermsOfService;
