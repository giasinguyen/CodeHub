import React from "react";
import { Link } from "react-router-dom";
import { Code2, Github, Twitter, Mail, Heart, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { label: "Code Snippets", href: "/snippets" },
        { label: "Developers", href: "/developers" },
        { label: "Trending", href: "/trending" },
        { label: "API", href: "/api" },
      ],
    },
    company: {
      title: "Company",
      links: [
        { label: "About us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Report Bug", href: "/report" },
        { label: "Feedback", href: "/feedback" },
        { label: "Community", href: "/community" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Licenses", href: "/licenses" },
      ],
    },
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/giasinguyen", label: "GitHub" },
    {
      icon: Facebook,
      href: "https://facebook.com/user.ntgs",
      label: "Facebook",
    },
    { icon: Mail, href: "giasinguyentran@gmail.com", label: "Email" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CodeHub</span>
            </Link>{" "}
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Code snippet sharing platform for developers. Build, learn and
              connect with the community.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="py-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-slate-400 text-sm">
                Get useful code snippets and programming tips every week.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 md:w-64 px-4 py-2 bg-slate-800 border border-slate-700 rounded-l-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-r-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-slate-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-slate-400 text-sm">
                © {currentYear} CodeHub. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-1 text-slate-400 text-sm">
                <span>Made by Nguyen Tran Gia Si | iamgiasi</span>
                <Heart className="w-4 h-4 text-red-400" />
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
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
