package code.hub.codehubbackend.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FollowStatusResponse {
    
    @JsonProperty("isFollowing")
    private boolean isFollowing;
    
    @JsonProperty("isFollowedBy")
    private boolean isFollowedBy; // If the target user follows current user back
    
    private long followerCount;
    private long followingCount;
}
