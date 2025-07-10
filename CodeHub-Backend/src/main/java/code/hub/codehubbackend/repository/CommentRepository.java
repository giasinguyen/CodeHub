package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Get top-level comments (not replies) for a snippet
    @Query("SELECT c FROM Comment c WHERE c.snippet.id = :snippetId AND c.parentComment IS NULL AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Comment> findMainCommentsBySnippetId(@Param("snippetId") Long snippetId, Pageable pageable);
    
    // Get all comments for a snippet (including replies)
    @Query("SELECT c FROM Comment c WHERE c.snippet.id = :snippetId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Comment> findBySnippetIdOrderByCreatedAtDesc(Long snippetId, Pageable pageable);
    
    // Get replies for a specific comment
    @Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentCommentId AND c.isDeleted = false ORDER BY c.createdAt ASC")
    List<Comment> findRepliesByParentCommentId(@Param("parentCommentId") Long parentCommentId);
    
    // Count comments for a snippet (excluding deleted)
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.snippet.id = :snippetId AND c.isDeleted = false")
    long countBySnippetIdAndNotDeleted(@Param("snippetId") Long snippetId);
    
    long countBySnippetId(Long snippetId);

    // Admin methods
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.createdAt > :since")
    Long countByCreatedAtAfter(@Param("since") java.time.Instant since);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author = :author")
    Long countByAuthor(@Param("author") code.hub.codehubbackend.entity.User author);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.snippet = :snippet")
    Long countBySnippet(@Param("snippet") code.hub.codehubbackend.entity.Snippet snippet);
    
    // Find comments with mentions
    @Query("SELECT c FROM Comment c WHERE c.content LIKE CONCAT('%@', :username, '%') AND c.isDeleted = false")
    List<Comment> findCommentsMentioning(@Param("username") String username);
}
