// Help Articles Data
export const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of CodeHub',
    icon: 'Book',
    color: 'bg-blue-500',
    totalArticles: 12,
    articles: [
      {
        id: 'gs-1',
        title: 'Creating your first snippet',
        slug: 'creating-your-first-snippet',
        views: 1250,
        rating: 4.8,
        readTime: '5 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-10',
        summary: 'Learn how to create and share your first code snippet on CodeHub',
        content: `
# Creating Your First Snippet

Welcome to CodeHub! This guide will walk you through creating your first code snippet.

## What is a Code Snippet?

A code snippet is a small piece of reusable code that solves a specific problem or demonstrates a particular technique. On CodeHub, you can share snippets with the community to help other developers learn and solve problems.

## Step-by-Step Guide

### 1. Navigate to Create Snippet

1. Click on the **"Create"** button in the top navigation
2. Select **"New Snippet"** from the dropdown menu
3. You'll be redirected to the snippet creation page

### 2. Fill in Basic Information

**Title**: Give your snippet a clear, descriptive title
- Good: "React useState Hook Example"
- Bad: "My Code"

**Description**: Explain what your snippet does and when to use it
- Include the problem it solves
- Mention any prerequisites
- Add usage examples if helpful

### 3. Write Your Code

**Language Selection**: Choose the appropriate programming language from the dropdown. This enables syntax highlighting.

**Code Editor**: Use our Monaco-powered editor to write your code
- Syntax highlighting is automatic
- Auto-completion helps with common patterns
- Line numbers for easy reference

### 4. Add Tags

Tags help others discover your snippet:
- Use relevant programming languages (e.g., "javascript", "react")
- Include framework names (e.g., "nextjs", "express")
- Add concept tags (e.g., "hooks", "async", "authentication")

### 5. Set Visibility

Choose who can see your snippet:
- **Public**: Visible to everyone, appears in search results
- **Unlisted**: Only accessible with direct link
- **Private**: Only you can see it

### 6. Preview and Publish

1. Use the **Preview** tab to see how your snippet will look
2. Check syntax highlighting and formatting
3. Click **"Publish Snippet"** when ready

## Best Practices

### Code Quality
- Write clean, readable code
- Add comments for complex logic
- Follow language-specific conventions
- Test your code before sharing

### Documentation
- Explain the problem your snippet solves
- Include usage examples
- Document any dependencies
- Add installation instructions if needed

### Tagging
- Use 3-5 relevant tags
- Include the primary language
- Add framework/library tags
- Use descriptive concept tags

## Next Steps

After creating your first snippet:
1. Share it with the community
2. Engage with feedback and comments
3. Update your snippet based on suggestions
4. Explore other snippets for inspiration

Happy coding! 🚀
        `,
        tags: ['getting-started', 'tutorial', 'basics']
      },
      {
        id: 'gs-2',
        title: 'Setting up your profile',
        slug: 'setting-up-your-profile',
        views: 980,
        rating: 4.6,
        readTime: '3 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-08',
        summary: 'Complete your CodeHub profile to connect with other developers',
        content: `
# Setting Up Your Profile

Your CodeHub profile is your developer identity. A well-crafted profile helps you connect with other developers and showcases your skills.

## Profile Basics

### Profile Picture
1. Click on your avatar in the top-right corner
2. Select "Profile Settings"
3. Upload a professional photo or use our avatar generator
4. Recommended size: 400x400 pixels

### Bio and Description
Write a compelling bio that includes:
- Your role/title (e.g., "Full Stack Developer")
- Technologies you work with
- What you're passionate about
- Current learning goals

**Example:**
"Frontend developer passionate about React and TypeScript. Currently learning Three.js for 3D web experiences. Love sharing knowledge through code snippets!"

## Contact Information

### Social Links
Add your professional social media profiles:
- **GitHub**: Link your repositories
- **LinkedIn**: Professional networking
- **Twitter**: Developer community engagement
- **Website**: Personal portfolio or blog

### Location
Adding your location helps with:
- Finding local developers
- Networking opportunities
- Time zone awareness for collaboration

## Skills and Technologies

### Skill Tags
Add technologies you work with:
- Programming languages (JavaScript, Python, Java)
- Frameworks (React, Vue, Angular, Django)
- Tools (Git, Docker, AWS)
- Databases (MongoDB, PostgreSQL, Redis)

### Experience Level
Set your experience level for different technologies:
- **Beginner**: Learning the basics
- **Intermediate**: Comfortable with common patterns
- **Advanced**: Deep understanding and experience
- **Expert**: Can teach and mentor others

## Privacy Settings

### Profile Visibility
Choose who can see your profile:
- **Public**: Visible to everyone
- **Registered Users**: Only logged-in users
- **Private**: Only people you follow

### Activity Sharing
Control what activities are visible:
- Snippet creation and updates
- Comments and likes
- Following activity
- Learning progress

## Customization

### Theme Preferences
Personalize your CodeHub experience:
- **Dark Mode**: Easy on the eyes during coding
- **Light Mode**: Clean and bright interface
- **Auto**: Follows your system preference

### Notification Settings
Configure how you want to be notified:
- Email notifications for comments
- Push notifications for mentions
- Weekly digest of popular snippets
- Following updates

## Building Your Reputation

### Share Quality Content
- Create useful code snippets
- Write clear documentation
- Help others with comments
- Share your learning journey

### Engage with Community
- Comment on interesting snippets
- Like and bookmark helpful content
- Follow developers you admire
- Participate in discussions

### Consistency
- Regular activity builds reputation
- Update your profile as you grow
- Keep your skills section current
- Share your latest projects

## Profile Completion Checklist

- [ ] Profile picture uploaded
- [ ] Bio written (50+ characters)
- [ ] At least 3 skill tags added
- [ ] Social links added (GitHub recommended)
- [ ] Location specified
- [ ] Privacy settings configured
- [ ] First snippet created

Complete your profile to unlock all CodeHub features and start building your developer network!
        `,
        tags: ['profile', 'setup', 'personalization']
      },
      {
        id: 'gs-3',
        title: 'Understanding syntax highlighting',
        slug: 'understanding-syntax-highlighting',
        views: 756,
        rating: 4.7,
        readTime: '4 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-05',
        summary: 'Learn how syntax highlighting works and how to get the best display for your code',
        content: `
# Understanding Syntax Highlighting

Syntax highlighting makes your code easier to read by coloring different parts of your code according to their function. CodeHub uses Monaco Editor (the same editor as VS Code) for the best highlighting experience.

## How It Works

### Automatic Detection
When you create a snippet, CodeHub automatically detects the programming language based on:
- File extension (if provided)
- Code patterns and keywords
- Manual selection from the language dropdown

### Supported Languages

CodeHub supports syntax highlighting for 50+ programming languages:

**Popular Languages:**
- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- Go
- Rust
- PHP

**Web Technologies:**
- HTML
- CSS/SCSS/LESS
- React JSX
- Vue
- Angular

**Data & Config:**
- JSON
- YAML
- XML
- SQL
- GraphQL

**Shell & Scripts:**
- Bash
- PowerShell
- Batch

## Language Selection

### Manual Selection
1. Create or edit a snippet
2. Click the language dropdown (usually shows "Plain Text")
3. Search for your language
4. Select the appropriate option

### Best Practices
- Always select the correct language
- Use specific variants when available (e.g., "JavaScript React" instead of just "JavaScript")
- For config files, use the specific format (e.g., "JSON" not "Text")

## Code Formatting

### Indentation
Proper indentation improves readability:
- Use consistent spaces or tabs
- Follow language conventions
- CodeHub preserves your original formatting

### Comments
Comments are highlighted differently:
\`\`\`javascript
// Single-line comments appear in gray
/* Multi-line comments 
   are also highlighted */
\`\`\`

### Strings and Keywords
Different colors for different elements:
\`\`\`javascript
const message = "Hello World"; // keyword, variable, string
function greet(name) {         // function keyword
    return \`Hi, \${name}!\`;      // template literal
}
\`\`\`

## Advanced Features

### Code Folding
Long functions or blocks can be collapsed:
- Click the arrow next to line numbers
- Useful for organizing large snippets
- Helps focus on specific sections

### Minimap
For longer code snippets:
- Shows overview of entire file
- Quick navigation to different sections
- Highlights current viewport

### Error Detection
CodeHub highlights common syntax errors:
- Missing brackets or semicolons
- Undefined variables
- Type mismatches (in TypeScript)

## Troubleshooting

### Language Not Detected
If highlighting isn't working:
1. Check language selection in dropdown
2. Ensure code follows language syntax
3. Try refreshing the page
4. Contact support if issues persist

### Mixed Languages
For files with multiple languages:
- HTML with embedded CSS/JavaScript
- Markdown with code blocks
- Use the primary language for highlighting

### Custom Highlighting
For specialized formats:
- Use the closest supported language
- Add a note in the description
- Consider breaking into multiple snippets

## Tips for Better Highlighting

### JavaScript/TypeScript
\`\`\`javascript
// Use proper JSX for React components
function Component() {
    return <div>Hello World</div>;
}

// TypeScript types are highlighted
interface User {
    name: string;
    age: number;
}
\`\`\`

### Python
\`\`\`python
# Proper function definitions
def calculate_total(items):
    """Calculate total price with tax."""
    return sum(item.price for item in items) * 1.08

# Class definitions
class User:
    def __init__(self, name):
        self.name = name
\`\`\`

### CSS
\`\`\`css
/* Selectors and properties are highlighted */
.button {
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    padding: 8px 16px;
}

/* Media queries */
@media (max-width: 768px) {
    .button {
        width: 100%;
    }
}
\`\`\`

Good syntax highlighting makes your code more readable and professional. Take advantage of CodeHub's powerful highlighting features to create snippets that are easy to understand and learn from!
        `,
        tags: ['syntax', 'highlighting', 'editor']
      },
      {
        id: 'gs-4',
        title: 'How to search for code snippets',
        slug: 'how-to-search-for-code-snippets',
        views: 645,
        rating: 4.5,
        readTime: '6 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-03',
        summary: 'Master CodeHub\'s search features to find exactly what you need',
        content: `
# How to Search for Code Snippets

Finding the right code snippet quickly is essential for productive development. CodeHub offers powerful search features to help you discover exactly what you need.

## Basic Search

### Search Bar
The search bar is available on every page:
1. Located in the top navigation
2. Use \`Ctrl+K\` (or \`Cmd+K\` on Mac) for quick access
3. Start typing to see instant suggestions
4. Press Enter to see full results

### Search Tips
- Use specific keywords
- Include programming language
- Add framework or library names
- Try alternative terms if needed

## Advanced Search Features

### Filters
Refine your search results using filters:

**Language Filter:**
- Select specific programming languages
- Multiple languages can be selected
- Popular languages are shown first

**Tags:**
- Filter by specific tags
- Combine multiple tags for precision
- Use "AND" logic (all tags must match)

**Date Range:**
- Recent snippets (last week)
- Popular this month
- All time favorites

**Difficulty Level:**
- Beginner-friendly
- Intermediate concepts
- Advanced techniques

### Search Operators

Use special operators for precise searches:

**Exact Phrases:**
\`"react hooks useState"\` - finds exact phrase

**Exclude Terms:**
\`javascript -jquery\` - JavaScript but not jQuery

**Language Specific:**
\`lang:python\` - only Python snippets

**User Search:**
\`user:username\` - snippets by specific user

**Tag Search:**
\`tag:authentication\` - snippets tagged with authentication

## Search Categories

### By Problem Type

**Authentication:**
- Login systems
- JWT tokens
- OAuth integration
- Password hashing

**API Integration:**
- REST API calls
- GraphQL queries
- Error handling
- Rate limiting

**Data Manipulation:**
- Array operations
- Object transformation
- Database queries
- CSV parsing

**UI Components:**
- Modal dialogs
- Form validation
- Responsive layouts
- Animation effects

### By Technology Stack

**Frontend:**
\`react button component\`
\`vue directive\`
\`angular service\`
\`css flexbox layout\`

**Backend:**
\`express middleware\`
\`django authentication\`
\`node.js file upload\`
\`python web scraping\`

**Database:**
\`mongodb aggregation\`
\`sql join queries\`
\`redis caching\`
\`prisma schema\`

**DevOps:**
\`docker compose\`
\`github actions\`
\`nginx configuration\`
\`aws lambda\`

## Search Results

### Result Types

**Snippet Results:**
- Code snippets matching your query
- Ranked by relevance and popularity
- Shows language, tags, and stats

**User Results:**
- Developers with relevant expertise
- Profile information and specialties
- Number of related snippets

**Tag Results:**
- Related tags to refine search
- Popular tags in your domain
- Tag descriptions and usage

### Result Ranking

Results are ranked by:
1. **Relevance** - how well title and content match
2. **Popularity** - views, likes, and bookmarks
3. **Recency** - recently updated content
4. **Quality** - user ratings and feedback

### Result Actions

For each result you can:
- **View** - see the full snippet
- **Like** - mark as helpful
- **Bookmark** - save for later
- **Fork** - create your own version
- **Comment** - ask questions or provide feedback

## Search Strategies

### Problem-First Approach
1. Describe your problem clearly
2. Include the technology you're using
3. Add context about your use case
4. Try different keyword combinations

**Example:**
Instead of: \`button\`
Try: \`react button component click handler\`

### Solution-First Approach
1. Search for specific solutions
2. Look for implementation patterns
3. Find complete examples
4. Check for best practices

**Example:**
\`jwt authentication middleware express\`
\`form validation react hook form\`

### Learning-Oriented Search
1. Start with broad concepts
2. Narrow down to specific techniques
3. Look for tutorial-style snippets
4. Find progressive examples

**Example:**
\`javascript basics\` → \`javascript arrays\` → \`javascript array map filter\`

## Saved Searches

### Creating Alerts
Save frequently used searches:
1. Perform a search with filters
2. Click "Save Search" button
3. Name your saved search
4. Choose notification frequency

### Managing Alerts
- Edit search parameters
- Change notification settings
- Delete outdated searches
- Share searches with team

## Search History

### Recent Searches
- Access your last 20 searches
- Click to repeat exact search
- See search frequency
- Export search history

### Popular Searches
Discover trending searches:
- Most searched this week
- Popular in your language
- Trending tags
- Community favorites

## Mobile Search

### Touch-Optimized
- Large search buttons
- Swipe-friendly filters
- Voice search support
- Offline search history

### Quick Actions
- Recent searches
- Saved snippets
- Popular categories
- Quick filters

## Troubleshooting Search

### No Results Found
Try these steps:
1. Check spelling and syntax
2. Remove some filters
3. Use broader terms
4. Try alternative keywords

### Too Many Results
Narrow down with:
1. Add more specific terms
2. Use language filters
3. Apply difficulty filters
4. Sort by recency

### Irrelevant Results
Improve relevance by:
1. Using exact phrases
2. Excluding unwanted terms
3. Adding context words
4. Using specific tags

Effective searching is a skill that improves with practice. Experiment with different strategies and filters to become a power user of CodeHub's search features!
        `,
        tags: ['search', 'discovery', 'tips']
      }
    ]
  },
  {
    id: 'code-management',
    title: 'Code Management',
    description: 'Managing your snippets and code',
    icon: 'Code',
    color: 'bg-green-500',
    totalArticles: 8,
    articles: [
      {
        id: 'cm-1',
        title: 'Organizing snippets with tags',
        slug: 'organizing-snippets-with-tags',
        views: 892,
        rating: 4.7,
        readTime: '5 min',
        difficulty: 'Intermediate',
        lastUpdated: '2025-07-12',
        summary: 'Learn effective tagging strategies to organize and discover your code snippets',
        content: `
# Organizing Snippets with Tags

Tags are the backbone of snippet organization on CodeHub. A well-thought-out tagging strategy makes your snippets discoverable and helps you build a organized code library.

## What Are Tags?

Tags are keywords that describe what your snippet does, what technologies it uses, and what problems it solves. They act as labels that help categorize and find content.

### Benefits of Good Tagging
- **Discoverability**: Others can find your snippets easily
- **Organization**: Group related snippets together
- **Search**: Filter and search your own collection
- **Community**: Connect with snippets on similar topics

## Tag Categories

### Language Tags
Always include the primary programming language:
\`\`\`
javascript, python, java, typescript, go, rust, php
\`\`\`

### Framework Tags
Add relevant frameworks and libraries:
\`\`\`
react, vue, angular, express, django, spring, laravel
\`\`\`

### Concept Tags
Describe what the snippet demonstrates:
\`\`\`
authentication, validation, async, hooks, middleware, api
\`\`\`

### Use Case Tags
Explain when to use the snippet:
\`\`\`
form-handling, file-upload, error-handling, testing, deployment
\`\`\`

### Difficulty Tags
Help others understand complexity:
\`\`\`
beginner, intermediate, advanced, tutorial, example, pattern
\`\`\`

## Tagging Best Practices

### 1. Be Specific and Relevant
**Good:**
\`react-hooks, useState, state-management\`

**Bad:**
\`code, programming, web\`

### 2. Use 3-7 Tags
- Too few: Hard to categorize
- Too many: Loses focus
- Sweet spot: 4-6 tags

### 3. Follow Conventions
Use commonly accepted tag names:
- \`javascript\` not \`js\`
- \`react-native\` not \`reactnative\`
- \`machine-learning\` not \`ml\`

### 4. Include Hierarchical Tags
Add both general and specific tags:
\`\`\`
database, sql, postgresql, query-optimization
\`\`\`

## Tag Examples by Category

### Frontend Development
\`\`\`javascript
// React Component Example
Tags: react, component, hooks, useState, typescript, ui

// CSS Animation
Tags: css, animation, keyframes, transition, responsive

// Vue.js Form
Tags: vue, form, validation, vuex, composition-api
\`\`\`

### Backend Development
\`\`\`python
// Django REST API
Tags: django, rest-api, serializers, authentication, python

// Express Middleware
Tags: express, middleware, authentication, jwt, node.js

// Database Query
Tags: sql, postgresql, join, optimization, query
\`\`\`

### DevOps & Tools
\`\`\`yaml
// Docker Configuration
Tags: docker, containerization, deployment, nginx, production

// GitHub Actions
Tags: ci-cd, github-actions, automation, testing, deployment

// AWS Lambda
Tags: aws, lambda, serverless, python, api-gateway
\`\`\`

## Advanced Tagging Strategies

### Namespace Tags
Use prefixes for organization:
\`\`\`
ui:button, ui:modal, ui:form
api:auth, api:users, api:posts
util:date, util:string, util:array
\`\`\`

### Version Tags
Track technology versions:
\`\`\`
react-18, node-20, python-3.11, typescript-5
\`\`\`

### Project Tags
Link snippets to specific projects:
\`\`\`
project:ecommerce, project:blog, project:dashboard
\`\`\`

### Status Tags
Indicate snippet status:
\`\`\`
work-in-progress, deprecated, updated, tested, production-ready
\`\`\`

## Tag Management

### Editing Tags
Update tags when:
- Technology versions change
- Use cases evolve
- Better tags become available
- Community conventions change

### Tag Analytics
Monitor your tag usage:
- Most used tags
- Tag performance (views/likes)
- Community tag trends
- Missing tag opportunities

### Tag Consistency
Maintain consistency across snippets:
- Use same spelling and format
- Follow established patterns
- Regular tag audits
- Create personal tag guidelines

## Community Tagging

### Popular Tags
Learn from popular tags in your domain:
- Check trending tags
- See what experts use
- Follow tag conventions
- Contribute to tag discussions

### Tag Discovery
Find new relevant tags:
- Browse similar snippets
- Check user profiles
- Explore tag clouds
- Use tag suggestions

### Tag Collaboration
Work with the community:
- Suggest tag improvements
- Report inappropriate tags
- Participate in tag discussions
- Help maintain tag quality

## Search Optimization

### SEO-Friendly Tags
Choose tags that people search for:
- Use common terminology
- Include alternative spellings
- Add industry terms
- Consider beginner language

### Long-tail Tags
Include specific combinations:
\`\`\`
react-custom-hooks, jwt-authentication-middleware, responsive-css-grid
\`\`\`

### Context Tags
Add environmental context:
\`\`\`
browser, node.js, mobile, desktop, server-side, client-side
\`\`\`

## Tag Hierarchy Examples

### React Development
\`\`\`
Level 1: react
Level 2: react-hooks, react-components, react-router
Level 3: useState, useEffect, custom-hooks, functional-components
Level 4: state-management, lifecycle, routing, context-api
\`\`\`

### Python Data Science
\`\`\`
Level 1: python
Level 2: data-science, machine-learning, pandas, numpy
Level 3: data-analysis, visualization, preprocessing, modeling
Level 4: feature-engineering, model-evaluation, data-cleaning
\`\`\`

## Common Tagging Mistakes

### Avoid These Pitfalls
1. **Over-tagging**: Using too many irrelevant tags
2. **Under-tagging**: Missing important descriptive tags
3. **Inconsistency**: Different formats for same concept
4. **Vague tags**: Generic terms that don't help
5. **Personal tags**: Tags only meaningful to you

### Tag Validation
Before publishing, ask:
- Would I search for these tags?
- Do they accurately describe the snippet?
- Are they commonly used terms?
- Do they follow community conventions?

## Tag Maintenance

### Regular Reviews
Schedule periodic tag reviews:
- Monthly tag audits
- Update deprecated tags
- Add newly relevant tags
- Remove outdated tags

### Tag Migration
When updating tags:
- Keep old tags temporarily
- Add new tags gradually
- Update related snippets
- Notify followers of changes

Effective tagging is an art that improves with practice. Start with basic categories and gradually develop your own tagging system that works for your coding style and the community's needs.
        `,
        tags: ['organization', 'tags', 'best-practices']
      }
    ]
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Connect with other developers',
    icon: 'Users',
    color: 'bg-purple-500',
    totalArticles: 6,
    articles: [
      {
        id: 'comm-1',
        title: 'Following other developers',
        slug: 'following-other-developers',
        views: 723,
        rating: 4.3,
        readTime: '4 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-09',
        summary: 'Build your developer network by following and connecting with other CodeHub users',
        content: `
# Following Other Developers

Building connections with other developers is one of the most valuable aspects of CodeHub. Following developers you admire helps you discover new content, learn from experts, and build your professional network.

## Why Follow Developers?

### Stay Updated
- See their latest snippets in your feed
- Get notified about new content
- Track their learning journey
- Discover new technologies they explore

### Learn from Experts
- Access proven code patterns
- See best practices in action
- Understand problem-solving approaches
- Learn new technologies faster

### Build Network
- Connect with like-minded developers
- Find potential collaborators
- Discover job opportunities
- Join community discussions

## How to Find Developers to Follow

### Search by Technology
1. Search for snippets in your tech stack
2. Look at snippet authors
3. Check their profiles
4. Follow those with quality content

### Browse Categories
- Frontend developers
- Backend specialists
- DevOps engineers
- Data scientists
- Mobile developers

### Community Features
- Check featured developers
- Look at trending profiles
- See who others follow
- Join discussions and find active members

### Quality Indicators
Look for developers who:
- Share high-quality snippets
- Write clear documentation
- Engage with community
- Have consistent activity
- Receive positive feedback

## Following Process

### Find a Developer
1. Visit their profile page
2. Review their snippets and activity
3. Check their expertise areas
4. Read their bio and background

### Click Follow
1. Click the "Follow" button on their profile
2. They'll be added to your following list
3. Their activity appears in your feed
4. You'll get notifications based on settings

### Follow Back
When someone follows you:
- Check their profile
- Review their content
- Follow back if interested
- Engage with their snippets

## Managing Your Following

### Following Feed
Your personalized feed shows:
- New snippets from followed developers
- Updates to existing snippets
- Comments and discussions
- Achievement notifications

### Notification Settings
Control what notifications you receive:
- New snippet publications
- Snippet updates
- Comment activity
- Milestone achievements

### Following List
Manage your following list:
- View all followed developers
- Sort by activity or relevance
- Unfollow inactive accounts
- Organize into groups (upcoming feature)

## Building Your Own Following

### Create Quality Content
- Share useful snippets regularly
- Write clear documentation
- Solve real problems
- Keep content current

### Engage with Community
- Comment on others' snippets
- Like and share helpful content
- Answer questions
- Participate in discussions

### Be Consistent
- Regular posting schedule
- Consistent quality standards
- Reliable activity
- Professional communication

### Profile Optimization
- Complete your profile fully
- Use professional avatar
- Write compelling bio
- Showcase your best work

## Following Etiquette

### Respectful Engagement
- Leave constructive comments
- Ask thoughtful questions
- Provide helpful feedback
- Acknowledge good work

### Avoid Spam
- Don't mass follow/unfollow
- Avoid generic comments
- Don't promote unrelated content
- Respect others' time

### Give Credit
- Acknowledge inspiration sources
- Tag original authors when forking
- Share others' work appropriately
- Respect intellectual property

## Following Strategies

### Quality Over Quantity
Focus on developers who:
- Share content relevant to your interests
- Maintain high quality standards
- Engage meaningfully with community
- Provide learning value

### Diverse Following
Follow developers with different:
- Expertise levels (beginners to experts)
- Technology focuses
- Industry backgrounds
- Geographic locations
- Communication styles

### Regular Review
Periodically review your following:
- Unfollow inactive accounts
- Add new interesting developers
- Adjust notification settings
- Update following criteria

## Following Categories

### By Expertise Level

**Beginners:**
- Fresh perspectives
- Simple, clear explanations
- Learning journey insights
- Relatable struggles

**Intermediate:**
- Practical solutions
- Real-world examples
- Growth trajectories
- Skill development

**Experts:**
- Advanced techniques
- Industry insights
- Best practices
- Thought leadership

### By Content Type

**Tutorial Creators:**
- Step-by-step guides
- Educational content
- Beginner-friendly explanations
- Comprehensive examples

**Problem Solvers:**
- Quick solutions
- Bug fixes
- Optimization tips
- Troubleshooting guides

**Innovators:**
- Cutting-edge techniques
- New technology adoption
- Creative solutions
- Experimental code

### By Technology Stack

**Frontend Specialists:**
- React, Vue, Angular experts
- CSS and design systems
- Performance optimization
- User experience focus

**Backend Developers:**
- API design patterns
- Database optimization
- Server architecture
- Security implementations

**Full-Stack Engineers:**
- End-to-end solutions
- Integration patterns
- Architecture decisions
- Technology comparisons

## Mutual Following Benefits

### Collaboration Opportunities
- Code reviews
- Pair programming
- Project partnerships
- Knowledge sharing

### Learning Acceleration
- Faster problem solving
- Diverse perspectives
- Skill validation
- Career guidance

### Professional Growth
- Industry connections
- Job referrals
- Speaking opportunities
- Community recognition

## Following Analytics

### Track Your Impact
Monitor your follower growth:
- Total followers count
- Follower quality metrics
- Engagement rates
- Geographic distribution

### Understand Your Audience
Learn about your followers:
- Technology interests
- Experience levels
- Active times
- Preferred content types

### Optimize Strategy
Use insights to improve:
- Content planning
- Posting timing
- Topic selection
- Engagement tactics

## Privacy and Safety

### Privacy Controls
Manage your visibility:
- Public vs private profiles
- Follower approval settings
- Activity visibility controls
- Contact information limits

### Safety Features
Report inappropriate behavior:
- Spam or harassment
- Copyright violations
- Inappropriate content
- Fake accounts

### Block and Unfollow
Use these tools when needed:
- Block problematic users
- Unfollow quietly
- Report violations
- Maintain healthy environment

Following other developers is about building genuine connections and learning relationships. Focus on quality interactions, provide value to your followers, and maintain a positive presence in the community.
        `,
        tags: ['community', 'networking', 'following']
      }
    ]
  },
  {
    id: 'account-settings',
    title: 'Account & Settings',
    description: 'Manage your account preferences',
    icon: 'Settings',
    color: 'bg-orange-500',
    totalArticles: 7,
    articles: [
      {
        id: 'as-1',
        title: 'Changing your password',
        slug: 'changing-your-password',
        views: 834,
        rating: 4.6,
        readTime: '3 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-11',
        summary: 'Keep your account secure by regularly updating your password',
        content: `
# Changing Your Password

Regularly updating your password is crucial for account security. CodeHub makes it easy to change your password while ensuring your account remains secure.

## When to Change Your Password

### Security Reasons
- Suspected account compromise
- Password appeared in data breaches
- Shared device usage
- Suspicious account activity

### Best Practice Schedule
- Every 3-6 months for regular updates
- Immediately after security concerns
- When leaving shared devices
- After team member changes (if password was shared)

### Warning Signs
Change your password immediately if you notice:
- Unrecognized login notifications
- Snippets you didn't create
- Changes to your profile
- Unexpected email notifications

## Password Requirements

### Minimum Standards
CodeHub requires passwords that are:
- At least 8 characters long
- Contain uppercase letters
- Contain lowercase letters
- Include at least one number
- Have at least one special character

### Recommended Standards
For maximum security, use passwords that:
- Are 12+ characters long
- Mix multiple character types
- Avoid common patterns
- Don't reuse previous passwords
- Are unique to CodeHub

## Step-by-Step Guide

### 1. Access Account Settings
1. Click your profile picture (top-right corner)
2. Select "Account Settings" from dropdown
3. Navigate to "Security" tab
4. Find "Password" section

### 2. Verify Current Password
1. Enter your current password
2. System verifies your identity
3. Proceed to password change form

### 3. Enter New Password
1. Type your new password
2. Confirm new password in second field
3. Check password strength indicator
4. Ensure it meets all requirements

### 4. Save Changes
1. Click "Update Password" button
2. System validates new password
3. Confirmation message appears
4. Optional: Force logout from other devices

## Password Security Tips

### Creating Strong Passwords

**Use Passphrases:**
\`MyFavorite2024CodeSnippet!\` - Easier to remember, harder to crack

**Avoid Common Mistakes:**
- Don't use personal information
- Avoid common words or patterns
- Don't reuse passwords across sites
- Avoid keyboard patterns (qwerty123)

**Password Patterns:**
- Combine unrelated words
- Add numbers and symbols
- Use random capitalization
- Include special characters

### Password Managers
Consider using a password manager:
- Generates strong, unique passwords
- Stores passwords securely
- Auto-fills login forms
- Syncs across devices
- Alerts for compromised passwords

**Popular Options:**
- 1Password
- LastPass
- Bitwarden
- Dashlane
- Built-in browser managers

## Two-Factor Authentication

### Enable 2FA
After changing your password, enable 2FA for added security:
1. Go to Security settings
2. Find "Two-Factor Authentication"
3. Choose your preferred method
4. Follow setup instructions

### 2FA Methods
- **Authenticator Apps**: Google Authenticator, Authy
- **SMS**: Text message codes
- **Email**: Email verification codes
- **Hardware Keys**: YubiKey, FIDO2 devices

## Account Recovery

### Recovery Options
Set up recovery methods before you need them:
- Recovery email address
- Phone number verification
- Security questions
- Backup codes

### Lost Password Process
If you forget your password:
1. Click "Forgot Password" on login page
2. Enter your email address
3. Check email for reset link
4. Follow link to create new password
5. Log in with new password

## Security Best Practices

### Regular Maintenance
- Review account activity monthly
- Update password every 3-6 months
- Check connected devices regularly
- Monitor login notifications

### Device Security
- Log out from shared devices
- Use trusted devices when possible
- Keep devices updated
- Use device lock screens

### Network Security
- Avoid public WiFi for account changes
- Use VPN on untrusted networks
- Ensure HTTPS connection
- Clear browser data after use

## Troubleshooting

### Common Issues

**Password Won't Update:**
- Check current password is correct
- Ensure new password meets requirements
- Try different browser or clear cache
- Contact support if issues persist

**Forgot Current Password:**
- Use password reset process
- Check password manager
- Try common variations you use
- Contact support with account verification

**Password Reset Email Not Received:**
- Check spam/junk folders
- Verify email address spelling
- Wait 10-15 minutes for delivery
- Try alternative email if configured

### Getting Help
If you need assistance:
1. Check our troubleshooting guide
2. Search community forums
3. Contact support with account details
4. Provide screenshots if helpful

## After Changing Password

### Immediate Steps
1. Update password in password manager
2. Log in to verify new password works
3. Update other devices/browsers
4. Review account security settings

### Security Review
Take this opportunity to:
- Enable two-factor authentication
- Review connected applications
- Update recovery information
- Check recent account activity

### Team Notifications
If working in teams:
- Update shared password managers
- Notify team members if relevant
- Review team access permissions
- Update documentation

## Password Change Notifications

### Automatic Notifications
CodeHub automatically sends notifications:
- Email confirmation of password change
- Login alerts from new devices
- Security setting changes
- Suspicious activity alerts

### Managing Notifications
Configure notification preferences:
- Email frequency settings
- Mobile push notifications
- Security alert preferences
- Team notification settings

Regular password updates are a simple but effective way to protect your CodeHub account. Combined with other security measures like two-factor authentication, they help ensure your code and personal information stay safe.
        `,
        tags: ['security', 'password', 'account']
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Keep your account secure',
    icon: 'Shield',
    color: 'bg-red-500',
    totalArticles: 5,
    articles: [
      {
        id: 'sec-1',
        title: 'Two-factor authentication setup',
        slug: 'two-factor-authentication-setup',
        views: 676,
        rating: 4.8,
        readTime: '7 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-15',
        summary: 'Secure your account with two-factor authentication for enhanced protection',
        content: `
# Two-Factor Authentication Setup

Two-factor authentication (2FA) adds an extra layer of security to your CodeHub account by requiring both your password and a second verification factor. This guide will walk you through setting up and using 2FA.

## What is Two-Factor Authentication?

### Security Layers
1. **Something you know**: Your password
2. **Something you have**: Your phone or hardware token
3. **Something you are**: Biometric verification (future feature)

### How It Works
1. Enter your username and password
2. System prompts for second factor
3. Provide verification code from your device
4. Access granted after both factors verified

### Benefits
- **Enhanced Security**: Prevents unauthorized access even if password is compromised
- **Peace of Mind**: Know your account is protected
- **Industry Standard**: Meets security best practices
- **Compliance**: Required for some enterprise environments

## 2FA Methods Available

### 1. Authenticator Apps (Recommended)
**Most Secure Option**

**Supported Apps:**
- Google Authenticator (iOS/Android)
- Microsoft Authenticator (iOS/Android)
- Authy (iOS/Android/Desktop)
- 1Password (with subscription)
- Bitwarden Authenticator

**Advantages:**
- Works offline
- More secure than SMS
- No dependency on phone service
- Can backup codes

### 2. SMS Text Messages
**Convenient Option**

**How it works:**
- Receive 6-digit codes via text
- Enter code during login
- Valid for 5 minutes

**Considerations:**
- Requires cellular service
- Vulnerable to SIM swapping
- May have delivery delays
- International charges may apply

### 3. Email Verification
**Backup Option**

**Process:**
- Receive codes via email
- Use when other methods unavailable
- Temporary access option

**Use Cases:**
- Backup method
- Device lost/broken
- Travel without phone
- Emergency access

### 4. Hardware Keys (Coming Soon)
**Enterprise-Grade Security**

**Supported Standards:**
- FIDO2/WebAuthn
- YubiKey
- FIDO Alliance certified devices

## Setting Up Authenticator App 2FA

### Step 1: Access Security Settings
1. Click your profile picture
2. Select "Account Settings"
3. Navigate to "Security" tab
4. Find "Two-Factor Authentication" section

### Step 2: Choose Method
1. Click "Set up 2FA"
2. Select "Authenticator App"
3. Download recommended app if needed

### Step 3: Scan QR Code
1. Open your authenticator app
2. Add new account/scan QR code
3. Point camera at QR code on screen
4. Account automatically added to app

### Step 4: Enter Verification Code
1. Check your authenticator app
2. Find CodeHub entry
3. Enter the 6-digit code
4. Click "Verify and Enable"

### Step 5: Save Backup Codes
1. System generates 10 backup codes
2. Download or print backup codes
3. Store codes securely
4. Each code can be used once

## Setting Up SMS 2FA

### Step 1: Phone Number Verification
1. Go to Security settings
2. Select "SMS" as 2FA method
3. Enter your phone number
4. Select country code

### Step 2: Verification
1. Click "Send Verification Code"
2. Check your text messages
3. Enter 6-digit code received
4. Click "Verify Phone Number"

### Step 3: Enable SMS 2FA
1. Confirm phone number is correct
2. Click "Enable SMS 2FA"
3. Test with a login attempt
4. Save backup codes

## Using 2FA

### Daily Login Process
1. Enter username and password
2. Click "Sign In"
3. 2FA prompt appears
4. Open authenticator app or check SMS
5. Enter 6-digit code
6. Access granted

### Backup Codes
Use when primary method unavailable:
1. Click "Use backup code instead"
2. Enter one of your saved backup codes
3. Code becomes invalid after use
4. Generate new codes when running low

### Remember Device
- Option to trust device for 30 days
- Reduces frequency of 2FA prompts
- Only use on personal devices
- Revoke access anytime in settings

## Managing 2FA

### Viewing Active Methods
Check your current 2FA setup:
- Active methods listed
- Last used timestamps
- Backup codes remaining
- Trusted devices

### Changing Methods
Switch between 2FA types:
1. Disable current method
2. Set up new method
3. Verify new method works
4. Generate new backup codes

### Backup Codes Management
- View remaining codes
- Generate new set (invalidates old ones)
- Download codes securely
- Print for physical storage

## Troubleshooting 2FA

### Common Issues

**Authenticator App Not Working:**
- Check time sync on device
- Manually sync time in app settings
- Re-scan QR code if needed
- Try different authenticator app

**SMS Not Received:**
- Check for cellular service
- Verify phone number is correct
- Check blocked messages
- Try email backup method

**Lost Device:**
- Use backup codes to login
- Set up 2FA on new device
- Revoke access from lost device
- Contact support if needed

### Recovery Process
If locked out of account:
1. Use backup codes if available
2. Try alternative 2FA method
3. Contact support with account verification
4. Provide identity verification documents

## Security Best Practices

### Authenticator App Tips
- **Backup Your App**: Enable cloud backup if available
- **Multiple Devices**: Install on phone and tablet
- **App Security**: Use app lock features
- **Regular Updates**: Keep authenticator app updated

### Backup Code Security
- **Secure Storage**: Password manager or safe
- **Multiple Copies**: Store in different locations
- **Access Control**: Don't share with others
- **Regular Review**: Check codes periodically

### Device Security
- **Screen Lock**: Always use device passcodes
- **Physical Security**: Don't leave devices unattended
- **Software Updates**: Keep OS and apps updated
- **Remote Wipe**: Enable for lost devices

## Advanced Security

### Account Monitoring
Regular security checks:
- Review login history monthly
- Check trusted devices quarterly
- Monitor account activity
- Set up security alerts

### Security Alerts
Configure notifications for:
- New device logins
- 2FA method changes
- Suspicious activity
- Failed login attempts

### Recovery Planning
Prepare for emergencies:
- Multiple backup methods
- Secure backup code storage
- Emergency contact information
- Account recovery documentation

## Team and Enterprise Features

### Team 2FA Requirements
Administrators can:
- Require 2FA for all team members
- Set grace periods for compliance
- Monitor 2FA adoption rates
- Provide recovery assistance

### Compliance Features
- Audit logs for 2FA events
- Compliance reporting
- Security policy enforcement
- Integration with enterprise systems

## Disabling 2FA

### When to Disable
Only disable 2FA if:
- Switching to different method
- Account transfer required
- Troubleshooting issues
- Temporary access needed

### Disable Process
1. Go to Security settings
2. Enter current password
3. Verify with current 2FA method
4. Click "Disable 2FA"
5. Confirm decision

**Warning**: Account becomes less secure without 2FA

Two-factor authentication is one of the most effective ways to protect your CodeHub account. Take the time to set it up properly and keep your backup codes safe. Your code snippets and personal information are worth the extra security step!
        `,
        tags: ['2fa', 'security', 'authentication']
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: 'HelpCircle',
    color: 'bg-yellow-500',
    totalArticles: 4,
    articles: [
      {
        id: 'ts-1',
        title: 'Code highlighting not working',
        slug: 'code-highlighting-not-working',
        views: 445,
        rating: 4.3,
        readTime: '5 min',
        difficulty: 'Beginner',
        lastUpdated: '2025-07-07',
        summary: 'Fix syntax highlighting issues in the code editor',
        content: `
# Code Highlighting Not Working

Syntax highlighting makes code easier to read and understand. If your code isn't highlighting properly, this guide will help you troubleshoot and fix the issue.

## Common Causes

### Language Not Selected
The most common cause is not selecting the correct programming language:
- Check the language dropdown above the editor
- Ensure it matches your code type
- Select the specific variant when available

### Browser Issues
Sometimes browser problems prevent highlighting:
- Cached JavaScript files
- Browser extensions interfering
- Outdated browser version
- JavaScript disabled

### Code Format Issues
Improperly formatted code may not highlight:
- Syntax errors in the code
- Mixed languages in one snippet
- Special characters or encoding
- Very large code blocks

## Quick Fixes

### 1. Select Correct Language
1. Click the language dropdown (usually shows "Plain Text")
2. Type to search for your language
3. Select the exact match (e.g., "JavaScript React" vs "JavaScript")
4. Wait 2-3 seconds for highlighting to apply

### 2. Refresh the Page
Simple page refresh often resolves issues:
- Press F5 or Ctrl+R (Cmd+R on Mac)
- Wait for page to fully load
- Check if highlighting appears
- Try selecting language again

### 3. Clear Browser Cache
Cached files might be outdated:
- Press Ctrl+Shift+Delete (Cmd+Shift+Delete on Mac)
- Select "Cached images and files"
- Choose "Last hour" or "Last 24 hours"
- Click "Clear data" and refresh page

## Detailed Troubleshooting

### Language Selection Issues

**Problem**: Can't find your language in dropdown
**Solutions**:
- Search using alternative names (e.g., "js" for JavaScript)
- Look for similar languages (e.g., "C++" instead of "cpp")
- Use parent language (e.g., "Text" for unknown formats)
- Contact support to add missing languages

**Problem**: Language selected but no highlighting
**Solutions**:
- Wait 5-10 seconds for processing
- Try a different language variant
- Check for syntax errors in your code
- Refresh page and try again

### Browser-Specific Issues

**Chrome/Edge**:
- Disable browser extensions temporarily
- Check Developer Tools console for errors
- Try incognito/private mode
- Update to latest browser version

**Firefox**:
- Clear recent history (Ctrl+Shift+Delete)
- Disable Enhanced Tracking Protection temporarily
- Check add-ons for conflicts
- Try safe mode

**Safari**:
- Clear website data for CodeHub
- Check privacy settings
- Disable content blockers temporarily
- Update Safari to latest version

### Code Format Problems

**Mixed Languages**:
If your snippet contains multiple languages:
- Choose the primary language for highlighting
- Consider splitting into separate snippets
- Use comments to identify different sections
- Document the mixed format in description

**Syntax Errors**:
Code with syntax errors may not highlight properly:
- Check for unclosed brackets or quotes
- Verify proper indentation
- Fix obvious syntax errors
- Use a local editor to validate syntax

## Advanced Solutions

### Editor Reset
If highlighting is completely broken:
1. Copy your code to clipboard
2. Clear the entire editor
3. Select language from dropdown
4. Paste code back
5. Check if highlighting returns

### Alternative Languages
If your specific language isn't working:
- Try a similar language (e.g., C for C++)
- Use a parent category (e.g., "Shell" for Bash)
- Select "Text" for basic formatting
- Add a note in description about actual language

### Code Block Size
Very large code blocks might not highlight:
- Split into smaller, focused snippets
- Remove unnecessary code sections
- Focus on the main logic
- Link to full code in external repository

## Prevention Tips

### Best Practices
- Always select language before pasting code
- Use consistent indentation (spaces or tabs)
- Validate syntax before publishing
- Keep snippets focused and concise

### Code Preparation
Before creating snippets:
- Test code in local environment
- Remove debugging statements
- Add helpful comments
- Format code consistently

### Language Variants
Choose the most specific language option:
- "JavaScript React" for JSX components
- "TypeScript" for TS files
- "Python 3" instead of just "Python"
- "HTML5" for modern HTML

## Supported Languages

### Popular Languages
CodeHub supports highlighting for:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- Go
- Rust
- PHP
- Ruby
- Swift

### Web Technologies
- HTML/HTML5
- CSS/SCSS/LESS
- React JSX
- Vue.js
- Angular templates

### Data Formats
- JSON
- YAML
- XML
- CSV
- SQL

### Configuration Files
- Docker
- NGINX
- Apache
- Environment files
- Package.json

## Getting Help

### Community Support
If issues persist:
1. Search existing discussions
2. Post in troubleshooting forum
3. Include browser and OS details
4. Share screenshot of issue

### Contact Support
For technical issues:
- Use the "Report Bug" feature
- Provide detailed steps to reproduce
- Include browser console errors
- Attach screenshots if helpful

### Provide Information
When seeking help, include:
- Browser name and version
- Operating system
- Language you're trying to use
- Steps you've already tried
- Screenshots of the issue

## Future Improvements

### Upcoming Features
CodeHub is continuously improving highlighting:
- Additional language support
- Better error detection
- Automatic language detection
- Custom theme options

### Feedback
Help us improve by:
- Reporting highlighting issues
- Suggesting new languages
- Testing beta features
- Providing feedback on updates

## Alternative Solutions

### External Tools
If highlighting continues to fail:
- Use external syntax highlighter
- Share code as images (not ideal)
- Link to external repositories
- Use plain text with good comments

### Documentation
Always document your code well:
- Clear variable names
- Helpful comments
- Function documentation
- Usage examples

Remember that syntax highlighting is a visual aid - your code is still valuable even without perfect highlighting. Focus on writing clear, well-documented code that helps other developers learn and solve problems.
        `,
        tags: ['highlighting', 'troubleshooting', 'editor']
      }
    ]
  }
];

// Popular articles (can be from any category)
export const popularArticles = [
  {
    id: 'gs-1',
    title: 'Creating your first snippet',
    category: 'Getting Started',
    views: 1250,
    rating: 4.8,
    readTime: '5 min',
    difficulty: 'Beginner',
    summary: 'Learn how to create and share your first code snippet on CodeHub',
    tags: ['getting-started', 'tutorial', 'basics']
  },
  {
    id: 'sec-1',
    title: 'Two-factor authentication setup',
    category: 'Security',
    views: 1089,
    rating: 4.7,
    readTime: '7 min',
    difficulty: 'Beginner',
    summary: 'Secure your account with two-factor authentication for enhanced protection',
    tags: ['2fa', 'security', 'authentication']
  },
  {
    id: 'cm-1',
    title: 'Organizing snippets with tags',
    category: 'Code Management',
    views: 976,
    rating: 4.6,
    readTime: '5 min',
    difficulty: 'Intermediate',
    summary: 'Learn effective tagging strategies to organize and discover your code snippets',
    tags: ['organization', 'tags', 'best-practices']
  },
  {
    id: 'as-1',
    title: 'Changing your password',
    category: 'Account & Settings',
    views: 834,
    rating: 4.5,
    readTime: '3 min',
    difficulty: 'Beginner',
    summary: 'Keep your account secure by regularly updating your password',
    tags: ['security', 'password', 'account']
  }
];

// Helper function to get all articles from all categories
export const getAllArticles = () => {
  const allArticles = [];
  
  for (const category of helpCategories) {
    for (const article of category.articles) {
      allArticles.push({
        ...article,
        category: category.title,
        categoryId: category.id
      });
    }
  }
  
  return allArticles;
};

// Helper function to get article by ID
export const getArticleById = (id) => {
  for (const category of helpCategories) {
    const article = category.articles.find(article => article.id === id);
    if (article) {
      return { ...article, category: category.title };
    }
  }
  return null;
};

// Helper function to get article by slug
export const getArticleBySlug = (slug) => {
  for (const category of helpCategories) {
    const article = category.articles.find(article => article.slug === slug);
    if (article) {
      return { ...article, category: category.title };
    }
  }
  return null;
};

// Helper function to search articles
export const searchArticles = (query) => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  const results = [];
  
  for (const category of helpCategories) {
    for (const article of category.articles) {
      if (
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        category.title.toLowerCase().includes(searchTerm)
      ) {
        results.push({ ...article, category: category.title });
      }
    }
  }
  
  return results;
};

// Helper function to get related articles
export const getRelatedArticles = (articleId, limit = 3) => {
  const currentArticle = getArticleById(articleId);
  if (!currentArticle) return [];
  
  const related = [];
  
  for (const category of helpCategories) {
    for (const article of category.articles) {
      if (article.id === articleId) continue;
      
      // Check for common tags
      const commonTags = article.tags.filter(tag => 
        currentArticle.tags.includes(tag)
      );
      
      if (commonTags.length > 0) {
        related.push({
          ...article,
          category: category.title,
          relevanceScore: commonTags.length
        });
      }
    }
  }
  
  return related
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
};
