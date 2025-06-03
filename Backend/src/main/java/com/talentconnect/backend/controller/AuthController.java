package com.talentconnect.backend.controller;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.talentconnect.backend.dto.AuthRequest;
import com.talentconnect.backend.dto.SignupRequest;
import com.talentconnect.backend.model.Employer;
import com.talentconnect.backend.model.JobSeeker;
import com.talentconnect.backend.model.RoleType;
import com.talentconnect.backend.model.User;
import com.talentconnect.backend.repository.EmployerRepository;
import com.talentconnect.backend.repository.JobSeekerRepository;
import com.talentconnect.backend.repository.UserRepository;
import com.talentconnect.backend.security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://talent-connect.s3-website-ap-southeast-2.amazonaws.com",
        "http://d2s57y3bv04cxg.cloudfront.net"
})
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private EmployerRepository employerRepo;
    @Autowired
    private JobSeekerRepository jobSeekerRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody SignupRequest req)
            throws ExecutionException, InterruptedException {

        Firestore db = FirestoreClient.getFirestore();

        boolean emailUsedInEmployers = !db.collection("employers")
                .whereEqualTo("email", req.getEmail()).get().get().isEmpty();
        boolean emailUsedInJobSeekers = !db.collection("JobSeekers")
                .whereEqualTo("email", req.getEmail()).get().get().isEmpty();

        if (emailUsedInEmployers) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "This email is already used by an employer."));
        }
        if (emailUsedInJobSeekers) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "This email is already used by a job seeker."));
        }

        if (userRepo.findByEmail(req.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "This email is already registered."));
        }

        String hashed = passwordEncoder.encode(req.getPassword());
        String userId = UUID.randomUUID().toString();

        User user = new User(userId, req.getEmail(), hashed, req.getRole());
        userRepo.save(user);

        if (req.getRole() == RoleType.Employer) {
            int count = db.collection("employers").get().get().size();
            String generatedEmpId = String.format("emp%03d", count + 1);

            Employer employer = new Employer();
            employer.setEmployerId(generatedEmpId);
            employer.setEmail(req.getEmail());
            db.collection("employers").document(generatedEmpId).set(employer).get();
        } else {
            int count = db.collection("JobSeekers").get().get().size();
            String generatedJsId = String.format("js%03d", count + 1);

            JobSeeker seeker = new JobSeeker();
            seeker.setJobSeekerId(generatedJsId);
            seeker.setEmail(req.getEmail());
            db.collection("JobSeekers").document(generatedJsId).set(seeker).get();
        }

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest req)
            throws ExecutionException, InterruptedException {

        User user = userRepo.findByEmail(req.getEmail());
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));

        String token = jwtTokenProvider.generateToken(authentication);

        Firestore db = FirestoreClient.getFirestore();
        String id = "";

        if (user.getRole() == RoleType.Employer) {
            var snap = db.collection("employers").whereEqualTo("email", user.getEmail()).get().get();
            if (!snap.isEmpty()) {
                id = snap.getDocuments().get(0).toObject(Employer.class).getEmployerId();
            }
        } else {
            var snap = db.collection("JobSeekers").whereEqualTo("email", user.getEmail()).get().get();
            if (!snap.isEmpty()) {
                id = snap.getDocuments().get(0).toObject(JobSeeker.class).getJobSeekerId();
            }
        }

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole().name(),
                "id", id));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> sendResetEmail(@RequestBody Map<String, String> body)
            throws ExecutionException, InterruptedException {
        String email = body.get("email");
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No account found with this email address");
        }
        return ResponseEntity.ok("User exists. You may now reset the password.");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody Map<String, String> body)
            throws ExecutionException, InterruptedException {
        String email = body.get("email");
        String newPassword = body.get("newPassword");

        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        String hashed = passwordEncoder.encode(newPassword);
        userRepo.updatePassword(user.getId(), hashed);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {

        return ResponseEntity.noContent().build();
    }
}
