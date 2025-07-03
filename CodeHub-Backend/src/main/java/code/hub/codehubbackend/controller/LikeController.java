package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/snippets/{snippetId}")
@Tag(name = "Likes", description = "Like management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {
    
    @Autowired
    private LikeService likeService;
    
    @PostMapping("/like")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Toggle like", description = "Like or unlike a snippet")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long snippetId) {
        boolean isLiked = likeService.toggleLike(snippetId);
        long likeCount = likeService.getLikeCount(snippetId);
        
        return ResponseEntity.ok(Map.of(
                "isLiked", isLiked,
                "likeCount", likeCount
        ));
    }
    
    @GetMapping("/like/status")
    @Operation(summary = "Get like status", description = "Check if current user has liked the snippet")
    public ResponseEntity<Map<String, Object>> getLikeStatus(@PathVariable Long snippetId) {
        boolean isLiked = likeService.isLiked(snippetId);
        long likeCount = likeService.getLikeCount(snippetId);
        
        return ResponseEntity.ok(Map.of(
                "isLiked", isLiked,
                "likeCount", likeCount
        ));
    }
}
