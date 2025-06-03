package com.talentconnect.backend.model;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.annotation.PropertyName;

public class Application {
    private String applicationId;
    private String jobId;
    private String jobSeekerId;
    private String status;
    private Timestamp applyTime;

    public Application() {}

    @PropertyName("applicationId")
    public String getApplicationId() {
        return applicationId;
    }

    @PropertyName("applicationId")
    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    @PropertyName("jobId")
    public String getJobId() {
        return jobId;
    }

    @PropertyName("jobId")
    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    @PropertyName("jobSeekerId")
    public String getJobSeekerId() {
        return jobSeekerId;
    }

    @PropertyName("jobSeekerId")
    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    @PropertyName("status")
    public String getStatus() {
        return status;
    }

    @PropertyName("status")
    public void setStatus(String status) {
        this.status = status;
    }

    @PropertyName("applyDate")
    public Timestamp getApplyTime() {
        return applyTime;
    }

    @PropertyName("applyDate")
    public void setApplyTime(Timestamp applyTime) {
        this.applyTime = applyTime;
    }
}
