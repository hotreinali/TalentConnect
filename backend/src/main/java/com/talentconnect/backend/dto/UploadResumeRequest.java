package com.talentconnect.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class UploadResumeRequest {

    private MultipartFile resumeFile;

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
}

