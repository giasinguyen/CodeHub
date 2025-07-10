package code.hub.codehubbackend.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentCreateRequest {
    
    @NotBlank(message = "Comment content cannot be empty")
    @Size(min = 1, max = 2000, message = "Comment must be between 1 and 2000 characters")
    private String content;
    
    // For nested comments/replies
    private Long parentCommentId;
    
    // For mentions and formatting
    private String replyToUsername;
}
