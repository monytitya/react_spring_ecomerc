package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.dto.PlaceOrderRequest;
import Spring_Ecomerc.Spring_ecomerc.model.OrderModel;
import Spring_Ecomerc.Spring_ecomerc.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderModel>> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            HttpServletRequest httpRequest) {
        OrderModel order = orderService.placeOrder(request, httpRequest.getRemoteAddr());
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/my/{customerId}")
    public ResponseEntity<ApiResponse<List<OrderModel>>> myOrders(@PathVariable Integer customerId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrdersByCustomer(customerId)));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<OrderModel>>> allOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders()));
    }

    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderModel>> updateStatus(
            @PathVariable Integer orderId,
            @RequestBody Map<String, String> body) {
        OrderModel order = orderService.updateOrderStatus(orderId, body.get("status"));
        return ResponseEntity.ok(ApiResponse.success("Status updated", order));
    }
}

