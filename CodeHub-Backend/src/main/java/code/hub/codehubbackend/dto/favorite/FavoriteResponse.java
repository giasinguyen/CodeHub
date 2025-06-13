package code.hub.codehubbackend.dto.favorite;

import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {
    private Long id;
    private SnippetResponse snippet;
    private Instant favoritedAt;
    private String notes;
    private String category;
    private boolean isBookmarked;
    private String priority;
}
