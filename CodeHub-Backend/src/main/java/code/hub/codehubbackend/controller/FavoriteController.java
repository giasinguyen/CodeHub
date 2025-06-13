package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.favorite.*;
import code.hub.codehubbackend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class FavoriteController {
    
    private final FavoriteService favoriteService;
    
    /**
     * Get user's favorites with pagination
     */
    @GetMapping("/favorites")
    public ResponseEntity<Page<FavoriteResponse>> getUserFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<FavoriteResponse> favorites = favoriteService.getUserFavorites(pageable);
        return ResponseEntity.ok(favorites);
    }
    
    /**
     * Add snippet to favorites
     */
    @PostMapping("/snippets/{snippetId}/favorite")
    public ResponseEntity<String> addFavorite(
            @PathVariable Long snippetId,
            @RequestBody(required = false) FavoriteRequest request) {
        
        String notes = (request != null) ? request.getNotes() : null;
        favoriteService.addFavorite(snippetId, notes);
        return ResponseEntity.ok("Snippet added to favorites");
    }
    
    /**
     * Remove snippet from favorites
     */
    @DeleteMapping("/snippets/{snippetId}/favorite")
    public ResponseEntity<String> removeFavorite(@PathVariable Long snippetId) {
        favoriteService.removeFavorite(snippetId);
        return ResponseEntity.ok("Snippet removed from favorites");
    }
    
    /**
     * Toggle favorite status
     */
    @PostMapping("/snippets/{snippetId}/favorite/toggle")
    public ResponseEntity<String> toggleFavorite(
            @PathVariable Long snippetId,
            @RequestBody(required = false) FavoriteRequest request) {
        
        String notes = (request != null) ? request.getNotes() : null;
        boolean isFavorited = favoriteService.toggleFavorite(snippetId, notes);
        
        String message = isFavorited ? "Snippet added to favorites" : "Snippet removed from favorites";
        return ResponseEntity.ok(message);
    }
    
    /**
     * Get favorite status for a snippet
     */
    @GetMapping("/snippets/{snippetId}/favorite/status")
    public ResponseEntity<FavoriteStatusResponse> getFavoriteStatus(@PathVariable Long snippetId) {
        FavoriteStatusResponse status = favoriteService.getFavoriteStatus(snippetId);
        return ResponseEntity.ok(status);
    }
    
    /**
     * Update favorite notes
     */
    @PutMapping("/snippets/{snippetId}/favorite/notes")
    public ResponseEntity<String> updateFavoriteNotes(
            @PathVariable Long snippetId,
            @RequestBody FavoriteRequest request) {
        
        favoriteService.updateFavoriteNotes(snippetId, request.getNotes());
        return ResponseEntity.ok("Favorite notes updated");
    }
    
    /**
     * Get user's favorite statistics
     */
    @GetMapping("/favorites/stats")
    public ResponseEntity<FavoriteStatsResponse> getFavoriteStats() {
        FavoriteStatsResponse stats = favoriteService.getFavoriteStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Bulk add favorites
     */
    @PostMapping("/favorites/bulk/add")
    public ResponseEntity<String> bulkAddFavorites(@RequestBody List<Long> snippetIds) {
        for (Long snippetId : snippetIds) {
            try {
                favoriteService.addFavorite(snippetId, null);
            } catch (Exception e) {
                log.warn("Failed to add snippet {} to favorites: {}", snippetId, e.getMessage());
            }
        }
        return ResponseEntity.ok("Bulk favorites operation completed");
    }
    
    /**
     * Bulk remove favorites
     */
    @PostMapping("/favorites/bulk/remove")
    public ResponseEntity<String> bulkRemoveFavorites(@RequestBody List<Long> snippetIds) {
        for (Long snippetId : snippetIds) {
            try {
                favoriteService.removeFavorite(snippetId);
            } catch (Exception e) {
                log.warn("Failed to remove snippet {} from favorites: {}", snippetId, e.getMessage());
            }
        }
        return ResponseEntity.ok("Bulk unfavorites operation completed");
    }
}
