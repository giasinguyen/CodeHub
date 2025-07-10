package code.hub.codehubbackend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@Slf4j
public class DatabaseMigration {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean
    public ApplicationRunner databaseMigrationRunner() {
        return args -> {
            log.info("🔄 Starting database migration...");
            
            try {
                // Check and create migration tracking table
                createMigrationTable();
                
                // Run migrations
                migrateRecentlyViewedTable();
                migrateNotificationTypeColumn();
                
                log.info("✅ Database migration completed successfully!");
                
            } catch (Exception e) {
                log.error("❌ Database migration failed: {}", e.getMessage());
                // Don't throw exception to prevent application startup failure
            }
        };
    }

    private void createMigrationTable() {
        try {
            String sql = """
                CREATE TABLE IF NOT EXISTS migration_history (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    migration_name VARCHAR(255) NOT NULL UNIQUE,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    success BOOLEAN DEFAULT TRUE
                )
                """;
            jdbcTemplate.execute(sql);
            log.debug("Migration tracking table ensured");
        } catch (Exception e) {
            log.warn("Failed to create migration table: {}", e.getMessage());
        }
    }

    private void migrateRecentlyViewedTable() {
        String migrationName = "recently_viewed_v2";
        
        try {
            // Check if migration already ran
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM migration_history WHERE migration_name = ?",
                Integer.class, migrationName
            );
            
            if (count != null && count > 0) {
                log.info("Migration '{}' already executed, skipping", migrationName);
                return;
            }
            
        } catch (Exception e) {
            log.debug("Migration table check failed, proceeding with migration: {}", e.getMessage());
        }

        try {
            log.info("🔧 Migrating recently_viewed table...");
            
            // Add version column if not exists
            addColumnIfNotExists("recently_viewed", "version", "BIGINT DEFAULT 0");
            
            // Add last_viewed_at column if not exists
            addColumnIfNotExists("recently_viewed", "last_viewed_at", 
                "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            
            // Update existing records
            String updateSql = """
                UPDATE recently_viewed 
                SET last_viewed_at = COALESCE(last_viewed_at, viewed_at), 
                    version = COALESCE(version, 0) 
                WHERE last_viewed_at IS NULL OR version IS NULL
                """;
            int updated = jdbcTemplate.update(updateSql);
            log.info("Updated {} existing records", updated);
            
            // Create indexes
            createIndexIfNotExists("idx_recently_viewed_user_last_viewed", 
                "recently_viewed", "(user_id, last_viewed_at DESC)");
            createIndexIfNotExists("idx_recently_viewed_snippet", 
                "recently_viewed", "(snippet_id)");
            createUniqueIndexIfNotExists("idx_recently_viewed_user_snippet", 
                "recently_viewed", "(user_id, snippet_id)");
            
            // Record successful migration
            try {
                jdbcTemplate.update(
                    "INSERT INTO migration_history (migration_name, success) VALUES (?, ?)",
                    migrationName, true
                );
            } catch (Exception e) {
                log.debug("Failed to record migration: {}", e.getMessage());
            }
            
            log.info("✅ Recently viewed table migration completed");
            
        } catch (Exception e) {
            log.error("❌ Failed to migrate recently_viewed table: {}", e.getMessage());
            
            // Record failed migration
            try {
                jdbcTemplate.update(
                    "INSERT INTO migration_history (migration_name, success) VALUES (?, ?)",
                    migrationName, false
                );
            } catch (Exception recordError) {
                log.debug("Failed to record migration failure: {}", recordError.getMessage());
            }
        }
    }

    private void addColumnIfNotExists(String tableName, String columnName, String columnDefinition) {
        try {
            // Check if column exists
            String checkSql = """
                SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = ? 
                AND COLUMN_NAME = ?
                """;
            
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, tableName, columnName);
            
            if (count == null || count == 0) {
                String alterSql = String.format("ALTER TABLE %s ADD COLUMN %s %s", 
                    tableName, columnName, columnDefinition);
                jdbcTemplate.execute(alterSql);
                log.info("✅ Added column {} to table {}", columnName, tableName);
            } else {
                log.debug("Column {} already exists in table {}", columnName, tableName);
            }
            
        } catch (Exception e) {
            log.warn("Failed to add column {} to table {}: {}", columnName, tableName, e.getMessage());
        }
    }

    private void createIndexIfNotExists(String indexName, String tableName, String indexDefinition) {
        try {
            // Check if index exists
            String checkSql = """
                SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = ? 
                AND INDEX_NAME = ?
                """;
            
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, tableName, indexName);
            
            if (count == null || count == 0) {
                String createSql = String.format("CREATE INDEX %s ON %s %s", 
                    indexName, tableName, indexDefinition);
                jdbcTemplate.execute(createSql);
                log.info("✅ Created index {} on table {}", indexName, tableName);
            } else {
                log.debug("Index {} already exists on table {}", indexName, tableName);
            }
            
        } catch (Exception e) {
            log.warn("Failed to create index {} on table {}: {}", indexName, tableName, e.getMessage());
        }
    }

    private void createUniqueIndexIfNotExists(String indexName, String tableName, String indexDefinition) {
        try {
            // Check if index exists
            String checkSql = """
                SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = ? 
                AND INDEX_NAME = ?
                """;
            
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, tableName, indexName);
            
            if (count == null || count == 0) {
                String createSql = String.format("CREATE UNIQUE INDEX %s ON %s %s", 
                    indexName, tableName, indexDefinition);
                jdbcTemplate.execute(createSql);
                log.info("✅ Created unique index {} on table {}", indexName, tableName);
            } else {
                log.debug("Index {} already exists on table {}", indexName, tableName);
            }
            
        } catch (Exception e) {
            log.warn("Failed to create unique index {} on table {}: {}", indexName, tableName, e.getMessage());
        }
    }
    
    private void migrateNotificationTypeColumn() {
        String migrationName = "notification_type_column_length";
        
        try {
            // Check if migration already ran
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM migration_history WHERE migration_name = ?",
                Integer.class, migrationName
            );
            
            if (count != null && count > 0) {
                log.info("Migration '{}' already executed, skipping", migrationName);
                return;
            }
            
        } catch (Exception e) {
            log.debug("Migration table check failed, proceeding with migration: {}", e.getMessage());
        }

        try {
            log.info("🔧 Migrating notification type column length...");
            
            // Check current column definition
            String checkColumnSql = """
                SELECT CHARACTER_MAXIMUM_LENGTH 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'notifications' 
                AND COLUMN_NAME = 'type'
                """;
            
            Integer currentLength = jdbcTemplate.queryForObject(checkColumnSql, Integer.class);
            
            if (currentLength == null || currentLength < 50) {
                // Alter the type column to accommodate longer enum values
                String alterSql = "ALTER TABLE notifications MODIFY COLUMN type VARCHAR(50) NOT NULL";
                jdbcTemplate.execute(alterSql);
                log.info("✅ Updated notification type column length to VARCHAR(50)");
            } else {
                log.info("Notification type column already has sufficient length: {}", currentLength);
            }
            
            // Record successful migration
            try {
                jdbcTemplate.update(
                    "INSERT INTO migration_history (migration_name, success) VALUES (?, ?)",
                    migrationName, true
                );
            } catch (Exception e) {
                log.debug("Failed to record migration: {}", e.getMessage());
            }
            
            log.info("✅ Notification type column migration completed");
            
        } catch (Exception e) {
            log.error("❌ Failed to migrate notification type column: {}", e.getMessage());
            
            // Record failed migration
            try {
                jdbcTemplate.update(
                    "INSERT INTO migration_history (migration_name, success) VALUES (?, ?)",
                    migrationName, false
                );
            } catch (Exception recordError) {
                log.debug("Failed to record migration failure: {}", recordError.getMessage());
            }
        }
    }
}
