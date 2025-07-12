package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.admin.*;
import code.hub.codehubbackend.entity.*;
import code.hub.codehubbackend.repository.*;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final SnippetRepository snippetRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final ActivityRepository activityRepository;

    public DashboardStatsResponse getDashboardStats() {
        log.info("Fetching dashboard statistics");
        
        // Basic counts
        Long totalUsers = userRepository.count();
        Long totalSnippets = snippetRepository.count();
        Long totalComments = commentRepository.count();
        Long totalLikes = likeRepository.count();
        Long totalViews = snippetRepository.getTotalViews();
        
        // Today's statistics
        Instant todayStart = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
        Long newUsersToday = userRepository.countByCreatedAtAfter(todayStart);
        Long newSnippetsToday = snippetRepository.countByCreatedAtAfter(todayStart);
        Long newCommentsToday = commentRepository.countByCreatedAtAfter(todayStart);
        
        // Active users (users with activity in last 30 days)
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        Long activeUsers = userRepository.countActiveUsers(thirtyDaysAgo);
        
        // Averages
        Double avgSnippetsPerUser = totalUsers > 0 ? (double) totalSnippets / totalUsers : 0.0;
        Double avgCommentsPerSnippet = totalSnippets > 0 ? (double) totalComments / totalSnippets : 0.0;
        
        // Most popular language
        String mostPopularLanguage = snippetRepository.findMostPopularLanguage()
                .orElse("Unknown");
        
        // Most active user
        String mostActiveUser = userRepository.findMostActiveUser()
                .orElse("Unknown");
        
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalSnippets(totalSnippets)
                .totalComments(totalComments)
                .totalLikes(totalLikes)
                .totalViews(totalViews)
                .activeUsers(activeUsers)
                .newUsersToday(newUsersToday)
                .newSnippetsToday(newSnippetsToday)
                .newCommentsToday(newCommentsToday)
                .averageSnippetsPerUser(Math.round(avgSnippetsPerUser * 100.0) / 100.0)
                .averageCommentsPerSnippet(Math.round(avgCommentsPerSnippet * 100.0) / 100.0)
                .mostPopularLanguage(mostPopularLanguage)
                .mostActiveUser(mostActiveUser)
                .build();
    }

    public Page<UserManagementResponse> getUsers(int page, int size, String search) {
        log.info("Fetching users - page: {}, size: {}, search: {}", page, size, search);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        
        if (search != null && !search.trim().isEmpty()) {
            users = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search, search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return users.map(this::mapToUserManagementResponse);
    }

    public UserDetailsResponse getUserDetails(Long userId) {
        log.info("Fetching user details for ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Get statistics
        Long snippetsCount = snippetRepository.countByAuthor(user);
        Long commentsCount = commentRepository.countByAuthor(user);
        Long likesGiven = likeRepository.countByUser(user);
        Long likesReceived = likeRepository.countBySnippetAuthor(user);
        Long viewsCount = snippetRepository.getTotalViewsByAuthor(user);
        
        // Get recent activities
        List<Activity> recentActivities = activityRepository.findByUserOrderByCreatedAtDesc(
                user, PageRequest.of(0, 10)).getContent();
        
        List<UserDetailsResponse.ActivitySummary> activitySummaries = recentActivities.stream()
                .map(activity -> UserDetailsResponse.ActivitySummary.builder()
                        .type(activity.getType().name())
                        .description(activity.getType().name() + " - " + activity.getTargetType())
                        .timestamp(activity.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant())
                        .build())
                .toList();
        
        return UserDetailsResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getCreatedAt()) // Using createdAt as placeholder
                .profilePicture(user.getAvatarUrl())
                .bio(user.getBio())
                .location(user.getLocation())
                .website(user.getWebsiteUrl())
                .githubUsername(user.getGithubUrl())
                .linkedinProfile(user.getLinkedinUrl())
                .twitterHandle(user.getTwitterUrl())
                .snippetsCount(snippetsCount)
                .commentsCount(commentsCount)
                .likesGiven(likesGiven)
                .likesReceived(likesReceived)
                .viewsCount(viewsCount)
                .recentActivities(activitySummaries)
                .build();
    }

    @Transactional
    public void updateUserStatus(Long userId, boolean enabled) {
        log.info("Updating user status - ID: {}, enabled: {}", userId, enabled);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setEnabled(enabled);
        userRepository.save(user);
        
        log.info("User status updated successfully");
    }

    public Page<SnippetModerationResponse> getSnippets(int page, int size, String search) {
        log.info("Fetching snippets for moderation - page: {}, size: {}, search: {}", page, size, search);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Snippet> snippets;
        
        if (search != null && !search.trim().isEmpty()) {
            snippets = snippetRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                    search, search, pageable);
        } else {
            snippets = snippetRepository.findAll(pageable);
        }
        
        return snippets.map(this::mapToSnippetModerationResponse);
    }

    @Transactional
    public void deleteSnippet(Long snippetId) {
        log.info("Deleting snippet with ID: {}", snippetId);
        
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found"));
        
        snippetRepository.delete(snippet);
        log.info("Snippet deleted successfully");
    }

    public List<Map<String, Object>> getUserAnalytics(String period, int days) {
        log.info("Fetching user analytics - period: {}, days: {}", period, days);
        
        Instant startDate = Instant.now().minus(days, ChronoUnit.DAYS);
        return userRepository.getUserAnalytics(startDate, period);
    }

    public List<Map<String, Object>> getSnippetAnalytics(String period, int days) {
        log.info("Fetching snippet analytics - period: {}, days: {}", period, days);
        
        Instant startDate = Instant.now().minus(days, ChronoUnit.DAYS);
        return snippetRepository.getSnippetAnalytics(startDate, period);
    }

    // Chart data methods
    public List<Map<String, Object>> getTopLanguagesChart() {
        log.info("Fetching top languages chart data");
        List<Object[]> results = snippetRepository.getTopLanguagesData();
        return results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("language", row[0]);
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSnippetsCreatedChart() {
        log.info("Fetching snippets created chart data");
        List<Object[]> results = snippetRepository.getSnippetsCreatedLast30Days();
        return results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", row[0]);
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getViewsChart() {
        log.info("Fetching views chart data");
        List<Object[]> results = snippetRepository.getViewsLast30Days();
        return results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", row[0]);
                    map.put("views", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getSnippetsByHourChart() {
        log.info("Fetching snippets by hour chart data");
        List<Object[]> results = snippetRepository.getSnippetsByHourLast7Days();
        return results.stream()
                .map(row -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("hour", row[0]);
                    map.put("count", row[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public Page<ActivityResponse> getRecentActivities(int page, int size) {
        log.info("Fetching recent activities - page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Activity> activities = activityRepository.findAll(pageable);
        
        return activities.map(this::mapToActivityResponse);
    }

    public SystemHealthResponse getSystemHealth() {
        log.info("Fetching system health information");
        
        // System uptime
        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();
        
        // Memory information
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        long maxMemory = runtime.maxMemory();
        double memoryUsage = ((double) (totalMemory - freeMemory) / maxMemory) * 100;
        
        // Database health (simplified)
        SystemHealthResponse.DatabaseHealth dbHealth = SystemHealthResponse.DatabaseHealth.builder()
                .status("healthy")
                .totalConnections(10L)
                .activeConnections(5L)
                .idleConnections(5L)
                .avgResponseTime(15.5)
                .build();
        
        // System resources
        SystemHealthResponse.SystemResources resources = SystemHealthResponse.SystemResources.builder()
                .cpuUsage(45.0) // This would need actual CPU monitoring
                .memoryUsage(memoryUsage)
                .diskUsage(60.0) // This would need actual disk monitoring
                .totalMemory(totalMemory)
                .freeMemory(freeMemory)
                .totalDiskSpace(1000000000L) // 1GB example
                .freeDiskSpace(400000000L) // 400MB example
                .build();
        
        // Additional metrics
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("jvm_version", System.getProperty("java.version"));
        metrics.put("os_name", System.getProperty("os.name"));
        metrics.put("os_version", System.getProperty("os.version"));
        metrics.put("available_processors", Runtime.getRuntime().availableProcessors());
        
        return SystemHealthResponse.builder()
                .status("healthy")
                .uptime(uptime)
                .version("1.0.0")
                .database(dbHealth)
                .resources(resources)
                .metrics(metrics)
                .build();
    }

    public UserStatsResponse getUserStats(Long userId) {
        log.info("Fetching stats for user ID: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Long totalSnippets = snippetRepository.countByAuthorId(userId);
        Long totalComments = commentRepository.countByUserId(userId);
        Long totalLikes = likeRepository.countByUserId(userId);
        Long likesReceived = likeRepository.countBySnippetAuthorId(userId);
        Long profileViews = 0L; // User entity doesn't have profileViews field yet
        
        return UserStatsResponse.builder()
                .userId(userId)
                .totalSnippets(totalSnippets)
                .totalComments(totalComments)
                .totalLikes(totalLikes)
                .likesReceived(likesReceived)
                .profileViews(profileViews)
                .build();
    }

    public Page<SnippetModerationResponse> getUserSnippets(Long userId, int page, int size) {
        log.info("Fetching snippets for user ID: {} (page: {}, size: {})", userId, page, size);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Snippet> snippets = snippetRepository.findByAuthorId(userId, pageable);
        
        return snippets.map(snippet -> SnippetModerationResponse.builder()
                .id(snippet.getId())
                .title(snippet.getTitle())
                .description(snippet.getDescription())
                .language(snippet.getLanguage())
                .authorUsername(snippet.getOwner().getUsername())
                .authorEmail(snippet.getOwner().getEmail())
                .createdAt(snippet.getCreatedAt())
                .updatedAt(snippet.getUpdatedAt())
                .isPublic(true) // Default to public since Snippet entity doesn't have isPublic field
                .likesCount(snippet.getLikes() != null ? (long) snippet.getLikes().size() : 0L)
                .commentsCount(snippet.getComments() != null ? (long) snippet.getComments().size() : 0L)
                .viewsCount(snippet.getViewCount())
                .flagged(false)
                .flagReason(null)
                .codePreview(snippet.getCode() != null && snippet.getCode().length() > 200 
                    ? snippet.getCode().substring(0, 200) + "..." 
                    : snippet.getCode())
                .build());
    }

    public Page<ActivityResponse> getUserActivities(Long userId, int page, int size) {
        log.info("Fetching activities for user ID: {} (page: {}, size: {})", userId, page, size);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Activity> activities = activityRepository.findByUserId(userId, pageable);
        
        return activities.map(activity -> ActivityResponse.builder()
                .id(activity.getId())
                .userId(activity.getUser().getId())
                .username(activity.getUser().getUsername())
                .description("Activity: " + activity.getType().toString())
                .activityType(activity.getType().toString())
                .timestamp(activity.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).toInstant())
                .build());
    }

    private UserManagementResponse mapToUserManagementResponse(User user) {
        Long snippetsCount = snippetRepository.countByAuthor(user);
        Long commentsCount = commentRepository.countByAuthor(user);
        Long likesCount = likeRepository.countByUser(user);
        
        return UserManagementResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getCreatedAt()) // Using createdAt as placeholder
                .snippetsCount(snippetsCount)
                .commentsCount(commentsCount)
                .likesCount(likesCount)
                .profilePicture(user.getAvatarUrl())
                .build();
    }

    private SnippetModerationResponse mapToSnippetModerationResponse(Snippet snippet) {
        Long viewsCount = snippet.getViewCount() != null ? snippet.getViewCount() : 0L;
        Long likesCount = likeRepository.countBySnippet(snippet);
        Long commentsCount = commentRepository.countBySnippet(snippet);
        
        String codePreview = snippet.getCode() != null && snippet.getCode().length() > 200
                ? snippet.getCode().substring(0, 200) + "..."
                : snippet.getCode();
        
        return SnippetModerationResponse.builder()
                .id(snippet.getId())
                .title(snippet.getTitle())
                .description(snippet.getDescription())
                .language(snippet.getLanguage())
                .authorUsername(snippet.getOwner().getUsername())
                .authorEmail(snippet.getOwner().getEmail())
                .createdAt(snippet.getCreatedAt())
                .updatedAt(snippet.getUpdatedAt())
                .viewsCount(viewsCount)
                .likesCount(likesCount)
                .commentsCount(commentsCount)
                .isPublic(true) // Assuming all snippets are public for now
                .flagged(false) // This would need a flagging system
                .flagReason(null)
                .codePreview(codePreview)
                .build();
    }

    private ActivityResponse mapToActivityResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType().name())
                .description(activity.getType().name() + " - " + activity.getTargetType())
                .userUsername(activity.getUser().getUsername())
                .userEmail(activity.getUser().getEmail())
                .timestamp(activity.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant())
                .details(activity.getMetadata())
                .ipAddress("127.0.0.1") // Placeholder
                .userAgent("Unknown") // Placeholder
                .build();
    }
}
