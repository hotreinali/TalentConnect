package com.talentconnect.backend.dto;

import com.talentconnect.backend.model.RoleType;

public class SignupRequest {
    private String email;
    private String password;
    private RoleType role;

    public SignupRequest() {
    }

    public SignupRequest(String email, String password, RoleType role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }
}
