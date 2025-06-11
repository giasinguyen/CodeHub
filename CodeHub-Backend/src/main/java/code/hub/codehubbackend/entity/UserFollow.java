package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "user_follows", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "followed_user_id"}))
public class UserFollow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followed_user_id", nullable = false)
    private User followedUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // Constructors
    public UserFollow() {}

    public UserFollow(User follower, User followedUser) {
        this.follower = follower;
        this.followedUser = followedUser;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }

    public User getFollowedUser() {
        return followedUser;
    }

    public void setFollowedUser(User followedUser) {
        this.followedUser = followedUser;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserFollow)) return false;
        UserFollow that = (UserFollow) o;
        return follower.getId().equals(that.follower.getId()) && 
               followedUser.getId().equals(that.followedUser.getId());
    }

    @Override
    public int hashCode() {
        return follower.getId().hashCode() + followedUser.getId().hashCode();
    }
}
