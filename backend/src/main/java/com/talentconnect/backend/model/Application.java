package com.talentconnect.backend.model;

public class Application {
    private String applicationId;
    private String jobId;
    private String jobSeekerId;
    private String status;
    private String applyTime;

    public Application() {}

    public String getApplicationId() {
        return applicationId;
    }
    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getJobId() {
        return jobId; }
    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getJobSeekerId() {
        return jobSeekerId;
    }
    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplyTime() {
        return applyTime;
    }
    public void setApplyTime(String applyTime) {
        this.applyTime = applyTime;
    }
}
