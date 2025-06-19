package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "recently_viewed", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "snippet_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentlyViewed {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false)
    private Snippet snippet;
    
    @CreationTimestamp
    @Column(name = "viewed_at", nullable = false, updatable = false)
    private LocalDateTime viewedAt;
    
    @UpdateTimestamp
    @Column(name = "last_viewed_at", nullable = true) // Nullable for backward compatibility
    private LocalDateTime lastViewedAt;
    
    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 1;
    
    @Version
    @Column(nullable = true) // Nullable for backward compatibility
    private Long version;
    
    // Helper method to get the most recent viewed time
    public LocalDateTime getMostRecentViewedAt() {
        return lastViewedAt != null ? lastViewedAt : viewedAt;
    }
}
