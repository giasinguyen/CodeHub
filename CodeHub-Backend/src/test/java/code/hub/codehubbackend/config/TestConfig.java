package code.hub.codehubbackend.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.context.ActiveProfiles;

@TestConfiguration
@ActiveProfiles("test")
public class TestConfig {
    // Test configuration beans go here if needed
    // passwordEncoder bean is already provided by SecurityConfig
}
