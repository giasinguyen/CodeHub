package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.snippet.SnippetCreateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.dto.snippet.SnippetUpdateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetVersionResponse;
import code.hub.codehubbackend.entity.*;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.repository.*;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SnippetService {
    
    @Autowired
    private SnippetRepository snippetRepository;
    
    @Autowired
    private SnippetVersionRepository versionRepository;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private FileUploadService fileUploadService;
    
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
            snippets = snippetRepository.findAll(pageable);
        }
        
        return snippets.map(this::convertToResponse);
    }    public SnippetResponse getSnippetById(Long id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", id));
        
        // Increment view count
        snippet.incrementViewCount();
        snippetRepository.save(snippet);
        
        return convertToResponse(snippet);
    }
      @Transactional
    @CacheEvict(value = {"languages", "tags", "mostLiked", "mostViewed"}, allEntries = true)
    public SnippetResponse createSnippet(SnippetCreateRequest request, List<MultipartFile> files) {
        User currentUser = getCurrentUser();
        
        // Upload files if provided
        List<String> mediaUrls = null;
        if (files != null && !files.isEmpty()) {
            mediaUrls = fileUploadService.uploadFiles(files);
        }
        
        Snippet snippet = Snippet.builder()
                .title(request.getTitle())
                .code(request.getCode())
                .language(request.getLanguage())
                .description(request.getDescription())
                .tags(request.getTags())
                .mediaUrls(mediaUrls != null ? mediaUrls : List.of())
                .owner(currentUser)
                .build();
          snippet = snippetRepository.save(snippet);
        
        // Create initial version
        createVersion(snippet, snippet.getCode(), snippet.getDescription(), "Initial version");
        
        return convertToResponse(snippet);
    }    @Transactional
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
        }
          // Update snippet
        snippet.setTitle(request.getTitle());
        snippet.setCode(request.getCode());
        snippet.setLanguage(request.getLanguage());
        snippet.setDescription(request.getDescription());
        snippet.setTags(request.getTags());
        
        snippet = snippetRepository.save(snippet);
        return convertToResponse(snippet);
    }    @Transactional
    @CacheEvict(value = {"languages", "tags", "mostLiked", "mostViewed"}, allEntries = true)
    public void deleteSnippet(Long id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", id));
        
        User currentUser = getCurrentUser();
        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own snippets");
        }
        
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
        return convertToResponse(snippet);
    }
      @Cacheable("languages")
    public List<String> getAvailableLanguages() {
        return snippetRepository.findDistinctLanguages();
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
                .build();
    }
      private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        // Check if the principal is actually a User object
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        
        // For anonymous users or other cases, return null
        return null;
    }
    
    // Public method for UserService to use
    public SnippetResponse convertToResponse(Snippet snippet) {
        User currentUser = getCurrentUser();
        boolean isLiked = currentUser != null && 
                         likeRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippet.getId());
        
        long commentCount = commentRepository.countBySnippetId(snippet.getId());
        
        return SnippetResponse.builder()
                .id(snippet.getId())
                .title(snippet.getTitle())
                .code(snippet.getCode())
                .language(snippet.getLanguage())
                .description(snippet.getDescription())
                .mediaUrls(snippet.getMediaUrls())
                .tags(snippet.getTags())
                .owner(SnippetResponse.UserSummary.builder()
                        .id(snippet.getOwner().getId())
                        .username(snippet.getOwner().getUsername())
                        .avatarUrl(snippet.getOwner().getAvatarUrl())
                        .build())
                .createdAt(snippet.getCreatedAt())
                .updatedAt(snippet.getUpdatedAt())
                .viewCount(snippet.getViewCount())
                .likeCount(snippet.getLikeCount())
                .commentCount(commentCount)
                .isLiked(isLiked)
                .build();
    }

    public Page<SnippetResponse> searchSnippets(String keyword, int page, int size, String sort) {
        Sort sortBy = switch (sort) {
            case "likes" -> Sort.by(Sort.Direction.DESC, "likeCount");
            case "views" -> Sort.by(Sort.Direction.DESC, "viewCount");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
        
        Pageable pageable = PageRequest.of(page, size, sortBy);
        Page<Snippet> snippets = snippetRepository.searchByKeyword(keyword, pageable);
        
        return snippets.map(this::convertToResponse);
    }
      @Cacheable(value = "mostLiked", key = "#page + '_' + #size")
    public Page<SnippetResponse> getMostLikedSnippets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Snippet> snippets = snippetRepository.findMostLiked(pageable);
        return snippets.map(this::convertToResponse);
    }
    
    @Cacheable(value = "mostViewed", key = "#page + '_' + #size")
    public Page<SnippetResponse> getMostViewedSnippets(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Snippet> snippets = snippetRepository.findMostViewed(pageable);
        return snippets.map(this::convertToResponse);
    }
}
