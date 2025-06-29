package code.hub.codehubbackend.dto.chat;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateChatRoomRequest {
    @NotNull(message = "Participant user ID is required")
    private Long participantUserId;
    
    private String roomName; // Optional for private chats
}
