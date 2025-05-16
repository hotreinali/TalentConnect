package com.talentconnect.backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.model.Application;
import com.talentconnect.backend.model.Employer;
import com.talentconnect.backend.model.Job;
import com.talentconnect.backend.model.Shortlist;

@Repository
public class EmployerRepository {

    private final Firestore db = FirestoreClient.getFirestore();

    private static final String EMPLOYERS = "employers";
    private static final String JOBS = "jobs";
    private static final String APPLICATIONS = "applications";
    private static final String POTENTIAL_CANDIDATE_LISTS = "potentialCandidateLists";

    public void saveEmployer(String employerId, Employer employer) throws ExecutionException, InterruptedException {
        employer.setEmployerId(employerId); // 确保 ID 被写入对象本身
        db.collection(EMPLOYERS).document(employerId).set(employer).get();
    }

    public Employer getEmployer(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot snapshot = db.collection(EMPLOYERS).document(id).get().get();
        return snapshot.exists() ? snapshot.toObject(Employer.class) : null;
    }

    public void updateEmployer(String id, Employer employer) {
        db.collection(EMPLOYERS).document(id).set(employer);
    }

    public String createJob(Job job) throws ExecutionException, InterruptedException {
        String jobId = UUID.randomUUID().toString();
        job.setJobId(jobId);
        db.collection(JOBS).document(jobId).set(job);
        return jobId;
    }

    public List<Job> getJobsByEmployer(String employerId) throws ExecutionException, InterruptedException {
        List<Job> jobList = new ArrayList<>();
        QuerySnapshot snapshot = db.collection(JOBS).whereEqualTo("employerId", employerId).get().get();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            jobList.add(doc.toObject(Job.class));
        }
        return jobList;
    }

    public Job getJobById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = db.collection(JOBS).document(id).get().get();
        return doc.exists() ? doc.toObject(Job.class) : null;
    }

    public List<Application> getApplicationsByJobId(String jobId) throws ExecutionException, InterruptedException {
        List<Application> list = new ArrayList<>();
        QuerySnapshot snapshot = db.collection(APPLICATIONS).whereEqualTo("jobId", jobId).get().get();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            list.add(doc.toObject(Application.class));
        }
        return list;
    }

    public void updateJob(String id, Job job) {
        db.collection(JOBS).document(id).set(job);
    }

    public void updateApplicationStatus(String id, String status) {
        db.collection(APPLICATIONS).document(id).update("status", status);
    }

    public String addToShortlist(Shortlist shortlist) {
        String id = UUID.randomUUID().toString();
        shortlist.setPcId(id);
        db.collection(POTENTIAL_CANDIDATE_LISTS).document(id).set(shortlist);
        return id;
    }

    public List<Shortlist> getShortlists(String employerId) throws ExecutionException, InterruptedException {
        List<Shortlist> result = new ArrayList<>();
        QuerySnapshot snapshot = db.collection(POTENTIAL_CANDIDATE_LISTS).whereEqualTo("employerId", employerId).get()
                .get();
        for (DocumentSnapshot doc : snapshot.getDocuments()) {
            result.add(doc.toObject(Shortlist.class));
        }
        return result;
    }

    public void removeShortlist(String id) {
        db.collection(POTENTIAL_CANDIDATE_LISTS).document(id).delete();
    }
}
