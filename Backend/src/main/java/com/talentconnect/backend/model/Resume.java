package com.talentconnect.backend.model;

import com.google.cloud.Timestamp;

public class Resume {
    private String resumeId;
    private String jobSeekerId;
    private String downloadUrl;
    private Timestamp uploadedAt;

    public Resume() {
    }

    public Resume(String resumeId, String jobSeekerId, String downloadUrl, Timestamp uploadedAt) {
        this.resumeId = resumeId;
        this.jobSeekerId = jobSeekerId;
        this.downloadUrl = downloadUrl;
        this.uploadedAt = uploadedAt;
    }

    public String getResumeId() {
        return resumeId;
    }

    public void setResumeId(String resumeId) {
        this.resumeId = resumeId;
    }

    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public Timestamp getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Timestamp uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
