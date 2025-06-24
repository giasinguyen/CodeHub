package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.monitoring.DatabaseHealthIndicator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthController {

    @Autowired
    private DatabaseHealthIndicator databaseHealthIndicator;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        
        // Get database health
        Map<String, Object> dbHealth = databaseHealthIndicator.checkHealth();
        health.put("database", dbHealth);
        
        // Add overall status
        String dbStatus = (String) dbHealth.get("status");
        health.put("status", dbStatus);
        health.put("timestamp", System.currentTimeMillis());
        
        if ("UP".equals(dbStatus)) {
            return ResponseEntity.ok(health);
        } else {
            return ResponseEntity.status(503).body(health);
        }
    }

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> getDatabaseHealth() {
        Map<String, Object> dbHealth = databaseHealthIndicator.checkHealth();
        
        if ("UP".equals(dbHealth.get("status"))) {
            return ResponseEntity.ok(dbHealth);
        } else {
            return ResponseEntity.status(503).body(dbHealth);
        }
    }
}
