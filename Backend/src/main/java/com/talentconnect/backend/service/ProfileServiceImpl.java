package com.talentconnect.backend.service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.dto.ProfileResponse;
import com.talentconnect.backend.dto.UpdateProfileRequest;

@Service
public class ProfileServiceImpl implements ProfileService {

    private static final String COLLECTION_NAME = "JobSeekers";

    @Override
    public ProfileResponse getProfileById(String jobSeekerId) {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(jobSeekerId);

        try {
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {

                ProfileResponse response = new ProfileResponse();
                response.setJobSeekerId(jobSeekerId);
                response.setFirstName(document.getString("firstName"));
                response.setLastName(document.getString("lastName"));
                response.setEmail(document.getString("email"));
                response.setPhoneNo(document.getString("phoneNo"));
                response.setWorkingExperience(document.getString("workingExperience"));
                response.setDesiredRoles(document.getString("desiredRoles"));
                response.setPreference(document.getString("preference"));
                return response;
            } else {
                System.out.println("⚠️ No such document with ID: " + jobSeekerId);
                return null;
            }

        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void updateProfile(String jobSeekerId, UpdateProfileRequest request) {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(jobSeekerId);

        Map<String, Object> updates = new HashMap<>();

        if (request.getFirstName() != null)
            updates.put("firstName", request.getFirstName());
        if (request.getLastName() != null)
            updates.put("lastName", request.getLastName());
        if (request.getEmail() != null)
            updates.put("email", request.getEmail());
        if (request.getPhoneNo() != null)
            updates.put("phoneNo", request.getPhoneNo());
        if (request.getWorkingExperience() != null)
            updates.put("workingExperience", request.getWorkingExperience());
        if (request.getDesiredRoles() != null)
            updates.put("desiredRoles", request.getDesiredRoles());
        if (request.getPreference() != null)
            updates.put("preference", request.getPreference());

        ApiFuture<WriteResult> result = docRef.update(updates);
        try {
            System.out.println("✅ Profile updated at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

}
