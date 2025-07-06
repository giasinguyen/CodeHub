package code.hub.codehubbackend.dto.admin;

import code.hub.codehubbackend.entity.User;
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
public class UserDetailsResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private User.Role role;
    private boolean enabled;
    private Instant createdAt;
    private Instant lastLoginAt;
    private String profilePicture;
    private String bio;
    private String location;
    private String website;
    private String githubUsername;
    private String linkedinProfile;
    private String twitterHandle;
    
    // Statistics
    private Long snippetsCount;
    private Long commentsCount;
    private Long likesGiven;
    private Long likesReceived;
    private Long followersCount;
    private Long followingCount;
    private Long viewsCount;
    
    // Recent activity
    private List<ActivitySummary> recentActivities;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivitySummary {
        private String type;
        private String description;
        private Instant timestamp;
    }
}
