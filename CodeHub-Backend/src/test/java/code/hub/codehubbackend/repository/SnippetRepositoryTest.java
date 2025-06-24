package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.util.TestDataBuilder;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class SnippetRepositoryTest {

    @Container
    static MariaDBContainer<?> mariaDB = new MariaDBContainer<>("mariadb:10.6")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SnippetRepository snippetRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.createTestUser();
        testUser = entityManager.persistAndFlush(testUser);
    }

    @Test
    void findByOwner_ReturnsSnippets() {
        // Given
        Snippet snippet1 = TestDataBuilder.createTestSnippet(testUser);
        snippet1.setTitle("Snippet 1");
        entityManager.persistAndFlush(snippet1);

        Snippet snippet2 = TestDataBuilder.createTestSnippet(testUser);
        snippet2.setTitle("Snippet 2");
        entityManager.persistAndFlush(snippet2);

        // When
        List<Snippet> result = snippetRepository.findByOwner(testUser);

        // Then
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(s -> s.getTitle().equals("Snippet 1")));
        assertTrue(result.stream().anyMatch(s -> s.getTitle().equals("Snippet 2")));
    }

    @Test
    void findByLanguage_ReturnsMatchingSnippets() {
        // Given
        Snippet jsSnippet = TestDataBuilder.createTestSnippet(testUser);
        jsSnippet.setLanguage("JavaScript");
        entityManager.persistAndFlush(jsSnippet);

        Snippet pySnippet = TestDataBuilder.createTestSnippet(testUser);
        pySnippet.setLanguage("Python");
        entityManager.persistAndFlush(pySnippet);

        PageRequest pageRequest = PageRequest.of(0, 10);

        // When
        Page<Snippet> result = snippetRepository.findByLanguage("JavaScript", pageRequest);

        // Then
        assertEquals(1, result.getContent().size());
        assertEquals("JavaScript", result.getContent().get(0).getLanguage());
    }    @Test
    void searchByKeyword_ReturnsMatchingSnippets() {
        // Given
        Snippet snippet1 = TestDataBuilder.createTestSnippet(testUser);
        snippet1.setTitle("React Components");
        snippet1.setDescription("React functional components");
        entityManager.persistAndFlush(snippet1);

        Snippet snippet2 = TestDataBuilder.createTestSnippet(testUser);
        snippet2.setTitle("Vue.js Methods");
        snippet2.setDescription("Vue component methods");
        entityManager.persistAndFlush(snippet2);

        PageRequest pageRequest = PageRequest.of(0, 10);

        // When
        Page<Snippet> result = snippetRepository.searchByKeyword("React", pageRequest);

        // Then
        assertEquals(1, result.getContent().size());
        assertEquals("React Components", result.getContent().get(0).getTitle());
    }    @Test
    void findMostLiked_ReturnsOrderedByLikes() {
        // Given
        Snippet snippet1 = TestDataBuilder.createTestSnippet(testUser);
        snippet1.setTitle("Low Likes");
        snippet1.setLikeCount(5L);
        entityManager.persistAndFlush(snippet1);

        Snippet snippet2 = TestDataBuilder.createTestSnippet(testUser);
        snippet2.setTitle("High Likes");
        snippet2.setLikeCount(50L);
        entityManager.persistAndFlush(snippet2);

        PageRequest pageRequest = PageRequest.of(0, 10);

        // When
        Page<Snippet> result = snippetRepository.findMostLiked(pageRequest);

        // Then
        assertEquals(2, result.getContent().size());
        assertEquals("High Likes", result.getContent().get(0).getTitle());
        assertEquals(50L, result.getContent().get(0).getLikeCount());
    }

    @Test
    void findDistinctTags_ReturnsAllTags() {
        // Given
        Snippet snippet1 = TestDataBuilder.createTestSnippet(testUser);
        snippet1.setTags(Arrays.asList("react", "javascript"));
        entityManager.persistAndFlush(snippet1);

        Snippet snippet2 = TestDataBuilder.createTestSnippet(testUser);
        snippet2.setTags(Arrays.asList("python", "flask"));
        entityManager.persistAndFlush(snippet2);

        // When
        List<String> result = snippetRepository.findDistinctTags();

        // Then
        assertTrue(result.contains("react"));
        assertTrue(result.contains("javascript"));
        assertTrue(result.contains("python"));
        assertTrue(result.contains("flask"));
    }

    @Test
    void countByOwner_ReturnsCorrectCount() {
        // Given
        entityManager.persistAndFlush(TestDataBuilder.createTestSnippet(testUser));
        entityManager.persistAndFlush(TestDataBuilder.createTestSnippet(testUser));
        entityManager.persistAndFlush(TestDataBuilder.createTestSnippet(testUser));

        // When
        Long count = snippetRepository.countByOwner(testUser);

        // Then
        assertEquals(3L, count);
    }

    @Test
    void findById_ReturnsSnippet() {
        // Given
        Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
        snippet = entityManager.persistAndFlush(snippet);

        // When
        Optional<Snippet> result = snippetRepository.findById(snippet.getId());

        // Then
        assertTrue(result.isPresent());
        assertEquals(snippet.getTitle(), result.get().getTitle());
    }

    @Test
    void deleteById_RemovesSnippet() {
        // Given
        Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
        snippet = entityManager.persistAndFlush(snippet);
        Long snippetId = snippet.getId();

        // When
        snippetRepository.deleteById(snippetId);
        entityManager.flush();

        // Then
        Optional<Snippet> result = snippetRepository.findById(snippetId);
        assertFalse(result.isPresent());
    }
}
