package code.hub.codehubbackend.mapper;

import code.hub.codehubbackend.dto.snippet.SnippetResponse;
import code.hub.codehubbackend.entity.Snippet;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class SnippetMapper {
    
    public SnippetResponse convertToResponse(Snippet snippet) {
        if (snippet == null) {
            return null;
        }
        
        SnippetResponse.UserSummary owner = null;
        if (snippet.getOwner() != null) {
            owner = SnippetResponse.UserSummary.builder()
                    .id(snippet.getOwner().getId())
                    .username(snippet.getOwner().getUsername())
                    .avatarUrl(snippet.getOwner().getAvatarUrl())
                    .build();
        }
        
        return SnippetResponse.builder()
                .id(snippet.getId())
                .title(snippet.getTitle())
                .description(snippet.getDescription())
                .code(snippet.getCode())
                .language(snippet.getLanguage())
                .mediaUrls(snippet.getMediaUrls())
                .tags(snippet.getTags() != null ? snippet.getTags().stream().collect(Collectors.toList()) : null)
                .likeCount(snippet.getLikeCount() != null ? snippet.getLikeCount() : 0L)
                .viewCount(snippet.getViewCount() != null ? snippet.getViewCount() : 0L)
                .commentCount(0L) // Will be set by service
                .owner(owner)
                .createdAt(snippet.getCreatedAt())
                .updatedAt(snippet.getUpdatedAt())
                .isLiked(false) // Will be set by service
                .build();
    }
}
