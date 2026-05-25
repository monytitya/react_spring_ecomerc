package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.dto.ContactRequest;
import Spring_Ecomerc.Spring_ecomerc.service.TelegramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final TelegramService telegramService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<String>> sendContactMessage(
            @Valid @RequestBody ContactRequest request) {

        try {
            // Build the Telegram notification message
            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

            String subject = (request.getSubject() != null && !request.getSubject().isBlank())
                    ? request.getSubject()
                    : "(no subject)";

            String telegramMessage =
                    "📬 <b>New Contact Message</b>\n\n" +
                    "👤 <b>Name:</b> " + escapeHtml(request.getName()) + "\n" +
                    "📧 <b>Email:</b> " + escapeHtml(request.getEmail()) + "\n" +
                    "📌 <b>Subject:</b> " + escapeHtml(subject) + "\n" +
                    "💬 <b>Message:</b> " + escapeHtml(request.getMessage()) + "\n\n" +
                    "🕐 " + timestamp;

            // Send to Telegram — failures are handled silently inside TelegramService
            telegramService.sendMessage(telegramMessage);

            log.info("Contact form submitted by {} <{}>", request.getName(), request.getEmail());

            return ResponseEntity.ok(
                    ApiResponse.success("Message sent successfully", "OK"));

        } catch (Exception e) {
            log.error("Error processing contact form: {}", e.getMessage());
            // Still return success to the user — Telegram issues shouldn't break the form
            return ResponseEntity.ok(
                    ApiResponse.success("Message received", "OK"));
        }
    }

    /** Strip HTML special chars to avoid injection in Telegram HTML parse mode */
    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
