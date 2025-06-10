package code.hub.codehubbackend.controller;

import code.hub.codehubbackend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling image uploads
 */
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload avatar image
     */
    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            String imageUrl = cloudinaryService.uploadAvatar(file, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Avatar uploaded successfully");
            response.put("imageUrl", imageUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading avatar", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload avatar: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Upload cover photo
     */
    @PostMapping("/cover")
    public ResponseEntity<?> uploadCoverPhoto(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            String imageUrl = cloudinaryService.uploadCoverPhoto(file, username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Cover photo uploaded successfully");
            response.put("imageUrl", imageUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading cover photo", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload cover photo: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Upload general image
     */
    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder,
            Authentication authentication) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file, folder);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Image uploaded successfully");
            response.put("imageUrl", imageUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading image", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload image: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Delete image
     */
    @DeleteMapping("/image")
    public ResponseEntity<?> deleteImage(
            @RequestParam("imageUrl") String imageUrl,
            Authentication authentication) {
        try {
            boolean deleted = cloudinaryService.deleteImage(imageUrl);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", deleted);
            response.put("message", deleted ? "Image deleted successfully" : "Failed to delete image");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting image", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete image: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
