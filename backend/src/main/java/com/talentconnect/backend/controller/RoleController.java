package com.talentconnect.backend.controller;

import com.talentconnect.backend.model.RoleType;
import com.talentconnect.backend.model.User;
import com.talentconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/users")
public class RoleController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/{id}/roles")
    public ResponseEntity<RoleType> getUserRole(@PathVariable String id)
            throws ExecutionException, InterruptedException {
        User user = userRepo.findById(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return ResponseEntity.ok(user.getRole());
    }

    @PostMapping("/{id}/roles")
    public ResponseEntity<Void> setUserRole(@PathVariable String id,
            @RequestBody RoleType role)
            throws ExecutionException, InterruptedException {
        User user = userRepo.findById(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        user.setRole(role);
        userRepo.save(user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/roles/{role}")
    public ResponseEntity<Void> removeUserRole(@PathVariable String id,
            @PathVariable RoleType role)
            throws ExecutionException, InterruptedException {
        User user = userRepo.findById(id);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (!role.equals(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role mismatch");
        }
        user.setRole(null);
        userRepo.save(user);
        return ResponseEntity.noContent().build();
    }
}
