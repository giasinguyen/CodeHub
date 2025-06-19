package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long> {
    
    Page<Snippet> findByOwner(User owner, Pageable pageable);
    
    Page<Snippet> findByLanguage(String language, Pageable pageable);
    
    @Query("SELECT s FROM Snippet s WHERE s.language = :language")
    Page<Snippet> findByLanguageIgnoreCase(@Param("language") String language, Pageable pageable);
    
    @Query("SELECT s FROM Snippet s WHERE " +
           "(:language IS NULL OR LOWER(s.language) = LOWER(:language)) AND " +
           "(:tag IS NULL OR :tag MEMBER OF s.tags)")
    Page<Snippet> findByLanguageAndTag(@Param("language") String language, 
                                      @Param("tag") String tag, 
                                      Pageable pageable);    @Query("SELECT s FROM Snippet s WHERE " +
           "UPPER(s.title) LIKE UPPER(CONCAT('%', :keyword, '%')) OR " +
           "UPPER(s.language) LIKE UPPER(CONCAT('%', :keyword, '%')) OR " +
           "EXISTS (SELECT t FROM s.tags t WHERE UPPER(t) LIKE UPPER(CONCAT('%', :keyword, '%')))")
    Page<Snippet> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT s FROM Snippet s ORDER BY s.likeCount DESC")
    Page<Snippet> findMostLiked(Pageable pageable);
    
    @Query("SELECT s FROM Snippet s ORDER BY s.viewCount DESC")
    Page<Snippet> findMostViewed(Pageable pageable);
      @Query("SELECT DISTINCT s.language FROM Snippet s WHERE s.language IS NOT NULL ORDER BY s.language")
    List<String> findDistinctLanguages();
    
    @Query("SELECT DISTINCT tag FROM Snippet s JOIN s.tags tag ORDER BY tag")
    List<String> findDistinctTags();    // User statistics queries
    @Query("SELECT COUNT(s) FROM Snippet s WHERE s.owner = :user")
    Long countByOwner(@Param("user") User user);
    
    @Query("SELECT s FROM Snippet s WHERE s.owner = :user")
    List<Snippet> findByOwner(@Param("user") User user);
    
    @Query("SELECT COUNT(s) FROM Snippet s WHERE s.owner.id = :authorId")
    Long countByAuthorId(@Param("authorId") Long authorId);
    
    @Query("SELECT s FROM Snippet s WHERE s.owner.id = :authorId")
    List<Snippet> findByAuthorId(@Param("authorId") Long authorId);
    
    @Query("SELECT COALESCE(SUM(s.likeCount), 0) FROM Snippet s WHERE s.owner = :user")
    Long sumLikesByOwner(@Param("user") User user);
      @Query("SELECT COALESCE(SUM(s.viewCount), 0) FROM Snippet s WHERE s.owner = :user")
    Long sumViewsByOwner(@Param("user") User user);
    
    // Community statistics queries
    @Query("SELECT COALESCE(SUM(s.likeCount), 0) FROM Snippet s")
    Long sumAllLikes();
    
    // Atomic increment để tránh race condition
    @Modifying
    @Query("UPDATE Snippet s SET s.viewCount = s.viewCount + 1 WHERE s.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
