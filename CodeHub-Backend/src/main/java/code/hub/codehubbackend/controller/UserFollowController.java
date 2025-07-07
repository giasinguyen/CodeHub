package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.user.FollowResponse;
import code.hub.codehubbackend.dto.user.FollowStatusResponse;
import code.hub.codehubbackend.service.UserFollowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Follow", description = "User follow/unfollow management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserFollowController {
    
    @Autowired
    private UserFollowService userFollowService;
    
    @PostMapping("/{userId}/follow")
    @Operation(summary = "Follow user", description = "Follow a user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> followUser(
            @Parameter(description = "User ID to follow") @PathVariable Long userId
    ) {
        boolean isFollowing = userFollowService.toggleFollow(userId);
        String message = isFollowing ? "User followed successfully" : "User unfollowed successfully";
        return ResponseEntity.ok(message);
    }
    
    @DeleteMapping("/{userId}/follow")
    @Operation(summary = "Unfollow user", description = "Unfollow a user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> unfollowUser(
            @Parameter(description = "User ID to unfollow") @PathVariable Long userId
    ) {
        userFollowService.unfollowUser(userId);
        return ResponseEntity.ok("User unfollowed successfully");
    }
    
    @GetMapping("/{userId}/follow/status")
    @Operation(summary = "Get follow status", description = "Check if current user follows the specified user")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FollowStatusResponse> getFollowStatus(
            @Parameter(description = "User ID to check") @PathVariable Long userId
    ) {
        FollowStatusResponse status = userFollowService.getFollowStatus(userId);
        return ResponseEntity.ok(status);
    }
    
    @GetMapping("/{userId}/followers")
    @Operation(summary = "Get user followers", description = "Get paginated list of user's followers")
    public ResponseEntity<Page<FollowResponse>> getUserFollowers(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size
    ) {
        Page<FollowResponse> followers = userFollowService.getUserFollowers(userId, page, size);
        return ResponseEntity.ok(followers);
    }
    
    @GetMapping("/{userId}/following")
    @Operation(summary = "Get user following", description = "Get paginated list of users that this user follows")
    public ResponseEntity<Page<FollowResponse>> getUserFollowing(
            @Parameter(description = "User ID") @PathVariable Long userId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size
    ) {
        Page<FollowResponse> following = userFollowService.getUserFollowing(userId, page, size);
        return ResponseEntity.ok(following);
    }
    
    @GetMapping("/profile/followers")
    @Operation(summary = "Get current user followers", description = "Get current user's followers")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<FollowResponse>> getCurrentUserFollowers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size
    ) {
        Page<FollowResponse> followers = userFollowService.getCurrentUserFollowers(page, size);
        return ResponseEntity.ok(followers);
    }
    
    @GetMapping("/profile/following")
    @Operation(summary = "Get current user following", description = "Get users that current user follows")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<FollowResponse>> getCurrentUserFollowing(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size
    ) {
        Page<FollowResponse> following = userFollowService.getCurrentUserFollowing(page, size);
        return ResponseEntity.ok(following);
    }
}
