import React, { useState } from "react";
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
  Globe,
} from "lucide-react";
import { Card } from "../../components/ui";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "hello@codehub.dev",
      action: "mailto:hello@codehub.dev",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our team in real-time",
      contact: "Available 9 AM - 6 PM GMT+7",
      action: "#",
    },
    {
      icon: Github,
      title: "GitHub Issues",
      description: "Report bugs or request features",
      contact: "github.com/codehub/issues",
      action: "https://github.com/giasinguyen",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for urgent matters",
      contact: "+84 123 456 789",
      action: "tel:+84123456789",
    },
  ];

  const socialLinks = [
    { icon: Github, name: "GitHub", url: "https://github.com/giasinguyen" },
    { icon: Twitter, name: "Twitter", url: "#" },
    { icon: Linkedin, name: "LinkedIn", url: "#" },
    { icon: Globe, name: "Website", url: "#" },
  ];

  const officeInfo = {
    address: "Ho Chi Minh City, Vietnam",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM GMT+7",
    timezone: "GMT+7 (Asia/Ho_Chi_Minh)",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "general",
      });
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We'd love to hear from
              you. Our team is here to help and respond quickly.
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {" "}
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div>
              {" "}
              <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
                Contact Methods
              </h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card
                    key={index}
                    className="p-4 bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                      method.action !== "#" &&
                      window.open(method.action, "_blank")
                    }
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-lg">
                        <method.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white dark:text-white light:text-slate-900 mb-1">
                          {method.title}
                        </h3>
                        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 mb-2">
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
              {/* Office Information */}{" "}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-900 mb-4">
                  Office Information
                </h3>
                <Card className="p-4 bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-white dark:text-white light:text-slate-900">
                          Address
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                          {officeInfo.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-white dark:text-white light:text-slate-900">
                          Business Hours
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                          {officeInfo.hours}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-white dark:text-white light:text-slate-900">
                          Timezone
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600">
                          {officeInfo.timezone}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              {/* Social Links */}{" "}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-800 dark:bg-slate-800 light:bg-white p-3 rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-cyan-50 transition-colors"
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5 text-slate-400 dark:text-slate-400 light:text-slate-600" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div>
              <Card className="p-8 bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200">
                <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Type */}{" "}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 dark:text-slate-400 light:text-slate-700 mb-2">
                      What can we help you with?
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 dark:bg-slate-700 light:bg-slate-50 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white dark:text-white light:text-slate-900"
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
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-white">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700 dark:bg-slate-700 light:bg-slate-50 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white dark:text-white light:text-slate-900"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-white">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700 dark:bg-slate-700 light:bg-slate-50 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white dark:text-white light:text-slate-900"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-white">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700 dark:bg-slate-700 light:bg-slate-50 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white dark:text-white light:text-slate-900"
                      placeholder="Brief description of your inquiry"
                      required
                    />
                  </div>
                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-white">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-4 py-3 bg-slate-700 dark:bg-slate-700 light:bg-slate-50 border border-slate-600 dark:border-slate-600 light:border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white dark:text-white light:text-slate-900 resize-vertical"
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
                <div className="mt-6 p-4 bg-slate-700 dark:bg-slate-700 light:bg-cyan-50 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-300 text-white">
                    <strong>Response Time:</strong> We typically respond within
                    24 hours during business days. For urgent technical issues,
                    please use our live chat or GitHub issues.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* FAQ Section */}{" "}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800 dark:bg-slate-800 light:bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white dark:text-white light:text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 dark:text-slate-400 light:text-slate-600">
              Can't find what you're looking for? Check out our help center or
              contact us directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I report a bug?",
                answer:
                  "You can report bugs through GitHub issues or use our contact form with 'Bug Report' selected.",
              },
              {
                question: "Is CodeHub free to use?",
                answer:
                  "Yes, CodeHub is free for individual developers. We also offer premium features for teams.",
              },
              {
                question: "How can I contribute?",
                answer:
                  "We welcome contributions! Check our GitHub repository for open issues and contribution guidelines.",
              },
              {
                question: "Do you offer enterprise support?",
                answer:
                  "Yes, we provide enterprise support and custom solutions. Contact us for more information.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <Card className="p-6 h-full bg-slate-800 dark:bg-slate-800 light:bg-white border border-slate-700 dark:border-slate-700 light:border-slate-200">
                  <h3 className="font-semibold text-white dark:text-white light:text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-sm leading-relaxed">
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
