package code.hub.codehubbackend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityStatsResponse {
    
    private Long totalDevelopers;
    private Long totalSnippets;
    private Long totalContributions;
    private Long activeDevelopers;
    private Double averageRating;
    private String mostActiveCountry;
    private String trendingSkill;
}
