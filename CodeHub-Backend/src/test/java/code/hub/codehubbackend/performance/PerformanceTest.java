package code.hub.codehubbackend.performance;

import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.UserRepository;
import code.hub.codehubbackend.util.TestDataBuilder;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@TestPropertySource(properties = {
    "cloudinary.cloud-name=test-cloud",
    "cloudinary.api-key=test-api-key", 
    "cloudinary.api-secret=test-api-secret"
})
public class PerformanceTest {

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testBulkSnippetCreation() {
        // Given
        User testUser = TestDataBuilder.createTestUser();
        testUser = userRepository.save(testUser);

        StopWatch stopWatch = new StopWatch();
        int numberOfSnippets = 1000;

        // When
        stopWatch.start();
        List<Snippet> snippets = new ArrayList<>();
        for (int i = 0; i < numberOfSnippets; i++) {
            Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
            snippet.setTitle("Performance Test Snippet " + i);
            snippets.add(snippet);
        }
        snippetRepository.saveAll(snippets);
        stopWatch.stop();

        // Then
        long executionTime = stopWatch.getTotalTimeMillis();
        System.out.println("Bulk creation of " + numberOfSnippets + " snippets took: " + executionTime + "ms");
        
        // Assert reasonable performance (should complete within 5 seconds)
        assertTrue(executionTime < TimeUnit.SECONDS.toMillis(5), 
                "Bulk creation took too long: " + executionTime + "ms");
        
        // Verify all snippets were created
        assertEquals(numberOfSnippets, snippetRepository.countByOwner(testUser));
    }

    @Test
    void testPaginatedSnippetRetrieval() {
        // Given
        User testUser = TestDataBuilder.createTestUser();
        testUser = userRepository.save(testUser);

        // Create test data
        List<Snippet> snippets = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
            snippet.setTitle("Paginated Test Snippet " + i);
            snippets.add(snippet);
        }
        snippetRepository.saveAll(snippets);

        StopWatch stopWatch = new StopWatch();

        // When
        stopWatch.start();
        Page<Snippet> page1 = snippetRepository.findAll(PageRequest.of(0, 20));
        Page<Snippet> page2 = snippetRepository.findAll(PageRequest.of(1, 20));
        Page<Snippet> page3 = snippetRepository.findAll(PageRequest.of(2, 20));
        stopWatch.stop();

        // Then
        long executionTime = stopWatch.getTotalTimeMillis();
        System.out.println("Paginated retrieval took: " + executionTime + "ms");

        // Assert reasonable performance (should complete within 1 second)
        assertTrue(executionTime < TimeUnit.SECONDS.toMillis(1),
                "Paginated retrieval took too long: " + executionTime + "ms");

        // Verify pagination works correctly
        assertEquals(20, page1.getContent().size());
        assertEquals(20, page2.getContent().size());
        assertEquals(20, page3.getContent().size());
        assertTrue(page1.getTotalElements() >= 100);
    }

    @Test
    void testSnippetSearchPerformance() {
        // Given
        User testUser = TestDataBuilder.createTestUser();
        testUser = userRepository.save(testUser);

        // Create test data with searchable content
        List<Snippet> snippets = new ArrayList<>();
        for (int i = 0; i < 500; i++) {
            Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
            snippet.setTitle("Search Test " + (i % 10)); // Creates patterns for searching
            snippet.setDescription("This is a test snippet for search performance " + i);
            snippets.add(snippet);
        }
        snippetRepository.saveAll(snippets);

        StopWatch stopWatch = new StopWatch();        // When
        stopWatch.start();
        Page<Snippet> searchResults = snippetRepository.searchByKeyword(
                "Search Test", PageRequest.of(0, 20));
        stopWatch.stop();

        // Then
        long executionTime = stopWatch.getTotalTimeMillis();
        System.out.println("Search operation took: " + executionTime + "ms");

        // Assert reasonable performance (should complete within 500ms)
        assertTrue(executionTime < 500,
                "Search took too long: " + executionTime + "ms");

        // Verify search results
        assertFalse(searchResults.getContent().isEmpty());
        assertTrue(searchResults.getTotalElements() > 0);
    }

    @Test
    void testConcurrentSnippetAccess() throws InterruptedException {
        // Given
        User testUser = TestDataBuilder.createTestUser();
        testUser = userRepository.save(testUser);

        Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
        snippet = snippetRepository.save(snippet);

        final Long snippetId = snippet.getId();
        final int numberOfThreads = 10;
        final int operationsPerThread = 5;

        List<Thread> threads = new ArrayList<>();
        StopWatch stopWatch = new StopWatch();

        // When
        stopWatch.start();
        for (int i = 0; i < numberOfThreads; i++) {
            Thread thread = new Thread(() -> {
                for (int j = 0; j < operationsPerThread; j++) {
                    snippetRepository.findById(snippetId);
                }
            });
            threads.add(thread);
            thread.start();
        }

        // Wait for all threads to complete
        for (Thread thread : threads) {
            thread.join();
        }
        stopWatch.stop();

        // Then
        long executionTime = stopWatch.getTotalTimeMillis();
        System.out.println("Concurrent access (" + numberOfThreads + " threads, " + 
                operationsPerThread + " ops each) took: " + executionTime + "ms");

        // Assert reasonable performance (should complete within 2 seconds)
        assertTrue(executionTime < TimeUnit.SECONDS.toMillis(2),
                "Concurrent access took too long: " + executionTime + "ms");
    }
}
