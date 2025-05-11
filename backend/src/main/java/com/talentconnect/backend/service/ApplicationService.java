package com.talentconnect.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.dto.ApplyJobRequest;
import com.talentconnect.backend.model.ApplicationStatus;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class ApplicationService {

    private final Firestore db = FirestoreClient.getFirestore();

    public void submitApplication(ApplyJobRequest request) {
        String applicationId = UUID.randomUUID().toString();

        Map<String, Object> data = new HashMap<>();
        data.put("jobId", request.getJobId());
        data.put("jobSeekerId", request.getJobSeekerId());
        data.put("status", ApplicationStatus.SUBMITTED.name());
        data.put("applyDate", FieldValue.serverTimestamp());

        db.collection("applications")
                .document(applicationId)
                .set(data);
    }

    public List<Map<String, Object>> getApplicationsByJobSeekerId(String jobSeekerId) {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            CollectionReference collection = db.collection("applications");
            Query query = collection.whereEqualTo("jobSeekerId", jobSeekerId);
            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> app = doc.getData();
                app.put("applicationId", doc.getId());
                results.add(app);
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to get applications", e);
        }

        return results;
    }
}
