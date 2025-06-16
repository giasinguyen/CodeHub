package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.dto.user.*;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.UserRepository;
import code.hub.codehubbackend.repository.UserFollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private UserFollowRepository userFollowRepository;
    @Autowired
    private SnippetService snippetService;
    @Autowired
    private ActivityService activityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileResponse getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        return convertToProfileResponse(currentUser);
    }

    public UserProfileResponse getUserProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return convertToProfileResponse(user);
    }

    public UserProfileResponse getUserProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return convertToProfileResponse(user);
    }

    public UserStatsResponse getCurrentUserStats() {
        User currentUser = getCurrentUser();
        return getUserStatsForUser(currentUser);
    }

    public UserStatsResponse getUserStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return getUserStatsForUser(user);
    }

    private UserStatsResponse getUserStatsForUser(User user) {
        // Count snippets created by the user
        Long snippetsCount = snippetRepository.countByOwner(user);

        // Count followers (users who follow this user)
        Long followersCount = userFollowRepository.countFollowersByUserId(user.getId());

        // Count following (users this user follows)
        Long followingCount = userFollowRepository.countFollowingByUserId(user.getId()); // Calculate total likes,
                                                                                         // views, and comments on
                                                                                         // user's snippets
        List<Snippet> userSnippets = snippetRepository.findByOwner(user);
        Long totalLikes = userSnippets.stream()
                .mapToLong(snippet -> snippet.getLikeCount() != null ? snippet.getLikeCount() : 0L)
                .sum();
        Long totalViews = userSnippets.stream()
                .mapToLong(snippet -> snippet.getViewCount() != null ? snippet.getViewCount() : 0L)
                .sum();
        Long totalComments = userSnippets.stream()
                .mapToLong(snippet -> snippet.getComments() != null ? snippet.getComments().size() : 0L)
                .sum();

        return new UserStatsResponse(followersCount, followingCount, snippetsCount,
                totalLikes, totalViews, totalComments);
    }

    @Transactional
    public UserProfileResponse updateUserProfile(UserUpdateRequest request) {
        User currentUser = getCurrentUser();

        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            currentUser.setEmail(request.getEmail());
        }

        if (request.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(request.getAvatarUrl());
        }

        if (request.getCoverPhotoUrl() != null) {
            currentUser.setCoverPhotoUrl(request.getCoverPhotoUrl());
        }

        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }

        if (request.getFullName() != null) {
            currentUser.setFullName(request.getFullName());
        }

        if (request.getLocation() != null) {
            currentUser.setLocation(request.getLocation());
        }

        if (request.getWebsiteUrl() != null) {
            currentUser.setWebsiteUrl(request.getWebsiteUrl());
        }

        if (request.getGithubUrl() != null) {
            currentUser.setGithubUrl(request.getGithubUrl());
        }

        if (request.getTwitterUrl() != null) {
            currentUser.setTwitterUrl(request.getTwitterUrl());
        }

        if (request.getLinkedinUrl() != null) {
            currentUser.setLinkedinUrl(request.getLinkedinUrl());
        }
        currentUser = userRepository.save(currentUser);

        // Create profile update activity
        activityService.createProfileUpdateActivity();

        return convertToProfileResponse(currentUser);
    }

    public Page<SnippetResponse> getUserSnippets(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Snippet> snippets = snippetRepository.findByOwner(user, pageable);

        return snippets.map(snippet -> snippetService.convertToResponse(snippet));
    }

    public Page<SnippetResponse> getCurrentUserSnippets(int page, int size) {
        User currentUser = getCurrentUser();
        return getUserSnippets(currentUser.getId(), page, size);
    }

    @Transactional
    public void changePassword(PasswordChangeRequest request) {
        User currentUser = getCurrentUser();

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password is different
        if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPasswordHash())) {
            throw new RuntimeException("New password must be different from current password");
        }

        // Update password
        currentUser.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    private UserProfileResponse convertToProfileResponse(User user) {
        // Calculate user statistics
        Long snippetCount = snippetRepository.countByOwner(user);
        Long totalLikes = snippetRepository.sumLikesByOwner(user);
        Long totalViews = snippetRepository.sumViewsByOwner(user);

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .coverPhotoUrl(user.getCoverPhotoUrl())
                .bio(user.getBio())
                .fullName(user.getFullName())
                .location(user.getLocation())
                .websiteUrl(user.getWebsiteUrl())
                .githubUrl(user.getGithubUrl())
                .twitterUrl(user.getTwitterUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .createdAt(user.getCreatedAt())
                .snippetCount(snippetCount != null ? snippetCount : 0L)
                .totalLikes(totalLikes != null ? totalLikes : 0L)
                .totalViews(totalViews != null ? totalViews : 0L)
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return (User) authentication.getPrincipal();
    }

    // New methods for developers page functionality
    public Page<DeveloperResponse> getAllDevelopers(int page, int size, String sort, String direction,
            String search, String location, Integer experience, List<String> skills) {
        // Handle reputation sort specially since it's calculated, not a DB field
        if ("reputation".equals(sort)) {
            // For reputation sort, use a simpler approach and sort in memory
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users = userRepository.findAll(pageable);

            List<DeveloperResponse> developers = users.getContent().stream()
                    .map(this::convertToDeveloperResponse)
                    .sorted((a, b) -> {
                        if ("desc".equalsIgnoreCase(direction)) {
                            return Double.compare(b.getReputation() != null ? b.getReputation() : 0.0,
                                    a.getReputation() != null ? a.getReputation() : 0.0);
                        } else {
                            return Double.compare(a.getReputation() != null ? a.getReputation() : 0.0,
                                    b.getReputation() != null ? b.getReputation() : 0.0);
                        }
                    })
                    .collect(Collectors.toList());

            // Create a new Page with sorted results
            return new PageImpl<>(developers, pageable, users.getTotalElements());
        } else {
            // For other sorts, use database sorting
            Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC
                    : Sort.Direction.ASC;

            // Map frontend sort fields to actual entity fields
            String actualSortField;
            switch (sort) {
                case "name":
                    actualSortField = "username";
                    break;
                case "newest":
                    actualSortField = "createdAt";
                    break;
                case "contributions":
                    actualSortField = "createdAt"; // fallback since contributions is calculated
                    break;
                default:
                    actualSortField = "createdAt"; // default fallback
                    break;
            }

            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, actualSortField));
            Page<User> users = userRepository.findAll(pageable);
            return users.map(this::convertToDeveloperResponse);
        }
    }

    public List<DeveloperResponse> getFeaturedDevelopers(int limit) {
        // Get top developers by total likes and snippet count
        Pageable pageable = PageRequest.of(0, limit);
        List<User> featuredUsers = userRepository.findTopDevelopersByActivity(pageable);

        if (featuredUsers.isEmpty()) {
            // Fallback to recent users if no activity-based ranking
            featuredUsers = userRepository.findTopByOrderByCreatedAtDesc(pageable).getContent();
        }

        return featuredUsers.stream()
                .map(this::convertToDeveloperResponse)
                .collect(Collectors.toList());
    }

    public CommunityStatsResponse getCommunityStats() {
        Long totalDevelopers = userRepository.count();
        Long totalSnippets = snippetRepository.count();
        Long totalLikes = snippetRepository.sumAllLikes();
        Long activeDevelopers = userRepository.countActiveUsersLastMonth();

        return CommunityStatsResponse.builder()
                .totalDevelopers(totalDevelopers)
                .totalSnippets(totalSnippets)
                .totalContributions(totalLikes != null ? totalLikes : 0L)
                .activeDevelopers(activeDevelopers != null ? activeDevelopers : 0L)
                .averageRating(4.5) // Mock value for now
                .mostActiveCountry("United States") // Mock value for now
                .trendingSkill("JavaScript") // Mock value for now
                .build();
    }

    public List<TrendingSkillResponse> getTrendingSkills(String period, int limit) {
        // Mock trending skills data for now
        List<TrendingSkillResponse> trendingSkills = Arrays.asList(
                TrendingSkillResponse.builder()
                        .name("JavaScript")
                        .count(1250L)
                        .growthRate(15.5)
                        .hotness(5)
                        .category("Frontend")
                        .build(),
                TrendingSkillResponse.builder()
                        .name("Python")
                        .count(980L)
                        .growthRate(12.3)
                        .hotness(4)
                        .category("Backend")
                        .build(),
                TrendingSkillResponse.builder()
                        .name("React")
                        .count(890L)
                        .growthRate(18.7)
                        .hotness(5)
                        .category("Frontend")
                        .build(),
                TrendingSkillResponse.builder()
                        .name("Node.js")
                        .count(750L)
                        .growthRate(10.2)
                        .hotness(4)
                        .category("Backend")
                        .build(),
                TrendingSkillResponse.builder()
                        .name("TypeScript")
                        .count(650L)
                        .growthRate(22.1)
                        .hotness(5)
                        .category("Language")
                        .build());

        return trendingSkills.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<LeaderboardUserResponse> getLeaderboard(String category, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<User> topUsers;

        switch (category.toLowerCase()) {
            case "snippets":
                topUsers = userRepository.findTopUsersBySnippetCount(pageable);
                break;
            case "likes":
                topUsers = userRepository.findTopUsersByTotalLikes(pageable);
                break;
            case "contributions":
                topUsers = userRepository.findTopUsersByTotalContributions(pageable);
                break;
            default: // "overall"
                topUsers = userRepository.findTopUsersByOverallScore(pageable);
                break;
        }

        List<LeaderboardUserResponse> leaderboard = new ArrayList<>();
        for (int i = 0; i < topUsers.size(); i++) {
            User user = topUsers.get(i);
            Long snippetCount = snippetRepository.countByOwner(user);
            Long totalLikes = snippetRepository.sumLikesByOwner(user);
            Long totalViews = snippetRepository.sumViewsByOwner(user);

            Long score = calculateUserScore(snippetCount, totalLikes, totalViews);

            LeaderboardUserResponse leaderboardUser = LeaderboardUserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .avatarUrl(user.getAvatarUrl())
                    .fullName(user.getFullName())
                    .location(user.getLocation())
                    .score(score)
                    .snippetCount(snippetCount != null ? snippetCount : 0L)
                    .totalLikes(totalLikes != null ? totalLikes : 0L)
                    .totalViews(totalViews != null ? totalViews : 0L)
                    .rank(i + 1)
                    .category(category)
                    .joinedAt(user.getCreatedAt())
                    .build();

            leaderboard.add(leaderboardUser);
        }

        return leaderboard;
    }

    private DeveloperResponse convertToDeveloperResponse(User user) {
        Long snippetCount = snippetRepository.countByOwner(user);
        Long totalLikes = snippetRepository.sumLikesByOwner(user);
        Long totalViews = snippetRepository.sumViewsByOwner(user);

        // Calculate reputation based on activity
        Double reputation = calculateReputation(snippetCount, totalLikes, totalViews);

        // Mock skills for now (would need separate skills table)
        List<String> skills = generateMockSkills(user);

        return DeveloperResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .coverPhotoUrl(user.getCoverPhotoUrl())
                .bio(user.getBio())
                .fullName(user.getFullName())
                .location(user.getLocation())
                .websiteUrl(user.getWebsiteUrl())
                .githubUrl(user.getGithubUrl())
                .twitterUrl(user.getTwitterUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .createdAt(user.getCreatedAt())
                .snippetCount(snippetCount != null ? snippetCount : 0L)
                .totalLikes(totalLikes != null ? totalLikes : 0L)
                .totalViews(totalViews != null ? totalViews : 0L)
                .reputation(reputation)
                .skills(skills)
                .experienceLevel(calculateExperienceLevel(snippetCount, reputation))
                .isOnline(false) // Mock value for now
                .lastActive(user.getUpdatedAt())
                .build();
    }

    private Double calculateReputation(Long snippetCount, Long totalLikes, Long totalViews) {
        double snippetScore = (snippetCount != null ? snippetCount : 0) * 10.0;
        double likeScore = (totalLikes != null ? totalLikes : 0) * 5.0;
        double viewScore = (totalViews != null ? totalViews : 0) * 0.1;

        return Math.min(100.0, (snippetScore + likeScore + viewScore) / 10.0);
    }

    private Long calculateUserScore(Long snippetCount, Long totalLikes, Long totalViews) {
        long snippetScore = (snippetCount != null ? snippetCount : 0) * 10;
        long likeScore = (totalLikes != null ? totalLikes : 0) * 5;
        long viewScore = (totalViews != null ? totalViews : 0) / 10;

        return snippetScore + likeScore + viewScore;
    }

    private Integer calculateExperienceLevel(Long snippetCount, Double reputation) {
        if (snippetCount == null || reputation == null)
            return 1;

        if (snippetCount >= 50 && reputation >= 80)
            return 5; // Expert
        if (snippetCount >= 25 && reputation >= 60)
            return 4; // Advanced
        if (snippetCount >= 10 && reputation >= 40)
            return 3; // Intermediate
        if (snippetCount >= 3 && reputation >= 20)
            return 2; // Beginner
        return 1; // Novice
    }

    private List<String> generateMockSkills(User user) {
        // Mock skill generation based on user ID for consistency
        List<String> allSkills = Arrays.asList(
                "JavaScript", "Python", "Java", "React", "Node.js", "TypeScript",
                "HTML", "CSS", "Vue.js", "Angular", "Spring Boot", "Express.js",
                "MongoDB", "PostgreSQL", "MySQL", "Docker", "AWS", "Git");

        Random random = new Random(user.getId());
        int skillCount = 3 + random.nextInt(5); // 3-7 skills

        List<String> userSkills = new ArrayList<>();
        List<String> availableSkills = new ArrayList<>(allSkills);

        for (int i = 0; i < skillCount && !availableSkills.isEmpty(); i++) {
            int index = random.nextInt(availableSkills.size());
            userSkills.add(availableSkills.remove(index));
        }

        return userSkills;
    }
}
