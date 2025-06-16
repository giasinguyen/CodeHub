package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.user.FollowResponse;
import code.hub.codehubbackend.dto.user.FollowStatusResponse;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.entity.UserFollow;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.repository.UserFollowRepository;
import code.hub.codehubbackend.repository.UserRepository;
import code.hub.codehubbackend.repository.SnippetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserFollowService {
    
    private final UserFollowRepository userFollowRepository;
    private final UserRepository userRepository;
    private final SnippetRepository snippetRepository;
    private final NotificationService notificationService;
    
    /**
     * Toggle follow status for a user
     */
    @Transactional
    public boolean toggleFollow(Long userId) {
        User currentUser = getCurrentUser();
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("You cannot follow yourself");
        }
        
        boolean isFollowing = userFollowRepository.existsByFollowerIdAndFollowedUserId(
                currentUser.getId(), userId);
        
        if (isFollowing) {
            // Unfollow
            userFollowRepository.deleteByFollowerIdAndFollowedUserId(currentUser.getId(), userId);
            log.info("User {} unfollowed user {}", currentUser.getId(), userId);
            return false;
        } else {
            // Follow
            UserFollow userFollow = new UserFollow(currentUser, targetUser);
            userFollowRepository.save(userFollow);
            
            // Create notification for followed user
            notificationService.createUserFollowNotification(targetUser, currentUser);
            
            log.info("User {} followed user {}", currentUser.getId(), userId);
            return true;
        }
    }
    
    /**
     * Unfollow a user
     */
    @Transactional
    public void unfollowUser(Long userId) {
        User currentUser = getCurrentUser();
        
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("You cannot unfollow yourself");
        }
        
        boolean isFollowing = userFollowRepository.existsByFollowerIdAndFollowedUserId(
                currentUser.getId(), userId);
        
        if (!isFollowing) {
            throw new RuntimeException("You are not following this user");
        }
        
        userFollowRepository.deleteByFollowerIdAndFollowedUserId(currentUser.getId(), userId);
        log.info("User {} unfollowed user {}", currentUser.getId(), userId);
    }
    
    /**
     * Get follow status between current user and target user
     */
    public FollowStatusResponse getFollowStatus(Long userId) {
        User currentUser = getCurrentUser();
        
        if (currentUser.getId().equals(userId)) {
            // For self, return counts but no follow status
            long followerCount = userFollowRepository.countFollowersByUserId(userId);
            long followingCount = userFollowRepository.countFollowingByUserId(userId);
            
            return FollowStatusResponse.builder()
                    .isFollowing(false)
                    .isFollowedBy(false)
                    .followerCount(followerCount)
                    .followingCount(followingCount)
                    .build();
        }
        
        boolean isFollowing = userFollowRepository.existsByFollowerIdAndFollowedUserId(
                currentUser.getId(), userId);
        boolean isFollowedBy = userFollowRepository.existsByFollowerIdAndFollowedUserId(
                userId, currentUser.getId());
        
        long followerCount = userFollowRepository.countFollowersByUserId(userId);
        long followingCount = userFollowRepository.countFollowingByUserId(userId);
        
        return FollowStatusResponse.builder()
                .isFollowing(isFollowing)
                .isFollowedBy(isFollowedBy)
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();
    }
    
    /**
     * Get followers of a user
     */
    public Page<FollowResponse> getUserFollowers(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Page<UserFollow> followers = userFollowRepository.findByFollowedUserOrderByCreatedAtDesc(
                targetUser, pageable);
        
        return followers.map(this::convertToFollowResponse);
    }
    
    /**
     * Get users that a user follows
     */
    public Page<FollowResponse> getUserFollowing(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Page<UserFollow> following = userFollowRepository.findByFollowerOrderByCreatedAtDesc(
                targetUser, pageable);
        
        return following.map(this::convertToFollowingResponse);
    }
    
    /**
     * Get current user's followers
     */
    public Page<FollowResponse> getCurrentUserFollowers(int page, int size) {
        User currentUser = getCurrentUser();
        return getUserFollowers(currentUser.getId(), page, size);
    }
    
    /**
     * Get users that current user follows
     */
    public Page<FollowResponse> getCurrentUserFollowing(int page, int size) {
        User currentUser = getCurrentUser();
        return getUserFollowing(currentUser.getId(), page, size);
    }
    
    /**
     * Convert UserFollow to FollowResponse for followers
     */
    private FollowResponse convertToFollowResponse(UserFollow userFollow) {
        User follower = userFollow.getFollower();
        User currentUser = getCurrentUser();
        
        // Check if current user follows this follower back
        boolean isFollowingBack = false;
        if (!currentUser.getId().equals(follower.getId())) {
            isFollowingBack = userFollowRepository.existsByFollowerIdAndFollowedUserId(
                    currentUser.getId(), follower.getId());
        }
        
        return FollowResponse.builder()
                .id(follower.getId())
                .username(follower.getUsername())
                .fullName(follower.getFullName())
                .avatarUrl(follower.getAvatarUrl())
                .bio(follower.getBio())
                .location(follower.getLocation())
                .followedAt(userFollow.getCreatedAt())
                .isFollowingBack(isFollowingBack)
                .stats(buildFollowStats(follower))
                .build();
    }
    
    /**
     * Convert UserFollow to FollowResponse for following
     */
    private FollowResponse convertToFollowingResponse(UserFollow userFollow) {
        User followedUser = userFollow.getFollowedUser();
        User currentUser = getCurrentUser();
        
        // Check if this followed user follows current user back
        boolean isFollowingBack = userFollowRepository.existsByFollowerIdAndFollowedUserId(
                followedUser.getId(), currentUser.getId());
        
        return FollowResponse.builder()
                .id(followedUser.getId())
                .username(followedUser.getUsername())
                .fullName(followedUser.getFullName())
                .avatarUrl(followedUser.getAvatarUrl())
                .bio(followedUser.getBio())
                .location(followedUser.getLocation())
                .followedAt(userFollow.getCreatedAt())
                .isFollowingBack(isFollowingBack)
                .stats(buildFollowStats(followedUser))
                .build();
    }
    
    /**
     * Build follow stats for a user
     */
    private FollowResponse.FollowStats buildFollowStats(User user) {
        long snippetCount = snippetRepository.countByOwner(user);
        long followerCount = userFollowRepository.countFollowersByUserId(user.getId());
        long followingCount = userFollowRepository.countFollowingByUserId(user.getId());
        long totalLikes = snippetRepository.sumLikesByOwner(user);
        
        return FollowResponse.FollowStats.builder()
                .snippetCount(snippetCount)
                .followerCount(followerCount)
                .followingCount(followingCount)
                .totalLikes(totalLikes)
                .build();
    }
    
    /**
     * Get current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
