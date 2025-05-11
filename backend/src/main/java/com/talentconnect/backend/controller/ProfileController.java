//package com.talentconnect.backend.controller;
//
//import com.talentconnect.backend.dto.ProfileResponse;
//import com.talentconnect.backend.model.User;
//import com.talentconnect.backend.repository.UserRepository;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.concurrent.ExecutionException;
//
//@RestController
//@RequestMapping("/api")
//public class ProfileController {
//
//    private final UserRepository userRepo;
//
//    public ProfileController(UserRepository userRepo) {
//        this.userRepo = userRepo;
//    }
//
//    @GetMapping("/profile")
//    public ProfileResponse getProfile(Authentication auth) throws ExecutionException, InterruptedException {
//        String email = auth.getName();
//        User user = userRepo.findByEmail(email);
//        return new ProfileResponse(user.getId(), user.getEmail(), user.getRole());
//    }
//}
