package code.hub.codehubbackend.monitoring;

import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DatabaseHealthIndicatorTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SnippetRepository snippetRepository;

    @InjectMocks
    private DatabaseHealthIndicator databaseHealthIndicator;

    @Test
    void checkHealth_Success() {
        // Given
        when(userRepository.count()).thenReturn(10L);
        when(snippetRepository.count()).thenReturn(25L);

        // When
        Map<String, Object> health = databaseHealthIndicator.checkHealth();

        // Then
        assertNotNull(health);
        assertEquals("UP", health.get("status"));
        assertEquals(10L, health.get("users"));
        assertEquals(25L, health.get("snippets"));
        assertEquals("Database is accessible", health.get("message"));

        verify(userRepository).count();
        verify(snippetRepository).count();
    }

    @Test
    void checkHealth_DatabaseError() {
        // Given
        when(userRepository.count()).thenThrow(new RuntimeException("Database connection failed"));

        // When
        Map<String, Object> health = databaseHealthIndicator.checkHealth();

        // Then
        assertNotNull(health);
        assertEquals("DOWN", health.get("status"));
        assertEquals("Database connection failed", health.get("error"));
        assertEquals("Database is not accessible", health.get("message"));

        verify(userRepository).count();
        verify(snippetRepository, never()).count();
    }
}
