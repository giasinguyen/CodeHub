package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.ChatRoom;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    Optional<ChatRoom> findByChatId(String chatId);
    
    @Query("SELECT cr FROM ChatRoom cr " +
           "JOIN cr.participants p " +
           "WHERE p.user = :user AND p.isActive = true " +
           "ORDER BY cr.updatedAt DESC")
    Page<ChatRoom> findByUserOrderByUpdatedAtDesc(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT cr FROM ChatRoom cr " +
           "JOIN cr.participants p1 " +
           "JOIN cr.participants p2 " +
           "WHERE p1.user = :user1 AND p2.user = :user2 " +
           "AND cr.roomType = 'PRIVATE' " +
           "AND p1.isActive = true AND p2.isActive = true")
    Optional<ChatRoom> findPrivateChatBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    @Query("SELECT cr FROM ChatRoom cr " +
           "JOIN cr.participants p " +
           "WHERE p.user = :user AND p.isActive = true " +
           "AND (LOWER(cr.roomName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR EXISTS (SELECT p2 FROM ChatParticipant p2 " +
           "           WHERE p2.chatRoom = cr AND p2.user != :user " +
           "           AND LOWER(p2.user.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')))) " +
           "ORDER BY cr.updatedAt DESC")
    List<ChatRoom> searchUserChatRooms(@Param("user") User user, @Param("searchTerm") String searchTerm);
    
    // Chat History queries
    @Query("SELECT COUNT(cr) FROM ChatRoom cr " +
           "JOIN cr.participants p " +
           "WHERE p.user = :user AND p.isActive = true")
    Long countActiveConversationsByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(cr) FROM ChatRoom cr " +
           "JOIN cr.participants p " +
           "WHERE p.user = :user AND p.isActive = false")
    Long countArchivedConversationsByUser(@Param("user") User user);
    
    @Query("SELECT cr FROM ChatRoom cr " +
           "JOIN cr.participants p " +
           "WHERE p.user = :user AND p.isActive = true " +
           "AND EXISTS (SELECT cm FROM ChatMessage cm WHERE cm.chatRoom = cr) " +
           "ORDER BY (SELECT MAX(cm.createdAt) FROM ChatMessage cm WHERE cm.chatRoom = cr) DESC")
    Page<ChatRoom> findActiveConversationsWithMessagesOrderByLastMessage(@Param("user") User user, Pageable pageable);
}
