package code.hub.codehubbackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * Service for handling image uploads to Cloudinary
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload avatar image
     */
    public String uploadAvatar(MultipartFile file, String userId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        validateImageFile(file);
        String publicId = "avatars/" + userId + "_" + UUID.randomUUID().toString();

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "codehub/avatars",
                "width", 300,
                "height", 300,
                "crop", "fill",
                "gravity", "face",
                "quality", "auto",
                "format", "webp",
                "overwrite", true,
                "resource_type", "image");

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        String imageUrl = (String) uploadResult.get("secure_url");

        log.info("Avatar uploaded successfully for user {}: {}", userId, imageUrl);
        return imageUrl;
    }

    /**
     * Upload cover photo
     */
    public String uploadCoverPhoto(MultipartFile file, String userId) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        validateImageFile(file);
        String publicId = "covers/" + userId + "_" + UUID.randomUUID().toString();

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "codehub/covers",
                "width", 1200,
                "height", 400,
                "crop", "fill",
                "quality", "auto",
                "format", "webp",
                "overwrite", true,
                "resource_type", "image");

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        String imageUrl = (String) uploadResult.get("secure_url");

        log.info("Cover photo uploaded successfully for user {}: {}", userId, imageUrl);
        return imageUrl;
    }

    /**
     * Upload general image (for snippets, posts, etc.)
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        validateImageFile(file);
        String publicId = folder + "/" + UUID.randomUUID().toString();

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "codehub/" + folder,
                "quality", "auto",
                "format", "webp",
                "overwrite", true,
                "resource_type", "image");

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        String imageUrl = (String) uploadResult.get("secure_url");

        log.info("Image uploaded successfully to folder {}: {}", folder, imageUrl);
        return imageUrl;
    }

    /**
     * Delete image from Cloudinary
     */
    public boolean deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                String resultStatus = (String) result.get("result");
                log.info("Image deletion result for {}: {}", publicId, resultStatus);
                return "ok".equals(resultStatus);
            }
            return false;
        } catch (Exception e) {
            log.error("Error deleting image: {}", imageUrl, e);
            return false;
        }
    }

    /**
     * Validate uploaded file
     */
    private void validateImageFile(MultipartFile file) {
        // Check file size (max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 10MB");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Check supported formats
        String[] supportedFormats = { "image/jpeg", "image/png", "image/gif", "image/webp" };
        boolean isSupported = false;
        for (String format : supportedFormats) {
            if (format.equals(contentType)) {
                isSupported = true;
                break;
            }
        }

        if (!isSupported) {
            throw new IllegalArgumentException("Unsupported image format. Supported formats: JPEG, PNG, GIF, WebP");
        }
    }

    /**
     * Upload general file (documents, archives, etc.)
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        // Validate file size (10MB limit)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        // Generate unique public ID
        String publicId = folder + "/" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        @SuppressWarnings("unchecked")
        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "codehub/" + folder,
                "resource_type", "auto", // Auto-detect resource type
                "overwrite", false);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        String fileUrl = (String) uploadResult.get("secure_url");

        log.info("File uploaded successfully: {} -> {}", file.getOriginalFilename(), fileUrl);
        return fileUrl;
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
                return null;
            }

            // Example URL:
            // https://res.cloudinary.com/dqmlxcbxt/image/upload/v1234567890/codehub/avatars/user123_uuid.webp
            int lastSlash = imageUrl.lastIndexOf('/');
            int secondLastSlash = imageUrl.lastIndexOf('/', lastSlash - 1);
            int thirdLastSlash = imageUrl.lastIndexOf('/', secondLastSlash - 1);

            if (thirdLastSlash > 0) {
                String publicId = imageUrl.substring(thirdLastSlash + 1);
                // Remove file extension
                int dotIndex = publicId.lastIndexOf('.');
                if (dotIndex > 0) {
                    publicId = publicId.substring(0, dotIndex);
                }
                return publicId;
            }

            return null;
        } catch (Exception e) {
            log.error("Error extracting public ID from URL: {}", imageUrl, e);
            return null;
        }
    }
}
