package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Notification;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Get all notifications for a user
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);
    
    // Get unread notifications for a user
    Page<Notification> findByRecipientAndReadOrderByCreatedAtDesc(User recipient, boolean read, Pageable pageable);
    
    // Count unread notifications for a user
    long countByRecipientAndRead(User recipient, boolean read);
    
    // Get recent notifications for a user (for real-time updates)
    @Query("SELECT n FROM Notification n WHERE n.recipient = :recipient AND n.createdAt > :since ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(@Param("recipient") User recipient, @Param("since") Instant since);
    
    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.read = true, n.readAt = :readAt WHERE n.recipient = :recipient AND n.read = false")
    int markAllAsReadByRecipient(@Param("recipient") User recipient, @Param("readAt") Instant readAt);
    
    // Delete old read notifications (cleanup)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.recipient = :recipient AND n.read = true AND n.createdAt < :before")
    int deleteOldReadNotifications(@Param("recipient") User recipient, @Param("before") Instant before);
    
    // Check if notification exists for specific action (to avoid duplicates)
    boolean existsByRecipientAndActorAndTypeAndTargetIdAndTargetType(
        User recipient, User actor, Notification.NotificationType type, Long targetId, String targetType
    );
    
    // Get notifications by type
    Page<Notification> findByRecipientAndTypeOrderByCreatedAtDesc(
        User recipient, Notification.NotificationType type, Pageable pageable
    );
      // Delete notifications when target is deleted
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.targetId = :targetId AND n.targetType = :targetType")
    int deleteByTargetIdAndTargetType(@Param("targetId") Long targetId, @Param("targetType") String targetType);
    
    // Count notifications by recipient
    long countByRecipient(User recipient);
    
    // Count notifications by recipient and created after
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient = :recipient AND n.createdAt > :createdAt")
    long countByRecipientAndCreatedAtAfter(@Param("recipient") User recipient, @Param("createdAt") Instant createdAt);
}
