import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Github, 
  Twitter,
  Linkedin,
  Globe
} from 'lucide-react';
import { Card } from '../../components/ui';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'hello@codehub.dev',
      action: 'mailto:hello@codehub.dev'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team in real-time',
      contact: 'Available 9 AM - 6 PM GMT+7',
      action: '#'
    },
    {
      icon: Github,
      title: 'GitHub Issues',
      description: 'Report bugs or request features',
      contact: 'github.com/codehub/issues',
      action: 'https://github.com/giasinguyen'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for urgent matters',
      contact: '+84 123 456 789',
      action: 'tel:+84123456789'
    }
  ];

  const socialLinks = [
    { icon: Github, name: 'GitHub', url: 'https://github.com/giasinguyen' },
    { icon: Twitter, name: 'Twitter', url: '#' },
    { icon: Linkedin, name: 'LinkedIn', url: '#' },
    { icon: Globe, name: 'Website', url: '#' }
  ];

  const officeInfo = {
    address: 'Ho Chi Minh City, Vietnam',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM GMT+7',
    timezone: 'GMT+7 (Asia/Ho_Chi_Minh)'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Thank you for your message! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We'd love to hear from you. 
              Our team is here to help and respond quickly.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Contact Methods
              </h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card 
                    key={index}
                    className="p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => method.action !== '#' && window.open(method.action, '_blank')}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-lg">
                        <method.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                          {method.contact}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Office Information */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Office Information
                </h3>
                <Card className="p-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Address</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{officeInfo.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Business Hours</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{officeInfo.hours}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Timezone</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{officeInfo.timezone}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-slate-200 dark:border-gray-600 hover:bg-cyan-50 dark:hover:bg-gray-700 transition-colors"
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      What can we help you with?
                    </label>                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-white"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="bug">Bug Report</option>
                    </select>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-white"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-white"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-white"
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-900 dark:text-white resize-vertical"
                      placeholder="Please provide as much detail as possible..."
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-cyan-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <strong>Response Time:</strong> We typically respond within 24 hours during business days. 
                    For urgent technical issues, please use our live chat or GitHub issues.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Can't find what you're looking for? Check out our help center or contact us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I report a bug?",
                answer: "You can report bugs through GitHub issues or use our contact form with 'Bug Report' selected."
              },
              {
                question: "Is CodeHub free to use?",
                answer: "Yes, CodeHub is free for individual developers. We also offer premium features for teams."
              },
              {
                question: "How can I contribute?",
                answer: "We welcome contributions! Check our GitHub repository for open issues and contribution guidelines."
              },
              {
                question: "Do you offer enterprise support?",
                answer: "Yes, we provide enterprise support and custom solutions. Contact us for more information."
              }
            ].map((faq, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
