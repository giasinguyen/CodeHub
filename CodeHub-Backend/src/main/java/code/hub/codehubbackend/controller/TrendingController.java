package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.dto.user.DeveloperResponse;
import code.hub.codehubbackend.dto.user.TrendingSkillResponse;
import code.hub.codehubbackend.dto.user.LeaderboardUserResponse;
import code.hub.codehubbackend.dto.trending.TrendingLanguageResponse;
import code.hub.codehubbackend.dto.trending.TrendingStatsResponse;
import code.hub.codehubbackend.service.SnippetService;
import code.hub.codehubbackend.service.UserService;
import code.hub.codehubbackend.service.TrendingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trending")
@Tag(name = "Trending", description = "Trending content and analytics APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class TrendingController {

    private final SnippetService snippetService;
    private final UserService userService;
    private final TrendingService trendingService;

    @GetMapping("/overview")
    @Operation(summary = "Get trending overview", description = "Get an overview of all trending content")
    public ResponseEntity<Map<String, Object>> getTrendingOverview(
            @Parameter(description = "Time period") @RequestParam(defaultValue = "week") String period) {
        
        Map<String, Object> overview = trendingService.getTrendingOverview(period);
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/snippets")
    @Operation(summary = "Get trending snippets", description = "Get trending code snippets")
    public ResponseEntity<Page<SnippetResponse>> getTrendingSnippets(
            @Parameter(description = "Trending type: most-liked, most-viewed, most-forked") 
            @RequestParam(defaultValue = "most-liked") String type,
            @Parameter(description = "Time period: day, week, month, year") 
            @RequestParam(defaultValue = "week") String period,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Page<SnippetResponse> snippets;
        switch (type.toLowerCase()) {
            case "most-viewed":
                snippets = snippetService.getMostViewedSnippets(page, size);
                break;
            case "most-liked":
            default:
                snippets = snippetService.getMostLikedSnippets(page, size);
                break;
        }
        
        return ResponseEntity.ok(snippets);
    }

    @GetMapping("/developers")
    @Operation(summary = "Get trending developers", description = "Get trending developers")
    public ResponseEntity<List<DeveloperResponse>> getTrendingDevelopers(
            @Parameter(description = "Time period") @RequestParam(defaultValue = "week") String period,
            @Parameter(description = "Limit") @RequestParam(defaultValue = "15") int limit) {
        
        List<DeveloperResponse> developers = userService.getFeaturedDevelopers(limit);
        return ResponseEntity.ok(developers);
    }

    @GetMapping("/skills")
    @Operation(summary = "Get trending skills", description = "Get trending skills and technologies")
    public ResponseEntity<List<TrendingSkillResponse>> getTrendingSkills(
            @Parameter(description = "Time period") @RequestParam(defaultValue = "week") String period,
            @Parameter(description = "Limit") @RequestParam(defaultValue = "15") int limit) {
        
        List<TrendingSkillResponse> skills = userService.getTrendingSkills(period, limit);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/languages")
    @Operation(summary = "Get trending languages", description = "Get trending programming languages")
    public ResponseEntity<List<TrendingLanguageResponse>> getTrendingLanguages(
            @Parameter(description = "Time period") @RequestParam(defaultValue = "week") String period,
            @Parameter(description = "Limit") @RequestParam(defaultValue = "15") int limit) {
        
        List<TrendingLanguageResponse> languages = trendingService.getTrendingLanguages(period, limit);
        return ResponseEntity.ok(languages);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get trending statistics", description = "Get overall trending statistics")
    public ResponseEntity<TrendingStatsResponse> getTrendingStats(
            @Parameter(description = "Time period") @RequestParam(defaultValue = "week") String period) {
        
        TrendingStatsResponse stats = trendingService.getTrendingStats(period);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/leaderboard")
    @Operation(summary = "Get trending leaderboard", description = "Get developers leaderboard")
    public ResponseEntity<List<LeaderboardUserResponse>> getTrendingLeaderboard(
            @Parameter(description = "Category") @RequestParam(defaultValue = "overall") String category,
            @Parameter(description = "Time period") @RequestParam(defaultValue = "week") String period,
            @Parameter(description = "Limit") @RequestParam(defaultValue = "10") int limit) {
        
        List<LeaderboardUserResponse> leaderboard = userService.getLeaderboard(category, limit);
        return ResponseEntity.ok(leaderboard);
    }
}
