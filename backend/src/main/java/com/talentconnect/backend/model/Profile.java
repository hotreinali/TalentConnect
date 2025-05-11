<<<<<<< Updated upstream
package com.talentconnect.backend.model;

public class Profile {
    private String jobSeekerId;
    private String firstName;
    private String lastName;
    private String phoneNo;
    private String workingExperience;
    private String desiredRoles;
    private String preference;
    private String resumeId;
    private String email;

    // 空构造函数（必须要有）
    public Profile() {
    }

    // 带参构造函数（可以方便快速创建对象）
    public Profile(String jobSeekerId, String firstName, String lastName, String phoneNo,
                   String workingExperience, String desiredRoles, String preference,
                   String resumeId, String email) {
        this.jobSeekerId = jobSeekerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNo = phoneNo;
        this.workingExperience = workingExperience;
        this.desiredRoles = desiredRoles;
        this.preference = preference;
        this.resumeId = resumeId;
        this.email = email;
    }

    // Getter and Setter 方法
    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

=======
package com.talentconnect.backend.model;

public class Profile {
    private String jobSeekerId;
    private String firstName;
    private String lastName;
    private String phoneNo;
    private String workingExperience;
    private String desiredRoles;
    private String preference;
    private String resumeId;
    private String email;

    // 空构造函数（必须要有）
    public Profile() {
    }

    // 带参构造函数（可以方便快速创建对象）
    public Profile(String jobSeekerId, String firstName, String lastName, String phoneNo,
                   String workingExperience, String desiredRoles, String preference,
                   String resumeId, String email) {
        this.jobSeekerId = jobSeekerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNo = phoneNo;
        this.workingExperience = workingExperience;
        this.desiredRoles = desiredRoles;
        this.preference = preference;
        this.resumeId = resumeId;
        this.email = email;
    }

    // Getter and Setter 方法
    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

>>>>>>> Stashed changes
