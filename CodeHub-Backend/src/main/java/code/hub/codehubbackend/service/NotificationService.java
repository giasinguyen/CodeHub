package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.notification.NotificationResponse;
import code.hub.codehubbackend.dto.notification.NotificationStatsResponse;
import code.hub.codehubbackend.entity.Notification;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.entity.Comment;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.repository.NotificationRepository;
import code.hub.codehubbackend.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Get paginated notifications for current user
     */
    public Page<NotificationResponse> getUserNotifications(int page, int size, String filter) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        
        Page<Notification> notifications;
        switch (filter.toLowerCase()) {
            case "unread":
                notifications = notificationRepository.findByRecipientAndReadOrderByCreatedAtDesc(
                    currentUser, false, pageable);
                break;
            case "read":
                notifications = notificationRepository.findByRecipientAndReadOrderByCreatedAtDesc(
                    currentUser, true, pageable);
                break;
            default:
                notifications = notificationRepository.findByRecipientOrderByCreatedAtDesc(
                    currentUser, pageable);
        }
        
        return notifications.map(this::convertToResponse);
    }
    
    /**
     * Get notification statistics for current user
     */
    public NotificationStatsResponse getNotificationStats() {
        User currentUser = getCurrentUser();
        
        long unreadCount = notificationRepository.countByRecipientAndRead(currentUser, false);
        long totalCount = notificationRepository.countByRecipient(currentUser);
        
        Instant today = Instant.now().truncatedTo(ChronoUnit.DAYS);
        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        
        long todayCount = notificationRepository.countByRecipientAndCreatedAtAfter(currentUser, today);
        long weekCount = notificationRepository.countByRecipientAndCreatedAtAfter(currentUser, weekAgo);
        
        return NotificationStatsResponse.builder()
                .unreadCount(unreadCount)
                .totalCount(totalCount)
                .todayCount(todayCount)
                .weekCount(weekCount)
                .build();
    }
    
    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }
        
        if (!notification.isRead()) {
            notification.markAsRead();
            notificationRepository.save(notification);
            log.info("Marked notification {} as read for user {}", notificationId, currentUser.getId());
        }
    }
    
    /**
     * Mark all notifications as read for current user
     */
    @Transactional
    public void markAllAsRead() {
        User currentUser = getCurrentUser();
        int updatedCount = notificationRepository.markAllAsReadByRecipient(currentUser, Instant.now());
        log.info("Marked {} notifications as read for user {}", updatedCount, currentUser.getId());
    }
    
    /**
     * Delete notification
     */
    @Transactional
    public void deleteNotification(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        if (!notification.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized access to notification");
        }
        
        notificationRepository.delete(notification);
        log.info("Deleted notification {} for user {}", notificationId, currentUser.getId());
    }
    
    /**
     * Create notification for snippet like
     */
    @Transactional
    public void createSnippetLikeNotification(Snippet snippet, User actor) {
        if (snippet.getOwner().getId().equals(actor.getId())) {
            return; // Don't notify when user likes their own snippet
        }
        
        // Check if notification already exists
        if (notificationRepository.existsByRecipientAndActorAndTypeAndTargetIdAndTargetType(
                snippet.getOwner(), actor, Notification.NotificationType.SNIPPET_LIKED, 
                snippet.getId(), "snippet")) {
            return; // Avoid duplicate notifications
        }
        
        String title = "New like on your snippet";
        String message = String.format("%s liked your \"%s\" snippet", 
                actor.getUsername(), snippet.getTitle());
        String actionUrl = "/snippets/" + snippet.getId();
        
        createNotification(snippet.getOwner(), actor, Notification.NotificationType.SNIPPET_LIKED,
                title, message, snippet.getId(), "snippet", actionUrl, null);
    }
    
    /**
     * Create notification for snippet comment
     */
    @Transactional
    public void createSnippetCommentNotification(Snippet snippet, Comment comment, User actor) {
        if (snippet.getOwner().getId().equals(actor.getId())) {
            return; // Don't notify when user comments on their own snippet
        }
        
        String title = "New comment on your snippet";
        String message = String.format("%s commented on your \"%s\" snippet", 
                actor.getUsername(), snippet.getTitle());
        String actionUrl = "/snippets/" + snippet.getId() + "#comment-" + comment.getId();
        
        createNotification(snippet.getOwner(), actor, Notification.NotificationType.SNIPPET_COMMENTED,
                title, message, snippet.getId(), "snippet", actionUrl, null);
    }
    
    /**
     * Create notification for user follow
     */
    @Transactional
    public void createUserFollowNotification(User followedUser, User follower) {
        String title = "New follower";
        String message = String.format("%s started following you", follower.getUsername());
        String actionUrl = "/profile/" + follower.getUsername();
        
        createNotification(followedUser, follower, Notification.NotificationType.USER_FOLLOWED,
                title, message, follower.getId(), "user", actionUrl, null);
    }
    
    /**
     * Create notification for snippet favorite/star
     */
    @Transactional
    public void createSnippetStarNotification(Snippet snippet, User actor) {
        if (snippet.getOwner().getId().equals(actor.getId())) {
            return; // Don't notify when user stars their own snippet
        }
        
        String title = "Snippet starred";
        String message = String.format("%s starred your \"%s\" snippet", 
                actor.getUsername(), snippet.getTitle());
        String actionUrl = "/snippets/" + snippet.getId();
        
        createNotification(snippet.getOwner(), actor, Notification.NotificationType.SNIPPET_STARRED,
                title, message, snippet.getId(), "snippet", actionUrl, null);
    }
    
    /**
     * Generic method to create notification
     */
    private void createNotification(User recipient, User actor, Notification.NotificationType type,
                                  String title, String message, Long targetId, String targetType,
                                  String actionUrl, Map<String, Object> metadata) {
        try {
            String metadataJson = null;
            if (metadata != null) {
                metadataJson = objectMapper.writeValueAsString(metadata);
            }
            
            Notification notification = Notification.builder()
                    .recipient(recipient)
                    .actor(actor)
                    .type(type)
                    .title(title)
                    .message(message)
                    .targetId(targetId)
                    .targetType(targetType)
                    .actionUrl(actionUrl)
                    .metadata(metadataJson)
                    .build();
            
            notificationRepository.save(notification);
            
            log.info("Created {} notification for user {} from actor {}", 
                    type, recipient.getId(), actor != null ? actor.getId() : "system");
            
        } catch (JsonProcessingException e) {
            log.error("Error creating notification metadata", e);
        }
    }
    
    /**
     * Convert Notification entity to NotificationResponse DTO
     */
    private NotificationResponse convertToResponse(Notification notification) {
        NotificationResponse.ActorInfo actorInfo = null;
        if (notification.getActor() != null) {
            actorInfo = NotificationResponse.ActorInfo.builder()
                    .id(notification.getActor().getId())
                    .username(notification.getActor().getUsername())
                    .fullName(notification.getActor().getFullName())
                    .avatarUrl(notification.getActor().getAvatarUrl())
                    .build();
        }
        
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType().name())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .targetId(notification.getTargetId())
                .targetType(notification.getTargetType())
                .actionUrl(notification.getActionUrl())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .actor(actorInfo)
                .build();
    }
    
    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    /**
     * Cleanup old read notifications (can be called periodically)
     */
    @Transactional
    public void cleanupOldNotifications() {
        Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            int deletedCount = notificationRepository.deleteOldReadNotifications(user, thirtyDaysAgo);
            if (deletedCount > 0) {
                log.info("Cleaned up {} old notifications for user {}", deletedCount, user.getId());
            }
        }
    }
}
