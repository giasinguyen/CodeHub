package code.hub.codehubbackend.monitoring;

import code.hub.codehubbackend.repository.UserRepository;
import code.hub.codehubbackend.repository.SnippetRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DatabaseHealthIndicator {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SnippetRepository snippetRepository;

    public Map<String, Object> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Test database connectivity by counting records
            long userCount = userRepository.count();
            long snippetCount = snippetRepository.count();

            health.put("status", "UP");
            health.put("users", userCount);
            health.put("snippets", snippetCount);
            health.put("message", "Database is accessible");
            
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            health.put("message", "Database is not accessible");
        }
        
        return health;
    }
}
