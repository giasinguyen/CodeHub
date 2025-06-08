package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    Page<Comment> findBySnippetIdOrderByCreatedAtDesc(Long snippetId, Pageable pageable);
    
    long countBySnippetId(Long snippetId);
}
