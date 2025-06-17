-- Create the recently_viewed table
CREATE TABLE IF NOT EXISTS recently_viewed (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    snippet_id BIGINT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_snippet (user_id, snippet_id)
);

-- Create index for better performance
CREATE INDEX idx_recently_viewed_user_viewed_at ON recently_viewed (user_id, viewed_at DESC);
CREATE INDEX idx_recently_viewed_snippet ON recently_viewed (snippet_id);
