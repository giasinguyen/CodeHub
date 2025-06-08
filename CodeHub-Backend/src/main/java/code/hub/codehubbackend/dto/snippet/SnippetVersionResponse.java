package code.hub.codehubbackend.dto.snippet;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SnippetVersionResponse {
    
    private Long id;
    private String code;
    private String description;
    private Integer versionNumber;
    private String changeMessage;
    private Instant createdAt;
}
