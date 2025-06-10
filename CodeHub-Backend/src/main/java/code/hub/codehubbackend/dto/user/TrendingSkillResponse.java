package code.hub.codehubbackend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendingSkillResponse {
    
    private String name;
    private Long count;
    private Double growthRate;
    private Integer hotness; // 1-5 scale
    private String category;
}
