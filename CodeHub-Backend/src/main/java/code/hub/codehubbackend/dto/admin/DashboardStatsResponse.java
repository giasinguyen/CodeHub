package code.hub.codehubbackend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalUsers;
    private Long totalSnippets;
    private Long totalComments;
    private Long totalLikes;
    private Long totalViews;
    private Long activeUsers;
    private Long newUsersToday;
    private Long newSnippetsToday;
    private Long newCommentsToday;
    private Double averageSnippetsPerUser;
    private Double averageCommentsPerSnippet;
    private String mostPopularLanguage;
    private String mostActiveUser;
}
