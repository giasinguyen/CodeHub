package code.hub.codehubbackend.service;

import code.hub.codehubbackend.dto.chat.*;
import code.hub.codehubbackend.entity.*;
import code.hub.codehubbackend.exception.ResourceNotFoundException;
import code.hub.codehubbackend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChatHistoryService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserService userService;
    
    /**
     * Get all conversations for the current user, ordered by latest activity
     */
    public Page<ConversationResponse> getConversations(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        
        Page<ChatRoom> chatRooms = chatRoomRepository
            .findActiveConversationsWithMessagesOrderByLastMessage(currentUser, pageable);
        
        return chatRooms.map(chatRoom -> buildConversationResponse(chatRoom, currentUser));
    }
    
    /**
     * Get conversation history with a specific user
     */
    public ChatHistoryResponse getConversationHistory(String targetUsername) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userService.getUserByUsername(targetUsername);
        
        ChatRoom chatRoom = chatRoomRepository
            .findPrivateChatBetweenUsers(currentUser, targetUser)
            .orElseThrow(() -> new ResourceNotFoundException("No conversation found with user: " + targetUsername));
        
        return buildChatHistoryResponse(chatRoom, currentUser, targetUser);
    }
    
    /**
     * Get conversation messages with pagination
     */
    public Page<ChatMessageResponse> getConversationMessages(String targetUsername, int page, int size) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userService.getUserByUsername(targetUsername);
        
        ChatRoom chatRoom = chatRoomRepository
            .findPrivateChatBetweenUsers(currentUser, targetUser)
            .orElseThrow(() -> new ResourceNotFoundException("No conversation found with user: " + targetUsername));
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderByCreatedAtDesc(chatRoom, pageable);
        
        return messages.map(this::mapToChatMessageResponse);
    }
    
    /**
     * Get conversation messages by chatId
     */
    public Page<ChatMessageResponse> getConversationMessagesByChatId(String chatId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        
        ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
            .orElseThrow(() -> new ResourceNotFoundException("Chat room not found: " + chatId));
        
        // Verify user is participant
        boolean isParticipant = chatRoom.getParticipants().stream()
            .anyMatch(p -> p.getUser().getId().equals(currentUser.getId()) && p.getIsActive());
        
        if (!isParticipant) {
            throw new ResourceNotFoundException("User is not a participant in this chat room");
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ChatMessage> messages = chatMessageRepository.findByChatRoomOrderByCreatedAtDesc(chatRoom, pageable);
        
        return messages.map(this::mapToChatMessageResponse);
    }
    
    /**
     * Search messages in all conversations
     */
    public Page<ChatMessageResponse> searchMessagesInAllConversations(String searchTerm, int page, int size) {
        User currentUser = userService.getCurrentUser();
        
        // Get user's active chat rooms
        List<ChatRoom> userChatRooms = chatRoomRepository
            .findByUserOrderByUpdatedAtDesc(currentUser, PageRequest.of(0, Integer.MAX_VALUE))
            .getContent();
        
        if (userChatRooms.isEmpty()) {
            return Page.empty();
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Instant fromDate = Instant.now().minus(365, ChronoUnit.DAYS); // Search last year
        
        return chatMessageRepository.findRecentMessagesInChatRooms(userChatRooms, fromDate, pageable)
            .map(this::mapToChatMessageResponse);
    }
    
    /**
     * Get chat statistics for the current user
     */
    @Transactional(readOnly = false)
    public ChatStatsResponse getChatStats() {
        User currentUser = userService.getCurrentUser();
        
        Long totalConversations = chatRoomRepository.countActiveConversationsByUser(currentUser);
        Long archivedConversations = chatRoomRepository.countArchivedConversationsByUser(currentUser);
        Long totalMessages = chatMessageRepository.countMessagesByUser(currentUser);
        
        // Calculate unread messages
        List<ChatRoom> userChatRooms = chatRoomRepository
            .findByUserOrderByUpdatedAtDesc(currentUser, PageRequest.of(0, Integer.MAX_VALUE))
            .getContent();
        
        Long unreadMessages = userChatRooms.stream()
            .mapToLong(chatRoom -> {
                Long unreadCount = chatMessageRepository.countUnreadMessages(
                    chatRoom, currentUser);
                log.info("🔍 [ChatHistoryService] Chat room {} has {} unread messages for user {}", 
                    chatRoom.getChatId(), unreadCount, currentUser.getUsername());
                return unreadCount;
            })
            .sum();
        
        log.info("🔍 [ChatHistoryService] User {} has {} total unread messages across {} chat rooms", 
            currentUser.getUsername(), unreadMessages, userChatRooms.size());
        
        return ChatStatsResponse.builder()
            .totalConversations(totalConversations)
            .activeConversations(totalConversations) // All active conversations
            .archivedConversations(archivedConversations)
            .totalMessages(totalMessages)
            .unreadMessages(unreadMessages)
            .build();
    }
    
    private ConversationResponse buildConversationResponse(ChatRoom chatRoom, User currentUser) {
        // Get the other participant (for private chats)
        ChatParticipant otherParticipant = chatRoom.getParticipants().stream()
            .filter(p -> !p.getUser().getId().equals(currentUser.getId()) && p.getIsActive())
            .findFirst()
            .orElse(null);
        
        // Get last message
        ChatMessage lastMessage = chatMessageRepository
            .findTopByChatRoomOrderByCreatedAtDesc(chatRoom)
            .orElse(null);
        
        // Count unread messages
        Long unreadCount = chatMessageRepository.countUnreadMessages(chatRoom, currentUser);
        
        ConversationResponse.ConversationResponseBuilder builder = ConversationResponse.builder()
            .chatId(chatRoom.getChatId())
            .roomType(chatRoom.getRoomType().name())
            .unreadCount(unreadCount);
        
        if (lastMessage != null) {
            builder.lastMessage(lastMessage.getContent())
                .lastMessageType(lastMessage.getMessageType().name())
                .lastMessageTime(lastMessage.getCreatedAt())
                .lastMessageSender(lastMessage.getSender().getUsername());
        }
        
        if (chatRoom.getRoomType() == ChatRoom.RoomType.PRIVATE && otherParticipant != null) {
            User otherUser = otherParticipant.getUser();
            builder.participantId(otherUser.getId())
                .participantUsername(otherUser.getUsername())
                .participantFullName(otherUser.getFullName())
                .participantAvatarUrl(otherUser.getAvatarUrl())
                .lastSeenAt(otherParticipant.getLastReadAt())
                .isOnline(false); // TODO: Implement online status
        } else if (chatRoom.getRoomType() == ChatRoom.RoomType.GROUP) {
            builder.roomName(chatRoom.getRoomName())
                .totalParticipants(chatRoom.getParticipants().size());
        }
        
        return builder.build();
    }
    
    private ChatHistoryResponse buildChatHistoryResponse(ChatRoom chatRoom, User currentUser, User targetUser) {
        Long totalMessages = chatMessageRepository.countMessagesByChatRoom(chatRoom);
        Instant firstMessageTime = chatMessageRepository.findFirstMessageTime(chatRoom).orElse(null);
        Instant lastMessageTime = chatMessageRepository.findLastMessageTime(chatRoom).orElse(null);
        Long unreadCount = chatMessageRepository.countUnreadMessages(chatRoom, currentUser);
        
        // Get participant info
        ChatParticipant currentUserParticipant = chatRoom.getParticipants().stream()
            .filter(p -> p.getUser().getId().equals(currentUser.getId()))
            .findFirst()
            .orElse(null);
        
        ChatParticipant targetUserParticipant = chatRoom.getParticipants().stream()
            .filter(p -> p.getUser().getId().equals(targetUser.getId()))
            .findFirst()
            .orElse(null);
        
        return ChatHistoryResponse.builder()
            .chatId(chatRoom.getChatId())
            .totalMessages(totalMessages)
            .firstMessageTime(firstMessageTime)
            .lastMessageTime(lastMessageTime)
            .unreadCount(unreadCount)
            .isActive(currentUserParticipant != null && currentUserParticipant.getIsActive())
            .currentUser(buildParticipantInfo(currentUser, currentUserParticipant))
            .otherParticipant(buildParticipantInfo(targetUser, targetUserParticipant))
            .build();
    }
    
    private ChatHistoryResponse.ParticipantInfo buildParticipantInfo(User user, ChatParticipant participant) {
        return ChatHistoryResponse.ParticipantInfo.builder()
            .id(user.getId())
            .username(user.getUsername())
            .fullName(user.getFullName())
            .avatarUrl(user.getAvatarUrl())
            .lastSeenAt(participant != null ? participant.getLastReadAt() : null)
            .isOnline(false) // TODO: Implement online status
            .build();
    }
    
    private ChatMessageResponse mapToChatMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
            .id(message.getId())
            .chatId(message.getChatRoom().getChatId())
            .senderId(message.getSender().getId())
            .senderUsername(message.getSender().getUsername())
            .senderAvatarUrl(message.getSender().getAvatarUrl())
            .content(message.getContent())
            .messageType(message.getMessageType())
            .attachmentUrl(message.getAttachmentUrl())
            .fileUrl(message.getFileUrl())
            .fileName(message.getFileName())
            .fileSize(message.getFileSize())
            .isRead(message.getIsRead())
            .isEdited(message.getIsEdited())
            .createdAt(message.getCreatedAt())
            .editedAt(message.getEditedAt())
            .sender(ChatMessageResponse.SenderInfo.builder()
                .id(message.getSender().getId())
                .username(message.getSender().getUsername())
                .fullName(message.getSender().getFullName())
                .avatarUrl(message.getSender().getAvatarUrl())
                .build())
            .build();
    }
}
