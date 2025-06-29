package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.chat.ChatMessageRequest;
import code.hub.codehubbackend.dto.chat.ChatMessageResponse;
import code.hub.codehubbackend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@Slf4j
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public ChatMessageResponse sendMessage(@Payload ChatMessageRequest chatMessageRequest, Principal principal) {
        log.info("Received message from user: {} for chat: {}", principal.getName(), chatMessageRequest.getChatId());
        
        try {
            ChatMessageResponse response = chatService.sendMessage(chatMessageRequest, principal.getName());
            // Send to topic using the chatId from the request
            return response;
        } catch (Exception e) {
            log.error("Error sending message", e);
            throw e;
        }
    }

    @MessageMapping("/chat.markAsRead")
    public void markAsRead(@Payload ChatMessageRequest request, Principal principal) {
        log.info("Marking messages as read for user: {} in chat: {}", principal.getName(), request.getChatId());
        
        try {
            chatService.markMessagesAsRead(request.getChatId(), principal.getName());
        } catch (Exception e) {
            log.error("Error marking messages as read", e);
        }
    }

    @MessageMapping("/chat.typing")
    public void sendTypingNotification(@Payload TypingRequest request, 
                                      Principal principal) {
        log.debug("User {} is typing in chat {}", principal.getName(), request.getChatId());
        
        TypingNotification notification = new TypingNotification(principal.getName(), request.getChatId(), true);
        messagingTemplate.convertAndSend("/topic/chat/" + request.getChatId() + "/typing", notification);
    }

    @MessageMapping("/chat.stopTyping")
    public void sendStopTypingNotification(@Payload TypingRequest request, 
                                          Principal principal) {
        log.debug("User {} stopped typing in chat {}", principal.getName(), request.getChatId());
        
        TypingNotification notification = new TypingNotification(principal.getName(), request.getChatId(), false);
        messagingTemplate.convertAndSend("/topic/chat/" + request.getChatId() + "/typing", notification);
    }

    // Inner class for typing requests
    public static class TypingRequest {
        private String chatId;

        public TypingRequest() {}

        public TypingRequest(String chatId) {
            this.chatId = chatId;
        }

        public String getChatId() { return chatId; }
        public void setChatId(String chatId) { this.chatId = chatId; }
    }

    // Inner class for typing notifications
    public static class TypingNotification {
        private String username;
        private String chatId;
        private boolean isTyping;

        public TypingNotification(String username, String chatId, boolean isTyping) {
            this.username = username;
            this.chatId = chatId;
            this.isTyping = isTyping;
        }

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getChatId() { return chatId; }
        public void setChatId(String chatId) { this.chatId = chatId; }
        
        public boolean isTyping() { return isTyping; }
        public void setTyping(boolean typing) { isTyping = typing; }
    }
}
