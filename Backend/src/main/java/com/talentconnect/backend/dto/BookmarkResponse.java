package com.talentconnect.backend.dto;

public class BookmarkResponse {

    private String pjid;
    private String jobSeekerId;
    private String jobId;

    public BookmarkResponse() {
    }

    public BookmarkResponse(String pjid, String jobSeekerId, String jobId) {
        this.pjid = pjid;
        this.jobSeekerId = jobSeekerId;
        this.jobId = jobId;
    }

    public String getPjid() {
        return pjid;
    }

    public void setPjid(String pjid) {
        this.pjid = pjid;
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
