package code.hub.codehubbackend.dto.favorite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteStatsResponse {
    private long totalFavorites;
    private long thisWeek;
    private long totalViews;
    private long totalLikes;
    private Map<String, Long> byLanguage;
    private long recentActivity;
}
