package code.hub.codehubbackend.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationStatsResponse {
    
    private long unreadCount;
    private long totalCount;
    private long todayCount;
    private long weekCount;
}
