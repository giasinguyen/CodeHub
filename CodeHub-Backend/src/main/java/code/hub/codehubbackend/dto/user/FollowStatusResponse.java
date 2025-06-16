package code.hub.codehubbackend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowStatusResponse {
    
    private boolean isFollowing;
    private boolean isFollowedBy; // If the target user follows current user back
    private long followerCount;
    private long followingCount;
}
