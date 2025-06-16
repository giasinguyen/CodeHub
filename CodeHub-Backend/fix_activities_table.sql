-- Fix for activities table enum data truncation issue
-- Run this script in HeidiSQL to fix the corrupted data

USE codehub;

-- First, let's see what invalid data exists
SELECT id, type, target_type FROM activities WHERE type NOT IN (
    'COMMENT_ADDED',
    'COMMENT_DELETED', 
    'PROFILE_UPDATED',
    'SNIPPET_CREATED',
    'SNIPPET_DELETED',
    'SNIPPET_FAVORITED',
    'SNIPPET_LIKED',
    'SNIPPET_UNFAVORITED',
    'SNIPPET_UNLIKED',
    'SNIPPET_UPDATED',
    'SNIPPET_VIEWED',
    'USER_FOLLOWED',
    'USER_UNFOLLOWED'
);

-- Delete rows with invalid type values (these are causing the truncation error)
DELETE FROM activities WHERE type NOT IN (
    'COMMENT_ADDED',
    'COMMENT_DELETED', 
    'PROFILE_UPDATED',
    'SNIPPET_CREATED',
    'SNIPPET_DELETED',
    'SNIPPET_FAVORITED',
    'SNIPPET_LIKED',
    'SNIPPET_UNFAVORITED',
    'SNIPPET_UNLIKED',
    'SNIPPET_UPDATED',
    'SNIPPET_VIEWED',
    'USER_FOLLOWED',
    'USER_UNFOLLOWED'
);

-- Alternative: Update invalid values to a default valid value
-- Uncomment these lines if you want to keep the rows but fix the type values
/*
UPDATE activities 
SET type = 'SNIPPET_VIEWED' 
WHERE type NOT IN (
    'COMMENT_ADDED',
    'COMMENT_DELETED', 
    'PROFILE_UPDATED',
    'SNIPPET_CREATED',
    'SNIPPET_DELETED',
    'SNIPPET_FAVORITED',
    'SNIPPET_LIKED',
    'SNIPPET_UNFAVORITED',
    'SNIPPET_UNLIKED',
    'SNIPPET_UPDATED',
    'SNIPPET_VIEWED',
    'USER_FOLLOWED',
    'USER_UNFOLLOWED'
);
*/

-- Now modify the column to use the proper enum with sufficient length
ALTER TABLE activities MODIFY COLUMN type ENUM(
    'COMMENT_ADDED',
    'COMMENT_DELETED', 
    'PROFILE_UPDATED',
    'SNIPPET_CREATED',
    'SNIPPET_DELETED',
    'SNIPPET_FAVORITED',
    'SNIPPET_LIKED',
    'SNIPPET_UNFAVORITED',
    'SNIPPET_UNLIKED',
    'SNIPPET_UPDATED',
    'SNIPPET_VIEWED',
    'USER_FOLLOWED',
    'USER_UNFOLLOWED'
) NOT NULL;

-- Also ensure target_type has sufficient length
ALTER TABLE activities MODIFY COLUMN target_type VARCHAR(50);

-- Check the final structure
DESCRIBE activities;

-- Verify all data is now valid
SELECT COUNT(*) as total_activities FROM activities;
SELECT type, COUNT(*) as count FROM activities GROUP BY type;