package com.talentconnect.backend.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.model.Employer;
import com.talentconnect.backend.model.Job;
import com.talentconnect.backend.model.Shortlist;

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

    // 2. Update employer profile
    @PutMapping("/profile/{id}")
    public String updateEmployerProfile(@PathVariable String id, @RequestBody Employer employer) throws Exception {
        db.collection(EMPLOYERS).document(id).set(employer);
        return "Employer profile updated";
    }

    // 3. Create job
    @PostMapping("/jobs")
    public String createJob(@RequestBody Job job) throws Exception {
        DocumentReference counterRef = db.collection("metadata").document("jobCounter");

        ApiFuture<String> future = db.runTransaction(transaction -> {
            DocumentSnapshot snapshot = transaction.get(counterRef).get();
            Long currentCount = snapshot.contains("count") ? snapshot.getLong("count") : 0L;
            long newCount = currentCount + 1;

            String jobId = String.format("job%03d", newCount);
            job.setJobId(jobId);
            db.collection(JOBS).document(jobId).set(job);
            transaction.update(counterRef, "count", newCount);

            return jobId;
        });

        return future.get();
    }

    // 5. View job details and applicants

    @GetMapping("/jobs/{id}")
    public Map<String, Object> getJobWithApplicants(@PathVariable String id) throws Exception {
        Map<String, Object> result = new HashMap<>();

        DocumentSnapshot jobDoc = db.collection(JOBS).document(id).get().get();
        if (!jobDoc.exists()) {
            throw new RuntimeException("Job not found");
        }
        result.put("job", jobDoc.toObject(Job.class));

        List<QueryDocumentSnapshot> applications = db.collection(APPLICATIONS)
                .whereEqualTo("jobId", id).get().get().getDocuments();

        List<Map<String, Object>> applicantList = new ArrayList<>();
        for (DocumentSnapshot doc : applications) {
            Map<String, Object> data = doc.getData();
            if (data != null) {
                data.put("applicationId", doc.getId());
                applicantList.add(data);
            }
        }

        result.put("applicants", applicantList);
        return result;
    }

    // 5. Get all jobs by employer
    @GetMapping("/jobs")
    public List<Job> getJobs(@RequestParam String employerId) throws Exception {
        List<Job> jobList = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection(JOBS).whereEqualTo("employerId", employerId).get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            jobList.add(doc.toObject(Job.class));
        }
        return jobList;
    }

    // 0️⃣ Public endpoint to get all jobs (for job seekers)
    @GetMapping("/jobs/all")
    public List<Job> getAllJobs() throws Exception {
        List<Job> jobList = new ArrayList<>();
        ApiFuture<QuerySnapshot> future = db.collection("jobs").get();
        for (DocumentSnapshot doc : future.get().getDocuments()) {
            jobList.add(doc.toObject(Job.class));
        }
        return jobList;
    }

    // 6. Get all applicants for all jobs posted by the employer (sorted by earliest
    // application)
    @GetMapping("/applicants")
    public List<Map<String, Object>> getAllApplicantsForEmployer(@RequestParam String employerId) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        List<Map<String, Object>> result = new ArrayList<>();

        // Step 1: Get all jobs posted by this employer
        QuerySnapshot jobSnapshots = db.collection("jobs")
                .whereEqualTo("employerId", employerId)
                .get()
                .get();

        List<String> jobIds = new ArrayList<>();
        Map<String, String> jobIdToTitle = new HashMap<>();

        for (DocumentSnapshot jobDoc : jobSnapshots.getDocuments()) {
            Job job = jobDoc.toObject(Job.class);
            jobIds.add(job.getJobId());
            jobIdToTitle.put(job.getJobId(), job.getTitle());
        }

        // Step 2: Get all applications for these jobs
        List<DocumentSnapshot> allApplicationDocs = new ArrayList<>();
        for (String jobId : jobIds) {
            QuerySnapshot appSnapshot = db.collection("applications")
                    .whereEqualTo("jobId", jobId)
                    .get()
                    .get();
            allApplicationDocs.addAll(appSnapshot.getDocuments());
        }

        // ✅ Sort applications by submission time (oldest first)
        allApplicationDocs.sort(Comparator.comparing(doc -> doc.getCreateTime().toDate()));

        // Step 3: Collect all unique jobSeekerIds
        Set<String> jobSeekerIds = new HashSet<>();
        for (DocumentSnapshot appDoc : allApplicationDocs) {
            String jobSeekerId = (String) appDoc.get("jobSeekerId");
            if (jobSeekerId != null) {
                jobSeekerIds.add(jobSeekerId);
            }
        }

        // Step 4: Batch load JobSeeker profiles
        List<DocumentReference> seekerRefs = jobSeekerIds.stream()
                .map(id -> db.collection("JobSeekers").document(id))
                .toList();
        List<DocumentSnapshot> seekerDocs = db.getAll(seekerRefs.toArray(new DocumentReference[0])).get();

        Map<String, Map<String, Object>> seekerMap = new HashMap<>();
        for (DocumentSnapshot doc : seekerDocs) {
            if (doc.exists()) {
                seekerMap.put(doc.getId(), doc.getData());
            }
        }

        // Step 5: Combine application data with job info and seeker profile
        for (DocumentSnapshot appDoc : allApplicationDocs) {
            Map<String, Object> appData = new HashMap<>(appDoc.getData());
            String jobId = (String) appData.get("jobId");
            String jobSeekerId = (String) appData.get("jobSeekerId");

            appData.put("applicationId", appDoc.getId());
            appData.put("title", jobIdToTitle.getOrDefault(jobId, "Unknown"));

            Map<String, Object> seeker = seekerMap.get(jobSeekerId);
            appData.put("firstName", seeker != null ? seeker.getOrDefault("firstName", "NA") : "NA");
            appData.put("lastName", seeker != null ? seeker.getOrDefault("lastName", "NA") : "NA");
            appData.put("email", seeker != null ? seeker.getOrDefault("email", "NA") : "NA");

            result.add(appData);
        }

        return result;
    }

    // 7. Update application status
    @PutMapping("/applications/{id}/status")
    public String updateApplicationStatus(@PathVariable String id, @RequestBody Map<String, String> payload)
            throws Exception {
        String newStatus = payload.get("status");

        if (newStatus != null && !newStatus.isEmpty()) {
            newStatus = Arrays.stream(newStatus.trim().split("\\s+"))
                    .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                    .collect(Collectors.joining(" "));
        } else {
            throw new IllegalArgumentException("Status is required.");
        }

        db.collection("applications").document(id).update("status", newStatus);
        return "Application status updated";
    }

    // 8. Add to shortlist
    @PostMapping("/shortlists")
    public Map<String, String> addToShortlist(@RequestBody Shortlist shortlist) throws Exception {
        String customId = shortlist.getEmployerId() + "_" + shortlist.getJobSeekerId();
        shortlist.setPcId(customId);
        db.collection(POTENTIAL_CANDIDATE_LISTS).document(customId).set(shortlist);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Candidate has been shortlisted.");
        response.put("shortlistId", customId);
        return response;
    }

    // 9. Get all shortlisted candidates
    @GetMapping("/shortlists")
    public List<Shortlist> getShortlists(@RequestParam String employerId) throws Exception {
        List<Shortlist> result = new ArrayList<>();
        QuerySnapshot snapshot = db.collection(POTENTIAL_CANDIDATE_LISTS)
                .whereEqualTo("employerId", employerId).get().get();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            result.add(doc.toObject(Shortlist.class));
        }
        return result;
    }

    // 10. Remove from shortlist
    @DeleteMapping("/shortlists/{pcId}")
    public String removeFromShortlist(@PathVariable String pcId) throws Exception {
        db.collection(POTENTIAL_CANDIDATE_LISTS).document(pcId).delete();
        return "Shortlisted candidate removed.";
    }
}