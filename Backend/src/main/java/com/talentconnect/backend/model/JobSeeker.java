package com.talentconnect.backend.model;

public class JobSeeker {

    private String jobSeekerId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNo;
    private String workingExperience;
    private String desiredRoles;
    private String preference;
    private String resumeId;

    public JobSeeker() {

    }

    public JobSeeker(String jobSeekerId, String email, String firstName, String lastName,
            String phoneNo, String workingExperience, String desiredRoles,
            String preference, String resumeId) {
        this.jobSeekerId = jobSeekerId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNo = phoneNo;
        this.workingExperience = workingExperience;
        this.desiredRoles = desiredRoles;
        this.preference = preference;
        this.resumeId = resumeId;
    }

    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNo() {
        return phoneNo;
    }

    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    public String getWorkingExperience() {
        return workingExperience;
    }

    public void setWorkingExperience(String workingExperience) {
        this.workingExperience = workingExperience;
    }

    public String getDesiredRoles() {
        return desiredRoles;
    }

    public void setDesiredRoles(String desiredRoles) {
        this.desiredRoles = desiredRoles;
    }

    public String getPreference() {
        return preference;
    }

    public void setPreference(String preference) {
        this.preference = preference;
    }

    public String getResumeId() {
        return resumeId;
    }

    public void setResumeId(String resumeId) {
        this.resumeId = resumeId;
    }
}
