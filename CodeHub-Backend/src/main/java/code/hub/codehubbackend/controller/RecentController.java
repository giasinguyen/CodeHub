package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.service.SnippetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recent")
@Tag(name = "Recently Viewed", description = "Recently viewed snippets APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class RecentController {
    
    private final SnippetService snippetService;
    
    @GetMapping("/snippets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get recently viewed snippets", description = "Get snippets recently viewed by current user")
    public ResponseEntity<Page<SnippetResponse>> getRecentlyViewedSnippets(
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "12") int size) {
        
        Page<SnippetResponse> recentSnippets = snippetService.getRecentlyViewedSnippets(page, size);
        return ResponseEntity.ok(recentSnippets);
    }
    
    @PostMapping("/snippets/{snippetId}/view")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Record snippet view", description = "Record that current user viewed a snippet")
    public ResponseEntity<Void> recordSnippetView(@PathVariable Long snippetId) {
        snippetService.recordSnippetView(snippetId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/snippets/{snippetId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Remove from recently viewed", description = "Remove a snippet from recently viewed list")
    public ResponseEntity<Void> removeFromRecentlyViewed(@PathVariable Long snippetId) {
        snippetService.removeFromRecentlyViewed(snippetId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/snippets")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Clear recently viewed", description = "Clear all recently viewed snippets for current user")
    public ResponseEntity<Void> clearRecentlyViewed() {
        snippetService.clearRecentlyViewed();
        return ResponseEntity.ok().build();
    }
}
