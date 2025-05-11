package com.talentconnect.backend.service;

import org.springframework.web.multipart.MultipartFile;


public interface ResumeService {
    String uploadResume(MultipartFile file, String jobSeekerId);
    String getResumeUrl(String jobSeekerId); // ✅ 新增：根据 ID 返回 Firebase 简历链接
    String replaceResume(MultipartFile file, String jobSeekerId);
    void deleteResume(String jobSeekerId);
}

