import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Code2,
  Globe,
  Database,
  Smartphone,
  Server,
  Brain,
  Gamepad,
  Shield,
  Cpu,
  Palette,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Users,
  Eye,
  Star,
  Calendar,
  Tag,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Plus,
  Minus,
  Hash,
  Code,
  Layers,
  BookOpen,
  Zap,
} from "lucide-react";
import { Card, Loading, Button } from "../components/ui";
import { snippetsAPI } from "../services/api";
import toast from "react-hot-toast";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [languageStats, setLanguageStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set(['web-frontend'])); // Default expand web-frontend
  const [expandedLanguages, setExpandedLanguages] = useState(new Set()); // Track expanded languages for tag view
  const [showTagsView, setShowTagsView] = useState(false); // Toggle between languages and tags view
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [languageStats, setLanguageStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  // Comprehensive language categories with modern organization
  const languageCategories = {
    "web-frontend": {
      name: "Web Frontend",
      icon: Globe,
      color: "from-blue-500 to-cyan-500",
      description: "Client-side web development technologies",
      languages: [
        { name: "JavaScript", color: "#f7df1e", popularity: 95, snippets: 2450, growth: 12 },
        { name: "TypeScript", color: "#3178c6", popularity: 88, snippets: 1830, growth: 25 },
        { name: "HTML", color: "#e34f26", popularity: 92, snippets: 1920, growth: 8 },
        { name: "CSS", color: "#1572b6", popularity: 90, snippets: 1650, growth: 10 },
        { name: "React", color: "#61dafb", popularity: 85, snippets: 1540, growth: 22 },
        { name: "Vue.js", color: "#4fc08d", popularity: 75, snippets: 980, growth: 18 },
        { name: "Angular", color: "#dd0031", popularity: 70, snippets: 760, growth: 15 },
        { name: "Svelte", color: "#ff3e00", popularity: 65, snippets: 420, growth: 35 },
        { name: "Next.js", color: "#000000", popularity: 78, snippets: 890, growth: 28 },
        { name: "Nuxt.js", color: "#00dc82", popularity: 68, snippets: 520, growth: 20 },
        { name: "Remix", color: "#000000", popularity: 45, snippets: 180, growth: 45 },
        { name: "Gatsby", color: "#663399", popularity: 55, snippets: 320, growth: 12 },
        { name: "Astro", color: "#ff5d01", popularity: 40, snippets: 150, growth: 60 },
        { name: "SCSS", color: "#c6538c", popularity: 72, snippets: 680, growth: 8 },
        { name: "Sass", color: "#a53b70", popularity: 70, snippets: 640, growth: 6 },
        { name: "Less", color: "#1d365d", popularity: 45, snippets: 280, growth: 2 },
        { name: "Tailwind CSS", color: "#06b6d4", popularity: 82, snippets: 1120, growth: 40 },
        { name: "Bootstrap", color: "#7952b3", popularity: 75, snippets: 850, growth: 5 },
        { name: "Material-UI", color: "#0081cb", popularity: 68, snippets: 580, growth: 15 },
        { name: "Styled Components", color: "#db7093", popularity: 60, snippets: 450, growth: 10 },
      ]
    },
    "web-backend": {
      name: "Web Backend",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      description: "Server-side web development and APIs",
      languages: [
        { name: "Node.js", color: "#339933", popularity: 88, snippets: 1650, growth: 20 },
        { name: "Express.js", color: "#000000", popularity: 82, snippets: 1240, growth: 15 },
        { name: "NestJS", color: "#e0234e", popularity: 70, snippets: 680, growth: 30 },
        { name: "Fastify", color: "#000000", popularity: 55, snippets: 320, growth: 25 },
        { name: "Koa.js", color: "#33333d", popularity: 45, snippets: 220, growth: 8 },
        { name: "Django", color: "#092e20", popularity: 85, snippets: 1180, growth: 18 },
        { name: "Flask", color: "#000000", popularity: 78, snippets: 920, growth: 12 },
        { name: "FastAPI", color: "#009688", popularity: 75, snippets: 850, growth: 35 },
        { name: "Ruby on Rails", color: "#cc0000", popularity: 68, snippets: 620, growth: 5 },
        { name: "Sinatra", color: "#000000", popularity: 45, snippets: 180, growth: 2 },
        { name: "Spring Boot", color: "#6db33f", popularity: 80, snippets: 980, growth: 15 },
        { name: "Spring", color: "#6db33f", popularity: 75, snippets: 820, growth: 10 },
        { name: "Laravel", color: "#ff2d20", popularity: 82, snippets: 1120, growth: 12 },
        { name: "Symfony", color: "#000000", popularity: 65, snippets: 480, growth: 8 },
        { name: "CodeIgniter", color: "#ee4323", popularity: 55, snippets: 320, growth: 3 },
        { name: "ASP.NET Core", color: "#512bd4", popularity: 72, snippets: 680, growth: 18 },
        { name: "ASP.NET", color: "#512bd4", popularity: 68, snippets: 580, growth: 8 },
        { name: "Gin", color: "#00add8", popularity: 65, snippets: 420, growth: 25 },
        { name: "Echo", color: "#00add8", popularity: 55, snippets: 280, growth: 20 },
        { name: "Fiber", color: "#00add8", popularity: 50, snippets: 240, growth: 30 },
      ]
    },
    "mobile": {
      name: "Mobile Development",
      icon: Smartphone,
      color: "from-purple-500 to-pink-500",
      description: "Mobile app development platforms and frameworks",
      languages: [
        { name: "React Native", color: "#61dafb", popularity: 85, snippets: 1240, growth: 22 },
        { name: "Flutter", color: "#02569b", popularity: 88, snippets: 1380, growth: 35 },
        { name: "Swift", color: "#fa7343", popularity: 80, snippets: 920, growth: 15 },
        { name: "Kotlin", color: "#7f52ff", popularity: 82, snippets: 1020, growth: 25 },
        { name: "Java (Android)", color: "#ed8b00", popularity: 75, snippets: 780, growth: 8 },
        { name: "Objective-C", color: "#438eff", popularity: 55, snippets: 320, growth: -5 },
        { name: "Dart", color: "#0175c2", popularity: 70, snippets: 580, growth: 30 },
        { name: "Ionic", color: "#3880ff", popularity: 65, snippets: 450, growth: 12 },
        { name: "Xamarin", color: "#3498db", popularity: 60, snippets: 380, growth: 5 },
        { name: "Cordova", color: "#35434f", popularity: 45, snippets: 220, growth: -8 },
        { name: "PhoneGap", color: "#00adef", popularity: 35, snippets: 120, growth: -15 },
        { name: "Unity (Mobile)", color: "#000000", popularity: 68, snippets: 520, growth: 18 },
        { name: "Unreal Engine", color: "#313131", popularity: 55, snippets: 280, growth: 20 },
        { name: "Cocos2d", color: "#55c2e1", popularity: 40, snippets: 150, growth: 8 },
        { name: "Corona SDK", color: "#ffc600", popularity: 25, snippets: 80, growth: -10 },
      ]
    },
    "data-science": {
      name: "Data Science & AI",
      icon: Brain,
      color: "from-orange-500 to-red-500",
      description: "Machine learning, data analysis, and artificial intelligence",
      languages: [
        { name: "Python", color: "#3776ab", popularity: 95, snippets: 2180, growth: 28 },
        { name: "R", color: "#276dc3", popularity: 78, snippets: 820, growth: 15 },
        { name: "Julia", color: "#9558b2", popularity: 60, snippets: 380, growth: 40 },
        { name: "Scala", color: "#dc322f", popularity: 65, snippets: 450, growth: 18 },
        { name: "TensorFlow", color: "#ff6f00", popularity: 85, snippets: 980, growth: 30 },
        { name: "PyTorch", color: "#ee4c2c", popularity: 88, snippets: 1120, growth: 35 },
        { name: "Keras", color: "#d00000", popularity: 75, snippets: 680, growth: 20 },
        { name: "Scikit-learn", color: "#f7931e", popularity: 82, snippets: 850, growth: 22 },
        { name: "Pandas", color: "#150458", popularity: 90, snippets: 1340, growth: 25 },
        { name: "NumPy", color: "#013243", popularity: 88, snippets: 1180, growth: 20 },
        { name: "Matplotlib", color: "#11557c", popularity: 80, snippets: 920, growth: 15 },
        { name: "Seaborn", color: "#3776ab", popularity: 72, snippets: 650, growth: 18 },
        { name: "Plotly", color: "#3f4f75", popularity: 70, snippets: 580, growth: 25 },
        { name: "Apache Spark", color: "#e25a1c", popularity: 68, snippets: 520, growth: 20 },
        { name: "Hadoop", color: "#66ccff", popularity: 55, snippets: 320, growth: 8 },
        { name: "Jupyter", color: "#f37626", popularity: 85, snippets: 1020, growth: 22 },
        { name: "Apache Kafka", color: "#000000", popularity: 62, snippets: 420, growth: 28 },
        { name: "Elasticsearch", color: "#005571", popularity: 65, snippets: 480, growth: 20 },
        { name: "OpenCV", color: "#5c3ee8", popularity: 75, snippets: 720, growth: 25 },
        { name: "NLTK", color: "#3776ab", popularity: 68, snippets: 520, growth: 18 },
      ]
    },
    "systems": {
      name: "Systems Programming",
      icon: Cpu,
      color: "from-slate-500 to-zinc-600",
      description: "Low-level programming and system development",
      languages: [
        { name: "C", color: "#555555", popularity: 85, snippets: 1120, growth: 8 },
        { name: "C++", color: "#00599c", popularity: 88, snippets: 1280, growth: 12 },
        { name: "Rust", color: "#ce422b", popularity: 78, snippets: 850, growth: 45 },
        { name: "Go", color: "#00add8", popularity: 82, snippets: 980, growth: 30 },
        { name: "Zig", color: "#ec915c", popularity: 55, snippets: 280, growth: 65 },
        { name: "Assembly", color: "#6e4c13", popularity: 45, snippets: 180, growth: 5 },
        { name: "D", color: "#ba595e", popularity: 35, snippets: 120, growth: 8 },
        { name: "Nim", color: "#ffc200", popularity: 40, snippets: 150, growth: 25 },
        { name: "Crystal", color: "#000100", popularity: 38, snippets: 140, growth: 20 },
        { name: "V", color: "#5d87bd", popularity: 30, snippets: 80, growth: 40 },
        { name: "Carbon", color: "#000000", popularity: 25, snippets: 50, growth: 100 },
        { name: "C#", color: "#239120", popularity: 80, snippets: 920, growth: 15 },
        { name: "F#", color: "#b845fc", popularity: 45, snippets: 220, growth: 12 },
        { name: "Ada", color: "#02f88c", popularity: 25, snippets: 60, growth: 3 },
        { name: "Fortran", color: "#734f96", popularity: 30, snippets: 80, growth: 2 },
        { name: "COBOL", color: "#2c5aa0", popularity: 20, snippets: 40, growth: -2 },
        { name: "Pascal", color: "#e3f171", popularity: 22, snippets: 50, growth: 1 },
        { name: "Delphi", color: "#cc342d", popularity: 28, snippets: 70, growth: 2 },
      ]
    },
    "database": {
      name: "Database & Storage",
      icon: Database,
      color: "from-indigo-500 to-blue-600",
      description: "Database systems and data storage solutions",
      languages: [
        { name: "SQL", color: "#336791", popularity: 90, snippets: 1450, growth: 12 },
        { name: "MySQL", color: "#00618a", popularity: 85, snippets: 1120, growth: 8 },
        { name: "PostgreSQL", color: "#336791", popularity: 88, snippets: 1280, growth: 18 },
        { name: "SQLite", color: "#003b57", popularity: 75, snippets: 720, growth: 10 },
        { name: "MongoDB", color: "#4db33d", popularity: 82, snippets: 980, growth: 22 },
        { name: "Redis", color: "#d82c20", popularity: 78, snippets: 850, growth: 25 },
        { name: "Cassandra", color: "#1287b1", popularity: 55, snippets: 320, growth: 15 },
        { name: "DynamoDB", color: "#ff9900", popularity: 60, snippets: 380, growth: 20 },
        { name: "Neo4j", color: "#008cc1", popularity: 45, snippets: 220, growth: 18 },
        { name: "InfluxDB", color: "#22adf6", popularity: 42, snippets: 180, growth: 25 },
        { name: "CouchDB", color: "#e42528", popularity: 35, snippets: 120, growth: 8 },
        { name: "Oracle", color: "#f80000", popularity: 68, snippets: 520, growth: 5 },
        { name: "SQL Server", color: "#cc2927", popularity: 72, snippets: 680, growth: 8 },
        { name: "MariaDB", color: "#003545", popularity: 65, snippets: 450, growth: 12 },
        { name: "PlanetScale", color: "#000000", popularity: 40, snippets: 150, growth: 35 },
        { name: "Supabase", color: "#3ecf8e", popularity: 55, snippets: 280, growth: 50 },
        { name: "Firebase", color: "#ffca28", popularity: 75, snippets: 720, growth: 20 },
        { name: "FaunaDB", color: "#3a1ab6", popularity: 35, snippets: 120, growth: 30 },
      ]
    },
    "devops": {
      name: "DevOps & Cloud",
      icon: Shield,
      color: "from-teal-500 to-cyan-600",
      description: "Infrastructure, deployment, and cloud technologies",
      languages: [
        { name: "Docker", color: "#2496ed", popularity: 88, snippets: 1280, growth: 25 },
        { name: "Kubernetes", color: "#326ce5", popularity: 80, snippets: 920, growth: 30 },
        { name: "Terraform", color: "#623ce4", popularity: 75, snippets: 720, growth: 35 },
        { name: "Ansible", color: "#ee0000", popularity: 70, snippets: 580, growth: 20 },
        { name: "Jenkins", color: "#d33833", popularity: 68, snippets: 520, growth: 12 },
        { name: "GitHub Actions", color: "#2088ff", popularity: 82, snippets: 980, growth: 40 },
        { name: "GitLab CI", color: "#fc6d26", popularity: 65, snippets: 450, growth: 25 },
        { name: "AWS", color: "#ff9900", popularity: 85, snippets: 1120, growth: 22 },
        { name: "Azure", color: "#0078d4", popularity: 75, snippets: 720, growth: 18 },
        { name: "Google Cloud", color: "#4285f4", popularity: 70, snippets: 580, growth: 25 },
        { name: "Nginx", color: "#009639", popularity: 78, snippets: 820, growth: 15 },
        { name: "Apache", color: "#d22128", popularity: 65, snippets: 480, growth: 5 },
        { name: "Helm", color: "#0f1689", popularity: 60, snippets: 380, growth: 28 },
        { name: "Vagrant", color: "#1563ff", popularity: 45, snippets: 220, growth: 8 },
        { name: "Prometheus", color: "#e6522c", popularity: 68, snippets: 520, growth: 30 },
        { name: "Grafana", color: "#f46800", popularity: 65, snippets: 450, growth: 25 },
        { name: "ELK Stack", color: "#005571", popularity: 62, snippets: 420, growth: 20 },
        { name: "Consul", color: "#e03875", popularity: 40, snippets: 150, growth: 15 },
      ]
    },
    "functional": {
      name: "Functional Programming",
      icon: Code2,
      color: "from-violet-500 to-purple-600",
      description: "Functional programming languages and paradigms",
      languages: [
        { name: "Haskell", color: "#5e5086", popularity: 65, snippets: 420, growth: 15 },
        { name: "Clojure", color: "#5881d8", popularity: 58, snippets: 320, growth: 12 },
        { name: "Erlang", color: "#b83998", popularity: 52, snippets: 280, growth: 8 },
        { name: "Elixir", color: "#6e4a7e", popularity: 68, snippets: 480, growth: 25 },
        { name: "F#", color: "#b845fc", popularity: 45, snippets: 220, growth: 12 },
        { name: "OCaml", color: "#3be133", popularity: 42, snippets: 180, growth: 10 },
        { name: "Elm", color: "#60b5cc", popularity: 48, snippets: 240, growth: 18 },
        { name: "PureScript", color: "#1d222d", popularity: 35, snippets: 120, growth: 15 },
        { name: "ReScript", color: "#ed5051", popularity: 40, snippets: 150, growth: 20 },
        { name: "Reason", color: "#ff5847", popularity: 38, snippets: 140, growth: 8 },
        { name: "Lisp", color: "#3fb68b", popularity: 35, snippets: 120, growth: 5 },
        { name: "Scheme", color: "#1e4aec", popularity: 30, snippets: 80, growth: 3 },
        { name: "Racket", color: "#3c5caa", popularity: 32, snippets: 90, growth: 8 },
        { name: "Common Lisp", color: "#3fb68b", popularity: 28, snippets: 70, growth: 2 },
        { name: "ML", color: "#dc566d", popularity: 25, snippets: 60, growth: 5 },
        { name: "Standard ML", color: "#dc566d", popularity: 22, snippets: 50, growth: 2 },
      ]
    },
    "scripting": {
      name: "Scripting & Automation",
      icon: Palette,
      color: "from-amber-500 to-orange-500",
      description: "Scripting languages and automation tools",
      languages: [
        { name: "Python", color: "#3776ab", popularity: 95, snippets: 2180, growth: 28 },
        { name: "JavaScript", color: "#f7df1e", popularity: 95, snippets: 2450, growth: 12 },
        { name: "Shell", color: "#89e051", popularity: 85, snippets: 1120, growth: 15 },
        { name: "Bash", color: "#89e051", popularity: 88, snippets: 1280, growth: 12 },
        { name: "PowerShell", color: "#5391fe", popularity: 72, snippets: 680, growth: 18 },
        { name: "Perl", color: "#39457e", popularity: 55, snippets: 320, growth: 2 },
        { name: "Ruby", color: "#cc342d", popularity: 68, snippets: 520, growth: 8 },
        { name: "PHP", color: "#777bb4", popularity: 75, snippets: 720, growth: 5 },
        { name: "Lua", color: "#000080", popularity: 58, snippets: 380, growth: 12 },
        { name: "Groovy", color: "#e69f56", popularity: 48, snippets: 240, growth: 8 },
        { name: "AWK", color: "#c41e3a", popularity: 35, snippets: 120, growth: 5 },
        { name: "Sed", color: "#ffd700", popularity: 28, snippets: 80, growth: 3 },
        { name: "VBScript", color: "#945db7", popularity: 25, snippets: 60, growth: -5 },
        { name: "AutoHotkey", color: "#334455", popularity: 42, snippets: 180, growth: 10 },
        { name: "AppleScript", color: "#101f1f", popularity: 30, snippets: 90, growth: 2 },
        { name: "Tcl", color: "#e4cc98", popularity: 22, snippets: 50, growth: 1 },
      ]
    },
    "game-dev": {
      name: "Game Development",
      icon: Gamepad,
      color: "from-rose-500 to-pink-600",
      description: "Game engines and game development frameworks",
      languages: [
        { name: "Unity", color: "#000000", popularity: 85, snippets: 1120, growth: 20 },
        { name: "Unreal Engine", color: "#313131", popularity: 78, snippets: 850, growth: 25 },
        { name: "Godot", color: "#478cbf", popularity: 68, snippets: 520, growth: 40 },
        { name: "C# (Unity)", color: "#239120", popularity: 82, snippets: 980, growth: 22 },
        { name: "C++ (Unreal)", color: "#00599c", popularity: 75, snippets: 720, growth: 18 },
        { name: "GDScript", color: "#478cbf", popularity: 55, snippets: 320, growth: 35 },
        { name: "Lua (Love2D)", color: "#000080", popularity: 48, snippets: 240, growth: 15 },
        { name: "JavaScript (Phaser)", color: "#f7df1e", popularity: 62, snippets: 420, growth: 18 },
        { name: "Python (Pygame)", color: "#3776ab", popularity: 58, snippets: 380, growth: 12 },
        { name: "Java (LibGDX)", color: "#ed8b00", popularity: 52, snippets: 280, growth: 8 },
        { name: "Rust (Bevy)", color: "#ce422b", popularity: 45, snippets: 220, growth: 50 },
        { name: "Go (Ebiten)", color: "#00add8", popularity: 35, snippets: 120, growth: 30 },
        { name: "HLSL", color: "#6a5acd", popularity: 65, snippets: 450, growth: 15 },
        { name: "GLSL", color: "#5586a4", popularity: 62, snippets: 420, growth: 12 },
        { name: "GameMaker Language", color: "#71b85f", popularity: 38, snippets: 140, growth: 8 },
        { name: "Construct 3", color: "#00b4f0", popularity: 32, snippets: 90, growth: 12 },
      ]
    }
  };
  // Load language statistics
  const loadLanguageStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await snippetsAPI.getLanguages();
      
      if (response.data) {
        // Process the language data and merge with our comprehensive list
        const apiLanguages = Array.isArray(response.data) 
          ? response.data.map(lang => typeof lang === 'string' ? { name: lang, count: 0 } : lang)
          : [];

        // Merge API data with our comprehensive language list
        const allLanguages = [];
        Object.values(languageCategories).forEach(category => {
          category.languages.forEach(lang => {
            const apiLang = apiLanguages.find(api => 
              api.name?.toLowerCase() === lang.name.toLowerCase()
            );
            allLanguages.push({
              ...lang,
              category: category.name,
              categoryId: Object.keys(languageCategories).find(key => 
                languageCategories[key].name === category.name
              ),
              actualSnippets: apiLang?.count || 0,
              // Use actual data if available, otherwise use mock data
              snippets: apiLang?.count || lang.snippets,
            });
          });
        });

        setLanguageStats(allLanguages);

        // Calculate category statistics
        const categoryStatsData = Object.entries(languageCategories).map(([key, category]) => {
          const categoryLanguages = allLanguages.filter(lang => lang.categoryId === key);
          const totalSnippets = categoryLanguages.reduce((sum, lang) => sum + lang.snippets, 0);
          const avgGrowth = categoryLanguages.reduce((sum, lang) => sum + lang.growth, 0) / categoryLanguages.length;
          const avgPopularity = categoryLanguages.reduce((sum, lang) => sum + lang.popularity, 0) / categoryLanguages.length;

          return {
            id: key,
            name: category.name,
            icon: category.icon,
            color: category.color,
            description: category.description,
            languageCount: categoryLanguages.length,
            totalSnippets,
            avgGrowth: Math.round(avgGrowth * 10) / 10,
            avgPopularity: Math.round(avgPopularity),
            languages: categoryLanguages,
          };
        });

        setCategoryStats(categoryStatsData);
      }
    } catch (error) {
      console.error("Failed to load language statistics:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadLanguageStats();
  }, [loadLanguageStats]);

  // Filter languages based on search and selection
  const filteredLanguages = languageStats.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || lang.categoryId === selectedCategory;
    const matchesLanguage = selectedLanguage === "all" || lang.name.toLowerCase() === selectedLanguage.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  // Sort languages
  const sortedLanguages = [...filteredLanguages].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'popularity':
        comparison = b.popularity - a.popularity;
        break;
      case 'snippets':
        comparison = b.snippets - a.snippets;
        break;
      case 'growth':
        comparison = b.growth - a.growth;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? -comparison : comparison;
  });

  // Filter categories based on search
  const filteredCategories = categoryStats.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCategoryCard = (category) => {
    const Icon = category.icon;
    
    return (
      <motion.div
        key={category.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
        onClick={() => setSelectedCategory(category.id)}
      >
        <Card className="h-full hover:shadow-xl transition-all duration-300 group">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} bg-opacity-20`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {category.languageCount}
                </div>
                <div className="text-xs text-slate-400">Languages</div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
              {category.name}
            </h3>
            
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {category.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Snippets</span>
                <span className="text-white font-semibold">
                  {category.totalSnippets.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Avg Growth</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className={`w-3 h-3 ${category.avgGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`font-semibold ${category.avgGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {category.avgGrowth > 0 ? '+' : ''}{category.avgGrowth}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Avg Popularity</span>
                <span className="text-cyan-400 font-semibold">
                  {category.avgPopularity}%
                </span>
              </div>

              {/* Popular languages in category */}
              <div className="flex flex-wrap gap-1 mt-3">
                {category.languages
                  .sort((a, b) => b.popularity - a.popularity)
                  .slice(0, 4)
                  .map((lang, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-md border"
                      style={{
                        backgroundColor: `${lang.color}20`,
                        borderColor: lang.color,
                        color: lang.color,
                      }}
                    >
                      {lang.name}
                    </span>
                  ))}
                {category.languages.length > 4 && (
                  <span className="px-2 py-1 text-xs rounded-md bg-slate-700 text-slate-300">
                    +{category.languages.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.div>
    );
  };

  const renderLanguageCard = (language, index) => (
    <Link
      key={language.name}
      to={`/snippets?language=${encodeURIComponent(language.name.toLowerCase())}`}
      className="block"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="h-full hover:shadow-xl transition-all duration-300 group">
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-5 h-5 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: language.color }}
                />
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {language.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">
                  {language.snippets.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">snippets</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Popularity</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${language.popularity}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold w-8 text-right">
                    {language.popularity}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Growth Rate</span>
                <div className="flex items-center space-x-1">
                  {language.growth >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
                  )}
                  <span className={`font-semibold ${language.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {language.growth > 0 ? '+' : ''}{language.growth}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Category</span>
                <span className="text-cyan-400 font-medium text-xs">
                  {language.category}
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.div>
    </Link>
  );

  const renderLanguageList = (language, index) => (
    <Link
      key={language.name}
      to={`/snippets?language=${encodeURIComponent(language.name.toLowerCase())}`}
      className="block"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="group"
      >
        <Card className="hover:shadow-lg transition-all duration-300">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: language.color }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {language.name}
                  </h3>
                  <p className="text-sm text-slate-400">{language.category}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-white">
                    {language.snippets.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">Snippets</div>
                </div>

                <div className="text-center">
                  <div className="font-semibold text-white">
                    {language.popularity}%
                  </div>
                  <div className="text-xs text-slate-400">Popularity</div>
                </div>

                <div className="text-center">
                  <div className={`font-semibold ${language.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {language.growth > 0 ? '+' : ''}{language.growth}%
                  </div>
                  <div className="text-xs text-slate-400">Growth</div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </motion.div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loading size="lg" text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full opacity-5 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Categories
              </h1>
            </div>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Explore programming languages and technologies organized by purpose and domain
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <Card.Content className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search languages, categories, or technologies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(languageCategories).map(([key, category]) => (
                        <option key={key} value={key}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="popularity">Sort by Popularity</option>
                      <option value="snippets">Sort by Snippets</option>
                      <option value="growth">Sort by Growth</option>
                      <option value="name">Sort by Name</option>
                    </select>
                    
                    <button
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || selectedCategory !== 'all') && (
                  <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-600">
                    <span className="text-sm text-slate-400">Active filters:</span>
                    {searchTerm && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-md text-xs">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs">
                        Category: {languageCategories[selectedCategory]?.name}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedLanguage('all');
                      }}
                      className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-md text-xs transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>

          {/* Category Overview (when no specific category is selected and no search) */}
          {selectedCategory === 'all' && !searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
                <div className="text-sm text-slate-400">
                  {categoryStats.length} categories • {languageStats.length} languages
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map(category => renderCategoryCard(category))}
              </div>
            </motion.div>
          )}

          {/* Languages Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedCategory !== 'all' 
                  ? `${languageCategories[selectedCategory]?.name} Languages`
                  : 'All Languages'
                }
              </h2>
              <div className="text-sm text-slate-400">
                {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Languages Grid/List */}
            <div className="space-y-4">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedLanguages.map((language, index) => renderLanguageCard(language, index))}
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedLanguages.map((language, index) => renderLanguageList(language, index))}
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredLanguages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No languages found</h3>
                  <p>Try adjusting your search terms or filters</p>
                </div>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedLanguage('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
