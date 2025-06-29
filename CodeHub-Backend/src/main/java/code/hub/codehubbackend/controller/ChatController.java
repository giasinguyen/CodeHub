package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.chat.*;
import code.hub.codehubbackend.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Chat and messaging APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/rooms")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create private chat room", description = "Create a private chat room with another user")
    public ResponseEntity<ChatRoomResponse> createPrivateChat(@Valid @RequestBody CreateChatRoomRequest request) {
        ChatRoomResponse chatRoom = chatService.createPrivateChat(request);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/rooms")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get user's chat rooms", description = "Get paginated list of user's chat rooms")
    public ResponseEntity<Page<ChatRoomResponse>> getUserChatRooms(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Page<ChatRoomResponse> chatRooms = chatService.getUserChatRooms(page, size);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/rooms/{chatId}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get chat room details", description = "Get details of a specific chat room")
    public ResponseEntity<ChatRoomResponse> getChatRoom(@PathVariable String chatId) {
        ChatRoomResponse chatRoom = chatService.getChatRoom(chatId);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/rooms/{chatId}/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get chat messages", description = "Get paginated messages from a chat room")
    public ResponseEntity<Page<ChatMessageResponse>> getChatMessages(
            @PathVariable String chatId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        
        Page<ChatMessageResponse> messages = chatService.getChatMessages(chatId, page, size);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Send message", description = "Send a message to a chat room")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse message = chatService.sendMessage(request);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/rooms/{chatId}/read")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Mark messages as read", description = "Mark all messages in a chat room as read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable String chatId) {
        chatService.markMessagesAsRead(chatId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/search")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Search chat rooms", description = "Search user's chat rooms by name or participant")
    public ResponseEntity<List<ChatRoomResponse>> searchChatRooms(
            @Parameter(description = "Search term") @RequestParam("q") String searchTerm) {
        
        List<ChatRoomResponse> chatRooms = chatService.searchChatRooms(searchTerm);
        return ResponseEntity.ok(chatRooms);
    }
}
