package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.LanguageStatsResponse;
import code.hub.codehubbackend.dto.snippet.SnippetCreateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.dto.snippet.SnippetUpdateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetVersionResponse;
import code.hub.codehubbackend.entity.*;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.mapper.SnippetMapper;
import code.hub.codehubbackend.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SnippetService {
    
    @Autowired
    private SnippetRepository snippetRepository;
      @Autowired
    private SnippetVersionRepository versionRepository;
    
    @Autowired
    private FileUploadService fileUploadService;
      @Autowired
    private ActivityService activityService;
      @Autowired
    private RecentlyViewedService recentlyViewedService;
    
    @Autowired
    private SnippetMapper snippetMapper;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<SnippetResponse> getAllSnippets(int page, int size, String language, String tag, String sort) {
        Sort sortBy = switch (sort) {
            case "likes" -> Sort.by(Sort.Direction.DESC, "likeCount");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCount");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
        
        Pageable pageable = PageRequest.of(page, size, sortBy);
        Page<Snippet> snippets;
        
        if (language != null && tag != null) {
            snippets = snippetRepository.findByLanguageAndTag(language, tag, pageable);
        } else if (language != null) {
            snippets = snippetRepository.findByLanguageIgnoreCase(language, pageable);
        } else {
            snippets = snippetRepository.findAll(pageable);        }
        
        return snippets.map(snippetMapper::convertToResponse);
    }public SnippetResponse getSnippetById(Long id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", id));
          // Increment view count
        snippet.incrementViewCount();
        snippetRepository.save(snippet);
        
        return snippetMapper.convertToResponse(snippet);
    }    @Transactional
    @CacheEvict(value = {"languages", "tags", "mostLiked", "mostViewed"}, allEntries = true)
    public SnippetResponse createSnippet(SnippetCreateRequest request, List<MultipartFile> files) {
        User currentUser = getCurrentUser();
        
        // Upload files if provided
        List<String> mediaUrls = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            mediaUrls = fileUploadService.uploadFiles(files);
        }
        
        // Also include any mediaUrls from the request (if any were provided)
        if (request.getMediaUrls() != null && !request.getMediaUrls().isEmpty()) {
            mediaUrls.addAll(request.getMediaUrls());
        }
        
        Snippet snippet = Snippet.builder()
                .title(request.getTitle())
                .code(request.getCode())
                .language(request.getLanguage())
                .description(request.getDescription())
                .tags(request.getTags() != null ? request.getTags() : List.of())
                .mediaUrls(mediaUrls)
                .owner(currentUser)
                .build();
          snippet = snippetRepository.save(snippet);
          // Create initial version
        createVersion(snippet, snippet.getCode(), snippet.getDescription(), "Initial version");
          // Create activity for snippet creation
        activityService.createSnippetActivity(snippet, Activity.ActivityType.SNIPPET_CREATED);
        
        return snippetMapper.convertToResponse(snippet);
    }@Transactional
    @CacheEvict(value = {"languages", "tags", "mostLiked", "mostViewed"}, allEntries = true)
    public SnippetResponse updateSnippet(Long id, SnippetUpdateRequest request, List<MultipartFile> files) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", id));
        
        User currentUser = getCurrentUser();
        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only update your own snippets");
        }
        
        // Create version before updating
        createVersion(snippet, snippet.getCode(), snippet.getDescription(), 
                     request.getChangeMessage() != null ? request.getChangeMessage() : "Updated");
        
        // Upload new files if provided
        if (files != null && !files.isEmpty()) {
            List<String> newMediaUrls = fileUploadService.uploadFiles(files);
            snippet.getMediaUrls().addAll(newMediaUrls);
        }        // Update snippet
        snippet.setTitle(request.getTitle());
        snippet.setCode(request.getCode());
        snippet.setLanguage(request.getLanguage());
        snippet.setDescription(request.getDescription());
        snippet.setTags(request.getTags());
        
        snippet = snippetRepository.save(snippet);
          // Create activity for snippet update
        activityService.createSnippetActivity(snippet, Activity.ActivityType.SNIPPET_UPDATED);
        
        return snippetMapper.convertToResponse(snippet);
    }    @Transactional
    @CacheEvict(value = {"languages", "tags", "mostLiked", "mostViewed"}, allEntries = true)
    public void deleteSnippet(Long id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", id));
          User currentUser = getCurrentUser();
        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own snippets");
        }
        
        // Delete related activities before deleting snippet
        activityService.deleteActivitiesByTarget(id, "snippet");
        
        snippetRepository.delete(snippet);
    }
    
    public List<SnippetVersionResponse> getSnippetVersions(Long snippetId) {
        List<SnippetVersion> versions = versionRepository.findBySnippetIdOrderByVersionNumberDesc(snippetId);        return versions.stream()
                .map(this::convertVersionToResponse)
                .collect(Collectors.toList());
    }
      @Transactional
    public SnippetResponse revertToVersion(Long snippetId, Long versionId) {
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", snippetId));
        
        User currentUser = getCurrentUser();
        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only revert your own snippets");
        }
        
        SnippetVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new ResourceNotFoundException("SnippetVersion", "id", versionId));
        
        // Create new version before reverting
        createVersion(snippet, snippet.getCode(), snippet.getDescription(), 
                     "Reverted to version " + version.getVersionNumber());
        
        // Revert to selected version
        snippet.setCode(version.getCode());
        snippet.setDescription(version.getDescription());
          snippet = snippetRepository.save(snippet);
        return snippetMapper.convertToResponse(snippet);
    }    @Cacheable("languages")
    public List<String> getAvailableLanguages() {
        return snippetRepository.findDistinctLanguages();
    }
      @Cacheable("languageStats")
    public List<LanguageStatsResponse> getLanguageStats() {
        try {
            List<Object[]> results = snippetRepository.findLanguagesWithCount();
            return results.stream()
                    .map(result -> {
                        String language = (String) result[0];
                        Number count = (Number) result[1];
                        return new LanguageStatsResponse(language, count.longValue());
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error getting language stats: ", e);
            return new ArrayList<>();
        }
    }
    
    @Cacheable("tags")
    public List<String> getAvailableTags() {
        return snippetRepository.findDistinctTags();
    }
    
    private void createVersion(Snippet snippet, String code, String description, String changeMessage) {
        Integer nextVersionNumber = versionRepository.findMaxVersionNumberBySnippetId(snippet.getId());
        if (nextVersionNumber == null) {
            nextVersionNumber = 1;
        } else {
            nextVersionNumber++;
        }
        
        SnippetVersion version = SnippetVersion.builder()
                .snippet(snippet)
                .code(code)
                .description(description)
                .versionNumber(nextVersionNumber)
                .changeMessage(changeMessage)
                .build();
        
        versionRepository.save(version);
    }
      private SnippetVersionResponse convertVersionToResponse(SnippetVersion version) {
        return SnippetVersionResponse.builder()
                .id(version.getId())
                .code(version.getCode())
                .description(version.getDescription())
                .versionNumber(version.getVersionNumber())
                .changeMessage(version.getChangeMessage())
                .createdAt(version.getCreatedAt())
                .build();    }
      public Page<SnippetResponse> searchSnippets(String keyword, int page, int size, String sort) {
        Sort sortBy = switch (sort) {
            case "likes" -> Sort.by(Sort.Direction.DESC, "likeCount");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCount");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
          Pageable pageable = PageRequest.of(page, size, sortBy);
        Page<Snippet> snippets = snippetRepository.searchByKeyword(keyword, pageable);
        
        return snippets.map(snippetMapper::convertToResponse);
    }    @Cacheable(value = "mostLiked", key = "#page + '_' + #size")
    public Page<SnippetResponse> getMostLikedSnippets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Snippet> snippets = snippetRepository.findMostLiked(pageable);
        return snippets.map(snippetMapper::convertToResponse);
    }
      @Cacheable(value = "mostViewed", key = "#page + '_' + #size")
    public Page<SnippetResponse> getMostViewedSnippets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Snippet> snippets = snippetRepository.findMostViewed(pageable);
        return snippets.map(snippetMapper::convertToResponse);
    }
    
    // =============== RECENTLY VIEWED API METHODS ===============    @Transactional
    public void recordSnippetView(Long snippetId) {
        User currentUser = getCurrentUser();
        
        // Kiểm tra snippet có tồn tại không (không cần lưu reference)
        if (!snippetRepository.existsById(snippetId)) {
            throw new ResourceNotFoundException("Snippet not found");
        }        // Use recently viewed service
        try {
            recentlyViewedService.recordView(currentUser, snippetId);
        } catch (Exception e) {
            // Log error nhưng không throw exception để không ảnh hưởng đến business logic chính
            log.warn("Failed to record recently viewed for user {} and snippet {}: {}", 
                     currentUser.getId(), snippetId, e.getMessage());
        }
        
        // Increment snippet view count trong transaction riêng để tránh conflict
        incrementSnippetViewCount(snippetId);
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private void incrementSnippetViewCount(Long snippetId) {
        try {
            snippetRepository.incrementViewCount(snippetId);
        } catch (Exception e) {
            log.warn("Failed to increment view count for snippet {}: {}", snippetId, e.getMessage());
        }
    }    public Page<SnippetResponse> getRecentlyViewedSnippets(int page, int size) {
        User currentUser = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
          Page<RecentlyViewed> recentViews = recentlyViewedService.getRecentlyViewedByUser(currentUser, pageable);
        return recentViews.map(recentView -> snippetMapper.convertToResponse(recentView.getSnippet()));
    }
      @Transactional
    public void removeFromRecentlyViewed(Long snippetId) {
        User currentUser = getCurrentUser();
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet not found"));
        
        recentlyViewedService.removeFromRecentlyViewed(currentUser, snippet);
    }
    
    @Transactional
    public void clearRecentlyViewed() {
        User currentUser = getCurrentUser();
        recentlyViewedService.clearRecentlyViewed(currentUser);
    }
    
    // =============== HELPER METHODS ===============
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {            throw new UnauthorizedException("User not authenticated");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    @SuppressWarnings("unused")
    private double calculatePercentage(Long count) {
        Long totalSnippets = snippetRepository.count();
        if (totalSnippets == 0) return 0.0;
        return (count.doubleValue() / totalSnippets.doubleValue()) * 100.0;
    }
}
