package Spring_Ecomerc.Spring_ecomerc.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardModel {
    private Long totalProducts;
    private Long totalCustomers;
    private Long totalOrders;
    private Long pendingOrders;
    private Long completedOrders;
    private Long totalRevenue;
    private Long totalCategories;
    private Long totalManufacturers;
}
