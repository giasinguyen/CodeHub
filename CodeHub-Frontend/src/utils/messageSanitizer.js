import DOMPurify from 'dompurify';

class MessageSanitizer {
  /**
   * Sanitize message content to prevent XSS attacks
   */
  static sanitizeContent(content) {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Configure DOMPurify
    const config = {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'code', 'pre'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false
    };

    return DOMPurify.sanitize(content, config);
  }

  /**
   * Validate message content length and format
   */
  static validateMessage(content) {
    const errors = [];

    if (!content || content.trim().length === 0) {
      errors.push('Message cannot be empty');
    }

    if (content.length > 5000) {
      errors.push('Message too long (max 5000 characters)');
    }

    // Check for excessive whitespace
    if (content.trim().length < content.length * 0.1) {
      errors.push('Message contains too much whitespace');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedContent: this.sanitizeContent(content)
    };
  }

  /**
   * Format message for display
   */
  static formatMessage(content) {
    if (!content) return '';

    // Convert line breaks to <br> tags
    let formatted = content.replace(/\n/g, '<br>');
    
    // Auto-link URLs (basic)
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">$1</a>'
    );

    return formatted;
  }
}

export default MessageSanitizer;
