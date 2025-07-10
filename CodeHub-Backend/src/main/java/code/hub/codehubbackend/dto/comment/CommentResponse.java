package code.hub.codehubbackend.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    
    private Long id;
    private String content;
    private AuthorSummary author;
    private Instant createdAt;
    private Instant updatedAt;
    
    // New fields for enhanced functionality
    private Integer likeCount;
    private Boolean isLiked;
    private Boolean canEdit;
    private Boolean canDelete;
    private Boolean isDeleted;
    
    // Nested comments support
    private Long parentCommentId;
    private List<CommentResponse> replies;
    private Integer replyCount;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorSummary {
        private Long id;
        private String username;
        private String fullName;
        private String avatarUrl;
        private String role;
    }
}
