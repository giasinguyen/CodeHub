package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.favorite.*;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.entity.Favorite;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.FavoriteRepository;
import code.hub.codehubbackend.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    
    @Autowired
    private FavoriteRepository favoriteRepository;
    
    @Autowired
    private SnippetRepository snippetRepository;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private SnippetService snippetService;
    
    @Transactional
    public boolean toggleFavorite(Long snippetId, String notes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to favorite snippets");
        }
        
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));
        
        boolean exists = favoriteRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippetId);
        
        if (exists) {
            // Remove from favorites
            favoriteRepository.deleteByUserIdAndSnippetId(currentUser.getId(), snippetId);
            
            // Create unfavorite activity
            activityService.createFavoriteActivity(snippet, false);
            
            return false;
        } else {
            // Add to favorites
            Favorite favorite = Favorite.builder()
                    .id(new Favorite.FavoriteKey(currentUser.getId(), snippetId))
                    .user(currentUser)
                    .snippet(snippet)
                    .notes(notes)
                    .build();
            
            favoriteRepository.save(favorite);
            
            // Create favorite activity
            activityService.createFavoriteActivity(snippet, true);
            
            return true;
        }
    }
    
    @Transactional
    public void addFavorite(Long snippetId, String notes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to favorite snippets");
        }
        
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));
        
        if (favoriteRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippetId)) {
            throw new RuntimeException("Snippet is already in favorites");
        }
        
        Favorite favorite = Favorite.builder()
                .id(new Favorite.FavoriteKey(currentUser.getId(), snippetId))
                .user(currentUser)
                .snippet(snippet)
                .notes(notes)
                .build();
        
        favoriteRepository.save(favorite);
        
        // Create favorite activity
        activityService.createFavoriteActivity(snippet, true);
    }
    
    @Transactional
    public void removeFavorite(Long snippetId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to manage favorites");
        }
        
        if (!favoriteRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippetId)) {
            throw new RuntimeException("Snippet is not in favorites");
        }
        
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));
        
        favoriteRepository.deleteByUserIdAndSnippetId(currentUser.getId(), snippetId);
        
        // Create unfavorite activity
        activityService.createFavoriteActivity(snippet, false);
    }
    
    public Page<FavoriteResponse> getUserFavorites(Pageable pageable) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to view favorites");
        }
        
        Page<Favorite> favorites = favoriteRepository.findByUserId(currentUser.getId(), pageable);
        
        List<FavoriteResponse> favoriteResponses = favorites.getContent().stream()
                .map(this::convertToFavoriteResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(favoriteResponses, pageable, favorites.getTotalElements());
    }
    
    public FavoriteStatusResponse getFavoriteStatus(Long snippetId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return FavoriteStatusResponse.builder().isFavorited(false).build();
        }
        
        boolean isFavorited = favoriteRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippetId);
        return FavoriteStatusResponse.builder().isFavorited(isFavorited).build();
    }
    
    public FavoriteStatsResponse getFavoriteStats() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to view favorite stats");
        }
        
        List<Favorite> userFavorites = favoriteRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        
        // Calculate stats
        long totalFavorites = userFavorites.size();
        
        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        long thisWeek = userFavorites.stream()
                .filter(f -> f.getCreatedAt().isAfter(weekAgo))
                .count();
        
        long totalViews = userFavorites.stream()
                .mapToLong(f -> f.getSnippet().getViewCount())
                .sum();
        
        long totalLikes = userFavorites.stream()
                .mapToLong(f -> f.getSnippet().getLikeCount())
                .sum();
        
        Map<String, Long> byLanguage = userFavorites.stream()
                .collect(Collectors.groupingBy(
                        f -> f.getSnippet().getLanguage(),
                        Collectors.counting()
                ));
        
        long recentActivity = thisWeek;
        
        return FavoriteStatsResponse.builder()
                .totalFavorites(totalFavorites)
                .thisWeek(thisWeek)
                .totalViews(totalViews)
                .totalLikes(totalLikes)
                .byLanguage(byLanguage)
                .recentActivity(recentActivity)
                .build();
    }
    
    @Transactional
    public void updateFavoriteNotes(Long snippetId, String notes) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to update favorites");
        }
        
        Favorite favorite = favoriteRepository.findByUserIdAndSnippetId(currentUser.getId(), snippetId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        
        favorite.setNotes(notes);
        favoriteRepository.save(favorite);
    }
      private FavoriteResponse convertToFavoriteResponse(Favorite favorite) {
        SnippetResponse snippetResponse = snippetService.convertToResponse(favorite.getSnippet());
        
        return FavoriteResponse.builder()
                .id(favorite.getId().getSnippetId())
                .snippet(snippetResponse)
                .favoritedAt(favorite.getCreatedAt())
                .notes(favorite.getNotes())
                .category(determineCategory(favorite.getSnippet()))
                .isBookmarked(false) // TODO: Implement bookmarking logic
                .priority(determinePriority(favorite))
                .build();
    }
    
    private String determineCategory(Snippet snippet) {
        // Simple category determination based on tags or language
        String language = snippet.getLanguage();
        if (language.toLowerCase().contains("javascript") || language.toLowerCase().contains("react")) {
            return "Frontend";
        } else if (language.toLowerCase().contains("java") || language.toLowerCase().contains("spring")) {
            return "Backend";
        } else if (language.toLowerCase().contains("python")) {
            return "Data Science";
        } else if (language.toLowerCase().contains("sql")) {
            return "Database";
        }
        return "General";
    }
      private String determinePriority(Favorite favorite) {
        // Simple priority determination based on creation time and snippet popularity
        long daysOld = ChronoUnit.DAYS.between(favorite.getCreatedAt(), Instant.now());
        Long likeCount = favorite.getSnippet().getLikeCount();
        
        if (daysOld <= 7 && likeCount > 10) {
            return "high";
        } else if (daysOld <= 30 || likeCount > 5) {
            return "medium";
        }
        return "normal";
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }
}
