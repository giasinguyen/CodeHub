package code.hub.codehubbackend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Long userId;
    private Long totalSnippets;
    private Long totalComments;
    private Long totalLikes;
    private Long likesReceived;
    private Long profileViews;
}
