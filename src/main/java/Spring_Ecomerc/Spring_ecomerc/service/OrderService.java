package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.dto.PlaceOrderRequest;
import Spring_Ecomerc.Spring_ecomerc.entity.CustomerOrder;
import Spring_Ecomerc.Spring_ecomerc.entity.PendingOrder;
import Spring_Ecomerc.Spring_ecomerc.model.OrderModel;
import Spring_Ecomerc.Spring_ecomerc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerOrderRepository customerOrderRepository;
    private final PendingOrderRepository pendingOrderRepository;
    private final CartRepository cartRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderModel placeOrder(PlaceOrderRequest request, String ipAddress) {
        long invoiceNo = Math.abs(new Random().nextLong() % 2_000_000_000L);

        CustomerOrder order = CustomerOrder.builder()
                .customerId(request.getCustomerId())
                .dueAmount(request.getDueAmount())
                .invoiceNo(invoiceNo)
                .qty(request.getQty())
                .size(request.getSize())
                .orderDate(LocalDateTime.now())
                .orderStatus("pending")
                .build();
        customerOrderRepository.save(order);

        PendingOrder pendingOrder = PendingOrder.builder()
                .customerId(request.getCustomerId())
                .invoiceNo(invoiceNo)
                .productId(String.valueOf(request.getProductId()))
                .qty(request.getQty())
                .size(request.getSize())
                .orderStatus("pending")
                .build();
        pendingOrderRepository.save(pendingOrder);

        cartRepository.deleteByIpAdd(ipAddress);

        return mapToModel(order);
    }

    public List<OrderModel> getOrdersByCustomer(Integer customerId) {
        return customerOrderRepository.findByCustomerId(customerId).stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public List<OrderModel> getAllOrders() {
        return customerOrderRepository.findAll().stream().map(this::mapToModel).collect(Collectors.toList());
    }

    public OrderModel updateOrderStatus(Integer orderId, String status) {
        CustomerOrder order = customerOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus(status);
        return mapToModel(customerOrderRepository.save(order));
    }

    private OrderModel mapToModel(CustomerOrder order) {
        OrderModel model = new OrderModel();
        model.setOrderId(order.getOrderId());
        model.setCustomerId(order.getCustomerId());
        model.setDueAmount(order.getDueAmount());
        model.setInvoiceNo(order.getInvoiceNo());
        model.setQty(order.getQty());
        model.setSize(order.getSize());
        model.setOrderDate(order.getOrderDate());
        model.setOrderStatus(order.getOrderStatus());
        
        customerRepository.findById(order.getCustomerId()).ifPresent(c -> model.setCustomerName(c.getCustomerName()));
        
        // Find product from pending_orders for display
        pendingOrderRepository.findByInvoiceNo(order.getInvoiceNo()).stream().findFirst().ifPresent(po -> {
            model.setProductId(po.getProductId());
            try {
                productRepository.findById(Integer.parseInt(po.getProductId())).ifPresent(p -> model.setProductTitle(p.getProductTitle()));
            } catch (Exception e) {}
        });
        
        return model;
    }
}

