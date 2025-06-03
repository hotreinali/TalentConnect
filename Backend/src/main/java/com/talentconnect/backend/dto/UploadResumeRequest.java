package com.talentconnect.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class UploadResumeRequest {

    private MultipartFile resumeFile;
    private String jobSeekerId;

    public UploadResumeRequest() {
    }

    public UploadResumeRequest(MultipartFile resumeFile) {
        this.resumeFile = resumeFile;
    }

    public MultipartFile getResumeFile() {
        return resumeFile;
    }

    public void setResumeFile(MultipartFile resumeFile) {
        this.resumeFile = resumeFile;
    }

    public String getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(String jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }
}
