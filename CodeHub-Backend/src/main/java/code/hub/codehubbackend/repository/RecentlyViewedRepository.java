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
public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, Long> {
    
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
}
