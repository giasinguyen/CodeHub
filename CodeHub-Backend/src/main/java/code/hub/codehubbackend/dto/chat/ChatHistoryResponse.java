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
public class ChatHistoryResponse {
    private String chatId;
    private Long totalMessages;
    private Instant firstMessageTime;
    private Instant lastMessageTime;
    private Long unreadCount;
    private boolean isActive;
    
    // Participant info
    private ParticipantInfo otherParticipant;
    private ParticipantInfo currentUser;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantInfo {
        private Long id;
        private String username;
        private String fullName;
        private String avatarUrl;
        private Instant lastSeenAt;
        private boolean isOnline;
    }
}
