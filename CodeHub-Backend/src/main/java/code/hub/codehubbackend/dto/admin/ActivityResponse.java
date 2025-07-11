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
public class ActivityResponse {
    private Long id;
    private Long userId;
    private String username;
    private String type;
    private String description;
    private String userUsername;
    private String userEmail;
    private String activityType;
    private Instant timestamp;
    private String details;
    private String ipAddress;
    private String userAgent;
}
