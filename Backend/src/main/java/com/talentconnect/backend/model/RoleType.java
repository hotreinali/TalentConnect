package com.talentconnect.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RoleType {
    JobSeeker,
    Employer;

    @JsonCreator
    public static RoleType fromString(String value) {
        for (RoleType role : RoleType.values()) {
            if (role.name().equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role: " + value);
    }

    @JsonValue
    public String getValue() {
        return name();
    }
}
