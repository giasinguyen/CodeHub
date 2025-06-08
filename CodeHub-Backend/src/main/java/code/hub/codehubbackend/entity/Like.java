package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "likes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Like {
    
    @EmbeddedId
    private LikeKey id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("snippetId")
    @JoinColumn(name = "snippet_id")
    private Snippet snippet;
    
    @Column(updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LikeKey implements Serializable {
        
        @Column(name = "user_id")
        private Long userId;
        
        @Column(name = "snippet_id")
        private Long snippetId;
    }
}
