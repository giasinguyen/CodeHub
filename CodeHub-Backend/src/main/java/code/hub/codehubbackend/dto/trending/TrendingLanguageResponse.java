package code.hub.codehubbackend.dto.trending;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendingLanguageResponse {
    
    private String name;
    private String displayName;
    private String color;
    private Long snippetCount;
    private Double growthRate;
    private Integer rank;
    private Integer previousRank;
    private Long weeklyGrowth;
    private Double marketShare;
    private String category;
    private Boolean isRising;
}
