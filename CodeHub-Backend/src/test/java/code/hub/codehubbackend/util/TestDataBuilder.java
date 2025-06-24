package code.hub.codehubbackend.util;

import code.hub.codehubbackend.entity.Snippet;
import code.hub.codehubbackend.entity.User;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;

public class TestDataBuilder {

    public static User createTestUser() {
        return User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash("$2a$10$hashedpassword")
                .role(User.Role.USER)
                .fullName("Test User")
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=testuser")
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public static User createTestUserWithId(Long id) {
        User user = createTestUser();
        user.setId(id);
        return user;
    }

    public static User createTestAdmin() {
        return User.builder()
                .username("admin")
                .email("admin@example.com")
                .passwordHash("$2a$10$hashedpassword")
                .role(User.Role.ADMIN)
                .fullName("Admin User")
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }    public static Snippet createTestSnippet(User owner) {
        return Snippet.builder()
                .title("Test Snippet")
                .code("console.log('Hello, World!');")
                .language("JavaScript")
                .description("A simple test snippet")
                .tags(new ArrayList<>(Arrays.asList("test", "javascript")))
                .owner(owner)
                .viewCount(0L)
                .likeCount(0L)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public static Snippet createTestSnippetWithId(Long id, User owner) {
        Snippet snippet = createTestSnippet(owner);
        snippet.setId(id);
        return snippet;
    }
}
