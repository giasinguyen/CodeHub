package code.hub.codehubbackend.config;

import code.hub.codehubbackend.entity.*;
import code.hub.codehubbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataLoader implements CommandLineRunner {    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private SnippetVersionRepository versionRepository;    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private Environment environment;

    private final Random random = new Random();    @Override
    public void run(String... args) throws Exception {
        // Don't load sample data during tests
        if (Arrays.asList(environment.getActiveProfiles()).contains("test")) {
            return;
        }
        
        if (userRepository.count() == 0) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        System.out.println("Loading sample data...");

        // Create users
        List<User> users = createUsers();
        userRepository.saveAll(users);

        // Create snippets
        List<Snippet> snippets = createSnippets(users);
        snippetRepository.saveAll(snippets);

        // Create versions for snippets
        createVersions(snippets);

        // Create likes
        createLikes(users, snippets);        // Create comments
        createComments(users, snippets);
        
        // Create sample notifications
        createSampleNotifications(users, snippets);

        System.out.println("Sample data loaded successfully!");
    }

    private List<User> createUsers() {
        return Arrays.asList(
            // Admin user for testing
            User.builder()
                .username("admin")
                .email("admin@example.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=admin")
                .role(User.Role.ADMIN)
                .build(),

            User.builder()
                .username("john_doe")
                .email("john@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=john")
                .build(),

            User.builder()
                .username("jane_smith")
                .email("jane@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=jane")
                .build(),

            User.builder()
                .username("alex_wilson")
                .email("alex@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=alex")
                .build(),

            User.builder()
                .username("sarah_dev")
                .email("sarah@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=sarah")
                .build(),

            User.builder()
                .username("mike_coder")
                .email("mike@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=mike")
                .build()
        );
    }

    private List<Snippet> createSnippets(List<User> users) {
        return Arrays.asList(
            // JavaScript snippets
            Snippet.builder()
                .title("React Custom Hook for API Calls")
                .code("import { useState, useEffect } from 'react';\n\nexport const useApi = (url) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        const response = await fetch(url);\n        if (!response.ok) throw new Error('Network response was not ok');\n        const result = await response.json();\n        setData(result);\n      } catch (err) {\n        setError(err.message);\n      } finally {\n        setLoading(false);\n      }\n    };\n\n    fetchData();\n  }, [url]);\n\n  return { data, loading, error };\n};")
                .language("JavaScript")
                .description("A reusable React custom hook for making API calls with loading and error states")
                .tags(Arrays.asList("react", "hooks", "api", "javascript", "frontend"))
                .owner(users.get(0))                .viewCount((long) (random.nextInt(1000) + 100))
                .likeCount((long) (random.nextInt(50) + 10))
                .build(),

            Snippet.builder()
                .title("Debounce Function Implementation")
                .code("function debounce(func, wait, immediate) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      timeout = null;\n      if (!immediate) func(...args);\n    };\n    const callNow = immediate && !timeout;\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n    if (callNow) func(...args);\n  };\n}\n\n// Usage example:\nconst debouncedSearch = debounce((query) => {\n  console.log('Searching for:', query);\n}, 300);\n\n// Call it multiple times - only the last call will execute\ndebouncedSearch('hello');\ndebouncedSearch('world'); // Only this will execute after 300ms")
                .language("JavaScript")
                .description("Implementation of a debounce function to limit the rate of function execution")
                .tags(Arrays.asList("javascript", "performance", "utility", "function"))                .owner(users.get(1))
                .viewCount((long) (random.nextInt(800) + 50))
                .likeCount((long) (random.nextInt(40) + 5))
                .build(),

            // Python snippets
            Snippet.builder()
                .title("FastAPI JWT Authentication")
                .code("from fastapi import FastAPI, HTTPException, Depends, status\nfrom fastapi.security import HTTPBearer, HTTPAuthorizationCredentials\nfrom jose import JWTError, jwt\nfrom passlib.context import CryptContext\nfrom datetime import datetime, timedelta\n\nSECRET_KEY = \"your-secret-key\"\nALGORITHM = \"HS256\"\nACCESS_TOKEN_EXPIRE_MINUTES = 30\n\npwd_context = CryptContext(schemes=[\"bcrypt\"], deprecated=\"auto\")\nsecurity = HTTPBearer()\n\ndef create_access_token(data: dict):\n    to_encode = data.copy()\n    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)\n    to_encode.update({\"exp\": expire})\n    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n    return encoded_jwt\n\ndef verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):\n    try:\n        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])\n        username = payload.get(\"sub\")\n        if username is None:\n            raise HTTPException(status_code=401, detail=\"Invalid token\")\n        return username\n    except JWTError:\n        raise HTTPException(status_code=401, detail=\"Invalid token\")")
                .language("Python")
                .description("Complete JWT authentication implementation for FastAPI applications")
                .tags(Arrays.asList("python", "fastapi", "jwt", "authentication", "security"))                .owner(users.get(2))
                .viewCount((long) (random.nextInt(1200) + 200))
                .likeCount((long) (random.nextInt(60) + 15))
                .build(),

            Snippet.builder()
                .title("Data Class with Validation")
                .code("from dataclasses import dataclass, field\nfrom typing import List, Optional\nfrom datetime import datetime\nimport re\n\n@dataclass\nclass User:\n    username: str\n    email: str\n    age: int\n    interests: List[str] = field(default_factory=list)\n    created_at: datetime = field(default_factory=datetime.now)\n    is_active: bool = True\n    \n    def __post_init__(self):\n        self.validate_email()\n        self.validate_age()\n        self.validate_username()\n    \n    def validate_email(self):\n        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'\n        if not re.match(pattern, self.email):\n            raise ValueError(f\"Invalid email format: {self.email}\")\n    \n    def validate_age(self):\n        if not 13 <= self.age <= 120:\n            raise ValueError(f\"Age must be between 13 and 120, got {self.age}\")\n    \n    def validate_username(self):\n        if len(self.username) < 3 or len(self.username) > 20:\n            raise ValueError(\"Username must be between 3 and 20 characters\")\n        if not re.match(r'^[a-zA-Z0-9_]+$', self.username):\n            raise ValueError(\"Username can only contain letters, numbers, and underscores\")\n\n# Usage\nuser = User(\n    username=\"john_doe\",\n    email=\"john@example.com\",\n    age=25,\n    interests=[\"coding\", \"music\", \"travel\"]\n)")
                .language("Python")
                .description("Python dataclass with built-in validation for common use cases")
                .tags(Arrays.asList("python", "dataclass", "validation", "oop"))                .owner(users.get(3))
                .viewCount((long) (random.nextInt(600) + 80))
                .likeCount((long) (random.nextInt(35) + 8))
                .build(),

            // Java snippets
            Snippet.builder()
                .title("Spring Boot Custom Exception Handler")
                .code("@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(ResourceNotFoundException.class)\n    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {\n        ErrorResponse error = ErrorResponse.builder()\n            .timestamp(LocalDateTime.now())\n            .status(HttpStatus.NOT_FOUND.value())\n            .error(\"Resource Not Found\")\n            .message(ex.getMessage())\n            .path(getCurrentPath())\n            .build();\n        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);\n    }\n\n    @ExceptionHandler(ValidationException.class)\n    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {\n        ErrorResponse error = ErrorResponse.builder()\n            .timestamp(LocalDateTime.now())\n            .status(HttpStatus.BAD_REQUEST.value())\n            .error(\"Validation Failed\")\n            .message(ex.getMessage())\n            .path(getCurrentPath())\n            .build();\n        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);\n    }\n\n    @ExceptionHandler(Exception.class)\n    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {\n        ErrorResponse error = ErrorResponse.builder()\n            .timestamp(LocalDateTime.now())\n            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())\n            .error(\"Internal Server Error\")\n            .message(\"An unexpected error occurred\")\n            .path(getCurrentPath())\n            .build();\n        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);\n    }\n\n    private String getCurrentPath() {\n        return RequestContextHolder.currentRequestAttributes()\n            .getAttribute(RequestAttributes.REFERENCE_REQUEST, RequestAttributes.SCOPE_REQUEST)\n            .getRequestURI();\n    }\n}")
                .language("Java")
                .description("Comprehensive exception handler for Spring Boot applications")
                .tags(Arrays.asList("java", "spring-boot", "exception-handling", "rest-api"))                .owner(users.get(4))
                .viewCount((long) (random.nextInt(900) + 150))
                .likeCount((long) (random.nextInt(45) + 12))
                .build(),

            Snippet.builder()
                .title("Builder Pattern Implementation")
                .code("public class Product {\n    private final String name;\n    private final String description;\n    private final double price;\n    private final String category;\n    private final boolean inStock;\n    private final List<String> tags;\n\n    private Product(Builder builder) {\n        this.name = builder.name;\n        this.description = builder.description;\n        this.price = builder.price;\n        this.category = builder.category;\n        this.inStock = builder.inStock;\n        this.tags = Collections.unmodifiableList(builder.tags);\n    }\n\n    public static class Builder {\n        private String name;\n        private String description;\n        private double price;\n        private String category;\n        private boolean inStock = true;\n        private List<String> tags = new ArrayList<>();\n\n        public Builder name(String name) {\n            this.name = name;\n            return this;\n        }\n\n        public Builder description(String description) {\n            this.description = description;\n            return this;\n        }\n\n        public Builder price(double price) {\n            this.price = price;\n            return this;\n        }\n\n        public Builder category(String category) {\n            this.category = category;\n            return this;\n        }\n\n        public Builder inStock(boolean inStock) {\n            this.inStock = inStock;\n            return this;\n        }\n\n        public Builder addTag(String tag) {\n            this.tags.add(tag);\n            return this;\n        }\n\n        public Product build() {\n            if (name == null || name.trim().isEmpty()) {\n                throw new IllegalStateException(\"Product name is required\");\n            }\n            if (price < 0) {\n                throw new IllegalStateException(\"Price cannot be negative\");\n            }\n            return new Product(this);\n        }\n    }\n\n    // Getters\n    public String getName() { return name; }\n    public String getDescription() { return description; }\n    public double getPrice() { return price; }\n    public String getCategory() { return category; }\n    public boolean isInStock() { return inStock; }\n    public List<String> getTags() { return tags; }\n}\n\n// Usage:\nProduct product = new Product.Builder()\n    .name(\"Laptop\")\n    .description(\"High-performance laptop\")\n    .price(999.99)\n    .category(\"Electronics\")\n    .addTag(\"computer\")\n    .addTag(\"portable\")\n    .build();")
                .language("Java")
                .description("Clean implementation of the Builder design pattern in Java")
                .tags(Arrays.asList("java", "design-pattern", "builder", "oop"))                .owner(users.get(0))
                .viewCount((long) (random.nextInt(700) + 100))
                .likeCount((long) (random.nextInt(38) + 7))
                .build(),

            // TypeScript snippets
            Snippet.builder()
                .title("Generic Repository Pattern")
                .code("interface Repository<T, ID> {\n  findById(id: ID): Promise<T | null>;\n  findAll(): Promise<T[]>;\n  save(entity: T): Promise<T>;\n  update(id: ID, entity: Partial<T>): Promise<T | null>;\n  delete(id: ID): Promise<boolean>;\n}\n\nclass BaseRepository<T extends { id: ID }, ID = string> implements Repository<T, ID> {\n  protected items: Map<ID, T> = new Map();\n\n  async findById(id: ID): Promise<T | null> {\n    return this.items.get(id) || null;\n  }\n\n  async findAll(): Promise<T[]> {\n    return Array.from(this.items.values());\n  }\n\n  async save(entity: T): Promise<T> {\n    this.items.set(entity.id, entity);\n    return entity;\n  }\n\n  async update(id: ID, updates: Partial<T>): Promise<T | null> {\n    const existing = this.items.get(id);\n    if (!existing) return null;\n    \n    const updated = { ...existing, ...updates };\n    this.items.set(id, updated);\n    return updated;\n  }\n\n  async delete(id: ID): Promise<boolean> {\n    return this.items.delete(id);\n  }\n}\n\n// Usage\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nclass UserRepository extends BaseRepository<User> {\n  async findByEmail(email: string): Promise<User | null> {\n    const users = await this.findAll();\n    return users.find(user => user.email === email) || null;\n  }\n}\n\nconst userRepo = new UserRepository();\nconst user = await userRepo.save({ id: '1', name: 'John', email: 'john@example.com' });")
                .language("TypeScript")
                .description("Generic repository pattern implementation with TypeScript")
                .tags(Arrays.asList("typescript", "repository-pattern", "generics", "async"))                .owner(users.get(1))
                .viewCount((long) (random.nextInt(500) + 75))
                .likeCount((long) (random.nextInt(30) + 6))
                .build(),

            // CSS snippets
            Snippet.builder()
                .title("Modern CSS Grid Layout")
                .code(".container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  grid-gap: 2rem;\n  padding: 2rem;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.card {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  overflow: hidden;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);\n}\n\n.card-header {\n  height: 200px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.card-content {\n  padding: 1.5rem;\n}\n\n.card-title {\n  font-size: 1.25rem;\n  font-weight: 600;\n  margin-bottom: 0.5rem;\n  color: #333;\n}\n\n.card-description {\n  color: #666;\n  line-height: 1.6;\n}\n\n/* Responsive design */\n@media (max-width: 768px) {\n  .container {\n    grid-template-columns: 1fr;\n    padding: 1rem;\n  }\n  \n  .card-header {\n    height: 150px;\n    font-size: 1.25rem;\n  }\n}")
                .language("CSS")
                .description("Responsive card layout using CSS Grid with modern styling")
                .tags(Arrays.asList("css", "grid", "responsive", "cards", "layout"))                .owner(users.get(2))
                .viewCount((long) (random.nextInt(400) + 60))
                .likeCount((long) (random.nextInt(25) + 4))
                .build(),

            // SQL snippets
            Snippet.builder()
                .title("Advanced SQL Window Functions")
                .code("-- Calculate running totals and rankings\nSELECT \n    customer_id,\n    order_date,\n    order_amount,\n    -- Running total of orders for each customer\n    SUM(order_amount) OVER (\n        PARTITION BY customer_id \n        ORDER BY order_date \n        ROWS UNBOUNDED PRECEDING\n    ) AS running_total,\n    -- Rank orders by amount within each customer\n    RANK() OVER (\n        PARTITION BY customer_id \n        ORDER BY order_amount DESC\n    ) AS amount_rank,\n    -- Calculate percentage of customer's total spending\n    ROUND(\n        order_amount * 100.0 / SUM(order_amount) OVER (PARTITION BY customer_id),\n        2\n    ) AS pct_of_customer_total,\n    -- Get previous order amount\n    LAG(order_amount, 1) OVER (\n        PARTITION BY customer_id \n        ORDER BY order_date\n    ) AS previous_order_amount,\n    -- Calculate difference from previous order\n    order_amount - LAG(order_amount, 1) OVER (\n        PARTITION BY customer_id \n        ORDER BY order_date\n    ) AS amount_change\nFROM orders\nWHERE order_date >= '2024-01-01'\nORDER BY customer_id, order_date;")
                .language("SQL")
                .description("Advanced SQL query using window functions for analytics")
                .tags(Arrays.asList("sql", "window-functions", "analytics", "database"))                .owner(users.get(3))
                .viewCount((long) (random.nextInt(800) + 120))
                .likeCount((long) (random.nextInt(42) + 9))
                .build(),

            // Docker snippet
            Snippet.builder()
                .title("Multi-stage Docker Build")
                .code("# Multi-stage build for React app\nFROM node:18-alpine AS builder\n\nWORKDIR /app\n\n# Copy package files\nCOPY package*.json ./\n\n# Install dependencies\nRUN npm ci --only=production\n\n# Copy source code\nCOPY . .\n\n# Build the app\nRUN npm run build\n\n# Production stage\nFROM nginx:alpine AS production\n\n# Copy built app from builder stage\nCOPY --from=builder /app/dist /usr/share/nginx/html\n\n# Copy custom nginx config\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n\n# Create non-root user\nRUN addgroup -g 1001 -S nodejs && \\\n    adduser -S nextjs -u 1001\n\n# Change ownership of nginx directories\nRUN chown -R nextjs:nodejs /var/cache/nginx && \\\n    chown -R nextjs:nodejs /var/log/nginx && \\\n    chown -R nextjs:nodejs /etc/nginx/conf.d\n\n# Touch pid file and change ownership\nRUN touch /var/run/nginx.pid && \\\n    chown -R nextjs:nodejs /var/run/nginx.pid\n\n# Switch to non-root user\nUSER nextjs\n\nEXPOSE 8080\n\nCMD [\"nginx\", \"-g\", \"daemon off;\"]")
                .language("Docker")
                .description("Multi-stage Docker build for optimized React app deployment")
                .tags(Arrays.asList("docker", "react", "nginx", "deployment", "optimization"))                .owner(users.get(4))
                .viewCount((long) (random.nextInt(600) + 90))
                .likeCount((long) (random.nextInt(35) + 8))
                .build()
        );
    }

    private void createVersions(List<Snippet> snippets) {
        for (Snippet snippet : snippets) {
            // Create initial version
            SnippetVersion version1 = SnippetVersion.builder()
                .snippet(snippet)
                .code(snippet.getCode())
                .description(snippet.getDescription())
                .versionNumber(1)
                .changeMessage("Initial version")
                .build();
            versionRepository.save(version1);

            // Create a second version for some snippets
            if (random.nextBoolean()) {
                String updatedCode = snippet.getCode() + "\n\n// Updated with improvements";
                SnippetVersion version2 = SnippetVersion.builder()
                    .snippet(snippet)
                    .code(updatedCode)
                    .description(snippet.getDescription() + " - Updated")
                    .versionNumber(2)
                    .changeMessage("Added improvements and optimizations")
                    .build();
                versionRepository.save(version2);
            }
        }
    }

    private void createLikes(List<User> users, List<Snippet> snippets) {
        for (Snippet snippet : snippets) {
            // Random users like each snippet
            int numLikes = random.nextInt(users.size());
            List<User> shuffledUsers = Arrays.asList(users.toArray(new User[0]));
            java.util.Collections.shuffle(shuffledUsers);

            for (int i = 0; i < numLikes; i++) {
                User user = shuffledUsers.get(i);                if (!user.equals(snippet.getOwner())) { // Users can't like their own snippets
                    Like like = Like.builder()
                        .id(new Like.LikeKey(user.getId(), snippet.getId()))
                        .user(user)
                        .snippet(snippet)
                        .build();
                    likeRepository.save(like);
                }
            }
        }        // Update like counts
        for (Snippet snippet : snippets) {
            long likeCount = likeRepository.countBySnippetId(snippet.getId());
            snippet.setLikeCount(likeCount);
            snippetRepository.save(snippet);
        }
    }

    private void createComments(List<User> users, List<Snippet> snippets) {
        String[] commentTexts = {
            "Great snippet! Very helpful and well-written.",
            "This is exactly what I was looking for. Thanks for sharing!",
            "Love the clean code style. Easy to understand and implement.",
            "Could you add some error handling to make it more robust?",
            "Excellent work! I've been struggling with this problem.",
            "This approach is much better than what I was using before.",
            "Thanks for the detailed explanation. Very educational!",
            "Simple yet effective solution. Much appreciated!",
            "How would you modify this for production use?",
            "Perfect timing! I needed this for my current project.",
            "Great use case example. The code is very readable.",
            "This saved me hours of debugging. Thank you!",
            "Would love to see a TypeScript version of this.",
            "Brilliant implementation! Clean and efficient.",
            "This is going straight into my code library."
        };

        for (Snippet snippet : snippets) {
            int numComments = random.nextInt(8) + 1; // 1 to 8 comments per snippet
            
            for (int i = 0; i < numComments; i++) {
                User commenter = users.get(random.nextInt(users.size()));
                String commentText = commentTexts[random.nextInt(commentTexts.length)];
                  Comment comment = Comment.builder()
                    .content(commentText)
                    .snippet(snippet)
                    .author(commenter)
                    .build();                commentRepository.save(comment);
            }
        }
    }
    
    private void createSampleNotifications(List<User> users, List<Snippet> snippets) {
        System.out.println("Creating sample notifications...");
        
        // Create notifications for the first user (john_doe)
        User recipient = users.get(0); // john_doe
        
        // Notification 1: Like notification
        Notification likeNotification = Notification.builder()
                .recipient(recipient)
                .actor(users.get(1)) // jane_smith
                .type(Notification.NotificationType.SNIPPET_LIKED)
                .title("New like on your snippet")
                .message("jane_smith liked your \"" + snippets.get(0).getTitle() + "\" snippet")
                .targetId(snippets.get(0).getId())
                .targetType("snippet")
                .actionUrl("/snippets/" + snippets.get(0).getId())
                .read(false)
                .createdAt(Instant.now().minus(5, ChronoUnit.MINUTES))
                .build();
        
        // Notification 2: Comment notification
        Notification commentNotification = Notification.builder()
                .recipient(recipient)
                .actor(users.get(2)) // alex_wilson
                .type(Notification.NotificationType.SNIPPET_COMMENTED)
                .title("New comment on your snippet")
                .message("alex_wilson commented on your \"" + snippets.get(1).getTitle() + "\" snippet")
                .targetId(snippets.get(1).getId())
                .targetType("snippet")
                .actionUrl("/snippets/" + snippets.get(1).getId())
                .read(false)
                .createdAt(Instant.now().minus(15, ChronoUnit.MINUTES))
                .build();
        
        // Notification 3: Follow notification
        Notification followNotification = Notification.builder()
                .recipient(recipient)
                .actor(users.get(3)) // sarah_dev
                .type(Notification.NotificationType.USER_FOLLOWED)
                .title("New follower")
                .message("sarah_dev started following you")
                .targetId(users.get(3).getId())
                .targetType("user")
                .actionUrl("/users/" + users.get(3).getUsername())
                .read(true)
                .createdAt(Instant.now().minus(2, ChronoUnit.HOURS))
                .readAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .build();
        
        // Notification 4: Star notification
        Notification starNotification = Notification.builder()
                .recipient(recipient)
                .actor(users.get(4)) // mike_coder
                .type(Notification.NotificationType.SNIPPET_STARRED)
                .title("Snippet starred")
                .message("mike_coder starred your \"" + snippets.get(2).getTitle() + "\" snippet")
                .targetId(snippets.get(2).getId())
                .targetType("snippet")
                .actionUrl("/snippets/" + snippets.get(2).getId())
                .read(true)
                .createdAt(Instant.now().minus(1, ChronoUnit.DAYS))
                .readAt(Instant.now().minus(23, ChronoUnit.HOURS))
                .build();
        
        // Save all notifications
        notificationRepository.saveAll(Arrays.asList(
            likeNotification,
            commentNotification,
            followNotification,
            starNotification
        ));
        
        System.out.println("Created 4 sample notifications for user: " + recipient.getUsername());
    }
}
