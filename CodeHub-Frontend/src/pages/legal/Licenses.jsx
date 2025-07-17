import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  Code2, 
  Download, 
  ExternalLink, 
  Package,
  Shield,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Github,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, Input } from '../../components/ui';

const Licenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedLicense, setExpandedLicense] = useState(null);

  const toggleLicense = (licenseId) => {
    setExpandedLicense(expandedLicense === licenseId ? null : licenseId);
  };

  const licenses = [
    {
      id: 'react',
      name: 'React',
      version: '19.0.0',
      license: 'MIT',
      category: 'frontend',
      description: 'A JavaScript library for building user interfaces',
      author: 'Meta',
      homepage: 'https://reactjs.org/',
      repository: 'https://github.com/facebook/react',
      licenseText: 'MIT License\n\nCopyright (c) Meta Platforms, Inc. and affiliates.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software...'
    },
    {
      id: 'tailwindcss',
      name: 'Tailwind CSS',
      version: '3.4.0',
      license: 'MIT',
      category: 'frontend',
      description: 'A utility-first CSS framework for rapidly building custom designs',
      author: 'Tailwind Labs',
      homepage: 'https://tailwindcss.com/',
      repository: 'https://github.com/tailwindlabs/tailwindcss',
      licenseText: 'MIT License\n\nCopyright (c) Tailwind Labs, Inc.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...'
    },
    {
      id: 'vite',
      name: 'Vite',
      version: '5.0.0',
      license: 'MIT',
      category: 'build',
      description: 'Next generation frontend tooling. It\'s fast!',
      author: 'Evan You',
      homepage: 'https://vitejs.dev/',
      repository: 'https://github.com/vitejs/vite',
      licenseText: 'MIT License\n\nCopyright (c) 2019-present, Yuxi (Evan) You and contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software...'
    },
    {
      id: 'spring-boot',
      name: 'Spring Boot',
      version: '3.2.0',
      license: 'Apache 2.0',
      category: 'backend',
      description: 'Spring Boot makes it easy to create stand-alone, production-grade Spring applications',
      author: 'VMware, Inc.',
      homepage: 'https://spring.io/projects/spring-boot',
      repository: 'https://github.com/spring-projects/spring-boot',
      licenseText: 'Apache License\nVersion 2.0, January 2004\nhttp://www.apache.org/licenses/\n\nTERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION...'
    },
    {
      id: 'mariadb',
      name: 'MariaDB',
      version: '11.0',
      license: 'GPL v2',
      category: 'database',
      description: 'An open source relational database',
      author: 'MariaDB Foundation',
      homepage: 'https://mariadb.org/',
      repository: 'https://github.com/MariaDB/server',
      licenseText: 'GNU GENERAL PUBLIC LICENSE\nVersion 2, June 1991\n\nCopyright (C) 1989, 1991 Free Software Foundation, Inc.\n51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA...'
    },
    {
      id: 'lucide-react',
      name: 'Lucide React',
      version: '0.300.0',
      license: 'ISC',
      category: 'frontend',
      description: 'Beautiful & consistent icon toolkit made by the community',
      author: 'Lucide Contributors',
      homepage: 'https://lucide.dev/',
      repository: 'https://github.com/lucide-icons/lucide',
      licenseText: 'ISC License\n\nCopyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.\n\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted...'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Database' },
    { value: 'build', label: 'Build Tools' }
  ];

  const licenseTypes = [
    { name: 'MIT', count: 3, color: 'bg-green-500', description: 'Permissive license' },
    { name: 'Apache 2.0', count: 1, color: 'bg-blue-500', description: 'Permissive license' },
    { name: 'GPL v2', count: 1, color: 'bg-orange-500', description: 'Copyleft license' },
    { name: 'ISC', count: 1, color: 'bg-purple-500', description: 'Permissive license' }
  ];

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || license.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const downloadLicenseFile = () => {
    const licenseContent = licenses.map(license => 
      `${license.name} (${license.version})\nLicense: ${license.license}\nAuthor: ${license.author}\n\n${license.licenseText}\n\n${'='.repeat(80)}\n\n`
    ).join('');
    
    const element = document.createElement('a');
    const file = new Blob([licenseContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'codehub-licenses.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-violet-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-800/50 shadow-sm border-b border-slate-700">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link to="/support">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Support
                </Link>
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Open Source Licenses
                    </h1>
                    <p className="text-slate-300">
                      Third-party libraries and their licenses used in CodeHub
                    </p>
                  </div>
                </div>
                <Button onClick={downloadLicenseFile} className="bg-purple-500 hover:bg-purple-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4">License Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {licenseTypes.map((licenseType) => (
                    <div key={licenseType.name} className="text-center">
                      <div className={`w-12 h-12 ${licenseType.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                        <span className="text-white font-bold">{licenseType.count}</span>
                      </div>
                      <div className="text-sm font-medium text-white">{licenseType.name}</div>
                      <div className="text-xs text-slate-400">{licenseType.description}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4 bg-slate-800/50 border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search licenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
              </Card>
              
              <Card className="p-4 bg-slate-800/50 border-slate-700">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>
            </div>
          </div>

          {/* License List */}
          <div className="space-y-4">
            {filteredLicenses.map((license) => {
              const isExpanded = expandedLicense === license.id;
              const licenseColor = licenseTypes.find(type => type.name === license.license)?.color || 'bg-gray-500';
              
              return (
                <Card key={license.id} className="bg-slate-800/50 border-slate-700">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-slate-700/50 rounded-lg">
                          <Package className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{license.name}</h3>
                            <span className="text-sm text-slate-400">v{license.version}</span>
                            <span className={`text-xs px-2 py-1 rounded ${licenseColor} text-white`}>
                              {license.license}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-2">{license.description}</p>
                          <p className="text-sm text-slate-400">by {license.author}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={license.homepage} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={license.repository} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleLicense(license.id)}
                        >
                          <Code2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <h4 className="text-sm font-medium text-white mb-2">License Text:</h4>
                        <pre className="text-xs text-slate-300 bg-slate-900/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                          {license.licenseText}
                        </pre>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredLicenses.length === 0 && (
            <Card className="p-12 text-center bg-slate-800/50 border-slate-700">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No licenses found</h3>
              <p className="text-slate-300">Try adjusting your search or filter criteria.</p>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">About Open Source Licenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Permissive Licenses
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Licenses like MIT, Apache 2.0, and ISC allow you to use, modify, and distribute the software 
                  with minimal restrictions. They're business-friendly and widely adopted.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                  Copyleft Licenses
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Licenses like GPL require that derivative works also be open source under the same license. 
                  This ensures that improvements remain open to the community.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-8 mt-8 bg-slate-800/50 border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">License Questions?</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              If you have questions about the licenses used in CodeHub or need clarification about usage rights, 
              please contact us:
            </p>
            <div className="flex items-center space-x-2 text-purple-400">
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
                  <Package className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
                  <span className="text-slate-300 group-hover:text-white">Cookie Policy</span>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Licenses;
