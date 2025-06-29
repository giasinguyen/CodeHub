package code.hub.codehubbackend.dto.chat;

import code.hub.codehubbackend.entity.ChatMessage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotNull(message = "Message type is required")
    private ChatMessage.MessageType messageType;

    private String attachmentUrl;

    @NotBlank(message = "Chat room ID is required")
    private String chatId;
}
