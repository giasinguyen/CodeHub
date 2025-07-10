package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLike.CommentLikeKey> {
    
    Optional<CommentLike> findByUserIdAndCommentId(Long userId, Long commentId);
    
    boolean existsByUserIdAndCommentId(Long userId, Long commentId);
    
    long countByCommentId(Long commentId);
    
    void deleteByUserIdAndCommentId(Long userId, Long commentId);
    
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.author.id = :authorId")
    Long countByCommentAuthorId(@Param("authorId") Long authorId);
}
