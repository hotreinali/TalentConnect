package com.talentconnect.backend.dto;

public class ApplyJobRequest {
    private String jobId;
    private String jobSeekerId;

    public ApplyJobRequest() {}

    public ApplyJobRequest(String jobId, String jobSeekerId) {
        this.jobId = jobId;
        this.jobSeekerId = jobSeekerId;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }
}
