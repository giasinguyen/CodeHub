package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.activity.ActivityResponse;
import code.hub.codehubbackend.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@Tag(name = "Activities", description = "User activity management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ActivityController {
    
    private final ActivityService activityService;
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get current user activities", description = "Get paginated activities for the current user")
    public ResponseEntity<Page<ActivityResponse>> getCurrentUserActivities(
            @Parameter(description = "Filter by activity type: all, snippets, likes, comments, profile") 
            @RequestParam(defaultValue = "all") String filter,
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "10") int size) {
        
        Page<ActivityResponse> activities = activityService.getCurrentUserActivities(filter, page, size);
        return ResponseEntity.ok(activities);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user activities", description = "Get paginated activities for a specific user")
    public ResponseEntity<Page<ActivityResponse>> getUserActivities(
            @PathVariable Long userId,
            @Parameter(description = "Filter by activity type: all, snippets, likes, comments, profile") 
            @RequestParam(defaultValue = "all") String filter,
            @Parameter(description = "Page number (0-based)") 
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") 
            @RequestParam(defaultValue = "10") int size) {
        
        Page<ActivityResponse> activities = activityService.getUserActivities(userId, filter, page, size);
        return ResponseEntity.ok(activities);
    }
}
