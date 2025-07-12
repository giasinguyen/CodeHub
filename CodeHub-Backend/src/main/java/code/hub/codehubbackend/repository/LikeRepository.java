package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Like.LikeKey> {
    
    Optional<Like> findByUserIdAndSnippetId(Long userId, Long snippetId);
    
    boolean existsByUserIdAndSnippetId(Long userId, Long snippetId);
    
    long countBySnippetId(Long snippetId);
    
    void deleteByUserIdAndSnippetId(Long userId, Long snippetId);
    
    // Admin methods
    @Query("SELECT COUNT(l) FROM Like l WHERE l.user = :user")
    Long countByUser(@Param("user") code.hub.codehubbackend.entity.User user);
    
    @Query("SELECT COUNT(l) FROM Like l WHERE l.snippet = :snippet")
    Long countBySnippet(@Param("snippet") code.hub.codehubbackend.entity.Snippet snippet);
    
    @Query("SELECT COUNT(l) FROM Like l WHERE l.snippet.owner = :author")
    Long countBySnippetAuthor(@Param("author") code.hub.codehubbackend.entity.User author);
    
    // Count likes by user ID
    @Query("SELECT COUNT(l) FROM Like l WHERE l.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    // Count likes received by user's snippets
    @Query("SELECT COUNT(l) FROM Like l WHERE l.snippet.owner.id = :authorId")
    Long countBySnippetAuthorId(@Param("authorId") Long authorId);
}
