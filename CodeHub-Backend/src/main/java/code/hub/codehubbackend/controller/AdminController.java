package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.admin.*;
import code.hub.codehubbackend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get dashboard statistics", description = "Get system-wide statistics for admin dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        log.info("Admin dashboard stats requested");
        DashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users", description = "Get paginated list of all users")
    public ResponseEntity<Page<UserManagementResponse>> getUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Search query") @RequestParam(required = false) String search) {
        Page<UserManagementResponse> users = adminService.getUsers(page, size, search);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user details", description = "Get detailed information about a specific user")
    public ResponseEntity<UserDetailsResponse> getUserDetails(@PathVariable Long userId) {
        UserDetailsResponse user = adminService.getUserDetails(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user status", description = "Enable or disable a user account")
    public ResponseEntity<Void> updateUserStatus(@PathVariable Long userId, @RequestParam boolean enabled) {
        adminService.updateUserStatus(userId, enabled);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/snippets")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all snippets", description = "Get paginated list of all snippets for moderation")
    public ResponseEntity<Page<SnippetModerationResponse>> getSnippets(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Search query") @RequestParam(required = false) String search) {
        Page<SnippetModerationResponse> snippets = adminService.getSnippets(page, size, search);
        return ResponseEntity.ok(snippets);
    }

    @DeleteMapping("/snippets/{snippetId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete snippet", description = "Delete a snippet (admin only)")
    public ResponseEntity<Void> deleteSnippet(@PathVariable Long snippetId) {
        adminService.deleteSnippet(snippetId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/analytics/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user analytics", description = "Get user registration and activity analytics")
    public ResponseEntity<List<Map<String, Object>>> getUserAnalytics(
            @Parameter(description = "Period (daily, weekly, monthly)") @RequestParam(defaultValue = "daily") String period,
            @Parameter(description = "Days to look back") @RequestParam(defaultValue = "30") int days) {
        List<Map<String, Object>> analytics = adminService.getUserAnalytics(period, days);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/snippets")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get snippet analytics", description = "Get snippet creation and activity analytics")
    public ResponseEntity<List<Map<String, Object>>> getSnippetAnalytics(
            @Parameter(description = "Period (daily, weekly, monthly)") @RequestParam(defaultValue = "daily") String period,
            @Parameter(description = "Days to look back") @RequestParam(defaultValue = "30") int days) {
        List<Map<String, Object>> analytics = adminService.getSnippetAnalytics(period, days);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/activities")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get recent activities", description = "Get recent system activities")
    public ResponseEntity<Page<ActivityResponse>> getRecentActivities(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        Page<ActivityResponse> activities = adminService.getRecentActivities(page, size);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/system/health")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get system health", description = "Get system health and performance metrics")
    public ResponseEntity<SystemHealthResponse> getSystemHealth() {
        SystemHealthResponse health = adminService.getSystemHealth();
        return ResponseEntity.ok(health);
    }
}
