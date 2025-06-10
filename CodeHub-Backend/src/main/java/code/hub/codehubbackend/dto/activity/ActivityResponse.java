package code.hub.codehubbackend.dto.activity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    
    private Long id;
    private String type;
    private Long targetId;
    private String targetType;
    private Map<String, Object> data; // Parsed metadata
    private LocalDateTime createdAt;
    
    // User information
    private UserInfo user;
    
    @Data
    @Builder
    @NoArgsConstructor 
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String username;
        private String fullName;
        private String avatarUrl;
    }
}
