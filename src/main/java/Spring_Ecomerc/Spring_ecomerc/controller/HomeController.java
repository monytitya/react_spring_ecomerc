package Spring_Ecomerc.Spring_ecomerc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class HomeController {

    @GetMapping("/")
    public RedirectView redirectToSwagger() {
        // Redirect root URL to Swagger UI
        return new RedirectView("/swagger-ui/index.html");
    }
}
