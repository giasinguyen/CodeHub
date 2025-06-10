package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.Activity;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    // Get all activities for a specific user
    Page<Activity> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Get activities by user and type
    Page<Activity> findByUserAndTypeOrderByCreatedAtDesc(User user, Activity.ActivityType type, Pageable pageable);
    
    // Get activities by user and multiple types
    Page<Activity> findByUserAndTypeInOrderByCreatedAtDesc(User user, List<Activity.ActivityType> types, Pageable pageable);
    
    // Get recent activities for a user (for dashboard/feed)
    @Query("SELECT a FROM Activity a WHERE a.user = :user ORDER BY a.createdAt DESC")
    List<Activity> findRecentActivitiesByUser(@Param("user") User user, Pageable pageable);
    
    // Get activities related to a specific target (e.g., all activities on a snippet)
    Page<Activity> findByTargetIdAndTargetTypeOrderByCreatedAtDesc(Long targetId, String targetType, Pageable pageable);
    
    // Delete activities by target (for cleanup when target is deleted)
    void deleteByTargetIdAndTargetType(Long targetId, String targetType);
    
    // Count activities by user and type
    long countByUserAndType(User user, Activity.ActivityType type);
}
