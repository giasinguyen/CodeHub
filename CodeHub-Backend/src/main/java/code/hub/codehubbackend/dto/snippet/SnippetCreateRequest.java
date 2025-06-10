package code.hub.codehubbackend.dto.snippet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class SnippetCreateRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Code is required")
    private String code;
    
    @Size(max = 50, message = "Language must not exceed 50 characters")
    private String language;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private List<String> tags;
    
    // For now, accept visibility but don't use it until we implement the feature
    private String visibility;
    
    // Media URLs for uploaded files
    private List<String> mediaUrls;
}
