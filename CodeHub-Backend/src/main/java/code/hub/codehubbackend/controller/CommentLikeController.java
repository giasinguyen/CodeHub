package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.service.CommentLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments/{commentId}")
@Tag(name = "Comment Likes", description = "Comment like management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class CommentLikeController {
    
    private final CommentLikeService commentLikeService;
    
    @PostMapping("/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Toggle comment like", description = "Like or unlike a comment")
    public ResponseEntity<Map<String, Object>> toggleCommentLike(@PathVariable Long commentId) {
        boolean isLiked = commentLikeService.toggleCommentLike(commentId);
        long likeCount = commentLikeService.getCommentLikeCount(commentId);
        
        return ResponseEntity.ok(Map.of(
                "isLiked", isLiked,
                "likeCount", likeCount
        ));
    }
    
    @GetMapping("/like/status")
    @Operation(summary = "Get comment like status", description = "Check if current user has liked the comment")
    public ResponseEntity<Map<String, Object>> getCommentLikeStatus(@PathVariable Long commentId) {
        boolean isLiked = commentLikeService.isCommentLiked(commentId);
        long likeCount = commentLikeService.getCommentLikeCount(commentId);
        
        return ResponseEntity.ok(Map.of(
                "isLiked", isLiked,
                "likeCount", likeCount
        ));
    }
    
    @PostMapping("/like/sync")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Sync comment like count", description = "Sync cached like count with actual database count (Admin only)")
    public ResponseEntity<Map<String, Object>> syncCommentLikeCount(@PathVariable Long commentId) {
        commentLikeService.syncCommentLikeCount(commentId);
        long likeCount = commentLikeService.getCommentLikeCount(commentId);
        
        return ResponseEntity.ok(Map.of(
                "message", "Like count synced successfully",
                "likeCount", likeCount
        ));
    }
}
