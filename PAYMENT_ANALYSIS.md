# Payment System Analysis - E-Commerce Application

## 1. PAYMENT VALIDATION - "Invalid payment amount" Error

### Backend Validation (Where Error is Thrown)
**File**: [src/main/java/Spring_Ecomerc/Spring_ecomerc/service/PaymentServiceImpl.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/service/PaymentServiceImpl.java#L49)

```java
@Override
@Transactional
public PaymentResponse createPayment(PaymentCreateRequest request) {
    if (request.getAmount() == null || request.getAmount() <= 0) {
        throw new RuntimeException("Invalid payment amount");
    }
    // ... rest of payment creation logic
}
```

**Location**: Line 49 in `PaymentServiceImpl.createPayment()`
**Condition**: Throws when:
- Amount is `null`
- Amount is `<= 0`

### Frontend Payment Validation
**File**: [Frontend/src/pages/Checkout.jsx](Frontend/src/pages/Checkout.jsx#L32-L38)

```javascript
const initPayment = async () => {
  try {
    // 1. Fetch real order details using invoiceNo
    const orderRes = await orderApi.getByInvoice(invoiceNo);
    if (!orderRes.data?.success) throw new Error("Order not found");

    const order = orderRes.data.data;
    setOrderData(order);
    const actualAmount = order.dueAmount || 0;  // Gets amount from order
    setAmount(actualAmount);

    // 2. Create/fetch a payment record in the backend
    const res = await paymentApi.create({
      orderId: order.orderId,
      amount: actualAmount,
      currency: "USD"
    });
```

**Validation Location**: Line 32-38 in `Checkout.jsx`
- Fetches amount from `order.dueAmount`
- Sends to backend via `paymentApi.create()`

---

## 2. API ENDPOINTS FOR PAYMENTS

### Primary Payment Endpoints (KHQR/Bakong)

#### 1. Create Payment (Initiate QR Code)
- **Endpoint**: `POST /api/payments/create`
- **Controller**: [KHQRController.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/controller/KHQRController.java#L18)
- **Service**: [PaymentServiceImpl.createPayment()](src/main/java/Spring_Ecomerc/Spring_ecomerc/service/PaymentServiceImpl.java#L46)
- **Request Body**:
```json
{
  "orderId": 123,
  "amount": 99.99,
  "currency": "USD"
}
```
- **Response**: Returns QR code string and base64 image for display

#### 2. Get Payment Status (Poll for Payment Confirmation)
- **Endpoint**: `GET /api/payments/status/{transactionId}`
- **Controller**: [KHQRController.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/controller/KHQRController.java#L26)
- **Service**: [PaymentServiceImpl.getPaymentStatus()](src/main/java/Spring_Ecomerc/Spring_ecomerc/service/PaymentServiceImpl.java#L78)
- **Response**: Payment status (PENDING, PAID, FAILED)

#### 3. Payment Webhook (Bakong Callback)
- **Endpoint**: `POST /api/payment/webhook`
- **Controller**: [BakongPaymentController.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/controller/BakongPaymentController.java#L27)
- **Service**: [PaymentServiceImpl.processWebhook()](src/main/java/Spring_Ecomerc/Spring_ecomerc/service/PaymentServiceImpl.java#L127)

### Secondary Endpoints (Admin/Customer)

#### 4. Get All Payments (Admin)
- **Endpoint**: `GET /api/admin/payments/all`
- **Controller**: [PaymentController.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/controller/PaymentController.java#L19)

#### 5. Customer Payment Endpoints
- **Get Payments by Invoice**: `GET /api/customers/payments/{invoiceNo}`
- **Add Payment Record**: `POST /api/customers/payments`
- **Controller**: [CustomerController.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/controller/CustomerController.java#L116-L121)

---

## 3. QR CODE PAYMENT HANDLING

### QR Code Generation Service
**File**: [src/main/java/Spring_Ecomerc/Spring_ecomerc/service/KHQRService.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/service/KHQRService.java)

#### KHQR String Generation
```java
public String generateKHQRString(String merchantId, String merchantName, String merchantCity, 
                                 String amount, String currency, String orderId) {
    StringBuilder khqr = new StringBuilder();
    
    // Version
    khqr.append(formatTag("00", "01"));
    
    // Payload Format Indicator
    khqr.append(formatTag("01", "12"));
    
    // Merchant Account Info (tag 29)
    khqr.append(formatTag("29", formatTag("00", merchantId)));
    
    // Merchant Category (5999 = miscellaneous)
    khqr.append(formatTag("52", "5999"));
    
    // Currency (840 = USD, 116 = KHR)
    String currencyCode = "USD".equalsIgnoreCase(currency) ? "840" : "116";
    khqr.append(formatTag("53", currencyCode));
    
    // Amount (tag 54)
    khqr.append(formatTag("54", amount));
    
    // Country Code
    khqr.append(formatTag("58", "KH"));
    
    // Merchant Name
    khqr.append(formatTag("59", merchantName));
    
    // Merchant City
    khqr.append(formatTag("60", merchantCity));
    
    // Additional Data (contains order ID)
    String additionalData = formatTag("01", orderId);
    khqr.append(formatTag("62", additionalData));
    
    // Timestamp (with 10-minute expiry)
    long createdAt = System.currentTimeMillis();
    String timestamps = formatTag("00", Long.toString(createdAt))
            + formatTag("01", Long.toString(createdAt + QR_EXPIRY_MILLIS));
    khqr.append(formatTag("99", timestamps));
    
    // CRC16 checksum
    khqr.append("6304");
    String crc = calculateCRC16(khqr.toString());
    khqr.append(crc);
    
    return khqr.toString();
}
```

#### QR Code Image Generation (Base64)
```java
public String generateQRCodeBase64(String qrContent) throws Exception {
    int width = 300;
    int height = 300;
    BitMatrix matrix = new MultiFormatWriter().encode(qrContent, BarcodeFormat.QR_CODE, width, height);
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);
    return Base64.getEncoder().encodeToString(outputStream.toByteArray());
}
```

**Key Features**:
- **QR Expiry**: 10 minutes (600,000 milliseconds)
- **CRC16 Checksum**: Validates QR code integrity
- **Format**: ISO 20022 KHQR standard

### Payment Entity QR Code Storage
**File**: [src/main/java/Spring_Ecomerc/Spring_ecomerc/entity/Payment.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/entity/Payment.java)

```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "order_id")
    private Long orderId;
    
    @Column(name = "transaction_id", unique = true)
    private String transactionId;
    
    @Column(name = "md5")
    private String md5;  // MD5 hash of KHQR payload
    
    @Column(name = "khqr_payload", length = 2048)
    private String khqrPayload;  // KHQR string
    
    @Column(name = "qr_expires_at")
    private LocalDateTime qrExpiresAt;  // When QR expires
    
    @Column(name = "amount")
    private Double amount;
    
    @Column(name = "currency")
    private String currency;  // "USD" or "KHR"
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status;  // PENDING, PAID, FAILED
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
```

### QR Code Refresh Logic
**File**: [PaymentServiceImpl.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/service/PaymentServiceImpl.java#L91-L122)

```java
private PaymentResponse getPaymentResponseWithQR(Payment payment) {
    PaymentResponse response = mapToResponse(payment);
    if (payment.getStatus() == PaymentStatus.PENDING) {
        try {
            // Regenerate QR if expired or missing
            if (payment.getKhqrPayload() == null || payment.getQrExpiresAt() == null
                    || !payment.getQrExpiresAt().isAfter(LocalDateTime.now(ZoneOffset.UTC))) {
                
                String qrString = khqrService.generateKHQRString(
                        merchantId,
                        merchantName,
                        merchantCity,
                        String.format(Locale.ROOT, "%.2f", payment.getAmount()),
                        payment.getCurrency(),
                        String.valueOf(payment.getOrderId())
                );
                
                // Generate MD5 hash
                byte[] md5Bytes = java.security.MessageDigest.getInstance("MD5")
                        .digest(qrString.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                
                payment.setKhqrPayload(qrString);
                payment.setMd5(java.util.HexFormat.of().formatHex(md5Bytes));
                payment.setQrExpiresAt(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(10));
                paymentRepository.save(payment);
            }
            
            response.setQrString(payment.getKhqrPayload());
            response.setQrImage(khqrService.generateQRCodeBase64(payment.getKhqrPayload()));
        } catch (Exception e) {
            System.err.println("Error generating KHQR: " + e.getMessage());
            // Log error but don't fail - return response without QR
        }
    }
    return response;
}
```

---

## 4. CHECKOUT PAYMENT VALIDATION LOGIC

### Frontend Checkout Flow
**File**: [Frontend/src/pages/Checkout.jsx](Frontend/src/pages/Checkout.jsx)

```javascript
const Checkout = () => {
  const [status, setStatus] = useState('PENDING');  // PENDING | PAID | FAILED
  const [amount, setAmount] = useState(0);
  const [qrImage, setQrImage] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const maxPollAttempts = 120;  // 10 minutes polling

  const initPayment = async () => {
    try {
      // 1. Get order with dueAmount
      const orderRes = await orderApi.getByInvoice(invoiceNo);
      const order = orderRes.data.data;
      const actualAmount = order.dueAmount || 0;
      setAmount(actualAmount);

      // 2. Create payment in backend
      const res = await paymentApi.create({
        orderId: order.orderId,
        amount: actualAmount,
        currency: "USD"
      });

      if (res.data?.success) {
        const pData = res.data.data;
        setTransactionId(pData.transactionId);
        setStatus(pData.status);
        setQrImage(pData.qrImage);  // Base64 PNG image
      } else {
        setErrorMsg(res.data?.message);
      }
    } catch (e) {
      setErrorMsg(e.response?.data?.message || e.message);
    }
  };

  const pollStatus = async () => {
    if (!transactionId || status === 'PAID') return;
    
    try {
      const res = await paymentApi.getStatus(transactionId);
      if (res.data.data?.status === 'PAID') {
        setStatus('PAID');
      } else {
        setPollCount(prev => {
          const newCount = prev + 1;
          if (newCount >= maxPollAttempts) {
            setErrorMsg('Payment confirmation timeout.');
            setStatus('FAILED');
            return newCount;
          }
          return newCount;
        });
      }
    } catch (e) {
      console.error("Status check failed", e);
      setPollCount(prev => prev + 1);
    }
  };

  // Poll every 5 seconds
  useEffect(() => {
    let timer;
    if (transactionId && status === 'PENDING' && pollCount < maxPollAttempts) {
      timer = setInterval(pollStatus, 5000);
    }
    return () => clearInterval(timer);
  }, [transactionId, status, pollCount]);

  // Redirect on success
  useEffect(() => {
    if (status !== 'PAID') return;
    clearCart();
    const redirectTimer = setTimeout(() => navigate(`/order-success/${invoiceNo}`), 1200);
    return () => clearTimeout(redirectTimer);
  }, [status, clearCart, invoiceNo, navigate]);
};
```

**Display Logic**:
- **Loading State**: Shows spinner while initializing payment
- **Pending State**: Displays QR code image with polling progress bar
- **Paid State**: Shows success message, clears cart, redirects to order success
- **Failed State**: Shows error message with retry option

### Cart to Checkout Order Placement
**File**: [Frontend/src/pages/website/Cart.jsx](Frontend/src/pages/website/Cart.jsx#L34-L60)

```javascript
const handleCheckout = async () => {
  if (items.length === 0) return;
  setPlacingOrder(true);
  
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const firstItem = items[0];
    
    const payload = {
      customerId: user?.id || null,
      dueAmount: Math.round(total),  // Amount to be paid
      qty: firstItem.qty || 1,
      size: firstItem.size || 'M',
      productId: firstItem.pId || firstItem.productId,
    };
    
    const res = await orderApi.placeOrder(payload);
    if (res.data?.success) {
      const invoiceNo = res.data.data.invoiceNo;
      clearCart();
      navigate(`/checkout/${invoiceNo}`);
    }
  } catch (err) {
    alert('Error placing order: ' + err?.response?.data?.message);
  } finally {
    setPlacingOrder(false);
  }
};
```

---

## 5. DATA TRANSFER OBJECTS (DTOs)

### PaymentCreateRequest
**File**: [src/main/java/Spring_Ecomerc/Spring_ecomerc/dto/PaymentCreateRequest.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/dto/PaymentCreateRequest.java)

```java
@Data
public class PaymentCreateRequest {
    private Long orderId;      // Order ID to link payment
    private Double amount;     // Payment amount (validated: must be > 0)
    private String currency;   // "USD" or "KHR"
}
```

### PaymentResponse
**File**: [src/main/java/Spring_Ecomerc/Spring_ecomerc/dto/PaymentResponse.java](src/main/java/Spring_Ecomerc/Spring_ecomerc/dto/PaymentResponse.java)

```java
@Data
@Builder
public class PaymentResponse {
    private Integer id;
    private Long orderId;
    private String transactionId;      // Unique transaction ID (TXN-XXXXXXXX)
    private Double amount;
    private String currency;
    private PaymentStatus status;      // PENDING, PAID, FAILED
    private String qrString;           // Raw KHQR payload
    private String qrImage;            // Base64-encoded PNG image
    private LocalDateTime createdAt;
}
```

### Payment Status Enum
```java
public enum PaymentStatus {
    PENDING,  // Payment initiated, awaiting confirmation
    PAID,     // Payment confirmed by bank/Bakong
    FAILED    // Payment failed or timeout
}
```

---

## 6. FRONTEND API SERVICE INTEGRATION

**File**: [Frontend/src/services/api.js](Frontend/src/services/api.js#L159-L163)

```javascript
export const paymentApi = {
  create: (data) => api.post('/payments/create', data),
  getStatus: (transactionId) => api.get(`/payments/status/{transactionId}`),
  webhook: (data) => api.post('/payments/callback', data),
  simulatePaid: (transactionId) => api.post(`/payments/simulate-paid/{transactionId}`),
};
```

**Base URL**: Configured via `VITE_API_URL` environment variable
**Authentication**: Includes bearer token from localStorage ('admin_token' or 'customer_token')
**Interceptors**: Auto-redirects to login on 401 responses

---

## 7. PAYMENT FLOW SUMMARY

### Complete User Flow

1. **User adds items to cart** → Cart page
2. **Click "Proceed to Checkout"** → Place Order API call
   - Sends: `{customerId, dueAmount, qty, size, productId}`
   - Returns: Order with `invoiceNo`
3. **Navigate to Checkout page** → `/checkout/{invoiceNo}`
4. **Init Payment** (Checkout.jsx)
   - Fetch order by invoice number
   - Extract `dueAmount`
   - **Validate amount > 0** (backend)
   - Create payment record
   - Returns: `{transactionId, qrString, qrImage, status: PENDING}`
5. **Display QR Code**
   - Show base64 PNG image
   - User scans with bank app
6. **Poll Payment Status** (every 5 seconds, max 120 attempts = 10 minutes)
   - Check if status = PAID
7. **On Payment Confirmed**
   - Clear shopping cart
   - Show success message
   - Redirect to order success page

### Amount Validation Checkpoints

| Layer | File | Validation |
|-------|------|-----------|
| **Frontend** | Cart.jsx | `dueAmount: Math.round(total)` - ensures number |
| **Frontend** | Checkout.jsx | `order.dueAmount \|\| 0` - fallback to 0 |
| **Backend** | PaymentServiceImpl.java | `amount == null \|\| amount <= 0` → throws "Invalid payment amount" |
| **Database** | Payment.java | `@Column(name = "amount")` - stored as Double |

---

## 8. ERROR HANDLING

### Backend Error Messages
- **"Invalid payment amount"** - Amount is null or ≤ 0
- **"KHQR receiving account is not configured"** - No merchant ID set
- **"Transaction ID is required"** - Webhook missing transaction ID
- **"Payment not found"** - Transaction ID not in database

### Frontend Error Handling
- **Order not found** - Invalid invoice number
- **Payment initialization failed** - Network or backend error
- **Payment confirmation timeout** - 10 minutes elapsed without confirmation
- **Status check failed** - Retry with next polling attempt

---

## 9. CONFIGURATION REQUIREMENTS

### Application Properties
```properties
# Required environment variables for KHQR payment
payment.khqr.merchant-id=store@bakong  # Merchant ID (active Bakong account)
payment.khqr.merchant-name=My Store     # Display name on QR code
payment.khqr.merchant-city=Phnom Penh   # City on QR code
khqr.api.token=${BAKONG_API_TOKEN}      # API token for Bakong integration
```

### Supported Currencies
- **USD** → Currency Code 840
- **KHR** → Currency Code 116

---

## 10. FILE LOCATION SUMMARY

| Component | Location |
|-----------|----------|
| Payment Service (Core Logic) | `src/main/java/.../service/PaymentServiceImpl.java` |
| KHQR Service (QR Generation) | `src/main/java/.../service/KHQRService.java` |
| KHQR Controller | `src/main/java/.../controller/KHQRController.java` |
| Bakong Payment Controller | `src/main/java/.../controller/BakongPaymentController.java` |
| Payment Controller (Admin) | `src/main/java/.../controller/PaymentController.java` |
| Payment Entity | `src/main/java/.../entity/Payment.java` |
| Payment DTOs | `src/main/java/.../dto/PaymentCreateRequest.java` & `PaymentResponse.java` |
| Checkout Component | `Frontend/src/pages/Checkout.jsx` |
| Payment API Service | `Frontend/src/services/api.js` |
| Cart/Order Flow | `Frontend/src/pages/website/Cart.jsx` |
| Payments Admin Panel | `Frontend/src/pages/Payments.jsx` |

