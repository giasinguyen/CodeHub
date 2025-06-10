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
public class UserProfileResponse {
    
    private Long id;
    private String username;
    private String email;
    private String role;
    private String avatarUrl;
    private String coverPhotoUrl;
    private String bio;
    private String fullName;
    private String location;
    private String websiteUrl;
    private String githubUrl;
    private String twitterUrl;
    private String linkedinUrl;
    private Instant createdAt;
    private Long snippetCount;
    private Long totalLikes;
    private Long totalViews;
}
