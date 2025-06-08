package code.hub.codehubbackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileUploadService {
    
    private final Cloudinary cloudinary;
    
    public FileUploadService(@Value("${cloudinary.cloud-name}") String cloudName,
                           @Value("${cloudinary.api-key}") String apiKey,
                           @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }
    
    public List<String> uploadFiles(List<MultipartFile> files) {
        List<String> uploadedUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                String url = uploadFile(file);
                uploadedUrls.add(url);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
            }
        }
        
        return uploadedUrls;
    }
    
    public String uploadFile(MultipartFile file) throws IOException {
        // Generate unique filename
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // Upload to Cloudinary
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", filename,
                        "folder", "codehub",
                        "resource_type", "auto"));
        
        return (String) uploadResult.get("secure_url");
    }
    
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + publicId, e);
        }
    }
}
