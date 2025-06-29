package code.hub.codehubbackend.security;

import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ChatChannelInterceptor implements ChannelInterceptor {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null) {
            StompCommand command = accessor.getCommand();
            
            if (StompCommand.CONNECT.equals(command)) {
                // Handle initial connection authentication
                authenticateConnection(accessor);
            } else if (StompCommand.SEND.equals(command)) {
                // For message sending, check if user is already authenticated
                // If not, try to authenticate using session attributes
                if (accessor.getUser() == null) {
                    // Try to get user from session
                    Object sessionUser = accessor.getSessionAttributes().get("user");
                    if (sessionUser instanceof Authentication) {
                        accessor.setUser((Authentication) sessionUser);
                    }
                }
                
                // Set SecurityContext for the current thread
                if (accessor.getUser() instanceof Authentication) {
                    Authentication auth = (Authentication) accessor.getUser();
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        
        return message;
    }
    
    private void authenticateConnection(StompHeaderAccessor accessor) {
        // Extract JWT token from headers
        List<String> authorization = accessor.getNativeHeader("Authorization");
        
        if (authorization != null && !authorization.isEmpty()) {
            String token = authorization.get(0);
            
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                
                try {
                    if (jwtUtils.validateJwtToken(token)) {
                        String username = jwtUtils.getUserNameFromJwtToken(token);
                        User user = userRepository.findByUsername(username)
                                .orElse(null);
                        
                        if (user != null) {
                            Authentication auth = new UsernamePasswordAuthenticationToken(
                                    user, null, user.getAuthorities());
                            accessor.setUser(auth);
                            
                            // Store in session for later use
                            accessor.getSessionAttributes().put("user", auth);
                            accessor.getSessionAttributes().put("username", username);
                            accessor.getSessionAttributes().put("userId", user.getId());
                            
                            log.info("WebSocket connection authenticated for user: {}", username);
                        }
                    }
                } catch (Exception e) {
                    log.error("Error authenticating WebSocket connection", e);
                }
            }
        }
    }
}
