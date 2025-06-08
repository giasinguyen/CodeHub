package code.hub.codehubbackend.dto.snippet;

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
public class SnippetResponse {
    
    private Long id;
    private String title;
    private String code;
    private String language;
    private String description;
    private List<String> mediaUrls;
    private List<String> tags;
    private UserSummary owner;
    private Instant createdAt;
    private Instant updatedAt;
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private boolean isLiked;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private Long id;
        private String username;
        private String avatarUrl;
    }
}
