import React from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Github,
  Mail,
  Heart,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { label: "Code Snippets", href: "/snippets" },
        { label: "Developers", href: "/developers" },
        { label: "Trending", href: "/trending" },
        { label: "Search", href: "/search" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },    support: {
      title: "Support",
      links: [
        { label: "Help Center", href: "/support" },
        { label: "Report Bug", href: "/support/report-bug" },
        { label: "Feedback", href: "/support/feedback" },
      ],
    },    legal: {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/legal/terms-of-service" },
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Cookie Policy", href: "/legal/cookie-policy" },
        { label: "Licenses", href: "/legal/licenses" },
      ],
    },
  };

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/giasinguyen",
      label: "GitHub",
      color: "hover:text-gray-300",
    },
    {
      icon: Facebook,
      href: "https://facebook.com/user.ntgs",
      label: "Facebook",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-400",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-500",
    },
    {
      icon: Mail,
      href: "mailto:giasinguyentran@gmail.com",
      label: "Email",
      color: "hover:text-cyan-400",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-700/50 mt-auto relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2.5 rounded-xl shadow-lg">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                CodeHub
              </span>
            </Link>
            <p className="text-slate-400 text-base mb-6 max-w-sm leading-relaxed">
              The modern platform for developers to share, discover, and
              collaborate on code snippets. Build better code together.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-slate-400 ${social.color} transition-all duration-300 transform hover:scale-110 p-2 rounded-lg hover:bg-slate-800`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xl font-bold text-cyan-400">10K+</div>
                <div className="text-xs text-slate-400">Developers</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                <div className="text-xl font-bold text-blue-400">50K+</div>
                <div className="text-xs text-slate-400">Snippets</div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="lg:col-span-1">
              <h3 className="text-white font-semibold mb-4 text-lg">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-cyan-400 transition-colors text-sm flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-slate-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0 lg:max-w-md">
              <h3 className="text-white font-semibold mb-2 text-lg">
                Stay Updated
              </h3>
              <p className="text-slate-400 text-sm">
                Get the latest code snippets, programming tips, and updates
                delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full lg:w-auto lg:max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 lg:w-72 px-4 py-3 bg-slate-800 border border-slate-700 rounded-l-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-r-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium shadow-lg hover:shadow-cyan-500/25">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-slate-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6">
              <p className="text-slate-400 text-sm">
                © {currentYear} CodeHub. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>by</span>
                <a
                  href="https://github.com/giasinguyen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Nguyen Tran Gia Si
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/status"
                className="text-slate-400 hover:text-white transition-colors"
              >
                System Status
              </Link>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-slate-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
