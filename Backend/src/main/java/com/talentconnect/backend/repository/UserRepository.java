package com.talentconnect.backend.repository;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.talentconnect.backend.model.RoleType;
import com.talentconnect.backend.model.User;

@Repository
public class UserRepository {
    private final Firestore db;

    public UserRepository(Firestore firestore) {
        this.db = firestore;
    }

    public void save(User user) throws ExecutionException, InterruptedException {
        db.collection("users")
                .document(user.getId())
                .set(user)
                .get();
    }

    public User findByEmail(String email) throws ExecutionException, InterruptedException {
        var q = db.collection("users")
                .whereEqualTo("email", email)
                .get()
                .get();
        if (q.isEmpty()) return null;

        return convertToUser(q.getDocuments().get(0));
    }

    public User findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = db.collection("users")
                .document(id)
                .get()
                .get();
        return doc.exists() ? convertToUser(doc) : null;
    }

    public void updatePassword(String id, String newPassword) throws ExecutionException, InterruptedException {
        db.collection("users")
                .document(id)
                .update(Map.of("password", newPassword))
                .get();
    }

    // ✅ 抽出公共逻辑
    private User convertToUser(DocumentSnapshot doc) {
        String id = doc.getId();
        String email = doc.getString("email");
        String password = doc.getString("password");
        String roleStr = doc.getString("role");

        RoleType role = RoleType.fromString(roleStr);  // 大小写无关解析

        return new User(id, email, password, role);
    }
}
