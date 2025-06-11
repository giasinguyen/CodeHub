package code.hub.codehubbackend.dto.trending;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendingStatsResponse {
    
    private Long totalSnippets;
    private Long totalDevelopers;
    private Long totalLikes;
    private Long totalViews;
    private Long totalComments;
    private Long todaySnippets;
    private Long weekSnippets;
    private Long monthSnippets;
    private Double snippetGrowthRate;
    private Double developerGrowthRate;
    private Double engagementRate;
    private String mostPopularLanguage;
    private String mostActiveUser;
    private Long mostLikedSnippetId;
    private String trendingPeriod;
}
