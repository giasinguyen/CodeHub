package code.hub.codehubbackend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatStatsResponse {
    private Long totalConversations;
    private Long totalMessages;
    private Long unreadMessages;
    private Long activeConversations;
    private Long archivedConversations;
}
