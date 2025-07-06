package code.hub.codehubbackend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemHealthResponse {
    private String status;
    private Long uptime;
    private String version;
    private DatabaseHealth database;
    private SystemResources resources;
    private Map<String, Object> metrics;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DatabaseHealth {
        private String status;
        private Long totalConnections;
        private Long activeConnections;
        private Long idleConnections;
        private Double avgResponseTime;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemResources {
        private Double cpuUsage;
        private Double memoryUsage;
        private Double diskUsage;
        private Long totalMemory;
        private Long freeMemory;
        private Long totalDiskSpace;
        private Long freeDiskSpace;
    }
}
