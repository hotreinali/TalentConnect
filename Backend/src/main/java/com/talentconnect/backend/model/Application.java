package com.talentconnect.backend.model;

import com.google.cloud.firestore.annotation.PropertyName;

public class Application {
    private String applicationId;
    private String jobId;
    private String jobSeekerId;
    private String status;
    private String applyTime;

    public Application() {}

    @PropertyName("applicationID")
    public String getApplicationId() {
        return applicationId;
    }

    @PropertyName("applicationID")
    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    @PropertyName("jobID")
    public String getJobId() {
        return jobId;
    }

    @PropertyName("jobID")
    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    @PropertyName("jobSeekerID")
    public String getJobSeekerId() {
        return jobSeekerId;
    }

    @PropertyName("jobSeekerID")
    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @PropertyName("applyDate")
    public String getApplyTime() {
        return applyTime;
    }

    @PropertyName("applyDate")
    public void setApplyTime(String applyTime) {
        this.applyTime = applyTime;
    }
}

