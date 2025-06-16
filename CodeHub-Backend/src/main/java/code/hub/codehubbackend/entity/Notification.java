package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor; // The user who performed the action
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 500)
    private String message;
    
    @Column(name = "target_id")
    private Long targetId; // ID of the target entity (snippet, comment, etc.)
    
    @Column(name = "target_type")
    private String targetType; // Type of the target entity
    
    @Column(name = "action_url")
    private String actionUrl; // URL to navigate to when clicked
    
    @Builder.Default
    @Column(name = "is_read")
    private boolean read = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "read_at")
    private Instant readAt;
    
    // Additional metadata as JSON string
    @Column(columnDefinition = "TEXT")
    private String metadata;
    
    public enum NotificationType {
        SNIPPET_LIKED,
        SNIPPET_COMMENTED,
        SNIPPET_STARRED,
        USER_FOLLOWED,
        COMMENT_REPLIED,
        SNIPPET_FORKED,
        MENTION,
        SYSTEM_ANNOUNCEMENT
    }
    
    public void markAsRead() {
        this.read = true;
        this.readAt = Instant.now();
    }
}
