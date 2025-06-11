package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.trending.TrendingLanguageResponse;
import code.hub.codehubbackend.dto.trending.TrendingStatsResponse;
import code.hub.codehubbackend.repository.SnippetRepository;
import code.hub.codehubbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrendingService {

    private final SnippetRepository snippetRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getTrendingOverview(String period) {
        Map<String, Object> overview = new HashMap<>();
        
        // Get basic stats
        TrendingStatsResponse stats = getTrendingStats(period);
        overview.put("stats", stats);
        
        // Get top languages (limited)
        List<TrendingLanguageResponse> topLanguages = getTrendingLanguages(period, 5);
        overview.put("topLanguages", topLanguages);
        
        // Add trending indicators
        overview.put("trendingUp", Arrays.asList("JavaScript", "TypeScript", "Python"));
        overview.put("trendingDown", Arrays.asList("PHP", "Perl"));
        overview.put("period", period);
        overview.put("lastUpdated", new Date());
        
        return overview;
    }

    public List<TrendingLanguageResponse> getTrendingLanguages(String period, int limit) {
        // Mock data for trending languages with realistic stats
        List<TrendingLanguageResponse> languages = Arrays.asList(
            TrendingLanguageResponse.builder()
                .name("JavaScript")
                .displayName("JavaScript")
                .color("#f7df1e")
                .snippetCount(2340L)
                .growthRate(15.5)
                .rank(1)
                .previousRank(1)
                .weeklyGrowth(156L)
                .marketShare(23.4)
                .category("Frontend")
                .isRising(true)
                .build(),
            TrendingLanguageResponse.builder()
                .name("Python")
                .displayName("Python")
                .color("#3776ab")
                .snippetCount(1890L)
                .growthRate(12.3)
                .rank(2)
                .previousRank(3)
                .weeklyGrowth(123L)
                .marketShare(18.9)
                .category("Backend")
                .isRising(true)
                .build(),
            TrendingLanguageResponse.builder()
                .name("TypeScript")
                .displayName("TypeScript")
                .color("#3178c6")
                .snippetCount(1456L)
                .growthRate(22.1)
                .rank(3)
                .previousRank(4)
                .weeklyGrowth(98L)
                .marketShare(14.6)
                .category("Frontend")
                .isRising(true)
                .build(),
            TrendingLanguageResponse.builder()
                .name("Java")
                .displayName("Java")
                .color("#ed8b00")
                .snippetCount(1234L)
                .growthRate(8.7)
                .rank(4)
                .previousRank(2)
                .weeklyGrowth(67L)
                .marketShare(12.3)
                .category("Backend")
                .isRising(false)
                .build(),
            TrendingLanguageResponse.builder()
                .name("Go")
                .displayName("Go")
                .color("#00add8")
                .snippetCount(892L)
                .growthRate(18.9)
                .rank(5)
                .previousRank(7)
                .weeklyGrowth(89L)
                .marketShare(8.9)
                .category("Backend")
                .isRising(true)
                .build(),
            TrendingLanguageResponse.builder()
                .name("Rust")
                .displayName("Rust")
                .color("#000000")
                .snippetCount(743L)
                .growthRate(25.4)
                .rank(6)
                .previousRank(8)
                .weeklyGrowth(78L)
                .marketShare(7.4)
                .category("Systems")
                .isRising(true)
                .build(),
            TrendingLanguageResponse.builder()
                .name("C++")
                .displayName("C++")
                .color("#00599c")
                .snippetCount(698L)
                .growthRate(5.2)
                .rank(7)
                .previousRank(6)
                .weeklyGrowth(34L)
                .marketShare(7.0)
                .category("Systems")
                .isRising(false)
                .build(),
            TrendingLanguageResponse.builder()
                .name("PHP")
                .displayName("PHP")
                .color("#777bb4")
                .snippetCount(645L)
                .growthRate(-2.1)
                .rank(8)
                .previousRank(5)
                .weeklyGrowth(-15L)
                .marketShare(6.5)
                .category("Backend")
                .isRising(false)
                .build(),
            TrendingLanguageResponse.builder()
                .name("Swift")
                .displayName("Swift")
                .color("#fa7343")
                .snippetCount(567L)
                .growthRate(14.7)
                .rank(9)
                .previousRank(10)
                .weeklyGrowth(45L)
                .marketShare(5.7)
                .category("Mobile")
                .isRising(true)
                .build(),
            TrendingLanguageResponse.builder()
                .name("Kotlin")
                .displayName("Kotlin")
                .color("#7f52ff")
                .snippetCount(489L)
                .growthRate(16.8)
                .rank(10)
                .previousRank(11)
                .weeklyGrowth(42L)
                .marketShare(4.9)
                .category("Mobile")
                .isRising(true)
                .build()
        );

        return languages.stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public TrendingStatsResponse getTrendingStats(String period) {
        // In a real implementation, these would be calculated from the database
        Long totalSnippets = snippetRepository.count();
        Long totalDevelopers = userRepository.count();
        
        return TrendingStatsResponse.builder()
            .totalSnippets(totalSnippets)
            .totalDevelopers(totalDevelopers)
            .totalLikes(totalSnippets * 8) // Mock calculation
            .totalViews(totalSnippets * 45) // Mock calculation
            .totalComments(totalSnippets * 3) // Mock calculation
            .todaySnippets(23L)
            .weekSnippets(156L)
            .monthSnippets(678L)
            .snippetGrowthRate(12.5)
            .developerGrowthRate(8.3)
            .engagementRate(67.8)
            .mostPopularLanguage("JavaScript")
            .mostActiveUser("alice_dev")
            .mostLikedSnippetId(1L)
            .trendingPeriod(period)
            .build();
    }
}
