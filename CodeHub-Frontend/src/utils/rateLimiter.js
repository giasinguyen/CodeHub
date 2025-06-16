// Simple rate limiter for frontend API calls
class RateLimiter {
  constructor() {
    this.calls = new Map();
    this.limits = new Map();
  }

  // Set rate limit for a specific key (e.g., 'follow-status', 'user-stats')
  setLimit(key, maxCalls = 5, windowMs = 60000) {
    this.limits.set(key, { maxCalls, windowMs });
  }

  // Check if a call is allowed
  isAllowed(key, identifier = '') {
    const fullKey = `${key}:${identifier}`;
    const limit = this.limits.get(key);
    
    if (!limit) {
      // No limit set, allow the call
      return true;
    }

    const now = Date.now();
    const calls = this.calls.get(fullKey) || [];
    
    // Remove old calls outside the window
    const recentCalls = calls.filter(time => now - time < limit.windowMs);
    
    // Update the calls array
    this.calls.set(fullKey, recentCalls);
    
    // Check if we're under the limit
    if (recentCalls.length < limit.maxCalls) {
      // Add this call to the list
      recentCalls.push(now);
      this.calls.set(fullKey, recentCalls);
      return true;
    }
    
    return false;
  }

  // Clear all rate limit data
  clear() {
    this.calls.clear();
  }

  // Get remaining calls for a key
  getRemainingCalls(key, identifier = '') {
    const fullKey = `${key}:${identifier}`;
    const limit = this.limits.get(key);
    
    if (!limit) {
      return Infinity;
    }

    const now = Date.now();
    const calls = this.calls.get(fullKey) || [];
    const recentCalls = calls.filter(time => now - time < limit.windowMs);
    
    return Math.max(0, limit.maxCalls - recentCalls.length);
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();

// Set default limits
rateLimiter.setLimit('follow-status', 3, 10000); // 3 calls per 10 seconds
rateLimiter.setLimit('user-stats', 3, 10000); // 3 calls per 10 seconds
rateLimiter.setLimit('user-snippets', 5, 15000); // 5 calls per 15 seconds

export default rateLimiter;
