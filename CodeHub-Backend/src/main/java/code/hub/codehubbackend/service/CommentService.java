package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.comment.CommentCreateRequest;
import code.hub.codehubbackend.dto.comment.CommentResponse;
import code.hub.codehubbackend.entity.Comment;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.repository.CommentRepository;
import code.hub.codehubbackend.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
      @Autowired
    private SnippetRepository snippetRepository;
    
    @Autowired
    private ActivityService activityService;
    
    public Page<CommentResponse> getSnippetComments(Long snippetId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findBySnippetIdOrderByCreatedAtDesc(snippetId, pageable);
        return comments.map(this::convertToResponse);
    }
      @Transactional
    public CommentResponse createComment(Long snippetId, CommentCreateRequest request) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("You must be logged in to comment");
        }
        
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new ResourceNotFoundException("Snippet", "id", snippetId));
          Comment comment = Comment.builder()
                .snippet(snippet)
                .author(currentUser)
                .content(request.getContent())
                .build();
        
        comment = commentRepository.save(comment);
        
        // Create comment activity
        activityService.createCommentActivity(snippet, request.getContent());
        return convertToResponse(comment);
    }
      @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        
        User currentUser = getCurrentUser();
        if (currentUser == null || !comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
    }
    
    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(CommentResponse.AuthorSummary.builder()
                        .id(comment.getAuthor().getId())
                        .username(comment.getAuthor().getUsername())
                        .avatarUrl(comment.getAuthor().getAvatarUrl())
                        .build())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return (User) authentication.getPrincipal();
    }
}
