package com.talentconnect.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.dto.BookmarkRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class BookmarkService {

    private final Firestore db = FirestoreClient.getFirestore();

    public void addBookmark(BookmarkRequest request) {
        String pjid = UUID.randomUUID().toString();

        Map<String, Object> data = new HashMap<>();
        data.put("jobSeekerId", request.getJobSeekerId());
        data.put("jobId", request.getJobId());

        db.collection("potentialJobLists")
                .document(pjid)
                .set(data);
    }

    public void removeBookmarkByPjid(String pjid) {
        db.collection("potentialJobLists")
                .document(pjid)
                .delete();
    }

    public List<Map<String, Object>> getBookmarksByJobSeekerId(String jobSeekerId) {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            CollectionReference collection = db.collection("potentialJobLists");
            Query query = collection.whereEqualTo("jobSeekerId", jobSeekerId);
            ApiFuture<QuerySnapshot> future = query.get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> bookmark = doc.getData();
                bookmark.put("pjid", doc.getId());
                results.add(bookmark);
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to get potentialJobLists", e);
        }

        return results;
    }
}
