package code.hub.codehubbackend.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RecentlyViewedRepositoryImpl {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    // Enhanced upsert method that automatically detects available columns
    @Modifying
    public void smartUpsert(Long userId, Long snippetId) {
        try {
            // Check if advanced columns exist
            if (hasAdvancedColumns()) {
                upsertWithAdvancedColumns(userId, snippetId);
            } else {
                upsertBasic(userId, snippetId);
            }
        } catch (Exception e) {
            log.warn("Smart upsert failed, falling back to basic method: {}", e.getMessage());
            upsertBasic(userId, snippetId);
        }
    }
    
    private boolean hasAdvancedColumns() {
        try {
            String sql = """
                SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'recently_viewed' 
                AND COLUMN_NAME IN ('last_viewed_at', 'version')
                """;
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            return count != null && count >= 2;
        } catch (Exception e) {
            log.debug("Failed to check advanced columns: {}", e.getMessage());
            return false;
        }
    }
    
    private void upsertWithAdvancedColumns(Long userId, Long snippetId) {
        String sql = """
            INSERT INTO recently_viewed (user_id, snippet_id, view_count, viewed_at, last_viewed_at, version) 
            VALUES (?, ?, 1, NOW(), NOW(), 0)
            ON DUPLICATE KEY UPDATE 
                view_count = view_count + 1,
                last_viewed_at = NOW(),
                version = COALESCE(version, 0) + 1
            """;
        jdbcTemplate.update(sql, userId, snippetId);
        log.debug("Used advanced upsert for user {} and snippet {}", userId, snippetId);
    }
    
    private void upsertBasic(Long userId, Long snippetId) {
        String sql = """
            INSERT INTO recently_viewed (user_id, snippet_id, view_count, viewed_at) 
            VALUES (?, ?, 1, NOW())
            ON DUPLICATE KEY UPDATE 
                view_count = view_count + 1,
                viewed_at = NOW()
            """;
        jdbcTemplate.update(sql, userId, snippetId);
        log.debug("Used basic upsert for user {} and snippet {}", userId, snippetId);
    }
}
