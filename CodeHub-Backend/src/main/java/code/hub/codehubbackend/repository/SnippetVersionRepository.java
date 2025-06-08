package code.hub.codehubbackend.repository;

import code.hub.codehubbackend.entity.SnippetVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SnippetVersionRepository extends JpaRepository<SnippetVersion, Long> {
    
    List<SnippetVersion> findBySnippetIdOrderByVersionNumberDesc(Long snippetId);
    
    @Query("SELECT MAX(sv.versionNumber) FROM SnippetVersion sv WHERE sv.snippet.id = :snippetId")
    Integer findMaxVersionNumberBySnippetId(@Param("snippetId") Long snippetId);
    
    @Query("SELECT sv FROM SnippetVersion sv WHERE sv.snippet.id = :snippetId AND sv.versionNumber = :versionNumber")
    SnippetVersion findBySnippetIdAndVersionNumber(@Param("snippetId") Long snippetId, 
                                                  @Param("versionNumber") Integer versionNumber);
}
