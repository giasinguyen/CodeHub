package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.ChatMessage;
import code.hub.codehubbackend.entity.ChatRoom;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom, Pageable pageable);
    
    List<ChatMessage> findByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom " +
           "ORDER BY cm.createdAt DESC")
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDescWithPaging(@Param("chatRoom") ChatRoom chatRoom, Pageable pageable);
    
    Optional<ChatMessage> findTopByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom " +
           "AND cm.sender != :user " +
           "AND cm.isRead = false")
    Long countUnreadMessages(@Param("chatRoom") ChatRoom chatRoom, 
                           @Param("user") User user);
    
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true " +
           "WHERE cm.chatRoom = :chatRoom " +
           "AND cm.sender != :user " +
           "AND cm.isRead = false")
    int markMessagesAsRead(@Param("chatRoom") ChatRoom chatRoom, @Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom " +
           "AND (LOWER(cm.content) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(cm.sender.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY cm.createdAt DESC")
    Page<ChatMessage> searchMessages(@Param("chatRoom") ChatRoom chatRoom, 
                                   @Param("searchTerm") String searchTerm, 
                                   Pageable pageable);
    
    // Chat History and Statistics queries
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.chatRoom = :chatRoom")
    Long countMessagesByChatRoom(@Param("chatRoom") ChatRoom chatRoom);
    
    @Query("SELECT MIN(cm.createdAt) FROM ChatMessage cm WHERE cm.chatRoom = :chatRoom")
    Optional<Instant> findFirstMessageTime(@Param("chatRoom") ChatRoom chatRoom);
    
    @Query("SELECT MAX(cm.createdAt) FROM ChatMessage cm WHERE cm.chatRoom = :chatRoom")
    Optional<Instant> findLastMessageTime(@Param("chatRoom") ChatRoom chatRoom);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.sender = :user")
    Long countMessagesByUser(@Param("user") User user);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom IN :chatRooms " +
           "AND cm.createdAt >= :fromDate " +
           "ORDER BY cm.createdAt DESC")
    Page<ChatMessage> findRecentMessagesInChatRooms(@Param("chatRooms") java.util.List<ChatRoom> chatRooms,
                                                   @Param("fromDate") Instant fromDate,
                                                   Pageable pageable);
}
