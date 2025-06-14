package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.activity.ActivityResponse;
import code.hub.codehubbackend.entity.Activity;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.ActivityRepository;
import code.hub.codehubbackend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Get activities for a specific user with optional filtering
     */
    public Page<ActivityResponse> getUserActivities(Long userId, String filterType, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Activity> activities;
        
        if (filterType != null && !filterType.equals("all")) {
            activities = getFilteredActivities(user, filterType, pageable);
        } else {
            activities = activityRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }
        
        return activities.map(this::convertToResponse);
    }
    
    /**
     * Get current user's activities
     */
    public Page<ActivityResponse> getCurrentUserActivities(String filterType, int page, int size) {
        User currentUser = getCurrentUser();
        return getUserActivities(currentUser.getId(), filterType, page, size);
    }
    
    /**
     * Create activity for snippet creation
     */
    @Transactional
    public void createSnippetActivity(Snippet snippet, Activity.ActivityType type) {
        try {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("snippet", Map.of(
                "id", snippet.getId(),
                "title", snippet.getTitle(),
                "language", snippet.getLanguage(),
                "description", snippet.getDescription()
            ));
            
            Activity activity = Activity.builder()
                    .user(snippet.getOwner())
                    .type(type)
                    .targetId(snippet.getId())
                    .targetType("snippet")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created activity: {} for snippet: {}", type, snippet.getId());
        } catch (JsonProcessingException e) {
            log.error("Error creating snippet activity", e);
        }
    }
    
    /**
     * Create activity for like/unlike
     */
    @Transactional
    public void createLikeActivity(Snippet snippet, boolean isLike) {
        try {
            User currentUser = getCurrentUser();
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("snippet", Map.of(
                "id", snippet.getId(),
                "title", snippet.getTitle(),
                "author", snippet.getOwner().getUsername()
            ));
            
            Activity activity = Activity.builder()
                    .user(currentUser)
                    .type(isLike ? Activity.ActivityType.SNIPPET_LIKED : Activity.ActivityType.SNIPPET_UNLIKED)
                    .targetId(snippet.getId())
                    .targetType("snippet")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created {} activity for snippet: {}", isLike ? "LIKE" : "UNLIKE", snippet.getId());
        } catch (JsonProcessingException e) {
            log.error("Error creating like activity", e);
        }
    }
    
    /**
     * Create activity for comment
     */
    @Transactional
    public void createCommentActivity(Snippet snippet, String commentContent) {
        try {
            User currentUser = getCurrentUser();
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("snippet", Map.of(
                "id", snippet.getId(),
                "title", snippet.getTitle()
            ));
            metadata.put("comment", commentContent);
            
            Activity activity = Activity.builder()
                    .user(currentUser)
                    .type(Activity.ActivityType.COMMENT_ADDED)
                    .targetId(snippet.getId())
                    .targetType("snippet")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created comment activity for snippet: {}", snippet.getId());        } catch (JsonProcessingException e) {
            log.error("Error creating comment activity", e);
        }
    }
    
    /**
     * Create activity for favorite
     */
    @Transactional
    public void createFavoriteActivity(Snippet snippet, boolean isFavorite) {
        try {
            User currentUser = getCurrentUser();
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("snippet", Map.of(
                "id", snippet.getId(),
                "title", snippet.getTitle(),
                "author", snippet.getOwner().getUsername()
            ));
            
            Activity activity = Activity.builder()
                    .user(currentUser)
                    .type(isFavorite ? Activity.ActivityType.SNIPPET_FAVORITED : Activity.ActivityType.SNIPPET_UNFAVORITED)
                    .targetId(snippet.getId())
                    .targetType("snippet")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created {} activity for snippet: {}", isFavorite ? "FAVORITE" : "UNFAVORITE", snippet.getId());
        } catch (JsonProcessingException e) {
            log.error("Error creating favorite activity", e);
        }
    }
      /**
     * Create activity for profile update
     */
    @Transactional
    public void createProfileUpdateActivity() {
        try {
            User currentUser = getCurrentUser();
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("user", Map.of(
                "id", currentUser.getId(),
                "username", currentUser.getUsername()
            ));
            
            Activity activity = Activity.builder()
                    .user(currentUser)
                    .type(Activity.ActivityType.PROFILE_UPDATED)
                    .targetId(currentUser.getId())
                    .targetType("user")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created profile update activity for user: {}", currentUser.getId());
        } catch (JsonProcessingException e) {
            log.error("Error creating profile update activity", e);
        }
    }
    
    /**
     * Create activity for following a user
     */
    @Transactional
    public void createFollowActivity(User userToFollow) {
        try {
            User currentUser = getCurrentUser();
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("followedUser", Map.of(
                "id", userToFollow.getId(),
                "username", userToFollow.getUsername(),
                "fullName", userToFollow.getFullName() != null ? userToFollow.getFullName() : userToFollow.getUsername()
            ));
            
            Activity activity = Activity.builder()
                    .user(currentUser)
                    .type(Activity.ActivityType.USER_FOLLOWED)
                    .targetId(userToFollow.getId())
                    .targetType("user")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created follow activity: user {} followed user {}", currentUser.getId(), userToFollow.getId());
        } catch (JsonProcessingException e) {
            log.error("Error creating follow activity", e);
        }
    }
    
    /**
     * Create activity for unfollowing a user
     */
    @Transactional
    public void createUnfollowActivity(User userToUnfollow) {
        try {
            User currentUser = getCurrentUser();
            
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("unfollowedUser", Map.of(
                "id", userToUnfollow.getId(),
                "username", userToUnfollow.getUsername(),
                "fullName", userToUnfollow.getFullName() != null ? userToUnfollow.getFullName() : userToUnfollow.getUsername()
            ));
            
            Activity activity = Activity.builder()
                    .user(currentUser)
                    .type(Activity.ActivityType.USER_UNFOLLOWED)
                    .targetId(userToUnfollow.getId())
                    .targetType("user")
                    .metadata(objectMapper.writeValueAsString(metadata))
                    .build();
            
            activityRepository.save(activity);
            log.info("Created unfollow activity: user {} unfollowed user {}", currentUser.getId(), userToUnfollow.getId());
        } catch (JsonProcessingException e) {
            log.error("Error creating unfollow activity", e);
        }
    }
    
    /**
     * Delete activities when target is deleted
     */
    @Transactional
    public void deleteActivitiesByTarget(Long targetId, String targetType) {
        activityRepository.deleteByTargetIdAndTargetType(targetId, targetType);
        log.info("Deleted activities for target: {} of type: {}", targetId, targetType);
    }
    
    /**
     * Get filtered activities based on type
     */
    private Page<Activity> getFilteredActivities(User user, String filterType, Pageable pageable) {
        switch (filterType.toLowerCase()) {
            case "snippets":
                return activityRepository.findByUserAndTypeInOrderByCreatedAtDesc(
                    user, 
                    List.of(Activity.ActivityType.SNIPPET_CREATED, Activity.ActivityType.SNIPPET_UPDATED), 
                    pageable
                );
            case "likes":
                return activityRepository.findByUserAndTypeOrderByCreatedAtDesc(
                    user, Activity.ActivityType.SNIPPET_LIKED, pageable
                );
            case "comments":
                return activityRepository.findByUserAndTypeOrderByCreatedAtDesc(
                    user, Activity.ActivityType.COMMENT_ADDED, pageable
                );
            case "profile":
                return activityRepository.findByUserAndTypeOrderByCreatedAtDesc(
                    user, Activity.ActivityType.PROFILE_UPDATED, pageable
                );
            default:
                return activityRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }
    }
    
    /**
     * Convert Activity entity to ActivityResponse DTO
     */
    private ActivityResponse convertToResponse(Activity activity) {
        Map<String, Object> data = new HashMap<>();
        
        if (activity.getMetadata() != null) {
            try {
                data = objectMapper.readValue(activity.getMetadata(), new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                log.error("Error parsing activity metadata", e);
            }
        }
        
        return ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType().name())
                .targetId(activity.getTargetId())
                .targetType(activity.getTargetType())
                .data(data)
                .createdAt(activity.getCreatedAt())
                .user(ActivityResponse.UserInfo.builder()
                        .id(activity.getUser().getId())
                        .username(activity.getUser().getUsername())
                        .fullName(activity.getUser().getFullName())
                        .avatarUrl(activity.getUser().getAvatarUrl())
                        .build())
                .build();
    }
    
    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return (User) authentication.getPrincipal();
    }
}
