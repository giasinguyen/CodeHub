package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.ChatParticipant;
import code.hub.codehubbackend.entity.ChatRoom;
import code.hub.codehubbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {
    
    List<ChatParticipant> findByChatRoomAndIsActiveTrue(ChatRoom chatRoom);
    
    Optional<ChatParticipant> findByChatRoomAndUser(ChatRoom chatRoom, User user);
    
    @Query("SELECT p FROM ChatParticipant p " +
           "WHERE p.chatRoom = :chatRoom " +
           "AND p.user = :user " +
           "AND p.isActive = true")
    Optional<ChatParticipant> findActiveByChatRoomAndUser(@Param("chatRoom") ChatRoom chatRoom, 
                                                        @Param("user") User user);
    
    @Modifying
    @Query("UPDATE ChatParticipant p SET p.lastReadAt = :readAt " +
           "WHERE p.chatRoom = :chatRoom AND p.user = :user")
    int updateLastReadAt(@Param("chatRoom") ChatRoom chatRoom, 
                        @Param("user") User user, 
                        @Param("readAt") Instant readAt);
    
    @Query("SELECT COUNT(p) FROM ChatParticipant p " +
           "WHERE p.chatRoom = :chatRoom AND p.isActive = true")
    Long countActiveByChatRoom(@Param("chatRoom") ChatRoom chatRoom);
    
    boolean existsByChatRoomAndUserAndIsActiveTrue(ChatRoom chatRoom, User user);
}
