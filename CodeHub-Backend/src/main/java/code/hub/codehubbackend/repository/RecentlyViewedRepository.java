package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.RecentlyViewed;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long> {    @Query("SELECT rv FROM RecentlyViewed rv WHERE rv.user = :user ORDER BY " +
           "CASE WHEN rv.lastViewedAt IS NOT NULL THEN rv.lastViewedAt " +
           "ELSE rv.viewedAt END DESC")
    Page<RecentlyViewed> findByUserOrderByLastViewedAtDesc(@Param("user") User user, Pageable pageable);
    
    // Fallback method for backward compatibility
    @Query("SELECT rv FROM RecentlyViewed rv WHERE rv.user = :user ORDER BY rv.viewedAt DESC")
    Page<RecentlyViewed> findByUserOrderByViewedAtDesc(@Param("user") User user, Pageable pageable);
    
    Optional<RecentlyViewed> findByUserAndSnippet(User user, Snippet snippet);
    
    @Modifying
    @Query("DELETE FROM RecentlyViewed rv WHERE rv.user = :user AND rv.snippet = :snippet")
    void deleteByUserAndSnippet(@Param("user") User user, @Param("snippet") Snippet snippet);
    
    @Modifying
    @Query("DELETE FROM RecentlyViewed rv WHERE rv.user = :user")
    void deleteByUser(@Param("user") User user);
      @Query("SELECT COUNT(rv) FROM RecentlyViewed rv WHERE rv.user = :user")
    long countByUser(@Param("user") User user);
    
    // Safe upsert method that works with both old and new schema
    @Modifying
    @Query(value = """
        INSERT INTO recently_viewed (user_id, snippet_id, view_count, viewed_at) 
        VALUES (:userId, :snippetId, 1, NOW())
        ON DUPLICATE KEY UPDATE 
            view_count = view_count + 1,
            viewed_at = NOW()
        """, nativeQuery = true)
    void upsertRecentlyViewedSafe(@Param("userId") Long userId, @Param("snippetId") Long snippetId);
}
