package code.hub.codehubbackend.dto.admin;

import code.hub.codehubbackend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private User.Role role;
    private boolean enabled;
    private Instant createdAt;
    private Instant lastLoginAt;
    private Long snippetsCount;
    private Long commentsCount;
    private Long likesCount;
    private String profilePicture;
}
