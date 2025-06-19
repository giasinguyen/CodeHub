import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Briefcase, GraduationCap, Code2, Zap, Heart, Globe } from 'lucide-react';
import { Card } from '../../components/ui';

const Careers = () => {
  const benefits = [
    {
      icon: Code2,
      title: 'Cutting-edge Technology',
      description: 'Work with the latest technologies and frameworks in a modern development environment.'
    },
    {
      icon: Users,
      title: 'Collaborative Team',
      description: 'Join a diverse team of passionate developers who believe in knowledge sharing.'
    },
    {
      icon: Zap,
      title: 'Fast-paced Growth',
      description: 'Accelerate your career in a rapidly growing startup with endless opportunities.'
    },
    {
      icon: Globe,
      title: 'Remote-first Culture',
      description: 'Work from anywhere in the world with flexible hours and work-life balance.'
    },
    {
      icon: GraduationCap,
      title: 'Learning & Development',
      description: 'Continuous learning opportunities with conference attendance and online courses.'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs for you and your family.'
    }
  ];

  const openPositions = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote / Ho Chi Minh City',
      type: 'Full-time',
      experience: '5+ years',
      description: 'We are looking for a senior full-stack developer to join our core team and help build the next generation of CodeHub features.',
      requirements: [
        'Strong experience with React and Node.js',
        'Proficiency in Spring Boot and Java',
        'Experience with PostgreSQL and Redis',
        'Knowledge of AWS cloud services',
        'Excellent problem-solving skills'
      ],
      responsibilities: [
        'Design and implement new features',
        'Optimize application performance',
        'Mentor junior developers',
        'Collaborate with product team',
        'Write clean, maintainable code'
      ]
    },
    {
      id: 2,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote / Ho Chi Minh City',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Join our frontend team to create beautiful and intuitive user interfaces that developers love to use.',
      requirements: [
        'Expert knowledge of React and TypeScript',
        'Experience with modern CSS frameworks',
        'Understanding of responsive design',
        'Knowledge of state management',
        'Experience with testing frameworks'
      ],
      responsibilities: [
        'Build responsive user interfaces',
        'Implement design systems',
        'Optimize web performance',
        'Write comprehensive tests',
        'Collaborate with UX designers'
      ]
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote / Ho Chi Minh City',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Help us scale our infrastructure and improve our deployment processes as we grow our user base.',
      requirements: [
        'Experience with AWS/GCP cloud platforms',
        'Strong knowledge of Docker and Kubernetes',
        'CI/CD pipeline experience',
        'Infrastructure as Code (Terraform)',
        'Monitoring and logging tools'
      ],
      responsibilities: [
        'Manage cloud infrastructure',
        'Automate deployment processes',
        'Implement monitoring solutions',
        'Ensure system reliability',
        'Optimize costs and performance'
      ]
    }
  ];

  const companyStats = [
    { label: 'Team Members', value: '15+' },
    { label: 'Countries', value: '8' },
    { label: 'Years of Experience', value: '2+' },
    { label: 'Coffee Consumed', value: '∞' }
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
              Join Our Team
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Build the future of code sharing with a passionate team of developers. 
              We're always looking for talented individuals who share our vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
                View Open Positions
              </button>
              <button className="border-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-50 dark:hover:bg-slate-800 transition-all">
                Learn About Our Culture
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-cyan-600 mb-2">
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

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Why Work With Us?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We believe in creating an environment where our team can do their best work while growing personally and professionally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                  <benefit.icon className="w-12 h-12 text-cyan-500 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Open Positions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Ready to make an impact? Check out our current openings and find your next career opportunity.
            </p>
          </motion.div>

          <div className="space-y-8">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {position.title}
                        </h3>
                        <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
                          {position.department}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-6 mb-6 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {position.type}
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {position.experience}
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {position.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                            Requirements:
                          </h4>
                          <ul className="space-y-2">
                            {position.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="text-slate-600 dark:text-slate-300 text-sm flex items-start">
                                <span className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                            Responsibilities:
                          </h4>
                          <ul className="space-y-2">
                            {position.responsibilities.map((resp, respIndex) => (
                              <li key={respIndex} className="text-slate-600 dark:text-slate-300 text-sm flex items-start">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 lg:mt-0 lg:ml-8">
                      <button className="w-full lg:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Don't see a fit? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Card className="p-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border border-cyan-200 dark:border-slate-600">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Don't see the perfect role?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                We're always interested in connecting with talented individuals. 
                Send us your resume and let us know how you'd like to contribute to CodeHub.
              </p>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
                Send Us Your Resume
              </button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Our Culture
            </h2>
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
              We foster an inclusive, collaborative environment where every team member can thrive. 
              Our culture is built on trust, innovation, and a shared passion for creating amazing developer tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">🚀</div>
                <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
                <p className="text-cyan-100 text-sm">We encourage experimentation and creative problem-solving</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">🤝</div>
                <h3 className="text-lg font-semibold text-white mb-2">Collaboration</h3>
                <p className="text-cyan-100 text-sm">We believe the best solutions come from working together</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">🌱</div>
                <h3 className="text-lg font-semibold text-white mb-2">Growth</h3>
                <p className="text-cyan-100 text-sm">We invest in our team's personal and professional development</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
