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
        
        model.setPendingOrders(orderRepository.countByOrderStatus("pending"));
        model.setCompletedOrders(orderRepository.countByOrderStatus("Complete"));
        
        // Sum up total revenue
        Long revenue = orderRepository.findAll().stream()
                .mapToLong(o -> o.getDueAmount().longValue())
                .sum();
        model.setTotalRevenue(revenue);
        model.setTotalProfit(revenue); // For now, assume profit = revenue for simplicity
        model.setTotalExpenses((long)(revenue * 0.05)); // 5% estimate
        model.setNewUsers(customerRepository.count());
        
        model.setTotalCategories(categoryRepository.count());
        model.setTotalManufacturers(manufacturerRepository.count());
        
        return model;
    }

    public DashboardModel getCustomerStats(Integer customerId) {
        DashboardModel model = new DashboardModel();
        var orders = orderRepository.findByCustomerId(customerId);
        
        model.setTotalOrders((long) orders.size());
        model.setPendingOrders(orders.stream().filter(o -> "pending".equalsIgnoreCase(o.getOrderStatus())).count());
        model.setCompletedOrders(orders.stream().filter(o -> "Complete".equalsIgnoreCase(o.getOrderStatus())).count());
        model.setTotalRevenue(orders.stream().mapToLong(o -> o.getDueAmount().longValue()).sum());
        
        return model;
    }
}
