package code.hub.codehubbackend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
    private String avatarUrl;
    
    @Size(max = 500, message = "Cover photo URL must not exceed 500 characters")
    private String coverPhotoUrl;
    
    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;
    
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;
    
    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;
    
    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    private String websiteUrl;
    
    @Size(max = 255, message = "GitHub URL must not exceed 255 characters")
    private String githubUrl;
    
    @Size(max = 255, message = "Twitter URL must not exceed 255 characters")
    private String twitterUrl;
    
    @Size(max = 255, message = "LinkedIn URL must not exceed 255 characters")
    private String linkedinUrl;
}
