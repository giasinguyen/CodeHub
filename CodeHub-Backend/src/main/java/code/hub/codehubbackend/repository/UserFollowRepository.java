package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.UserFollow;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    
    @Query("SELECT f FROM UserFollow f WHERE f.follower.id = :followerId AND f.followedUser.id = :followedUserId")
    Optional<UserFollow> findByFollowerIdAndFollowedUserId(@Param("followerId") Long followerId, 
                                                          @Param("followedUserId") Long followedUserId);
    
    @Query("SELECT COUNT(f) FROM UserFollow f WHERE f.followedUser.id = :userId")
    Long countFollowersByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(f) FROM UserFollow f WHERE f.follower.id = :userId")
    Long countFollowingByUserId(@Param("userId") Long userId);
      boolean existsByFollowerIdAndFollowedUserId(Long followerId, Long followedUserId);
    
    void deleteByFollowerIdAndFollowedUserId(Long followerId, Long followedUserId);
    
    // Get followers and following with pagination
    Page<UserFollow> findByFollowedUserOrderByCreatedAtDesc(User followedUser, Pageable pageable);
    
    Page<UserFollow> findByFollowerOrderByCreatedAtDesc(User follower, Pageable pageable);
}
