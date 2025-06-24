package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.config.TestConfig;
import code.hub.codehubbackend.dto.snippet.SnippetCreateRequest;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.UserRepository;
import code.hub.codehubbackend.security.JwtUtils;
import code.hub.codehubbackend.util.TestDataBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
@Transactional
@TestPropertySource(properties = {
    "cloudinary.cloud-name=test-cloud",
    "cloudinary.api-key=test-api-key", 
    "cloudinary.api-secret=test-api-secret"
})
public class SnippetControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private SnippetRepository snippetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private User testUser;
    private String jwtToken;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Create and save test user
        testUser = TestDataBuilder.createTestUser();
        testUser = userRepository.save(testUser);

        // Generate JWT token
        jwtToken = jwtUtils.generateTokenFromUsername(testUser.getUsername());
    }

    @Test
    void createSnippet_Success() throws Exception {
        // Given
        SnippetCreateRequest request = new SnippetCreateRequest();
        request.setTitle("Integration Test Snippet");
        request.setCode("console.log('integration test');");
        request.setLanguage("JavaScript");
        request.setDescription("Integration test description");
        request.setTags(Arrays.asList("test", "integration"));

        // When & Then
        mockMvc.perform(post("/api/snippets")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration Test Snippet"))
                .andExpect(jsonPath("$.language").value("JavaScript"))
                .andExpect(jsonPath("$.owner.username").value("testuser"));
    }

    @Test
    void getSnippetById_Success() throws Exception {
        // Given
        Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
        snippet = snippetRepository.save(snippet);

        // When & Then
        mockMvc.perform(get("/api/snippets/{id}", snippet.getId())
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(snippet.getId()))
                .andExpect(jsonPath("$.title").value("Test Snippet"));
    }

    @Test
    void getSnippetById_NotFound() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/snippets/{id}", 999L)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllSnippets_Success() throws Exception {
        // Given
        Snippet snippet1 = TestDataBuilder.createTestSnippet(testUser);
        snippet1.setTitle("Snippet 1");
        snippetRepository.save(snippet1);

        Snippet snippet2 = TestDataBuilder.createTestSnippet(testUser);
        snippet2.setTitle("Snippet 2");
        snippetRepository.save(snippet2);

        // When & Then
        mockMvc.perform(get("/api/snippets")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    @WithMockUser(username = "testuser", roles = "USER")
    void deleteSnippet_Success() throws Exception {
        // Given
        Snippet snippet = TestDataBuilder.createTestSnippet(testUser);
        snippet = snippetRepository.save(snippet);

        // When & Then
        mockMvc.perform(delete("/api/snippets/{id}", snippet.getId())
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void createSnippet_Unauthorized() throws Exception {
        // Given
        SnippetCreateRequest request = new SnippetCreateRequest();
        request.setTitle("Unauthorized Test");
        request.setCode("console.log('unauthorized');");
        request.setLanguage("JavaScript");        // When & Then - Spring Security returns 403 for method-level security failures
        mockMvc.perform(post("/api/snippets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createSnippet_InvalidInput() throws Exception {
        // Given - Request with missing required fields
        SnippetCreateRequest request = new SnippetCreateRequest();
        // Missing title and code

        // When & Then
        mockMvc.perform(post("/api/snippets")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
