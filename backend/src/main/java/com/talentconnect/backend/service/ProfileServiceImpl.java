package com.talentconnect.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.dto.ProfileResponse;
import com.talentconnect.backend.dto.UpdateProfileRequest;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class ProfileServiceImpl implements ProfileService {

    private static final String COLLECTION_NAME = "JobSeekers"; // Firebase 的集合名

    @Override
    public ProfileResponse getProfileById(String jobSeekerId) {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(jobSeekerId);

        try {
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                // 将 Firebase 中的数据转换为 ProfileResponse
                ProfileResponse response = new ProfileResponse();
                response.setJobSeekerId(jobSeekerId);
                response.setFirstName(document.getString("firstName"));
                response.setLastName(document.getString("lastName"));
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

        // 创建要保存的数据
        ProfileResponse data = new ProfileResponse();
        data.setJobSeekerId(jobSeekerId);
        data.setFirstName(request.getFirstName());
        data.setLastName(request.getLastName());
        data.setPhoneNo(request.getPhoneNo());
        data.setWorkingExperience(request.getWorkingExperience());
        data.setDesiredRoles(request.getDesiredRoles());
        data.setPreference(request.getPreference());

        // 写入 Firebase（合并方式更新）
        ApiFuture<WriteResult> result = docRef.set(data);
        try {
            System.out.println("✅ Profile updated at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }
}
