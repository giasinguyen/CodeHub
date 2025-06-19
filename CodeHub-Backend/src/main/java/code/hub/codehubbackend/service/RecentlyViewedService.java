package code.hub.codehubbackend.service;

import code.hub.codehubbackend.entity.RecentlyViewed;
import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.RecentlyViewedRepository;
import code.hub.codehubbackend.repository.RecentlyViewedRepositoryImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class RecentlyViewedService {
    
    @Autowired
    private RecentlyViewedRepository recentlyViewedRepository;
    
    @Autowired
    private RecentlyViewedRepositoryImpl recentlyViewedRepositoryImpl;
    
    @Transactional
    public void recordView(User user, Long snippetId) {
        try {
            recentlyViewedRepositoryImpl.smartUpsert(user.getId(), snippetId);
        } catch (Exception e) {
            log.warn("Failed to record recently viewed for user {} and snippet {}: {}", 
                     user.getId(), snippetId, e.getMessage());
        }
    }
    
    public Page<RecentlyViewed> getRecentlyViewedByUser(User user, Pageable pageable) {
        try {
            // Try to use the new lastViewedAt field
            return recentlyViewedRepository.findByUserOrderByLastViewedAtDesc(user, pageable);
        } catch (Exception e) {
            log.warn("Failed to fetch recently viewed with lastViewedAt, falling back to viewedAt: {}", e.getMessage());
            // Fallback to old method if new column doesn't exist
            try {
                return recentlyViewedRepository.findByUserOrderByViewedAtDesc(user, pageable);
            } catch (Exception fallbackError) {
                log.error("Failed to fetch recently viewed snippets: {}", fallbackError.getMessage());
                // Return empty page if all fails
                return Page.empty(pageable);
            }
        }
    }
    
    @Transactional
    public void removeFromRecentlyViewed(User user, Snippet snippet) {
        recentlyViewedRepository.deleteByUserAndSnippet(user, snippet);
    }
    
    @Transactional
    public void clearRecentlyViewed(User user) {
        recentlyViewedRepository.deleteByUser(user);
    }
    
    public long countByUser(User user) {
        return recentlyViewedRepository.countByUser(user);
    }
}
