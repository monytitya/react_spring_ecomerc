package Spring_Ecomerc.Spring_ecomerc;

import Spring_Ecomerc.Spring_ecomerc.service.PaymentServiceImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PaymentServiceImplTest {

    @Test
    void validatesMinimumUsdAmount() {
        assertTrue(PaymentServiceImpl.validateMinimumPaymentAmount(0.01, "USD"));
        assertFalse(PaymentServiceImpl.validateMinimumPaymentAmount(0.009, "USD"));
    }

    @Test
    void validatesMinimumKhrAmount() {
        assertTrue(PaymentServiceImpl.validateMinimumPaymentAmount(100.0, "KHR"));
        assertFalse(PaymentServiceImpl.validateMinimumPaymentAmount(99.0, "KHR"));
    }
}
