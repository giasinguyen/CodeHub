package code.hub.codehubbackend.dto.chat;

import code.hub.codehubbackend.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private Long id;
    private String chatId;
    private Long senderId;
    private String senderUsername;
    private String senderAvatarUrl;
    private String content;
    private ChatMessage.MessageType messageType;
    private String attachmentUrl;
    private Boolean isRead;
    private Boolean isEdited;
    private Instant createdAt;
    private Instant editedAt;
    private SenderInfo sender;
    
    // File-related fields
    private String fileUrl;
    private String fileName;
    private Long fileSize;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SenderInfo {
        private Long id;
        private String username;
        private String fullName;
        private String avatarUrl;
    }
}
