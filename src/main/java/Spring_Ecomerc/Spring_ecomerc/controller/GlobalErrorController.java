package Spring_Ecomerc.Spring_ecomerc.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class GlobalErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object statusAttribute = request.getAttribute("jakarta.servlet.error.status_code");
        int statusCode = (statusAttribute != null) ? Integer.parseInt(statusAttribute.toString()) : HttpStatus.INTERNAL_SERVER_ERROR.value();
        
        Map<String, Object> errorResponse = new LinkedHashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", statusCode);
        
        if (statusCode == HttpStatus.NOT_FOUND.value()) {
            errorResponse.put("error", "Not Found");
            errorResponse.put("message", "The endpoint you are trying to reach does not exist.");
        } else if (statusCode == HttpStatus.FORBIDDEN.value()) {
            errorResponse.put("error", "Forbidden");
            errorResponse.put("message", "You don't have permission to access this resource.");
        } else if (statusCode == HttpStatus.UNAUTHORIZED.value()) {
            errorResponse.put("error", "Unauthorized");
            errorResponse.put("message", "Authentication is required.");
        } else {
            errorResponse.put("error", "Internal Server Error");
            errorResponse.put("message", "An unexpected error occurred.");
        }
        
        errorResponse.put("path", request.getAttribute("jakarta.servlet.error.request_uri"));

        return ResponseEntity.status(statusCode).body(errorResponse);
    }
}
