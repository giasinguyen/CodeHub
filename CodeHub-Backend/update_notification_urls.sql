-- Update existing follow notifications to use /users/ instead of /profile/
-- This script updates actionUrl for USER_FOLLOWED notifications from /profile/username to /users/username

UPDATE notifications 
SET action_url = REPLACE(action_url, '/profile/', '/users/')
WHERE type = 'USER_FOLLOWED' 
  AND action_url LIKE '/profile/%';

-- Verify the changes
SELECT id, type, title, action_url, created_at 
FROM notifications 
WHERE type = 'USER_FOLLOWED'
ORDER BY created_at DESC
LIMIT 10;
