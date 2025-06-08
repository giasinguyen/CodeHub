package code.hub.codehubbackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "snippet_versions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SnippetVersion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snippet_id", nullable = false)
    private Snippet snippet;
    
    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "version_number")
    private Integer versionNumber;
    
    @Column(updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    @Column(name = "change_message")
    private String changeMessage;
}
