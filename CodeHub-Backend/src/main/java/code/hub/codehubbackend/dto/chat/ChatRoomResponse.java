package code.hub.codehubbackend.dto.chat;

import code.hub.codehubbackend.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private Long id;
    private String chatId;
    private String roomName;
    private ChatRoom.RoomType roomType;
    private List<ChatParticipantResponse> participants;
    private ChatMessageResponse lastMessage;
    private Long unreadCount;
    private Instant createdAt;
    private Instant updatedAt;
}
