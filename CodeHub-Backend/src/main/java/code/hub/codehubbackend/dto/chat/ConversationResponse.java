package code.hub.codehubbackend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private String chatId;
    private String participantUsername;
    private String participantFullName;
    private String participantAvatarUrl;
    private Long participantId;
    private String lastMessage;
    private String lastMessageType;
    private Instant lastMessageTime;
    private String lastMessageSender;
    private Long unreadCount;
    private boolean isOnline;
    private Instant lastSeenAt;
    
    // For group chats
    private String roomName;
    private Integer totalParticipants;
    private String roomType; // PRIVATE, GROUP
}
