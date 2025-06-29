package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.chat.*;
import code.hub.codehubbackend.entity.*;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.exception.UnauthorizedException;
import code.hub.codehubbackend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public ChatRoomResponse createPrivateChat(CreateChatRoomRequest request) {
        User currentUser = getCurrentUser();
        User otherUser = userRepository.findById(request.getParticipantUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if private chat already exists
        return chatRoomRepository.findPrivateChatBetweenUsers(currentUser, otherUser)
                .map(this::convertToChatRoomResponse)
                .orElseGet(() -> {
                    // Create new private chat room
                    ChatRoom chatRoom = ChatRoom.builder()
                            .chatId(UUID.randomUUID().toString())
                            .roomName(generatePrivateChatName(currentUser, otherUser))
                            .roomType(ChatRoom.RoomType.PRIVATE)
                            .build();

                    chatRoom = chatRoomRepository.save(chatRoom);

                    // Add participants
                    createParticipant(chatRoom, currentUser, ChatParticipant.ParticipantRole.MEMBER);
                    createParticipant(chatRoom, otherUser, ChatParticipant.ParticipantRole.MEMBER);

                    log.info("Created private chat room {} between users {} and {}", 
                            chatRoom.getChatId(), currentUser.getUsername(), otherUser.getUsername());

                    return convertToChatRoomResponse(chatRoom);
                });
    }

    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        User sender = getCurrentUser();
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(request.getChatId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Verify user is participant
        if (!chatParticipantRepository.existsByChatRoomAndUserAndIsActiveTrue(chatRoom, sender)) {
            throw new UnauthorizedException("You are not a participant in this chat");
        }

        // Create message
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(request.getContent())
                .messageType(request.getMessageType())
                .attachmentUrl(request.getAttachmentUrl())
                .isRead(false)
                .isEdited(false)
                .build();

        message = chatMessageRepository.save(message);

        // Update chat room's updated timestamp
        chatRoom.setUpdatedAt(Instant.now());
        chatRoomRepository.save(chatRoom);

        // Convert to response
        ChatMessageResponse response = convertToChatMessageResponse(message);

        // Send to all participants via WebSocket
        List<ChatParticipant> participants = chatParticipantRepository.findByChatRoomAndIsActiveTrue(chatRoom);
        participants.forEach(participant -> {
            if (!participant.getUser().getId().equals(sender.getId())) {
                messagingTemplate.convertAndSendToUser(
                        participant.getUser().getUsername(),
                        "/queue/messages",
                        response
                );
            }
        });

        // Also send to topic for the chat room
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoom.getChatId(), response);

        log.info("Message sent in chat room {} by user {}", chatRoom.getChatId(), sender.getUsername());

        return response;
    }

    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request, String username) {
        User sender = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + username));
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(request.getChatId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Verify user is participant
        if (!chatParticipantRepository.existsByChatRoomAndUserAndIsActiveTrue(chatRoom, sender)) {
            throw new UnauthorizedException("You are not a participant in this chat");
        }

        // Create message
        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(request.getContent())
                .messageType(request.getMessageType())
                .attachmentUrl(request.getAttachmentUrl())
                .isRead(false)
                .isEdited(false)
                .build();

        message = chatMessageRepository.save(message);

        // Update chat room's updated timestamp
        chatRoom.setUpdatedAt(Instant.now());
        chatRoomRepository.save(chatRoom);

        // Convert to response
        ChatMessageResponse response = convertToChatMessageResponse(message);

        // Send to all participants via WebSocket
        List<ChatParticipant> participants = chatParticipantRepository.findByChatRoomAndIsActiveTrue(chatRoom);
        participants.forEach(participant -> {
            if (!participant.getUser().getId().equals(sender.getId())) {
                messagingTemplate.convertAndSendToUser(
                        participant.getUser().getUsername(),
                        "/queue/messages",
                        response
                );
            }
        });

        // Also send to topic for the chat room
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoom.getChatId(), response);

        log.info("Message sent in chat room {} by user {}", chatRoom.getChatId(), sender.getUsername());

        return response;
    }

    public Page<ChatRoomResponse> getUserChatRooms(int page, int size) {
        User user = getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ChatRoom> chatRooms = chatRoomRepository.findByUserOrderByUpdatedAtDesc(user, pageable);
        
        return chatRooms.map(this::convertToChatRoomResponse);
    }

    public Page<ChatMessageResponse> getChatMessages(String chatId, int page, int size) {
        User user = getCurrentUser();
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Verify user is participant
        if (!chatParticipantRepository.existsByChatRoomAndUserAndIsActiveTrue(chatRoom, user)) {
            throw new UnauthorizedException("You are not a participant in this chat");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderByCreatedAtDescWithPaging(chatRoom, pageable);
        
        return messages.map(this::convertToChatMessageResponse);
    }

    @Transactional
    public void markMessagesAsRead(String chatId) {
        User user = getCurrentUser();
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Update last read timestamp
        chatParticipantRepository.updateLastReadAt(chatRoom, user, Instant.now());

        // Mark messages as read
        int updatedCount = chatMessageRepository.markMessagesAsRead(chatRoom, user);
        
        log.info("Marked {} messages as read for user {} in chat {}", 
                updatedCount, user.getUsername(), chatId);
    }

    @Transactional
    public void markMessagesAsRead(String chatId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("User not found: " + username));
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Update last read timestamp
        chatParticipantRepository.updateLastReadAt(chatRoom, user, Instant.now());

        // Mark messages as read
        int updatedCount = chatMessageRepository.markMessagesAsRead(chatRoom, user);
        
        log.info("Marked {} messages as read for user {} in chat {}", 
                updatedCount, user.getUsername(), chatId);
    }

    public List<ChatRoomResponse> searchChatRooms(String searchTerm) {
        User user = getCurrentUser();
        
        List<ChatRoom> chatRooms = chatRoomRepository.searchUserChatRooms(user, searchTerm);
        
        return chatRooms.stream()
                .map(this::convertToChatRoomResponse)
                .collect(Collectors.toList());
    }

    public ChatRoomResponse getChatRoom(String chatId) {
        User user = getCurrentUser();
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        // Verify user is participant
        if (!chatParticipantRepository.existsByChatRoomAndUserAndIsActiveTrue(chatRoom, user)) {
            throw new UnauthorizedException("You are not a participant in this chat");
        }

        return convertToChatRoomResponse(chatRoom);
    }

    // Helper methods
    private void createParticipant(ChatRoom chatRoom, User user, ChatParticipant.ParticipantRole role) {
        ChatParticipant participant = ChatParticipant.builder()
                .chatRoom(chatRoom)
                .user(user)
                .role(role)
                .isActive(true)
                .lastReadAt(Instant.now())
                .build();

        chatParticipantRepository.save(participant);
    }

    private String generatePrivateChatName(User user1, User user2) {
        return user1.getUsername() + " & " + user2.getUsername();
    }

    private ChatRoomResponse convertToChatRoomResponse(ChatRoom chatRoom) {
        User currentUser = getCurrentUser();
        
        List<ChatParticipant> participants = chatParticipantRepository.findByChatRoomAndIsActiveTrue(chatRoom);
        List<ChatParticipantResponse> participantResponses = participants.stream()
                .map(this::convertToChatParticipantResponse)
                .collect(Collectors.toList());

        // Get last message
        ChatMessageResponse lastMessage = chatMessageRepository.findTopByChatRoomOrderByCreatedAtDesc(chatRoom)
                .map(this::convertToChatMessageResponse)
                .orElse(null);

        // Calculate unread count
        Long unreadCount = chatMessageRepository.countUnreadMessages(
                chatRoom, currentUser, Instant.now().minusSeconds(86400 * 30)); // 30 days ago

        // For private chats, use the other participant's name as room name
        String displayName = chatRoom.getRoomName();
        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE && participants.size() == 2) {
            displayName = participants.stream()
                    .filter(p -> !p.getUser().getId().equals(currentUser.getId()))
                    .findFirst()
                    .map(p -> p.getUser().getFullName() != null ? p.getUser().getFullName() : p.getUser().getUsername())
                    .orElse(displayName);
        }

        return ChatRoomResponse.builder()
                .id(chatRoom.getId())
                .chatId(chatRoom.getChatId())
                .roomName(displayName)
                .roomType(chatRoom.getRoomType())
                .participants(participantResponses)
                .lastMessage(lastMessage)
                .unreadCount(unreadCount)
                .createdAt(chatRoom.getCreatedAt())
                .updatedAt(chatRoom.getUpdatedAt())
                .build();
    }

    private ChatMessageResponse convertToChatMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .chatId(message.getChatRoom().getChatId())
                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .senderAvatarUrl(message.getSender().getAvatarUrl())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .attachmentUrl(message.getAttachmentUrl())
                .isRead(message.getIsRead())
                .isEdited(message.getIsEdited())
                .createdAt(message.getCreatedAt())
                .editedAt(message.getEditedAt())
                .build();
    }

    private ChatParticipantResponse convertToChatParticipantResponse(ChatParticipant participant) {
        return ChatParticipantResponse.builder()
                .id(participant.getId())
                .userId(participant.getUser().getId())
                .username(participant.getUser().getUsername())
                .avatarUrl(participant.getUser().getAvatarUrl())
                .fullName(participant.getUser().getFullName())
                .role(participant.getRole())
                .isActive(participant.getIsActive())
                .isOnline(false) // TODO: Implement online status
                .lastReadAt(participant.getLastReadAt())
                .joinedAt(participant.getJoinedAt())
                .build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new UnauthorizedException("User not authenticated");
        }
        return (User) authentication.getPrincipal();
    }
}
