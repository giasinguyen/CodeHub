package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
      @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityType type;
    
    @Column(name = "target_id")
    private Long targetId;
    
    @Column(name = "target_type")
    private String targetType;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON string for additional data
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
      public enum ActivityType {
        SNIPPET_CREATED,
        SNIPPET_UPDATED, 
        SNIPPET_DELETED,
        SNIPPET_LIKED,        
        SNIPPET_UNLIKED,
        SNIPPET_FAVED,      // Shortened from SNIPPET_FAVORITED
        SNIPPET_UNFAVED,    // Shortened from SNIPPET_UNFAVORITED
        SNIPPET_VIEWED,
        COMMENT_ADDED,
        COMMENT_DELETED,
        USER_FOLLOWED,
        USER_UNFOLLOWED,
        PROFILE_UPDATED
    }
}
