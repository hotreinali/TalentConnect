<<<<<<< Updated upstream
package com.talentconnect.backend.model;

public class Resume {
    private String resumeId;
    private String jobSeekerId; // 新加的字段
    private String fileContent;
    private String uploadedAt;

    // 空构造函数
    public Resume() {
    }

    // 带参构造函数
    public Resume(String resumeId, String jobSeekerId, String fileContent, String uploadedAt) {
        this.resumeId = resumeId;
        this.jobSeekerId = jobSeekerId;
        this.fileContent = fileContent;
        this.uploadedAt = uploadedAt;
    }

    // Getter and Setter
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
=======
package com.talentconnect.backend.model;

public class Resume {
    private String resumeId;
    private String jobSeekerId; // 新加的字段
    private String fileContent;
    private String uploadedAt;

    // 空构造函数
    public Resume() {
    }

    // 带参构造函数
    public Resume(String resumeId, String jobSeekerId, String fileContent, String uploadedAt) {
        this.resumeId = resumeId;
        this.jobSeekerId = jobSeekerId;
        this.fileContent = fileContent;
        this.uploadedAt = uploadedAt;
    }

    // Getter and Setter
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
>>>>>>> Stashed changes
