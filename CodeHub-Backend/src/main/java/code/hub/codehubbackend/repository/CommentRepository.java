package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    Page<Comment> findBySnippetIdOrderByCreatedAtDesc(Long snippetId, Pageable pageable);
    
    long countBySnippetId(Long snippetId);

    // Admin methods
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.createdAt > :since")
    Long countByCreatedAtAfter(@Param("since") java.time.Instant since);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.author = :author")
    Long countByAuthor(@Param("author") code.hub.codehubbackend.entity.User author);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.snippet = :snippet")
    Long countBySnippet(@Param("snippet") code.hub.codehubbackend.entity.Snippet snippet);
}
