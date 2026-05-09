package Spring_Ecomerc.Spring_ecomerc.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.zip.CRC32;

@Service
public class KHQRService {

    public String generateKHQRString(String merchantId, String merchantName, String merchantCity, String amount, String currency,
            String orderId) {
        StringBuilder khqr = new StringBuilder();

        khqr.append(formatTag("00", "01"));

        khqr.append(formatTag("01", "12"));

        String bakongInfo = formatTag("00", "kh.com.bakong") +
                formatTag("01", merchantId);
        khqr.append(formatTag("29", bakongInfo));

        khqr.append(formatTag("52", "5999"));

        // Transaction Currency (840 for USD, 116 for KHR)
        String currencyCode = "USD".equalsIgnoreCase(currency) ? "840" : "116";
        khqr.append(formatTag("53", currencyCode));

        // Transaction Amount
        khqr.append(formatTag("54", amount));

        // Country Code
        khqr.append(formatTag("58", "KH"));

        // Merchant Name
        khqr.append(formatTag("59", merchantName));

        // Merchant City
        khqr.append(formatTag("60", merchantCity));

        // Additional Data Field (Order ID)
        String additionalData = formatTag("01", orderId);
        khqr.append(formatTag("62", additionalData));

        // CRC
        khqr.append("6304");
        String crc = calculateCRC16(khqr.toString());
        khqr.append(crc);

        return khqr.toString();
    }

    private String formatTag(String tag, String value) {
        byte[] utf8Bytes = value.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return tag + String.format("%02d", utf8Bytes.length) + value;
    }

    private String calculateCRC16(String data) {
        int crc = 0xFFFF;
        int polynomial = 0x1021;

        for (byte b : data.getBytes(java.nio.charset.StandardCharsets.UTF_8)) {
            for (int i = 0; i < 8; i++) {
                boolean bit = ((b >> (7 - i) & 1) == 1);
                boolean c15 = ((crc >> 15 & 1) == 1);
                crc <<= 1;
                if (c15 ^ bit)
                    crc ^= polynomial;
            }
        }

        crc &= 0xFFFF;
        return String.format("%04X", crc).toUpperCase();
    }

    public String generateQRCodeBase64(String qrContent) throws Exception {
        int width = 300;
        int height = 300;
        BitMatrix matrix = new MultiFormatWriter().encode(qrContent, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);
        return Base64.getEncoder().encodeToString(outputStream.toByteArray());
    }
}
