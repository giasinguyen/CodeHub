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
public class LeaderboardUserResponse {
    
    private Long id;
    private String username;
    private String avatarUrl;
    private String fullName;
    private String location;
    private Long score;
    private Long snippetCount;
    private Long totalLikes;
    private Long totalViews;
    private Integer rank;
    private String category; // "overall", "snippets", "likes", "contributions"
    private Instant joinedAt;
}
