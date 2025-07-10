package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.comment.CommentCreateRequest;
import code.hub.codehubbackend.dto.comment.CommentResponse;
import code.hub.codehubbackend.entity.Comment;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.repository.CommentRepository;
import code.hub.codehubbackend.repository.CommentLikeRepository;
import code.hub.codehubbackend.repository.SnippetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final SnippetRepository snippetRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    
    public Page<CommentResponse> getSnippetComments(Long snippetId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        // Get main comments only (not replies)
        Page<Comment> comments = commentRepository.findMainCommentsBySnippetId(snippetId, pageable);
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
        
        Comment.CommentBuilder commentBuilder = Comment.builder()
                .snippet(snippet)
                .author(currentUser)
                .content(request.getContent());
        
        // Handle reply to another comment
        if (request.getParentCommentId() != null) {
            Comment parentComment = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment", "id", request.getParentCommentId()));
            commentBuilder.parentComment(parentComment);
        }
        
        Comment comment = commentRepository.save(commentBuilder.build());
        
        // Create comment activity
        activityService.createCommentActivity(snippet, request.getContent());
        
        // Create notification for snippet owner
        if (!snippet.getOwner().getId().equals(currentUser.getId())) {
            notificationService.createSnippetCommentNotification(snippet, comment, currentUser);
        }
        
        // Create notification for parent comment author if this is a reply
        if (comment.getParentComment() != null && 
            !comment.getParentComment().getAuthor().getId().equals(currentUser.getId())) {
            notificationService.createCommentReplyNotification(comment.getParentComment(), comment, currentUser);
        }
        
        return convertToResponse(comment);
    }
    
    @Transactional
    public CommentResponse updateComment(Long commentId, CommentCreateRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        
        User currentUser = getCurrentUser();
        if (currentUser == null || !comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }
        
        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        
        return convertToResponse(comment);
    }
    
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        
        User currentUser = getCurrentUser();
        boolean isOwner = currentUser != null && comment.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser != null && "ADMIN".equals(currentUser.getRole().toString());
        
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        
        // Soft delete to preserve data integrity
        comment.softDelete();
        commentRepository.save(comment);
    }
    
    private CommentResponse convertToResponse(Comment comment) {
        User currentUser = getCurrentUser();
        
        // Check if current user has liked this comment
        boolean isLiked = currentUser != null && 
                commentLikeRepository.existsByUserIdAndCommentId(currentUser.getId(), comment.getId());
        
        // Get actual like count from database to ensure accuracy
        long actualLikeCount = commentLikeRepository.countByCommentId(comment.getId());
        
        // Update cached like count if different (for consistency)
        if (comment.getLikeCount() == null || comment.getLikeCount() != actualLikeCount) {
            comment.setLikeCount((int) actualLikeCount);
            commentRepository.save(comment);
        }
        
        // Check permissions
        boolean canEdit = currentUser != null && comment.getAuthor().getId().equals(currentUser.getId());
        boolean canDelete = canEdit || (currentUser != null && "ADMIN".equals(currentUser.getRole().toString()));
        
        // Load replies
        List<Comment> replies = commentRepository.findRepliesByParentCommentId(comment.getId());
        List<CommentResponse> replyResponses = replies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getIsDeleted() ? "[This comment has been deleted]" : comment.getContent())
                .author(CommentResponse.AuthorSummary.builder()
                        .id(comment.getAuthor().getId())
                        .username(comment.getAuthor().getUsername())
                        .fullName(comment.getAuthor().getFullName())
                        .avatarUrl(comment.getAuthor().getAvatarUrl())
                        .role(comment.getAuthor().getRole().toString())
                        .build())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .likeCount((int) actualLikeCount)
                .isLiked(isLiked)
                .canEdit(canEdit && !comment.getIsDeleted())
                .canDelete(canDelete && !comment.getIsDeleted())
                .isDeleted(comment.getIsDeleted())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .replies(replyResponses)
                .replyCount(replies.size())
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
