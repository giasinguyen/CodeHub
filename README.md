<div align="center">
  <img src="CodeHub-Frontend/public/CodeHub-Logo-nobg.png" alt="CodeHub Logo" >
  <h1>CodeHub Application</h1>
  <p><strong>A comprehensive platform for developers to share, discover, and collaborate on code snippets</strong></p>
  <p><em>Developed by: Nguyen Tran Gia Si | Updated: July 18, 2025</em></p>
</div>

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react" alt="React"/></a>
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=spring" alt="Spring Boot"/></a>
  <a href="https://mariadb.org/"><img src="https://img.shields.io/badge/Database-MariaDB-003545?style=for-the-badge&logo=mariadb" alt="MariaDB"/></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker" alt="Docker"/></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite" alt="Vite"/></a>
  <a href="https://cloudinary.com/"><img src="https://img.shields.io/badge/Images-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary" alt="Cloudinary"/></a>
</p>

## 🚀 Overview

CodeHub is a comprehensive platform designed for developers to share, discover, and collaborate on code snippets. With support for 70+ programming languages, advanced search capabilities, real-time messaging, and a modern UI/UX, CodeHub provides an intuitive and feature-rich environment for all your code sharing needs.

## ✨ Features

### 🔍 **Discovery & Search**
- Advanced search functionality with filters by language, tags, and popularity
- Comprehensive language support (70+ languages across 6 categories)
- Trending snippets based on likes, views, and activity
- Language-specific browsing with categorization
- Smart recommendations and autocomplete search
- Tag-based filtering and navigation

### 👤 **User Management & Social**
- Secure JWT-based authentication and authorization
- Comprehensive user profiles with statistics and activity tracking
- Social features (following, followers, user discovery)
- Developer community with reputation system
- Advanced profile customization and privacy settings
- Activity feeds and user engagement metrics

### 📝 **Advanced Snippet Management**
- Create, edit, and delete code snippets with Monaco Editor
- Syntax highlighting for 70+ programming languages
- Multi-file snippet support with organized structure
- Version history tracking and diff comparison
- Privacy controls (public, unlisted, private)
- Snippet categories and tagging system
- Code snippet forking and collaboration features

### 💬 **Real-time Communication**
- WebSocket-based real-time messaging system
- Direct messaging between users
- Group conversations and community discussions
- Message history and conversation management
- Emoji support and rich text formatting
- File sharing capabilities in chat
- Profile navigation from chat interface

### 🎯 **Content Interaction**
- Like and bookmark functionality with statistics
- Advanced comment system with nested replies
- Favorite snippets organization and management
- Share snippets via direct links
- Content rating and feedback system
- Snippet recommendations based on user activity

### 🏗️ **Admin Dashboard**
- Comprehensive admin panel for content management
- User management and moderation tools
- System analytics and monitoring
- Content moderation and security controls
- Performance metrics and health monitoring
- Database management and statistics

### 🎨 **Modern UI/UX**
- Responsive design optimized for all devices
- Dark theme optimized for coding environment
- Smooth animations and transitions with Framer Motion
- Intuitive navigation with React Router
- Accessible design with ARIA compliance
- Custom component library with Tailwind CSS

## 🛠️ Tech Stack

### Frontend Technologies
- **React 19.1** - Latest React with concurrent features
- **Vite 6.3** - Ultra-fast build tool and development server
- **React Router 7.6** - Declarative routing for React applications
- **Tailwind CSS 4.1** - Utility-first CSS framework with JIT compiler
- **Framer Motion 12.16** - Production-ready motion library
- **Monaco Editor 0.52** - VS Code editor experience in browser
- **Zustand 5.0** - Lightweight state management solution
- **React Query 5.80** - Data fetching and caching library
- **React Hook Form 7.57** - Performant forms with easy validation
- **Lucide React 0.513** - Beautiful & consistent icon library
- **React Hot Toast 2.5** - Lightweight notification system

### Backend Technologies
- **Spring Boot 3.5** - Enterprise-grade Java framework
- **Java 23** - Latest Java LTS with performance improvements
- **Spring Security 6** - Comprehensive security framework
- **Spring Data JPA** - Database abstraction layer
- **JWT (JJWT 0.12.3)** - JSON Web Token implementation
- **WebSocket** - Real-time bidirectional communication
- **MariaDB** - Production-ready relational database
- **PostgreSQL** - Advanced open-source database (alternative)
- **H2 Database** - In-memory database for testing
- **Cloudinary** - Cloud-based image storage and management
- **Maven** - Project management and build automation

### Development & DevOps
- **ESLint 9.25** - JavaScript/TypeScript linting
- **Prettier** - Code formatting and style consistency
- **PostCSS** - CSS transformation and optimization
- **Swagger/OpenAPI** - API documentation and testing
- **Spring Boot Actuator** - Production monitoring and metrics
- **Micrometer Prometheus** - Application metrics collection
- **TestContainers** - Integration testing with real databases
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework for testing

### Cloud & Infrastructure
- **Docker** - Containerization for consistent deployment
- **Cloudinary** - CDN and image optimization
- **Environment Variables** - Configuration management
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - API protection and performance optimization

## 📁 Project Structure

```
CodeHub/
├── CodeHub-Frontend/              # React 19.1 frontend application
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── admin/            # Admin dashboard components
│   │   │   │   ├── blog/         # Blog management
│   │   │   │   ├── dashboard/    # Admin dashboard tabs
│   │   │   │   └── UserDetail.jsx # User management
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── chat/             # Real-time messaging system
│   │   │   │   ├── ChatButton.jsx
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   ├── ConversationView.jsx
│   │   │   │   └── EmojiPicker.jsx
│   │   │   ├── comments/         # Comment system
│   │   │   ├── developers/       # Developer community
│   │   │   ├── favorites/        # Favorites management
│   │   │   ├── footer/           # Footer components
│   │   │   ├── layout/           # Layout components
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── profile/          # User profile components
│   │   │   ├── setup/            # Setup and onboarding
│   │   │   ├── support/          # Support system
│   │   │   └── ui/               # Core UI components
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Loading.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── VSCodeEditor.jsx
│   │   ├── contexts/             # React contexts
│   │   │   ├── AuthContext.jsx   # Authentication state
│   │   │   ├── ChatContext.jsx   # Chat state management
│   │   │   └── SnippetContext.jsx # Snippet state
│   │   ├── pages/                # Main application pages
│   │   │   ├── auth/             # Authentication pages
│   │   │   ├── blog/             # Blog pages
│   │   │   ├── company/          # Company pages
│   │   │   ├── legal/            # Legal pages
│   │   │   ├── support/          # Support pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateSnippet.jsx
│   │   │   ├── Developers.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── MySnippets.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── SnippetDetail.jsx
│   │   │   ├── Snippets.jsx
│   │   │   ├── TagPage.jsx
│   │   │   └── Trending.jsx
│   │   ├── services/             # API services
│   │   │   ├── adminAPI.js       # Admin API calls
│   │   │   ├── api.js            # Main API service
│   │   │   └── webSocketService.js # WebSocket management
│   │   ├── constants/            # Application constants
│   │   │   └── index.js          # API endpoints, language configs
│   │   ├── utils/                # Utility functions
│   │   │   ├── dateUtils.js      # Date formatting
│   │   │   ├── debounce.js       # Performance optimization
│   │   │   ├── messageSanitizer.js # Message validation
│   │   │   ├── rateLimiter.js    # Rate limiting
│   │   │   └── mockData.js       # Mock data for development
│   │   ├── styles/               # Custom styles
│   │   │   ├── appearance.css    # Theme customization
│   │   │   ├── developers.css    # Developer pages
│   │   │   ├── home-light.css    # Light theme
│   │   │   └── profile.css       # Profile styling
│   │   └── hooks/                # Custom React hooks
│   │       └── useChat.js        # Chat functionality
│   ├── public/                   # Static assets
│   │   ├── CodeHub-Logo.png      # Application logo
│   │   └── CodeHub-Logo-nobg.png # Logo without background
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   └── eslint.config.js          # ESLint configuration
├── CodeHub-Backend/               # Spring Boot 3.5 backend
│   ├── src/main/java/code/hub/   # Java source code
│   │   ├── controller/           # REST API controllers
│   │   ├── service/              # Business logic layer
│   │   ├── repository/           # Data access layer
│   │   ├── entity/               # JPA entities
│   │   ├── dto/                  # Data transfer objects
│   │   ├── security/             # Security configuration
│   │   ├── config/               # Application configuration
│   │   └── exception/            # Exception handling
│   ├── src/main/resources/       # Configuration files
│   │   ├── application.properties # Main configuration
│   │   ├── data/                 # Initial data
│   │   └── db/                   # Database migration scripts
│   ├── src/test/                 # Test files
│   │   ├── java/                 # Unit and integration tests
│   │   └── resources/            # Test configuration
│   ├── pom.xml                   # Maven dependencies
│   ├── mvnw                      # Maven wrapper (Unix)
│   └── mvnw.cmd                  # Maven wrapper (Windows)
├── README.md                     # Project documentation
└── docs/                         # Additional documentation
    ├── API.md                    # API documentation
    ├── DEPLOYMENT.md             # Deployment guide
    └── CONTRIBUTING.md           # Contribution guidelines
```

## 🚀 Quick Start

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v20 or higher) - JavaScript runtime
- **Java** (v23 or higher) - Backend runtime
- **Maven** (v3.9 or higher) - Build automation
- **MariaDB** (v10.6 or higher) - Primary database
- **Git** - Version control system

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/giasinguyen/codehub.git
   cd CodeHub
   ```

2. **Configure the database**
   ```bash
   # Create MariaDB database
   mysql -u root -p
   CREATE DATABASE codehub;
   CREATE USER 'codehub_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON codehub.* TO 'codehub_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Configure environment variables**
   ```bash
   cd CodeHub-Backend/src/main/resources
   # Create application-local.properties
   cp application.properties application-local.properties
   ```

   **Update application-local.properties:**
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:mariadb://localhost:3306/codehub
   spring.datasource.username=codehub_user
   spring.datasource.password=your_password
   
   # JWT Configuration
   jwt.secret=your-super-secret-jwt-key-here
   jwt.expiration=86400000
   
   # Cloudinary Configuration (optional)
   cloudinary.cloud-name=your-cloud-name
   cloudinary.api-key=your-api-key
   cloudinary.api-secret=your-api-secret
   ```

4. **Run the backend**
   ```bash
   cd CodeHub-Backend
   # Windows
   ./mvnw.cmd spring-boot:run
   
   # Unix/Linux/macOS
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd CodeHub-Frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   ```

   **Update .env:**
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=CodeHub
   VITE_DEBUG=true
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

### Testing the Application

1. **API Testing**
   - Import the Postman collection: `CodeHub-Backend/CodeHub_API_Collection.postman_collection.json`
   - Test endpoints using the collection
   - SwaggerUI available at: `http://localhost:8080/swagger-ui/index.html`

2. **Frontend Testing**
   - Navigate to `http://localhost:5173`
   - Register a new account or use demo credentials
   - Explore features: snippet creation, browsing, messaging, etc.

3. **Demo Features**
   - Create code snippets with 70+ language support
   - Browse trending snippets and discover developers
   - Use real-time messaging system
   - Explore admin dashboard (admin role required)
   - Test responsive design on different devices

## 📚 API Documentation

The backend provides comprehensive RESTful APIs for all functionalities:

### Authentication & Security
- `POST /api/auth/login` - User login with JWT token
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/{id}/snippets` - Get user's snippets
- `POST /api/users/{id}/follow` - Follow/unfollow user
- `GET /api/users/{id}/followers` - Get user followers
- `GET /api/users/{id}/following` - Get users being followed

### Snippet Management
- `GET /api/snippets` - Get all snippets (paginated)
- `GET /api/snippets/{id}` - Get snippet by ID
- `POST /api/snippets` - Create new snippet
- `PUT /api/snippets/{id}` - Update snippet
- `DELETE /api/snippets/{id}` - Delete snippet
- `GET /api/snippets/search` - Search snippets
- `GET /api/snippets/trending/{type}` - Get trending snippets
- `GET /api/snippets/languages` - Get available languages
- `GET /api/snippets/tags` - Get available tags

### Interaction & Social Features
- `POST /api/snippets/{id}/like` - Like/unlike snippet
- `GET /api/snippets/{id}/like/status` - Check like status
- `GET /api/snippets/{id}/comments` - Get snippet comments
- `POST /api/snippets/{id}/comments` - Add comment
- `PUT /api/snippets/{id}/comments/{commentId}` - Update comment
- `DELETE /api/snippets/{id}/comments/{commentId}` - Delete comment

### Favorites Management
- `GET /api/favorites` - Get user favorites
- `POST /api/snippets/{id}/favorite` - Add to favorites
- `DELETE /api/snippets/{id}/favorite` - Remove from favorites
- `GET /api/snippets/{id}/favorite/status` - Check favorite status
- `GET /api/favorites/stats` - Get favorites statistics

### Categories & Discovery
- `GET /api/categories/languages` - Get programming languages
- `GET /api/categories/tags` - Get available tags
- `GET /api/categories/popular` - Get popular categories
- `GET /api/categories/languages/{lang}/snippets` - Get snippets by language
- `GET /api/categories/tags/{tag}/snippets` - Get snippets by tag

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/stats` - Get notification statistics
- `POST /api/notifications/{id}/read` - Mark notification as read
- `POST /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/{id}` - Delete notification

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/snippets` - Get all snippets (admin only)
- `POST /api/admin/users/{id}/ban` - Ban user (admin only)
- `POST /api/admin/snippets/{id}/moderate` - Moderate snippet (admin only)

### Real-time Features
- **WebSocket Endpoint:** `/ws` - Real-time messaging
- **Chat Messages:** Send and receive messages
- **Typing Indicators:** Real-time typing status
- **Online Status:** User presence management

## 🔧 Configuration

### Environment Variables

#### Backend (application.properties)
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mariadb://localhost:3306/codehub
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

# JWT Configuration
jwt.secret=your-super-secret-jwt-key-here
jwt.expiration=86400000

# Cloudinary Configuration
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# Logging Configuration
logging.level.code.hub=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws

# Application Configuration
VITE_APP_NAME=CodeHub
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=A platform for code snippet sharing

# Development Configuration
VITE_DEBUG=true
VITE_ENABLE_MOCK_DATA=false

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_ADMIN=true
VITE_ENABLE_NOTIFICATIONS=true

# External Services
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_ANALYTICS_ID=your-analytics-id
```

### Docker Configuration

#### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  mariadb:
    image: mariadb:10.6
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: codehub
      MYSQL_USER: codehub_user
      MYSQL_PASSWORD: codehub_password
    ports:
      - "3306:3306"
    volumes:
      - mariadb_data:/var/lib/mysql

  backend:
    build: ./CodeHub-Backend
    ports:
      - "8080:8080"
    depends_on:
      - mariadb
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/codehub
      - SPRING_DATASOURCE_USERNAME=codehub_user
      - SPRING_DATASOURCE_PASSWORD=codehub_password

  frontend:
    build: ./CodeHub-Frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api

volumes:
  mariadb_data:
```

### Build Configuration

#### Vite Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          editor: ['@monaco-editor/react', 'monaco-editor']
        }
      }
    }
  }
})
```

## 🧪 Testing

### Backend Testing
```bash
cd CodeHub-Backend

# Run all tests
./mvnw test

# Run tests with coverage
./mvnw test jacoco:report

# Run integration tests
./mvnw test -Dtest="*IT"

# Run specific test class
./mvnw test -Dtest="UserServiceTest"

# Run with specific profile
./mvnw test -Dspring.profiles.active=test
```

### Frontend Testing
```bash
cd CodeHub-Frontend

# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Test Coverage
- **Backend:** JUnit 5, Mockito, TestContainers
- **Frontend:** Jest, React Testing Library, Cypress
- **Integration:** End-to-end API testing
- **Performance:** Load testing with JMeter

## 📦 Building for Production

### Backend Production Build
```bash
cd CodeHub-Backend

# Clean and build
./mvnw clean package -DskipTests

# Build with tests
./mvnw clean package

# Create Docker image
docker build -t codehub-backend:latest .

# Run production jar
java -jar target/CodeHub-Backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build
```bash
cd CodeHub-Frontend

# Build for production
npm run build

# Preview production build
npm run preview

# Build and analyze bundle
npm run build:analyze

# Create Docker image
docker build -t codehub-frontend:latest .

# Serve with nginx
nginx -c /etc/nginx/nginx.conf
```

### Production Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Using Kubernetes
kubectl apply -f k8s/

# Using traditional deployment
# Deploy JAR file to application server
# Deploy static files to web server (nginx, Apache)
```

### Performance Optimization
- **Frontend:** Code splitting, lazy loading, image optimization
- **Backend:** Database indexing, caching, connection pooling
- **CDN:** Static asset delivery via Cloudinary
- **Monitoring:** Application metrics with Actuator and Prometheus

## 🚀 Key Features Implemented

### 📝 **Advanced Code Editor**
- **Monaco Editor Integration:** Full VS Code experience in browser
- **70+ Language Support:** Comprehensive syntax highlighting and autocomplete
- **Language Categorization:** Organized by Programming Languages, Frontend/UI, Backend/API, Mobile, Database, and DevOps
- **Smart Language Detection:** Automatic language detection from code content
- **Customizable Themes:** Multiple editor themes including dark mode optimized for coding

### 🔍 **Intelligent Search & Discovery**
- **Advanced Filter System:** Filter by language, tags, popularity, and date
- **Categorized Language Selection:** Grouped language options for better UX
- **Smart Autocomplete:** Intelligent search suggestions and autocompletion
- **Trending Algorithm:** Dynamic trending based on likes, views, and user engagement
- **Tag-based Navigation:** Comprehensive tag system for content organization

### 💬 **Real-time Messaging System**
- **WebSocket Implementation:** Live bidirectional communication
- **Conversation Management:** Direct messaging and group conversations
- **Message History:** Persistent chat history with pagination
- **Emoji Support:** Rich emoji picker with categories
- **File Sharing:** Attachment support in chat messages
- **Profile Navigation:** Click-to-navigate user profiles from chat interface
- **Typing Indicators:** Real-time typing status and user presence

### 🎯 **User Experience Excellence**
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices
- **Dark Theme:** Carefully crafted dark theme for comfortable coding
- **Smooth Animations:** Framer Motion powered transitions and interactions
- **Accessibility:** ARIA compliance and keyboard navigation support
- **Performance:** Lazy loading, code splitting, and optimized bundle sizes

### � **Security & Authentication**
- **JWT Token System:** Secure token-based authentication
- **Role-based Access:** User and admin role management
- **Password Security:** Bcrypt hashing and validation
- **CORS Configuration:** Proper cross-origin request handling
- **Input Validation:** Comprehensive data validation and sanitization

### � **Analytics & Monitoring**
- **User Activity Tracking:** Comprehensive user behavior analytics
- **System Metrics:** Performance monitoring with Spring Boot Actuator
- **Error Tracking:** Comprehensive error logging and handling
- **Usage Statistics:** Detailed statistics for snippets, users, and system health


## 📞 Support

If you have any questions or need support:

- 📧 Email: giasinguyentran@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/giasinguyen/codehub/issues)
---