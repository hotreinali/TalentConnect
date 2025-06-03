package com.talentconnect.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
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
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firebase.cloud.StorageClient;
import com.talentconnect.backend.dto.ApplyJobRequest;
import com.talentconnect.backend.dto.BookmarkListResponse;
import com.talentconnect.backend.dto.BookmarkRequest;
import com.talentconnect.backend.dto.BookmarkSummary;
import com.talentconnect.backend.dto.JobDTO;
import com.talentconnect.backend.dto.ProfileResponse;
import com.talentconnect.backend.dto.UpdateProfileRequest;
import com.talentconnect.backend.model.Application;
import com.talentconnect.backend.model.JobSeeker;
import com.talentconnect.backend.model.Resume;
import com.talentconnect.backend.service.ApplicationService;
import com.talentconnect.backend.service.BookmarkService;
import com.talentconnect.backend.service.JobService;
import com.talentconnect.backend.service.ProfileService;
import com.talentconnect.backend.service.ResumeService;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://talent-connect.s3-website-ap-southeast-2.amazonaws.com",
        "http://d2s57y3bv04cxg.cloudfront.net"
})
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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

    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobSeekerId") String jobSeekerId) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No file uploaded"));
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds limit of 5MB"));
            }

            Bucket bucket = StorageClient.getInstance().bucket();
            String fileName = "resumes/" + jobSeekerId + "/" + System.currentTimeMillis() + "_"
                    + file.getOriginalFilename();
            Blob blob = bucket.create(fileName, file.getInputStream(), "application/pdf");

            String downloadUrl = blob.signUrl(3650, java.util.concurrent.TimeUnit.DAYS).toString();

            String resumeId = db.collection("resumes").document().getId();
            Timestamp uploadedAt = Timestamp.now();
            Resume resume = new Resume(resumeId, jobSeekerId, downloadUrl, uploadedAt);

            DocumentReference docRef = db.collection("resumes").document(resumeId);
            docRef.set(resume).get();

            DocumentReference jobSeekerDocRef = db.collection("JobSeekers").document(jobSeekerId);
            DocumentSnapshot jobSeekerDoc = jobSeekerDocRef.get().get();

            if (jobSeekerDoc.exists()) {
                JobSeeker jobSeeker = jobSeekerDoc.toObject(JobSeeker.class);
                if (jobSeeker != null) {
                    jobSeeker.setResumeId(resumeId);
                    jobSeekerDocRef.update("resumeId", resumeId).get();
                } else {
                    return ResponseEntity.status(500).body(Map.of("error", "Failed to parse JobSeeker data"));
                }
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "JobSeeker not found"));
            }

            return ResponseEntity.ok(Map.of("downloadUrl", downloadUrl, "resumeId", resumeId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
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

    @GetMapping("/resumes/jobseeker/{jobSeekerId}")
    public ResponseEntity<Map<String, String>> getResumeByJobSeekerId(@PathVariable String jobSeekerId) {
        try {
            ApiFuture<QuerySnapshot> future = db.collection("resumes")
                    .whereEqualTo("jobSeekerId", jobSeekerId)
                    .orderBy("uploadedAt", Query.Direction.DESCENDING)
                    .limit(1)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            if (!documents.isEmpty()) {
                String downloadUrl = documents.get(0).getString("downloadUrl");
                return ResponseEntity.ok(Map.of("resumeUrl", downloadUrl));
            } else {
                return ResponseEntity.ok(Map.of("resumeUrl", ""));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error fetching resume"));
        }
    }

    // application
    @PostMapping("/applications")
    public ResponseEntity<String> applyJob(@RequestBody ApplyJobRequest request) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<QuerySnapshot> future = db.collection("applications")
                    .whereEqualTo("jobSeekerId", request.getJobSeekerId())
                    .whereEqualTo("jobId", request.getJobId())
                    .get();

            List<QueryDocumentSnapshot> existing = future.get().getDocuments();
            if (!existing.isEmpty()) {
                return ResponseEntity.badRequest().body("You have already applied for this job.");
            }

            applicationService.submitApplication(request);
            return ResponseEntity.ok("Application submitted.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting application.");
        }
    }

    @GetMapping("/applications")
    public List<Map<String, Object>> getApplications(@RequestParam String jobSeekerId)
            throws InterruptedException, ExecutionException {

        ApiFuture<QuerySnapshot> future = db.collection("applications")
                .whereEqualTo("jobSeekerId", jobSeekerId)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        Map<String, Application> latestByJobId = new HashMap<>();

        for (QueryDocumentSnapshot doc : documents) {
            Application application = doc.toObject(Application.class);
            application.setApplicationId(doc.getId());

            String jobId = application.getJobId();
            if (!latestByJobId.containsKey(jobId)
                    || latestByJobId.get(jobId).getApplyTime().compareTo(application.getApplyTime()) < 0) {
                latestByJobId.put(jobId, application);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (Application app : latestByJobId.values()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("applicationId", app.getApplicationId());
            entry.put("jobId", app.getJobId());
            entry.put("status", app.getStatus());
            entry.put("applyTime", app.getApplyTime());

            DocumentSnapshot jobSnapshot = db.collection("jobs").document(app.getJobId()).get().get();
            if (jobSnapshot.exists()) {
                entry.put("title", jobSnapshot.getString("title"));
            } else {
                entry.put("title", "(Unknown)");
            }

            result.add(entry);
        }

        result.sort((a, b) -> {
            Timestamp t1 = (Timestamp) a.get("applyTime");
            Timestamp t2 = (Timestamp) b.get("applyTime");
            return t2.compareTo(t1);
        });

        return result;
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
