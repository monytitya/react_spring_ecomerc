package Spring_Ecomerc.Spring_ecomerc.controller;

import Spring_Ecomerc.Spring_ecomerc.dto.ApiResponse;
import Spring_Ecomerc.Spring_ecomerc.entity.*;
import Spring_Ecomerc.Spring_ecomerc.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cms")
@RequiredArgsConstructor
public class CmsController {

    private final AboutUsRepository aboutUsRepository;
    private final ContactUsRepository contactUsRepository;
    private final TermRepository termRepository;
    private final EnquiryTypeRepository enquiryTypeRepository;
    private final StoreRepository storeRepository;

    @GetMapping("/about")
    public ResponseEntity<ApiResponse<List<AboutUs>>> getAbout() {
        return ResponseEntity.ok(ApiResponse.success(aboutUsRepository.findAll()));
    }

    @PutMapping("/about/{id}")
    public ResponseEntity<ApiResponse<AboutUs>> updateAbout(@PathVariable Integer id, @RequestBody AboutUs about) {
        about.setAboutId(id);
        return ResponseEntity.ok(ApiResponse.success("Updated", aboutUsRepository.save(about)));
    }

    @GetMapping("/contact")
    public ResponseEntity<ApiResponse<List<ContactUs>>> getContact() {
        return ResponseEntity.ok(ApiResponse.success(contactUsRepository.findAll()));
    }

    @PutMapping("/contact/{id}")
    public ResponseEntity<ApiResponse<ContactUs>> updateContact(@PathVariable Integer id, @RequestBody ContactUs contact) {
        contact.setContactId(id);
        return ResponseEntity.ok(ApiResponse.success("Updated", contactUsRepository.save(contact)));
    }

    @GetMapping("/terms")
    public ResponseEntity<ApiResponse<List<Term>>> getTerms() {
        return ResponseEntity.ok(ApiResponse.success(termRepository.findAll()));
    }

    @GetMapping("/terms/{link}")
    public ResponseEntity<ApiResponse<Term>> getTermByLink(@PathVariable String link) {
        return ResponseEntity.ok(ApiResponse.success(termRepository.findByTermLink(link)
                .orElseThrow(() -> new RuntimeException("Term not found"))));
    }

    @GetMapping("/stores")
    public ResponseEntity<ApiResponse<List<Store>>> getStores() {
        return ResponseEntity.ok(ApiResponse.success(storeRepository.findAll()));
    }

    @GetMapping("/enquiry-types")
    public ResponseEntity<ApiResponse<List<EnquiryType>>> getEnquiryTypes() {
        return ResponseEntity.ok(ApiResponse.success(enquiryTypeRepository.findAll()));
    }
}
