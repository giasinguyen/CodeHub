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
import java.util.Optional;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom, Pageable pageable);
    
    @Query("SELECT cm FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom " +
           "ORDER BY cm.createdAt DESC")
    Page<ChatMessage> findByChatRoomOrderByCreatedAtDescWithPaging(@Param("chatRoom") ChatRoom chatRoom, Pageable pageable);
    
    Optional<ChatMessage> findTopByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm " +
           "WHERE cm.chatRoom = :chatRoom " +
           "AND cm.sender != :user " +
           "AND cm.createdAt > (SELECT COALESCE(p.lastReadAt, :defaultTime) FROM ChatParticipant p " +
           "                   WHERE p.chatRoom = :chatRoom AND p.user = :user)")
    Long countUnreadMessages(@Param("chatRoom") ChatRoom chatRoom, 
                           @Param("user") User user, 
                           @Param("defaultTime") Instant defaultTime);
    
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
}
