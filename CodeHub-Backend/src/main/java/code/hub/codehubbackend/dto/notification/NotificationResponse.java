package code.hub.codehubbackend.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    
    private Long id;
    private String type;
    private String title;
    private String message;
    private Long targetId;
    private String targetType;
    private String actionUrl;
    private boolean read;
    private Instant createdAt;
    private Instant readAt;
    private ActorInfo actor;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActorInfo {
        private Long id;
        private String username;
        private String fullName;
        private String avatarUrl;
    }
}
