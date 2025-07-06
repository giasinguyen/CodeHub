package code.hub.codehubbackend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SnippetModerationResponse {
    private Long id;
    private String title;
    private String description;
    private String language;
    private String authorUsername;
    private String authorEmail;
    private Instant createdAt;
    private Instant updatedAt;
    private Long viewsCount;
    private Long likesCount;
    private Long commentsCount;
    private boolean isPublic;
    private boolean flagged;
    private String flagReason;
    private String codePreview; // First 200 characters
}
