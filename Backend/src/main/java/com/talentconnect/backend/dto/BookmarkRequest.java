package com.talentconnect.backend.dto;

public class BookmarkRequest {
    private String jobSeekerId;
    private String jobId;

    public BookmarkRequest() {}

    public BookmarkRequest(String jobSeekerId, String jobId) {
        this.jobSeekerId = jobSeekerId;
        this.jobId = jobId;
    }

    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }
}
