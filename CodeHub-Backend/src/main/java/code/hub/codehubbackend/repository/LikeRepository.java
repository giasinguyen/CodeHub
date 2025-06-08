package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Like.LikeKey> {
    
    Optional<Like> findByUserIdAndSnippetId(Long userId, Long snippetId);
    
    boolean existsByUserIdAndSnippetId(Long userId, Long snippetId);
    
    long countBySnippetId(Long snippetId);
    
    void deleteByUserIdAndSnippetId(Long userId, Long snippetId);
}
