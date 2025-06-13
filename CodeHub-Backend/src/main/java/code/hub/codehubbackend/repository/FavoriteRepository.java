package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Favorite.FavoriteKey> {
    
    Optional<Favorite> findByUserIdAndSnippetId(Long userId, Long snippetId);
    
    boolean existsByUserIdAndSnippetId(Long userId, Long snippetId);
    
    long countBySnippetId(Long snippetId);
    
    void deleteByUserIdAndSnippetId(Long userId, Long snippetId);
    
    Page<Favorite> findByUserId(Long userId, Pageable pageable);
    
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId AND f.snippet.language = :language")
    Page<Favorite> findByUserIdAndSnippetLanguage(@Param("userId") Long userId, 
                                                   @Param("language") String language, 
                                                   Pageable pageable);
}
