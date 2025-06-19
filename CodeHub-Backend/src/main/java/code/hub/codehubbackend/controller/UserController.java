package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.user.UserProfileResponse;
import code.hub.codehubbackend.dto.user.UserUpdateRequest;
import code.hub.codehubbackend.dto.user.PasswordChangeRequest;
import code.hub.codehubbackend.dto.user.DeveloperResponse;
import code.hub.codehubbackend.dto.user.CommunityStatsResponse;
import code.hub.codehubbackend.dto.user.TrendingSkillResponse;
import code.hub.codehubbackend.dto.user.LeaderboardUserResponse;
import code.hub.codehubbackend.dto.user.UserStatsResponse;
import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
      @Autowired
    private UserService userService;
    
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
    
    @GetMapping("/username/{username}")
    @Operation(summary = "Get user profile by username", description = "Get a user's public profile information by username")
    public ResponseEntity<UserProfileResponse> getUserProfileByUsername(@PathVariable String username) {
        UserProfileResponse profile = userService.getUserProfileByUsername(username);
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
    @GetMapping("/profile/stats")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get current user statistics", description = "Get statistics for the currently authenticated user")
    public ResponseEntity<UserStatsResponse> getCurrentUserStats() {
        UserStatsResponse stats = userService.getCurrentUserStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/{id}/stats")
    @Operation(summary = "Get user statistics by ID", description = "Get statistics for a specific user")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable Long id) {
        UserStatsResponse stats = userService.getUserStats(id);
        return ResponseEntity.ok(stats);
    }
    
    @PutMapping("/profile/password")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Change password", description = "Change the current user's password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search users", description = "Search users by username or general query")
    public ResponseEntity<Page<DeveloperResponse>> searchUsers(
            @Parameter(description = "Search by username") @RequestParam(required = false) String username,
            @Parameter(description = "General search query") @RequestParam(required = false) String q,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "12") int size) {
        
        // Use username if provided, otherwise use q parameter
        String searchQuery = username != null ? username : q;
        
        if (searchQuery == null || searchQuery.trim().isEmpty()) {
            // Return empty page if no search query
            return ResponseEntity.ok(Page.empty());
        }
        
        Page<DeveloperResponse> users = userService.getAllDevelopers(page, size, "createdAt", "desc", searchQuery, null, null, null);
        return ResponseEntity.ok(users);
    }
    
    // New endpoints for developers page
    @GetMapping
    @Operation(summary = "Get all developers", description = "Get a paginated list of all developers with filtering options")
    public ResponseEntity<Page<DeveloperResponse>> getAllDevelopers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String direction,
            @Parameter(description = "Search query") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by location") @RequestParam(required = false) String location,
            @Parameter(description = "Filter by experience level") @RequestParam(required = false) Integer experience,
            @Parameter(description = "Filter by skills") @RequestParam(required = false) List<String> skills) {
        
        Page<DeveloperResponse> developers = userService.getAllDevelopers(page, size, sort, direction, search, location, experience, skills);
        return ResponseEntity.ok(developers);
    }
    
    @GetMapping("/featured")
    @Operation(summary = "Get featured developers", description = "Get a list of featured developers")
    public ResponseEntity<List<DeveloperResponse>> getFeaturedDevelopers(
            @Parameter(description = "Limit number of results") @RequestParam(defaultValue = "6") int limit) {
        
        List<DeveloperResponse> featured = userService.getFeaturedDevelopers(limit);
        return ResponseEntity.ok(featured);
    }
    
    @GetMapping("/stats/community")
    @Operation(summary = "Get community statistics", description = "Get overall community statistics")
    public ResponseEntity<CommunityStatsResponse> getCommunityStats() {
        CommunityStatsResponse stats = userService.getCommunityStats();
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/skills/trending")
    @Operation(summary = "Get trending skills", description = "Get list of trending skills in the community")
    public ResponseEntity<List<TrendingSkillResponse>> getTrendingSkills(
            @Parameter(description = "Time period for trending analysis") @RequestParam(defaultValue = "week") String period,
            @Parameter(description = "Limit number of results") @RequestParam(defaultValue = "10") int limit) {
        
        List<TrendingSkillResponse> trendingSkills = userService.getTrendingSkills(period, limit);
        return ResponseEntity.ok(trendingSkills);
    }
    
    @GetMapping("/leaderboard")
    @Operation(summary = "Get leaderboard", description = "Get top developers leaderboard by category")
    public ResponseEntity<List<LeaderboardUserResponse>> getLeaderboard(
            @Parameter(description = "Leaderboard category") @RequestParam(defaultValue = "overall") String category,
            @Parameter(description = "Limit number of results") @RequestParam(defaultValue = "10") int limit) {
        
        List<LeaderboardUserResponse> leaderboard = userService.getLeaderboard(category, limit);
        return ResponseEntity.ok(leaderboard);
    }
  
}
