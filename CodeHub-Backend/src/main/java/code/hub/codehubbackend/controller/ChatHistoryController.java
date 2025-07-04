package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.chat.*;
import code.hub.codehubbackend.service.ChatHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat/history")
@Tag(name = "Chat History", description = "Chat history and conversation management APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Slf4j
public class ChatHistoryController {

    private final ChatHistoryService chatHistoryService;

    @GetMapping("/conversations")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get all conversations", description = "Get paginated list of user's conversations ordered by latest activity")
    public ResponseEntity<Page<ConversationResponse>> getConversations(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Page<ConversationResponse> conversations = chatHistoryService.getConversations(page, size);
        return ResponseEntity.ok(conversations);
    }

    @GetMapping("/conversations/{username}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get conversation history", description = "Get conversation history with a specific user")
    public ResponseEntity<ChatHistoryResponse> getConversationHistory(@PathVariable String username) {
        ChatHistoryResponse history = chatHistoryService.getConversationHistory(username);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/conversations/{username}/messages")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get conversation messages", description = "Get paginated messages from conversation with a specific user")
    public ResponseEntity<Page<ChatMessageResponse>> getConversationMessages(
            @PathVariable String username,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        
        Page<ChatMessageResponse> messages = chatHistoryService.getConversationMessages(username, page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/chatrooms/{chatId}/messages")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get chat messages by chat ID", description = "Get paginated messages from a specific chat room")
    public ResponseEntity<Page<ChatMessageResponse>> getConversationMessagesByChatId(
            @PathVariable String chatId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        
        Page<ChatMessageResponse> messages = chatHistoryService.getConversationMessagesByChatId(chatId, page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Search messages", description = "Search messages across all conversations")
    public ResponseEntity<Page<ChatMessageResponse>> searchMessages(
            @Parameter(description = "Search term") @RequestParam("q") String searchTerm,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Page<ChatMessageResponse> messages = chatHistoryService.searchMessagesInAllConversations(searchTerm, page, size);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get chat statistics", description = "Get user's chat statistics including total conversations, messages, and unread count")
    public ResponseEntity<ChatStatsResponse> getChatStats() {
        log.info("🔍 [ChatHistoryController] getChatStats called");
        ChatStatsResponse stats = chatHistoryService.getChatStats();
        log.info("🔍 [ChatHistoryController] getChatStats returning: {}", stats);
        return ResponseEntity.ok(stats);
    }
}
