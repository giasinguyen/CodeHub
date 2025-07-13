import React, { useState, useEffect } from "react";
import {
  Code2,
  Users,
  Target,
  Heart,
  Lightbulb,
  Globe,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

const About = () => {
  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const [communityStats, setCommunityStats] = useState({
    totalUsers: 0,
    totalSnippets: 0,
    totalViews: 0,
    activeUsers: 0,
    totalLanguages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalSnippets: 0,
    totalViews: 0,
    activeUsers: 0,
    totalLanguages: 0,
  });

  // Animation effect for counting numbers
  useEffect(() => {
    if (!loading && communityStats.totalUsers > 0) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;

        setAnimatedStats({
          totalUsers: Math.floor(communityStats.totalUsers * progress),
          totalSnippets: Math.floor(communityStats.totalSnippets * progress),
          totalViews: Math.floor(communityStats.totalViews * progress),
          activeUsers: Math.floor(communityStats.activeUsers * progress),
          totalLanguages: Math.floor(communityStats.totalLanguages * progress),
        });

        if (step >= steps) {
          clearInterval(timer);
          setAnimatedStats(communityStats);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading, communityStats]);

  // Scroll tracking effect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = position / (documentHeight - windowHeight);

      setShowScrollButton(position > 200); // Show button after scrolling 200px
      setIsAtBottom(scrollPercentage > 0.8); // Consider "bottom" when 80% scrolled
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const loadCommunityStats = async () => {
      try {
        console.log("🔄 Loading community stats from backend...");
        console.log(
          "🔗 API Base URL:",
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
        );

        // Direct fetch test to bypass potential API service issues
        const directFetch = async () => {
          try {
            const response = await fetch(
              "http://localhost:8080/api/users/stats/community",
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("🎯 Direct fetch success:", data);
            return data;
          } catch (err) {
            console.error("🎯 Direct fetch failed:", err);
            return null;
          }
        };

        // Try direct fetch first
        const directCommunityData = await directFetch();

        // Also try through API service for comparison
        const [communityData, languageStats] = await Promise.all([
          api.getCommunityStats().catch((err) => {
            console.error("❌ Community stats API failed:", err);
            console.error(
              "❌ Error details:",
              err.response?.data || err.message
            );
            return null;
          }),
          api.getLanguageStats().catch((err) => {
            console.error("❌ Language stats API failed:", err);
            console.error(
              "❌ Error details:",
              err.response?.data || err.message
            );
            return [];
          }),
        ]);

        console.log("📊 API Service Community data:", communityData);
        console.log("🎯 Direct Fetch Community data:", directCommunityData);
        console.log("🔤 Language stats received:", languageStats);

        // Use direct fetch data if API service fails
        const finalCommunityData = communityData || directCommunityData;

        let finalStats;

        if (finalCommunityData && typeof finalCommunityData === "object") {
          // Use real API data from backend
          finalStats = {
            totalUsers: finalCommunityData.totalDevelopers || 0,
            totalSnippets: finalCommunityData.totalSnippets || 0,
            totalViews: (finalCommunityData.totalContributions || 0) * 100, // Estimate views from contributions
            activeUsers: finalCommunityData.activeDevelopers || 0,
            totalLanguages: Array.isArray(languageStats)
              ? languageStats.length
              : 0,
          };

          console.log("✅ Using real backend data:", finalStats);
        } else {
          console.warn("⚠️ All API calls failed, using fallback data");
          // Fallback to demo data only if API completely fails
          finalStats = {
            totalUsers: 1250,
            totalSnippets: 5640,
            totalViews: 89500,
            activeUsers: 875,
            totalLanguages:
              Array.isArray(languageStats) && languageStats.length > 0
                ? languageStats.length
                : 35,
          };

          console.log("⚠️ Using fallback data:", finalStats);
        }

        setCommunityStats(finalStats);
      } catch (error) {
        console.error("❌ Error loading community stats:", error);
        console.error(
          "❌ Full error object:",
          JSON.stringify(error, Object.getOwnPropertyNames(error))
        );
        // Set demo values only as last resort
        setCommunityStats({
          totalUsers: 1250,
          totalSnippets: 5640,
          totalViews: 89500,
          activeUsers: 875,
          totalLanguages: 35,
        });
      } finally {
        setLoading(false);
      }
    };

    loadCommunityStats();
  }, []);

  const getStatValue = (statKey) => {
    if (loading) return "Loading...";
    const value = animatedStats[statKey] || 0;
    if (value < 1000) return value.toString();
    if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
    return `${(value / 1000000).toFixed(1)}M`;
  };

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLearnMore = () => {
    navigate("/snippets");
  };

  const handleScrollButtonClick = () => {
    if (isAtBottom) {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const values = [
    {
      icon: Code2,
      title: "Code Quality",
      description:
        "We believe in writing clean, maintainable, and efficient code that stands the test of time.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Our platform is built by developers, for developers. Community feedback drives our decisions.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We constantly explore new technologies and methodologies to improve the developer experience.",
    },
    {
      icon: Target,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from code quality to user experience.",
    },
  ];

  const team = [
    {
      name: "Nguyen Tran Gia Si",
      role: "Founder & Lead Developer",
      image: "https://avatars.githubusercontent.com/u/63839394?v=4",
      bio: "Full-stack developer passionate about creating tools that help developers build better software.",
      social: {
        github: "https://github.com/giasinguyen",
        linkedin: "#",
        twitter: "#",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 light:bg-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6">
              About CodeHub
            </h1>
            <p className="text-xl text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to empower developers worldwide by creating the
              most comprehensive and user-friendly platform for sharing,
              discovering, and collaborating on code snippets.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 mb-6 leading-relaxed">
                At CodeHub, we believe that great code should be shared, not
                hidden. Our platform connects developers from around the world,
                enabling them to learn from each other, collaborate on projects,
                and push the boundaries of what's possible with code.
              </p>
              <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                Whether you're a beginner looking to learn or an expert wanting
                to share your knowledge, CodeHub provides the tools and
                community you need to grow as a developer.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 rounded-2xl shadow-2xl">
                <Code2 className="w-16 h-16 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Built for Developers
                </h3>
                <p className="text-cyan-100">
                  Every feature is designed with developers in mind, from syntax
                  highlighting to collaborative commenting and version control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800 dark:bg-slate-800 light:bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
              Our Values
            </h2>
            <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the culture of
              our platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
              >
                <value.icon className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-2xl mx-auto">
              The passionate individuals behind CodeHub who are dedicated to
              serving the developer community.
            </p>
          </div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-slate-800 dark:bg-slate-800 light:bg-white p-8 rounded-xl shadow-lg border border-slate-700 dark:border-slate-700 light:border-slate-200 max-w-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-cyan-500"
                />
                <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900 text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-cyan-600 text-center mb-4">{member.role}</p>
                <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-center text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-cyan-100 mb-8 leading-relaxed">
              Ready to start sharing your code and learning from others? Join
              thousands of developers already using CodeHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Get Started
              </button>
              <button
                onClick={handleLearnMore}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Button */}
      {showScrollButton && (
        <button
          onClick={handleScrollButtonClick}
          className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
        >
          {isAtBottom ? (
            <ChevronUp className="w-6 h-6" />
          ) : (
            <ChevronDown className="w-6 h-6" />
          )}
        </button>
      )}
    </div>
  );
};

export default About;
