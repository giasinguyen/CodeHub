package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.comment.CommentCreateRequest;
import code.hub.codehubbackend.dto.comment.CommentResponse;
import code.hub.codehubbackend.service.CommentService;
import code.hub.codehubbackend.service.CommentLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/snippets/{snippetId}/comments")
@Tag(name = "Comments", description = "Comment management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;
    private final CommentLikeService commentLikeService;
    
    @GetMapping
    @Operation(summary = "Get snippet comments", description = "Retrieve paginated comments for a specific snippet")
    public ResponseEntity<Page<CommentResponse>> getSnippetComments(
            @PathVariable Long snippetId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Page<CommentResponse> comments = commentService.getSnippetComments(snippetId, page, size);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Create comment", description = "Add a new comment to a snippet")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long snippetId,
            @Valid @RequestBody CommentCreateRequest request) {
        
        CommentResponse comment = commentService.createComment(snippetId, request);
        return ResponseEntity.ok(comment);
    }
    
    @PutMapping("/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Update comment", description = "Update an existing comment")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentCreateRequest request) {
        
        CommentResponse comment = commentService.updateComment(commentId, request);
        return ResponseEntity.ok(comment);
    }
    
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Delete comment", description = "Delete a comment")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{commentId}/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Toggle like on a comment", description = "Like or unlike a comment")
    public ResponseEntity<Map<String, Object>> toggleCommentLike(@PathVariable Long commentId) {
        boolean isLiked = commentLikeService.toggleCommentLike(commentId);
        long likeCount = commentLikeService.getCommentLikeCount(commentId);
        return ResponseEntity.ok(Map.of(
            "liked", isLiked,
            "likeCount", likeCount,
            "message", isLiked ? "Comment liked successfully" : "Comment unliked successfully"
        ));
    }
    
    @GetMapping("/{commentId}/like-status")
    @Operation(summary = "Check if comment is liked", description = "Check if the current user has liked the comment")
    public ResponseEntity<Map<String, Object>> getCommentLikeStatus(@PathVariable Long commentId) {
        boolean isLiked = commentLikeService.isCommentLiked(commentId);
        long likeCount = commentLikeService.getCommentLikeCount(commentId);
        return ResponseEntity.ok(Map.of(
            "liked", isLiked,
            "likeCount", likeCount
        ));
    }
    
    @PostMapping("/sync-like-counts")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Sync all comment like counts", description = "Sync cached like counts with actual database counts (Admin only)")
    public ResponseEntity<Map<String, String>> syncAllCommentLikeCounts() {
        commentLikeService.syncAllCommentLikeCounts();
        return ResponseEntity.ok(Map.of("message", "All comment like counts synced successfully"));
    }
}
