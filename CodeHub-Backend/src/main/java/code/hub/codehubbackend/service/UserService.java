package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.dto.user.UserProfileResponse;
import code.hub.codehubbackend.dto.user.UserUpdateRequest;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SnippetRepository snippetRepository;
    
    @Autowired
    private SnippetService snippetService;
    
    public UserProfileResponse getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        return convertToProfileResponse(currentUser);
    }
    
    public UserProfileResponse getUserProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return convertToProfileResponse(user);
    }
      @Transactional
    public UserProfileResponse updateUserProfile(UserUpdateRequest request) {
        User currentUser = getCurrentUser();
        
        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email is already in use");
            }
            currentUser.setEmail(request.getEmail());
        }
        
        if (request.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(request.getAvatarUrl());
        }
        
        if (request.getCoverPhotoUrl() != null) {
            currentUser.setCoverPhotoUrl(request.getCoverPhotoUrl());
        }
        
        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }
        
        if (request.getFullName() != null) {
            currentUser.setFullName(request.getFullName());
        }
        
        if (request.getLocation() != null) {
            currentUser.setLocation(request.getLocation());
        }
        
        if (request.getWebsiteUrl() != null) {
            currentUser.setWebsiteUrl(request.getWebsiteUrl());
        }
        
        if (request.getGithubUrl() != null) {
            currentUser.setGithubUrl(request.getGithubUrl());
        }
        
        if (request.getTwitterUrl() != null) {
            currentUser.setTwitterUrl(request.getTwitterUrl());
        }
        
        if (request.getLinkedinUrl() != null) {
            currentUser.setLinkedinUrl(request.getLinkedinUrl());
        }
        
        currentUser = userRepository.save(currentUser);
        return convertToProfileResponse(currentUser);
    }
    
    public Page<SnippetResponse> getUserSnippets(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Snippet> snippets = snippetRepository.findByOwner(user, pageable);
        
        return snippets.map(snippet -> snippetService.convertToResponse(snippet));
    }
    
    public Page<SnippetResponse> getCurrentUserSnippets(int page, int size) {
        User currentUser = getCurrentUser();
        return getUserSnippets(currentUser.getId(), page, size);
    }
      private UserProfileResponse convertToProfileResponse(User user) {
        // Calculate user statistics
        Long snippetCount = snippetRepository.countByOwner(user);
        Long totalLikes = snippetRepository.sumLikesByOwner(user);
        Long totalViews = snippetRepository.sumViewsByOwner(user);
        
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .coverPhotoUrl(user.getCoverPhotoUrl())
                .bio(user.getBio())
                .fullName(user.getFullName())
                .location(user.getLocation())
                .websiteUrl(user.getWebsiteUrl())
                .githubUrl(user.getGithubUrl())
                .twitterUrl(user.getTwitterUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .createdAt(user.getCreatedAt())
                .snippetCount(snippetCount != null ? snippetCount : 0L)
                .totalLikes(totalLikes != null ? totalLikes : 0L)
                .totalViews(totalViews != null ? totalViews : 0L)
                .build();
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return (User) authentication.getPrincipal();
    }
}
