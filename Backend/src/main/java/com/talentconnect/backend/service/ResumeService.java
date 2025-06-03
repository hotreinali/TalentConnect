package com.talentconnect.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {
    String uploadResume(MultipartFile file, String jobSeekerId);

    String getResumeUrl(String jobSeekerId);

    String replaceResume(MultipartFile file, String jobSeekerId);

    void deleteResume(String jobSeekerId);
}
