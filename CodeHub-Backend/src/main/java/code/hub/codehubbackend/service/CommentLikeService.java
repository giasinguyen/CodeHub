package code.hub.codehubbackend.service;

import code.hub.codehubbackend.entity.Comment;
import code.hub.codehubbackend.entity.CommentLike;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.CommentLikeRepository;
import code.hub.codehubbackend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentLikeService {
    
    private final CommentLikeRepository commentLikeRepository;
    private final CommentRepository commentRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    
    @Transactional
    public boolean toggleCommentLike(Long commentId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to like comments");
        }
        
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        boolean exists = commentLikeRepository.existsByUserIdAndCommentId(currentUser.getId(), commentId);
        
        if (exists) {
            // Unlike
            commentLikeRepository.deleteByUserIdAndCommentId(currentUser.getId(), commentId);
            
            // Update cached like count
            comment.decrementLikeCount();
            commentRepository.save(comment);
            
            // Create unlike activity
            activityService.createCommentLikeActivity(comment, false);
            
            return false;
        } else {
            // Like
            CommentLike commentLike = CommentLike.builder()
                    .id(new CommentLike.CommentLikeKey(currentUser.getId(), commentId))
                    .user(currentUser)
                    .comment(comment)
                    .build();
            
            commentLikeRepository.save(commentLike);
            
            // Update cached like count
            comment.incrementLikeCount();
            commentRepository.save(comment);
            
            // Create like activity
            activityService.createCommentLikeActivity(comment, true);
            
            // Create notification for comment author (if not self-like)
            if (!comment.getAuthor().getId().equals(currentUser.getId())) {
                notificationService.createCommentLikeNotification(comment, currentUser);
            }
            
            return true;
        }
    }
    
    public boolean isCommentLiked(Long commentId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        
        return commentLikeRepository.existsByUserIdAndCommentId(currentUser.getId(), commentId);
    }
    
    public long getCommentLikeCount(Long commentId) {
        return commentLikeRepository.countByCommentId(commentId);
    }
    
    @Transactional
    public void syncCommentLikeCount(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        // Get actual like count from database
        long actualLikeCount = commentLikeRepository.countByCommentId(commentId);
        
        // Update cached like count
        comment.setLikeCount((int) actualLikeCount);
        commentRepository.save(comment);
        
        log.info("Synced like count for comment {}: {}", commentId, actualLikeCount);
    }
    
    @Transactional
    public void syncAllCommentLikeCounts() {
        log.info("Starting to sync all comment like counts...");
        
        // Get all comments
        List<Comment> allComments = commentRepository.findAll();
        
        for (Comment comment : allComments) {
            long actualLikeCount = commentLikeRepository.countByCommentId(comment.getId());
            if (comment.getLikeCount() == null || comment.getLikeCount() != actualLikeCount) {
                comment.setLikeCount((int) actualLikeCount);
                commentRepository.save(comment);
                log.debug("Updated like count for comment {}: {} -> {}", 
                    comment.getId(), comment.getLikeCount(), actualLikeCount);
            }
        }
        
        log.info("Finished syncing all comment like counts");
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return (User) authentication.getPrincipal();
    }
}
