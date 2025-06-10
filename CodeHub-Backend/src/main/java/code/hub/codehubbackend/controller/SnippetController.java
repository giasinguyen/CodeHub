package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.snippet.SnippetCreateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.dto.snippet.SnippetUpdateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetVersionResponse;
import code.hub.codehubbackend.service.SnippetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/snippets")
@Tag(name = "Snippets", description = "Code snippet management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SnippetController {
    
    @Autowired
    private SnippetService snippetService;
    
    @GetMapping
    @Operation(summary = "Get all snippets", description = "Retrieve paginated list of code snippets with optional filtering")
    public ResponseEntity<Page<SnippetResponse>> getAllSnippets(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Filter by programming language") @RequestParam(required = false) String language,
            @Parameter(description = "Filter by tag") @RequestParam(required = false) String tag,
            @Parameter(description = "Sort by: newest, oldest, likes, views") @RequestParam(defaultValue = "newest") String sort) {
        
        Page<SnippetResponse> snippets = snippetService.getAllSnippets(page, size, language, tag, sort);
        return ResponseEntity.ok(snippets);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get snippet by ID", description = "Retrieve a specific code snippet by its ID")
    public ResponseEntity<SnippetResponse> getSnippetById(@PathVariable Long id) {
        SnippetResponse snippet = snippetService.getSnippetById(id);
        return ResponseEntity.ok(snippet);
    }
      @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create new snippet with files", description = "Create a new code snippet with optional file attachments")
    public ResponseEntity<SnippetResponse> createSnippetWithFiles(
            @Parameter(description = "Snippet data") @Valid @RequestPart("snippet") SnippetCreateRequest request,
            @Parameter(description = "Optional file attachments") @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        
        SnippetResponse snippet = snippetService.createSnippet(request, files);
        return ResponseEntity.ok(snippet);
    }
    
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create new snippet", description = "Create a new code snippet")
    public ResponseEntity<SnippetResponse> createSnippet(
            @Parameter(description = "Snippet data") @Valid @RequestBody SnippetCreateRequest request) {
        
        SnippetResponse snippet = snippetService.createSnippet(request, null);
        return ResponseEntity.ok(snippet);
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update snippet", description = "Update an existing code snippet")
    public ResponseEntity<SnippetResponse> updateSnippet(
            @PathVariable Long id,
            @Parameter(description = "Updated snippet data") @Valid @RequestPart("snippet") SnippetUpdateRequest request,
            @Parameter(description = "Optional additional file attachments") @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        
        SnippetResponse snippet = snippetService.updateSnippet(id, request, files);
        return ResponseEntity.ok(snippet);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete snippet", description = "Delete a code snippet")
    public ResponseEntity<Void> deleteSnippet(@PathVariable Long id) {
        snippetService.deleteSnippet(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/versions")
    @Operation(summary = "Get snippet versions", description = "Retrieve version history of a code snippet")
    public ResponseEntity<List<SnippetVersionResponse>> getSnippetVersions(@PathVariable Long id) {
        List<SnippetVersionResponse> versions = snippetService.getSnippetVersions(id);
        return ResponseEntity.ok(versions);
    }
    
    @PostMapping("/{id}/versions/{versionId}/revert")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Revert to version", description = "Revert snippet to a specific version")
    public ResponseEntity<SnippetResponse> revertToVersion(
            @PathVariable Long id, 
            @PathVariable Long versionId) {
        
        SnippetResponse snippet = snippetService.revertToVersion(id, versionId);
        return ResponseEntity.ok(snippet);
    }
    
    @GetMapping("/languages")
    @Operation(summary = "Get available languages", description = "Get list of programming languages used in snippets")
    public ResponseEntity<List<String>> getAvailableLanguages() {
        List<String> languages = snippetService.getAvailableLanguages();
        return ResponseEntity.ok(languages);
    }
    
    @GetMapping("/tags")
    @Operation(summary = "Get available tags", description = "Get list of tags used in snippets")
    public ResponseEntity<List<String>> getAvailableTags() {
        List<String> tags = snippetService.getAvailableTags();
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search snippets", description = "Search snippets by keyword in title, description, or code")
    public ResponseEntity<Page<SnippetResponse>> searchSnippets(
            @Parameter(description = "Search keyword") @RequestParam String keyword,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by: newest, oldest, likes, views") @RequestParam(defaultValue = "newest") String sort) {
        
        Page<SnippetResponse> snippets = snippetService.searchSnippets(keyword, page, size, sort);
        return ResponseEntity.ok(snippets);
    }
    
    @GetMapping("/trending/most-liked")
    @Operation(summary = "Get most liked snippets", description = "Get snippets ordered by like count")
    public ResponseEntity<Page<SnippetResponse>> getMostLikedSnippets(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Page<SnippetResponse> snippets = snippetService.getMostLikedSnippets(page, size);
        return ResponseEntity.ok(snippets);
    }
    
    @GetMapping("/trending/most-viewed")
    @Operation(summary = "Get most viewed snippets", description = "Get snippets ordered by view count")
    public ResponseEntity<Page<SnippetResponse>> getMostViewedSnippets(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Page<SnippetResponse> snippets = snippetService.getMostViewedSnippets(page, size);
        return ResponseEntity.ok(snippets);
    }
}
