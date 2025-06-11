package code.hub.codehubbackend.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User statistics response")
public class UserStatsResponse {

    @Schema(description = "Number of followers", example = "150")
    private Long followersCount;

    @Schema(description = "Number of users following", example = "75")
    private Long followingCount;

    @Schema(description = "Number of code snippets created", example = "42")
    private Long snippetsCount;

    @Schema(description = "Total likes received on snippets", example = "320")
    private Long totalLikes;

    @Schema(description = "Total views on snippets", example = "1250")
    private Long totalViews;

    @Schema(description = "Total comments received", example = "89")
    private Long totalComments;

    // Constructors
    public UserStatsResponse() {}

    public UserStatsResponse(Long followersCount, Long followingCount, Long snippetsCount, 
                           Long totalLikes, Long totalViews, Long totalComments) {
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.snippetsCount = snippetsCount;
        this.totalLikes = totalLikes;
        this.totalViews = totalViews;
        this.totalComments = totalComments;
    }

    // Getters and Setters
    public Long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(Long followersCount) {
        this.followersCount = followersCount;
    }

    public Long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(Long followingCount) {
        this.followingCount = followingCount;
    }

    public Long getSnippetsCount() {
        return snippetsCount;
    }

    public void setSnippetsCount(Long snippetsCount) {
        this.snippetsCount = snippetsCount;
    }

    public Long getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(Long totalLikes) {
        this.totalLikes = totalLikes;
    }

    public Long getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(Long totalViews) {
        this.totalViews = totalViews;
    }

    public Long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(Long totalComments) {
        this.totalComments = totalComments;
    }
}
