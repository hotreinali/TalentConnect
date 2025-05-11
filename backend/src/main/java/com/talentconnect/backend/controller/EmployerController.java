package com.talentconnect.backend.controller;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.model.Employer;
import com.talentconnect.backend.model.Job;
import com.talentconnect.backend.model.Shortlist;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/employer")
public class EmployerController {

    private static final String EMPLOYERS = "employers";
    private static final String JOBS = "jobs";
    private static final String APPLICATIONS = "applications";
    private static final String POTENTIAL_CANDIDATE_LISTS = "potentialCandidateLists";

    private final Firestore db = FirestoreClient.getFirestore();

    // 1. Get employer profile
    @GetMapping("/profile/{id}")
    public Employer getEmployerProfile(@PathVariable String id) throws Exception {
        DocumentSnapshot snapshot = db.collection(EMPLOYERS).document(id).get().get();
        return snapshot.exists() ? snapshot.toObject(Employer.class) : null;
    }

    // 2. Update employer info
    @PutMapping("/profile/{id}")
    public String updateEmployerProfile(@PathVariable String id, @RequestBody Employer employer) throws Exception {
        db.collection(EMPLOYERS).document(id).set(employer);
        return "Employer profile updated";
    }

    // 3. Create/post a job
    @PostMapping("/jobs")
    public String createJob(@RequestBody Job job) throws Exception {
        ApiFuture<QuerySnapshot> future = db.collection(JOBS).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        int count = documents.size() + 1;

        String jobId = String.format("job%03d", count);
        job.setJobId(jobId);

        db.collection(JOBS).document(jobId).set(job);

        return jobId;
    }


    // 4. View all jobs posted by employer
    @GetMapping("/jobs")
    public List<Job> getJobs(@RequestParam String employerId) throws Exception {
        List<Job> jobList = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection(JOBS).whereEqualTo("employerId", employerId).get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            jobList.add(doc.toObject(Job.class));
        }
        return jobList;
    }

    // 5. View job details and applicants
    @GetMapping("/jobs/{id}")
    public Map<String, Object> getJobWithApplicants(@PathVariable String id) throws Exception {
        Map<String, Object> result = new HashMap<>();
        DocumentSnapshot jobDoc = db.collection(JOBS).document(id).get().get();
        result.put("job", jobDoc.toObject(Job.class));

        List<QueryDocumentSnapshot> applications = db.collection(APPLICATIONS)
                .whereEqualTo("jobId", id).get().get().getDocuments();
        result.put("applicants", applications);

        return result;
    }

    // 6. Update job info
    @PutMapping("/jobs/{id}")
    public String updateJob(@PathVariable String id, @RequestBody Job job) throws Exception {
        db.collection(JOBS).document(id).set(job);
        return "Job updated successfully";
    }

    // 7. Update application status
    @PutMapping("/applications/{id}/status")
    public String updateApplicationStatus(@PathVariable String id, @RequestBody Map<String, String> payload) throws Exception {
        String newStatus = payload.get("status");
        db.collection(APPLICATIONS).document(id).update("status", newStatus);
        return "Application status updated";
    }

    // 8. Flag candidate as potential
    @PostMapping("/shortlists")
    public Map<String, String> addToShortlist(@RequestBody Shortlist shortlist) throws Exception {
        String customId = shortlist.getEmployerId() + "_" + shortlist.getJobSeekerId(); // 自定义ID
        shortlist.setPcId(customId);
        db.collection(POTENTIAL_CANDIDATE_LISTS).document(customId).set(shortlist);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Candidate has been shortlisted.");
        response.put("shortlistId", customId);
        return response;
    }

    // 9. View all flagged candidates
    @GetMapping("/shortlists")
    public List<Shortlist> getShortlists(@RequestParam String employerId) throws Exception {
        List<Shortlist> result = new ArrayList<>();
        QuerySnapshot snapshot = db.collection(POTENTIAL_CANDIDATE_LISTS).whereEqualTo("employerId", employerId).get().get();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            result.add(doc.toObject(Shortlist.class));
        }
        return result;
    }

    // 10. Remove someone from shortlist
    @DeleteMapping("/shortlists/{pcId}")
    public String removeFromShortlist(@PathVariable String pcId) throws Exception {
        db.collection(POTENTIAL_CANDIDATE_LISTS).document(pcId).delete();
        return "Shortlisted candidate removed.";
    }

}
