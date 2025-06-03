package com.talentconnect.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ApplyJobRequest {

    @JsonProperty("jobId")
    private String jobId;

    @JsonProperty("jobSeekerId")
    private String jobSeekerId;

    @JsonProperty("status")
    private String status;

    public ApplyJobRequest() {}

    public ApplyJobRequest(String jobId, String jobSeekerId, String status) {
        this.jobId = jobId;
        this.jobSeekerId = jobSeekerId;
        this.status = status;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
