package Spring_Ecomerc.Spring_ecomerc.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class TelegramService {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendMessage(String message) {
        if (botToken == null || botToken.isEmpty()) {
            log.warn("Telegram bot token is not configured.");
            return;
        }

        if (chatId == null || chatId.isEmpty()) {
            log.warn("Telegram chat ID is not configured. Please use /getChatId first.");
            return;
        }

        String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

        Map<String, String> body = new HashMap<>();
        body.put("chat_id", chatId);
        body.put("text", message);
        body.put("parse_mode", "HTML");

        try {
            restTemplate.postForObject(url, body, String.class);
            log.info("Message sent to Telegram chat: {}", chatId);
        } catch (Exception e) {
            log.error("Failed to send Telegram message: {}", e.getMessage());
        }
    }

    public void sendPaymentNotification(String invoiceNo, Double amount, String mode) {
        String msg = "<b>✅ Payment Successful!</b>\n\n" +
                     "<b>Invoice:</b> #" + invoiceNo + "\n" +
                     "<b>Amount:</b> $" + String.format("%.2f", amount) + "\n" +
                     "<b>Method:</b> " + mode + "\n\n" +
                     "<i>Dashboard has been updated.</i>";
        sendMessage(msg);
    }
}
