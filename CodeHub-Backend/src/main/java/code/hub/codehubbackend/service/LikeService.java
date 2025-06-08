package code.hub.codehubbackend.service;

import code.hub.codehubbackend.entity.Like;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.LikeRepository;
import code.hub.codehubbackend.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private SnippetRepository snippetRepository;
    
    @Transactional
    public boolean toggleLike(Long snippetId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("You must be logged in to like snippets");
        }
        
        Snippet snippet = snippetRepository.findById(snippetId)
                .orElseThrow(() -> new RuntimeException("Snippet not found"));
        
        boolean exists = likeRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippetId);
        
        if (exists) {
            // Unlike
            likeRepository.deleteByUserIdAndSnippetId(currentUser.getId(), snippetId);
            snippet.decrementLikeCount();
            snippetRepository.save(snippet);
            return false;
        } else {
            // Like
            Like like = Like.builder()
                    .id(new Like.LikeKey(currentUser.getId(), snippetId))
                    .user(currentUser)
                    .snippet(snippet)
                    .build();
            
            likeRepository.save(like);
            snippet.incrementLikeCount();
            snippetRepository.save(snippet);
            return true;
        }
    }
    
    public boolean isLiked(Long snippetId) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return false;
        }
        
        return likeRepository.existsByUserIdAndSnippetId(currentUser.getId(), snippetId);
    }
    
    public long getLikeCount(Long snippetId) {
        return likeRepository.countBySnippetId(snippetId);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return (User) authentication.getPrincipal();
    }
}
