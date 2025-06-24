package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.snippet.SnippetCreateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.entity.Activity;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.mapper.SnippetMapper;
import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.SnippetVersionRepository;
import code.hub.codehubbackend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SnippetServiceTest {

    @Mock
    private SnippetRepository snippetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SnippetVersionRepository versionRepository;

    @Mock
    private SnippetMapper snippetMapper;

    @Mock
    private ActivityService activityService;

    @Mock
    private RecentlyViewedService recentlyViewedService;

    @Mock
    private FileUploadService fileUploadService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SnippetService snippetService;

    private User testUser;
    private Snippet testSnippet;    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        
        // Create test snippet
        testSnippet = new Snippet();
        testSnippet.setId(1L);
        testSnippet.setTitle("Test Snippet");
        testSnippet.setCode("console.log('test');");
        testSnippet.setLanguage("JavaScript");
        testSnippet.setOwner(testUser);
    }

    private void setupSecurityContext() {
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        when(authentication.isAuthenticated()).thenReturn(true);
    }    @Test
    void createSnippet_Success() {
        // Given
        setupSecurityContext();
        SnippetCreateRequest request = new SnippetCreateRequest();
        request.setTitle("Test Snippet");
        request.setCode("console.log('test');");
        request.setLanguage("JavaScript");
        request.setDescription("Test description");
        request.setTags(Arrays.asList("test", "javascript"));

        SnippetResponse expectedResponse = SnippetResponse.builder()
                .id(1L)
                .title("Test Snippet")
                .code("console.log('test');")
                .language("JavaScript")
                .description("Test description")
                .tags(Arrays.asList("test", "javascript"))
                .build();

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(snippetRepository.save(any(Snippet.class))).thenReturn(testSnippet);
        when(snippetMapper.convertToResponse(any(Snippet.class))).thenReturn(expectedResponse);
        when(versionRepository.findMaxVersionNumberBySnippetId(anyLong())).thenReturn(null);
        when(versionRepository.save(any())).thenReturn(null);

        // When
        SnippetResponse result = snippetService.createSnippet(request, Collections.emptyList());

        // Then
        assertNotNull(result);
        assertEquals("Test Snippet", result.getTitle());
        assertEquals("JavaScript", result.getLanguage());
        verify(snippetRepository).save(any(Snippet.class));
        verify(activityService).createSnippetActivity(any(Snippet.class), eq(Activity.ActivityType.SNIPPET_CREATED));
        verify(versionRepository).save(any());
    }@Test
    void getSnippetById_Success() {
        // Given
        Long snippetId = 1L;
        SnippetResponse expectedResponse = SnippetResponse.builder()
                .id(snippetId)
                .title("Test Snippet")
                .build();

        when(snippetRepository.findById(snippetId)).thenReturn(Optional.of(testSnippet));
        when(snippetMapper.convertToResponse(any(Snippet.class))).thenReturn(expectedResponse);

        // When
        SnippetResponse result = snippetService.getSnippetById(snippetId);

        // Then
        assertNotNull(result);
        assertEquals(snippetId, result.getId());
        verify(snippetRepository).save(testSnippet); // incrementViewCount calls save
    }

    @Test
    void getSnippetById_NotFound() {
        // Given
        Long snippetId = 999L;
        when(snippetRepository.findById(snippetId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(ResourceNotFoundException.class, () -> {
            snippetService.getSnippetById(snippetId);
        });
    }    @Test
    void getAllSnippets_Success() {
        // Given
        int page = 0;
        int size = 10;
        String language = null;
        String tag = null;
        String sort = "createdAt";
        Page<Snippet> snippetPage = new PageImpl<>(Arrays.asList(testSnippet));
        SnippetResponse snippetResponse = SnippetResponse.builder()
                .id(1L)
                .title("Test Snippet")
                .build();

        when(snippetRepository.findAll(any(Pageable.class))).thenReturn(snippetPage);
        when(snippetMapper.convertToResponse(any(Snippet.class))).thenReturn(snippetResponse);

        // When
        Page<SnippetResponse> result = snippetService.getAllSnippets(page, size, language, tag, sort);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Test Snippet", result.getContent().get(0).getTitle());
    }    @Test
    void deleteSnippet_Success() {
        // Given
        setupSecurityContext();
        Long snippetId = 1L;
        when(snippetRepository.findById(snippetId)).thenReturn(Optional.of(testSnippet));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        doNothing().when(activityService).deleteActivitiesByTarget(snippetId, "snippet");

        // When
        snippetService.deleteSnippet(snippetId);

        // Then
        verify(snippetRepository).delete(testSnippet);
        verify(activityService).deleteActivitiesByTarget(snippetId, "snippet");
    }    @Test
    void deleteSnippet_NotOwner_ThrowsException() {
        // Given
        setupSecurityContext();
        Long snippetId = 1L;
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("otheruser");
        
        when(snippetRepository.findById(snippetId)).thenReturn(Optional.of(testSnippet));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(otherUser));

        // When & Then
        assertThrows(UnauthorizedException.class, () -> {
            snippetService.deleteSnippet(snippetId);
        });
        
        // Verify that delete was never called
        verify(snippetRepository, never()).delete(any());
        verify(activityService, never()).deleteActivitiesByTarget(anyLong(), anyString());
    }
}
