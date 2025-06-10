// Mock data for testing the profile page
export const mockUser = {
  id: 1,
  username: 'john_doe',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  bio: 'Full-stack developer passionate about clean code and open source. Love working with React, Node.js, and exploring new technologies.',
  location: 'San Francisco, CA',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  coverUrl: null,
  websiteUrl: 'https://johndoe.dev',
  githubUrl: 'https://github.com/johndoe',
  twitterUrl: 'https://twitter.com/johndoe',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2024-12-09T15:45:00Z',
  isVerified: true,
  followersCount: 245,
  followingCount: 189,
  snippetsCount: 67,
  totalViews: 12450,
  totalLikes: 892,
  totalForks: 156,
  emailVisible: false,
  activityVisible: true,
  profileSearchable: true,
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  commentNotifications: true,
  likeNotifications: false,
  followNotifications: true
};

export const mockSnippets = [
  {
    id: 1,
    title: 'React Custom Hook for API Calls',
    description: 'A reusable custom hook for handling API requests with loading states and error handling.',
    code: `const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
};`,
    language: 'JavaScript',
    visibility: 'public',
    tags: ['React', 'Hooks', 'API', 'JavaScript'],
    likesCount: 45,
    viewsCount: 1234,
    forksCount: 12,
    commentsCount: 8,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z'
  },
  {
    id: 2,
    title: 'Python Data Validation Decorator',
    description: 'Clean and efficient data validation using Python decorators for function parameters.',
    code: `def validate_types(**types):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i, (arg, expected_type) in enumerate(zip(args, types.values())):
                if not isinstance(arg, expected_type):
                    raise TypeError(f"Argument {i} must be {expected_type.__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator`,
    language: 'Python',
    visibility: 'public',
    tags: ['Python', 'Validation', 'Decorators', 'Functions'],
    likesCount: 32,
    viewsCount: 892,
    forksCount: 8,
    commentsCount: 5,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:30:00Z'
  },
  {
    id: 3,
    title: 'CSS Grid Auto-fit Layout',
    description: 'Responsive grid layout that automatically adjusts columns based on screen size.',
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`,
    language: 'CSS',
    visibility: 'unlisted',
    tags: ['CSS', 'Grid', 'Responsive', 'Layout'],
    likesCount: 28,
    viewsCount: 567,
    forksCount: 15,
    commentsCount: 3,
    createdAt: '2024-01-12T14:45:00Z',
    updatedAt: '2024-01-19T11:20:00Z'
  },
  {
    id: 4,
    title: 'JWT Authentication Helper',
    description: 'Simple JWT token management utility for Node.js applications.',
    code: `const jwt = require('jsonwebtoken');

class JWTHelper {
  constructor(secret) {
    this.secret = secret;
  }

  sign(payload, expiresIn = '24h') {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = JWTHelper;`,
    language: 'JavaScript',
    visibility: 'private',
    tags: ['Node.js', 'JWT', 'Authentication', 'Security'],
    likesCount: 51,
    viewsCount: 1678,
    forksCount: 23,
    commentsCount: 12,
    createdAt: '2023-12-28T16:20:00Z',
    updatedAt: '2024-01-05T10:45:00Z'
  },
  {
    id: 5,
    title: 'SQL Query Performance Tips',
    description: 'Common SQL optimization techniques to improve query performance.',
    code: `-- Use indexes effectively
CREATE INDEX idx_user_email ON users(email);

-- Avoid SELECT *
SELECT id, name, email FROM users WHERE status = 'active';

-- Use LIMIT for large datasets
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;

-- Use JOINs instead of subqueries when possible
SELECT u.name, p.title 
FROM users u 
JOIN posts p ON u.id = p.user_id 
WHERE u.status = 'active';`,
    language: 'SQL',
    visibility: 'public',
    tags: ['SQL', 'Performance', 'Database', 'Optimization'],
    likesCount: 73,
    viewsCount: 2341,
    forksCount: 34,
    commentsCount: 18,
    createdAt: '2023-11-15T08:30:00Z',
    updatedAt: '2023-12-02T13:15:00Z'
  },
  {
    id: 6,
    title: 'Docker Multi-stage Build',
    description: 'Efficient Docker multi-stage build for Node.js applications.',
    code: `# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
    language: 'Docker',
    visibility: 'public',
    tags: ['Docker', 'Node.js', 'DevOps', 'Containerization'],
    likesCount: 39,
    viewsCount: 1156,
    forksCount: 19,
    commentsCount: 7,
    createdAt: '2023-10-22T12:00:00Z',
    updatedAt: '2023-11-08T15:30:00Z'
  }
];
