package Spring_Ecomerc.Spring_ecomerc.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, String subFolder) throws IOException {
        String fileName = UUID.randomUUID() + "_"
                + StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path targetLocation = Paths.get(uploadDir + (subFolder.isEmpty() ? "" : "/" + subFolder));

        if (!Files.exists(targetLocation)) {
            Files.createDirectories(targetLocation);
        }

        Files.copy(file.getInputStream(), targetLocation.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        return (subFolder.isEmpty() ? "" : subFolder + "/") + fileName;
    }

    public String uploadBase64(String base64Data, String subFolder) {
        if (base64Data == null || base64Data.isEmpty())
            return null;

        try {
            String[] parts = base64Data.split(",");
            String imageString = parts.length > 1 ? parts[1] : parts[0];

            byte[] imageBytes = java.util.Base64.getDecoder().decode(imageString);

            String extension = "png";
            if (parts.length > 1 && parts[0].contains("/")) {
                extension = parts[0].split("/")[1].split(";")[0];
            }

            String fileName = UUID.randomUUID() + "." + extension;
            Path targetLocation = Paths.get(uploadDir + (subFolder.isEmpty() ? "" : "/" + subFolder));

            if (!Files.exists(targetLocation)) {
                Files.createDirectories(targetLocation);
            }

            Files.write(targetLocation.resolve(fileName), imageBytes);
            return (subFolder.isEmpty() ? "" : subFolder + "/") + fileName;

        } catch (Exception e) {
            System.err.println("Error decoding Base64 image: " + e.getMessage());
            return null; // Return null instead of crashing if data is invalid
        }
    }
}
