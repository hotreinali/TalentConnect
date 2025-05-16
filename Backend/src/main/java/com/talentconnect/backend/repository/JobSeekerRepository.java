package com.talentconnect.backend.repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.model.JobSeeker;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class JobSeekerRepository {

    private final Firestore db = FirestoreClient.getFirestore();
    private static final String JOB_SEEKERS = "JobSeekers";

    // 保存新的 JobSeeker（注册时调用）
    public void saveJobSeeker(String jobSeekerId, JobSeeker jobSeeker) throws ExecutionException, InterruptedException {
        jobSeeker.setJobSeekerId(jobSeekerId);
        db.collection(JOB_SEEKERS).document(jobSeekerId).set(jobSeeker).get();
    }

    // 根据 ID 获取 JobSeeker
    public JobSeeker getJobSeekerById(String jobSeekerId) throws ExecutionException, InterruptedException {
        DocumentSnapshot snapshot = db.collection(JOB_SEEKERS).document(jobSeekerId).get().get();
        return snapshot.exists() ? snapshot.toObject(JobSeeker.class) : null;
    }

    // 根据 email 查询 JobSeeker
    public JobSeeker getJobSeekerByEmail(String email) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = db.collection(JOB_SEEKERS).whereEqualTo("email", email).get();
        QuerySnapshot snapshot = future.get();
        if (snapshot.isEmpty()) return null;
        return snapshot.getDocuments().get(0).toObject(JobSeeker.class);
    }
}
