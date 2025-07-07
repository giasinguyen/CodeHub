package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.comment.CommentCreateRequest;
import code.hub.codehubbackend.dto.comment.CommentResponse;
import code.hub.codehubbackend.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/snippets/{snippetId}/comments")
@Tag(name = "Comments", description = "Comment management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
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
    
    @DeleteMapping("/{commentId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Delete comment", description = "Delete a comment")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
}
