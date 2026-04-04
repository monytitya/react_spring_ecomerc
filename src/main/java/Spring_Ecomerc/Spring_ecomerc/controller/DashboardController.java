package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.model.DashboardModel;
import Spring_Ecomerc.Spring_ecomerc.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardModel>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<ApiResponse<DashboardModel>> getCustomerStats(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getCustomerStats(id)));
    }
}
