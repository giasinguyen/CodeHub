package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.user.UserProfileResponse;
import code.hub.codehubbackend.dto.user.UserUpdateRequest;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.service.UserService;
import code.hub.codehubbackend.service.SnippetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SnippetService snippetService;
    
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get current user profile", description = "Get the profile of the currently authenticated user")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile() {
        UserProfileResponse profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user profile by ID", description = "Get a user's public profile information")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long id) {
        UserProfileResponse profile = userService.getUserProfileById(id);
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update user profile", description = "Update the current user's profile information")
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        UserProfileResponse profile = userService.updateUserProfile(request);
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/{id}/snippets")
    @Operation(summary = "Get user's snippets", description = "Get all snippets created by a specific user")
    public ResponseEntity<Page<SnippetResponse>> getUserSnippets(
            @PathVariable Long id,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Page<SnippetResponse> snippets = userService.getUserSnippets(id, page, size);
        return ResponseEntity.ok(snippets);
    }
    
    @GetMapping("/profile/snippets")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get current user's snippets", description = "Get all snippets created by the current user")
    public ResponseEntity<Page<SnippetResponse>> getCurrentUserSnippets(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Page<SnippetResponse> snippets = userService.getCurrentUserSnippets(page, size);
        return ResponseEntity.ok(snippets);
    }
}
