package code.hub.codehubbackend.dto.chat;

import code.hub.codehubbackend.entity.ChatParticipant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantResponse {
    private Long id;
    private Long userId;
    private String username;
    private String avatarUrl;
    private String fullName;
    private ChatParticipant.ParticipantRole role;
    private Boolean isActive;
    private Boolean isOnline;
    private Instant lastReadAt;
    private Instant joinedAt;
}
