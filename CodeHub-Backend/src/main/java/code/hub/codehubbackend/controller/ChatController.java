package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.dto.chat.*;
import code.hub.codehubbackend.entity.ChatMessage;
import code.hub.codehubbackend.entity.ChatParticipant;
import code.hub.codehubbackend.entity.ChatRoom;
import code.hub.codehubbackend.entity.User;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.repository.ChatParticipantRepository;
import code.hub.codehubbackend.repository.ChatRoomRepository;
import code.hub.codehubbackend.repository.UserRepository;
import code.hub.codehubbackend.service.ChatService;
import code.hub.codehubbackend.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Chat and messaging APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final CloudinaryService cloudinaryService;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatParticipantRepository chatParticipantRepository;

    @PostMapping("/rooms")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Create private chat room", description = "Create a private chat room with another user")
    public ResponseEntity<ChatRoomResponse> createPrivateChat(@Valid @RequestBody CreateChatRoomRequest request) {
        ChatRoomResponse chatRoom = chatService.createPrivateChat(request);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/rooms")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get user's chat rooms", description = "Get paginated list of user's chat rooms")
    public ResponseEntity<Page<ChatRoomResponse>> getUserChatRooms(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size) {
        
        Page<ChatRoomResponse> chatRooms = chatService.getUserChatRooms(page, size);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/rooms/{chatId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get chat room details", description = "Get details of a specific chat room")
    public ResponseEntity<ChatRoomResponse> getChatRoom(@PathVariable String chatId) {
        ChatRoomResponse chatRoom = chatService.getChatRoom(chatId);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/rooms/{chatId}/messages")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Get chat messages", description = "Get paginated messages from a chat room")
    public ResponseEntity<Page<ChatMessageResponse>> getChatMessages(
            @PathVariable String chatId,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "50") int size) {
        
        Page<ChatMessageResponse> messages = chatService.getChatMessages(chatId, page, size);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Send message", description = "Send a message to a chat room")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse message = chatService.sendMessage(request);
        return ResponseEntity.ok(message);
    }

    @PutMapping("/rooms/{chatId}/read")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Mark messages as read", description = "Mark all messages in a chat room as read")
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable String chatId) {
        log.info("🔍 [ChatController] Received markMessagesAsRead request for chatId: {}", chatId);
        chatService.markMessagesAsRead(chatId);
        log.info("🔍 [ChatController] Successfully marked messages as read for chatId: {}", chatId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Search chat rooms", description = "Search user's chat rooms by name or participant")
    public ResponseEntity<List<ChatRoomResponse>> searchChatRooms(
            @Parameter(description = "Search term") @RequestParam("q") String searchTerm) {
        
        List<ChatRoomResponse> chatRooms = chatService.searchChatRooms(searchTerm);
        return ResponseEntity.ok(chatRooms);
    }

    @GetMapping("/debug/unread/{chatId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Debug unread messages", description = "Get detailed information about unread messages for debugging")
    public ResponseEntity<Map<String, Object>> debugUnreadMessages(@PathVariable String chatId) {
        return chatService.debugUnreadMessages(chatId);
    }

    @PostMapping("/send-file")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @Operation(summary = "Send file message", description = "Upload and send a file in chat")
    public ResponseEntity<Map<String, Object>> sendFileMessage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "recipientUsername", required = false) String recipientUsername,
            @RequestParam(value = "roomId", required = false) String roomId,
            @RequestParam("messageType") String messageType,
            Authentication authentication) {
        
        try {
            log.info("📎 [ChatController] Received file upload request - file: {}, size: {}, recipient: {}, roomId: {}", 
                     file.getOriginalFilename(), file.getSize(), recipientUsername, roomId);
            
            // Validate file
            if (file.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check file size (10MB limit)
            long maxFileSize = 10 * 1024 * 1024; // 10MB
            if (file.getSize() > maxFileSize) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "File size exceeds 10MB limit");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Upload file to Cloudinary
            String fileUrl = cloudinaryService.uploadFile(file, "chat-files");
            log.info("📎 [ChatController] File uploaded successfully to: {}", fileUrl);
            
            // Determine chat ID - either from direct roomId or create/find private chat
            String chatId = roomId;
            if (chatId == null && recipientUsername != null) {
                // For direct messages, find or create private chat
                User currentUser = userRepository.findByUsername(authentication.getName())
                        .orElseThrow(() -> new UnauthorizedException("User not found"));
                User recipient = userRepository.findByUsername(recipientUsername)
                        .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));
                
                // Find existing private chat or create new one
                ChatRoom existingChat = chatRoomRepository.findPrivateChatBetweenUsers(currentUser, recipient)
                        .orElse(null);
                
                if (existingChat != null) {
                    chatId = existingChat.getChatId();
                } else {
                    // Create new private chat room
                    ChatRoom newChatRoom = ChatRoom.builder()
                            .chatId(UUID.randomUUID().toString())
                            .roomType(ChatRoom.RoomType.PRIVATE)
                            .roomName(null)
                            .isActive(true)
                            .build();
                    newChatRoom = chatRoomRepository.save(newChatRoom);
                    chatId = newChatRoom.getChatId();
                    
                    // Add participants
                    chatParticipantRepository.save(ChatParticipant.builder()
                            .chatRoom(newChatRoom)
                            .user(currentUser)
                            .isActive(true)
                            .build());
                    
                    chatParticipantRepository.save(ChatParticipant.builder()
                            .chatRoom(newChatRoom)
                            .user(recipient)
                            .isActive(true)
                            .build());
                }
            }
            
            if (chatId == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Either roomId or recipientUsername must be provided");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create file message
            ChatMessageRequest messageRequest = new ChatMessageRequest();
            messageRequest.setContent(file.getOriginalFilename());
            messageRequest.setMessageType(ChatMessage.MessageType.valueOf(messageType));
            messageRequest.setChatId(chatId);
            messageRequest.setFileUrl(fileUrl);
            messageRequest.setFileName(file.getOriginalFilename());
            messageRequest.setFileSize(file.getSize());
            
            // Send message through chat service
            ChatMessageResponse messageResponse = chatService.sendMessage(messageRequest, authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "File sent successfully");
            response.put("data", messageResponse);
            response.put("fileUrl", fileUrl);
            
            log.info("📎 [ChatController] File message sent successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ [ChatController] Error sending file message", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send file: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
