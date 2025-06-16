package code.hub.codehubbackend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowResponse {
    
    private Long id;
    private String username;
    private String fullName;
    private String avatarUrl;
    private String bio;
    private String location;
    private Instant followedAt;
    private boolean isFollowingBack; // If current user follows this user back
    private FollowStats stats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FollowStats {
        private long snippetCount;
        private long followerCount;
        private long followingCount;
        private long totalLikes;
    }
}
