package com.talentconnect.backend.controller;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.talentconnect.backend.dto.AuthRequest;
import com.talentconnect.backend.dto.AuthResponse;
import com.talentconnect.backend.dto.ChangePasswordRequest;
import com.talentconnect.backend.dto.SignupRequest;
import com.talentconnect.backend.model.User;
import com.talentconnect.backend.repository.UserRepository;
import com.talentconnect.backend.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody SignupRequest req)
            throws ExecutionException, InterruptedException {
        if (userRepo.findByEmail(req.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        String id = UUID.randomUUID().toString();
        String hashed = passwordEncoder.encode(req.getPassword());
        User user = new User(id, req.getEmail(), hashed, req.getRole());
        userRepo.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), List.of(user.getRole().name()));
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req)
            throws ExecutionException, InterruptedException {
        User user = userRepo.findByEmail(req.getEmail());
        if (user == null ||
                !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail(), List.of(user.getRole().name()));
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest req,
            Authentication auth) throws ExecutionException, InterruptedException {
        String email = auth.getName();
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found");
        }
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Old password incorrect");
        }
        String hashed = passwordEncoder.encode(req.getNewPassword());
        userRepo.updatePassword(user.getId(), hashed);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            jwtUtil.blacklist(token);
        }
        return ResponseEntity.noContent().build();
    }
}
