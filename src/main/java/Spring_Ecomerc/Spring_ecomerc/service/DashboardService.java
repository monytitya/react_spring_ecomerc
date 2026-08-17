package Spring_Ecomerc.Spring_ecomerc.service;

import Spring_Ecomerc.Spring_ecomerc.model.DashboardModel;
import Spring_Ecomerc.Spring_ecomerc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CustomerOrderRepository orderRepository;
    private final CategoryRepository categoryRepository;
    private final ManufacturerRepository manufacturerRepository;

    public DashboardModel getStats() {
        DashboardModel model = new DashboardModel();

        model.setTotalProducts(productRepository.count());
        model.setTotalCustomers(customerRepository.count());
        model.setTotalOrders(orderRepository.count());

        var allOrders = orderRepository.findAll();
        model.setPendingOrders(allOrders.stream().filter(this::isPendingStatus).count());
        model.setCompletedOrders(allOrders.stream().filter(this::isCompletedStatus).count());

        Long revenue = allOrders.stream()
                .mapToLong(o -> o.getDueAmount() == null ? 0L : Math.round(o.getDueAmount()))
                .sum();
        model.setTotalRevenue(revenue);
        model.setTotalProfit(revenue);
        model.setTotalExpenses((long) (revenue * 0.05));
        model.setNewUsers(customerRepository.count());

        model.setTotalCategories(categoryRepository.count());
        model.setTotalManufacturers(manufacturerRepository.count());

        return model;
    }

    public DashboardModel getCustomerStats(Integer customerId) {
        DashboardModel model = new DashboardModel();
        var orders = orderRepository.findByCustomerId(customerId);

        model.setTotalOrders((long) orders.size());
        model.setPendingOrders(orders.stream().filter(this::isPendingStatus).count());
        model.setCompletedOrders(orders.stream().filter(this::isCompletedStatus).count());
        model.setTotalRevenue(orders.stream().mapToLong(o -> o.getDueAmount() == null ? 0L : Math.round(o.getDueAmount())).sum());

        return model;
    }

    private boolean isPendingStatus(Spring_Ecomerc.Spring_ecomerc.entity.CustomerOrder order) {
        return order.getOrderStatus() != null && "pending".equalsIgnoreCase(order.getOrderStatus());
    }

    private boolean isCompletedStatus(Spring_Ecomerc.Spring_ecomerc.entity.CustomerOrder order) {
        if (order.getOrderStatus() == null) {
            return false;
        }
        String status = order.getOrderStatus().trim();
        return "complete".equalsIgnoreCase(status)
                || "paid".equalsIgnoreCase(status)
                || "delivered".equalsIgnoreCase(status)
                || "completed".equalsIgnoreCase(status);
    }
}
