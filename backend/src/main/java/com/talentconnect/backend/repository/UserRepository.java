package com.talentconnect.backend.repository;

import com.talentconnect.backend.model.User;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentSnapshot;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;
import java.util.Map;

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
        if (q.isEmpty())
            return null;
        DocumentSnapshot doc = q.getDocuments().get(0);
        return doc.toObject(User.class);
    }

    public User findById(String id) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = db.collection("users")
                .document(id)
                .get()
                .get();
        return doc.exists() ? doc.toObject(User.class) : null;
    }

    // ← 新增此方法
    public void updatePassword(String id, String newPassword) throws ExecutionException, InterruptedException {
        db.collection("users")
                .document(id)
                .update(Map.of("password", newPassword))
                .get();
    }
}
