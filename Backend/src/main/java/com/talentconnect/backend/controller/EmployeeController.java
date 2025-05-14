package com.talentconnect.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.dto.ApplyJobRequest;
import com.talentconnect.backend.dto.BookmarkListResponse;
import com.talentconnect.backend.dto.BookmarkRequest;
import com.talentconnect.backend.dto.BookmarkSummary;
import com.talentconnect.backend.dto.JobDTO;
import com.talentconnect.backend.dto.ProfileResponse;
import com.talentconnect.backend.dto.UpdateProfileRequest;
import com.talentconnect.backend.model.Application;
import com.talentconnect.backend.service.ApplicationService;
import com.talentconnect.backend.service.BookmarkService;
import com.talentconnect.backend.service.JobService;
import com.talentconnect.backend.service.ProfileService;
import com.talentconnect.backend.service.ResumeService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private JobService jobService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private ApplicationService applicationService;

     private final Firestore db = FirestoreClient.getFirestore();

    // profile
    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable String id) {
        ProfileResponse profile = profileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(
            @PathVariable String id,
            @RequestBody UpdateProfileRequest request) {
        profileService.updateProfile(id, request);
        return ResponseEntity.ok("Profile updated.");
    }

    // resume
    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobSeekerId") String jobSeekerId) {
        if (!"application/pdf".equals(file.getContentType())
                || file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        String resumeUrl = resumeService.uploadResume(file, jobSeekerId);
        return ResponseEntity.ok(resumeUrl);
    }

    @GetMapping("/resume/{id}")
    public ResponseEntity<String> getResume(@PathVariable String id) {
        String resumeUrl = resumeService.getResumeUrl(id);
        return ResponseEntity.ok(resumeUrl);
    }

    @PutMapping("/resume/{id}")
    public ResponseEntity<String> replaceResume(
            @PathVariable("id") String jobSeekerId,
            @RequestParam("file") MultipartFile file) {
        if (!"application/pdf".equals(file.getContentType())
                || file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        String newUrl = resumeService.replaceResume(file, jobSeekerId);
        return ResponseEntity.ok(newUrl);
    }

    @DeleteMapping("/resume/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable String id) {
        try {
            resumeService.deleteResume(id);
            return ResponseEntity.ok("Resume deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // application
    @PostMapping("/applications")
    public ResponseEntity<String> applyJob(@RequestBody ApplyJobRequest request) {
        applicationService.submitApplication(request);
        return ResponseEntity.ok("Application submitted.");
    }

   @GetMapping("/applications") // change
    public List<Application> getApplications() throws InterruptedException, ExecutionException {
        // String jobSeekerId = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Application> applicationList = new ArrayList<>();
        // ApiFuture<QuerySnapshot> future = db.collection("applications")
        //         .whereEqualTo("jobseekerId", jobSeekerId)
        //         .get();
        ApiFuture<QuerySnapshot> future = db.collection("applications")
                .get();
        for (QueryDocumentSnapshot doc : future.get().getDocuments()) {
            Application application = doc.toObject(Application.class);
            application.setApplicationId(doc.getId()); // Set the document ID
            applicationList.add(application);
        }
        return applicationList;
    }

    // bookmark
    @PostMapping("/bookmarks")
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkRequest request) {
        bookmarkService.addBookmark(request);
        return ResponseEntity.ok("Bookmark added.");
    }

    @DeleteMapping("/bookmarks/{pjid}")
    public ResponseEntity<String> removeBookmark(@PathVariable String pjid) {
        bookmarkService.removeBookmarkByPjid(pjid);
        return ResponseEntity.ok("Bookmark removed.");
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<BookmarkListResponse> getBookmarks(@RequestParam String jobSeekerId) {
        List<Map<String, Object>> records = bookmarkService.getBookmarksByJobSeekerId(jobSeekerId);
        List<BookmarkSummary> result = new ArrayList<>();

        for (Map<String, Object> record : records) {
            String jobId = (String) record.get("jobId");
            String pjid = (String) record.get("pjid");

            JobDTO job = jobService.getJobDetail(jobId);
            BookmarkSummary summary = new BookmarkSummary(pjid, jobId, job.getTitle(), job.getLocation());
            result.add(summary);
        }

        return ResponseEntity.ok(new BookmarkListResponse(result));
    }
}
