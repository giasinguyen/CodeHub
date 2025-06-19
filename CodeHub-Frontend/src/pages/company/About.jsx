import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Target, Heart, Lightbulb, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Active Developers', value: '10,000+', icon: Users },
    { label: 'Code Snippets', value: '50,000+', icon: Code2 },
    { label: 'Countries', value: '100+', icon: Globe },
    { label: 'Years of Innovation', value: '2+', icon: Heart },
  ];

  const values = [
    {
      icon: Code2,
      title: 'Code Quality',
      description: 'We believe in writing clean, maintainable, and efficient code that stands the test of time.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Our platform is built by developers, for developers. Community feedback drives our decisions.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly explore new technologies and methodologies to improve the developer experience.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from code quality to user experience.'
    }
  ];

  const team = [
    {
      name: 'Nguyen Tran Gia Si',
      role: 'Founder & Lead Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=giasi',
      bio: 'Full-stack developer passionate about creating tools that help developers build better software.',
      social: {
        github: 'https://github.com/giasinguyen',
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              About CodeHub
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to empower developers worldwide by creating the most comprehensive 
              and user-friendly platform for sharing, discovering, and collaborating on code snippets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center"
              >
                <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                At CodeHub, we believe that great code should be shared, not hidden. Our platform 
                connects developers from around the world, enabling them to learn from each other, 
                collaborate on projects, and push the boundaries of what's possible with code.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you're a beginner looking to learn or an expert wanting to share your 
                knowledge, CodeHub provides the tools and community you need to grow as a developer.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 rounded-2xl shadow-2xl">
                <Code2 className="w-16 h-16 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Built for Developers
                </h3>
                <p className="text-cyan-100">
                  Every feature is designed with developers in mind, from syntax highlighting 
                  to collaborative commenting and version control.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Our Values
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              These core values guide everything we do and shape the culture of our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <value.icon className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              The passionate individuals behind CodeHub who are dedicated to serving the developer community.
            </p>
          </motion.div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-cyan-500"
                />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-cyan-600 text-center mb-4">
                  {member.role}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-center text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
              Ready to start sharing your code and learning from others? 
              Join thousands of developers already using CodeHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
