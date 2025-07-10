package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "comment_likes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentLike {
    
    @EmbeddedId
    private CommentLikeKey id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("commentId")
    @JoinColumn(name = "comment_id")
    private Comment comment;
    
    @Column(updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentLikeKey implements Serializable {
        
        @Column(name = "user_id")
        private Long userId;
        
        @Column(name = "comment_id")
        private Long commentId;
    }
}
