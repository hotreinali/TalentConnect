package com.talentconnect.backend.dto;

public class ResumeResponse {

    private String resumeId;
    private String fileContent;
    private String uploadedAt;

    public ResumeResponse() {
    }

    public ResumeResponse(String resumeId, String fileContent, String uploadedAt) {
        this.resumeId = resumeId;
        this.fileContent = fileContent;
        this.uploadedAt = uploadedAt;
    }

    public String getResumeId() {
        return resumeId;
    }

    public void setResumeId(String resumeId) {
        this.resumeId = resumeId;
    }

    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }

    public String getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
