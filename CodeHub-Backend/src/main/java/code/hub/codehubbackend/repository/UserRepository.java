package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
      @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByUsername(@Param("keyword") String keyword);
      // Methods for featured developers
    @Query("SELECT u FROM User u LEFT JOIN Snippet s ON s.owner.id = u.id GROUP BY u.id ORDER BY COUNT(s) DESC, SUM(COALESCE(s.likeCount, 0)) DESC")
    List<User> findTopDevelopersByActivity(Pageable pageable);
    
    Page<User> findTopByOrderByCreatedAtDesc(Pageable pageable);
    
    // Methods for community statistics  
    @Query("SELECT COUNT(u) FROM User u WHERE u.updatedAt > :since")
    Long countActiveUsersLastMonth(@Param("since") java.time.Instant since);
    
    default Long countActiveUsersLastMonth() {
        java.time.Instant oneMonthAgo = java.time.Instant.now().minus(30, java.time.temporal.ChronoUnit.DAYS);
        return countActiveUsersLastMonth(oneMonthAgo);
    }
    
    // Methods for leaderboard
    @Query("SELECT u FROM User u LEFT JOIN Snippet s ON s.owner.id = u.id GROUP BY u.id ORDER BY COUNT(s) DESC")
    List<User> findTopUsersBySnippetCount(Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN Snippet s ON s.owner.id = u.id GROUP BY u.id ORDER BY SUM(COALESCE(s.likeCount, 0)) DESC")
    List<User> findTopUsersByTotalLikes(Pageable pageable);
    
    @Query("SELECT u FROM User u LEFT JOIN Snippet s ON s.owner.id = u.id GROUP BY u.id ORDER BY SUM(COALESCE(s.viewCount, 0)) DESC")
    List<User> findTopUsersByTotalContributions(Pageable pageable);    @Query("SELECT u FROM User u LEFT JOIN Snippet s ON s.owner.id = u.id GROUP BY u.id ORDER BY (COUNT(s) * 10 + SUM(COALESCE(s.likeCount, 0)) * 5 + SUM(COALESCE(s.viewCount, 0)) * 0.1) DESC")
    List<User> findTopUsersByOverallScore(Pageable pageable);
    
    // Admin methods
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt > :since")
    Long countByCreatedAtAfter(@Param("since") java.time.Instant since);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.updatedAt > :since")
    Long countActiveUsers(@Param("since") java.time.Instant since);
    
    @Query(value = "SELECT u.username FROM users u LEFT JOIN snippets s ON s.owner_id = u.id GROUP BY u.id ORDER BY COUNT(s.id) DESC LIMIT 1", nativeQuery = true)
    Optional<String> findMostActiveUser();
    
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String username, String email, Pageable pageable);
    
    @Query("SELECT DATE(u.createdAt) as date, COUNT(u) as count FROM User u WHERE u.createdAt > :startDate GROUP BY DATE(u.createdAt) ORDER BY DATE(u.createdAt)")
    List<java.util.Map<String, Object>> getUserAnalytics(@Param("startDate") java.time.Instant startDate, @Param("period") String period);
}
