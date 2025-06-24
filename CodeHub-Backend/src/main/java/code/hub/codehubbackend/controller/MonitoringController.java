package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.monitoring.DatabaseHealthIndicator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/monitoring")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MonitoringController {

    @Autowired
    private DatabaseHealthIndicator databaseHealthIndicator;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        
        // Database health
        Map<String, Object> dbHealth = databaseHealthIndicator.checkHealth();
        response.put("database", dbHealth);
        
        // Application health
        response.put("application", Map.of(
            "status", "UP",
            "timestamp", System.currentTimeMillis()
        ));
        
        // Overall status
        String overallStatus = "UP".equals(dbHealth.get("status")) ? "UP" : "DOWN";
        response.put("status", overallStatus);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("app", Map.of(
            "name", "CodeHub Backend",
            "version", "1.0.0",
            "description", "CodeHub Backend API"
        ));
        info.put("java", Map.of(
            "version", System.getProperty("java.version"),
            "vendor", System.getProperty("java.vendor")
        ));
        info.put("build", Map.of(
            "timestamp", System.currentTimeMillis()
        ));
        
        return ResponseEntity.ok(info);
    }
}
