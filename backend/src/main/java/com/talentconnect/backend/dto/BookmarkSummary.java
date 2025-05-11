package com.talentconnect.backend.dto;

public class BookmarkSummary {
    private String pjid;     // Firestore 中的文档 ID
    private String jobId;
    private String title;
    private String location;

    public BookmarkSummary() {}

    public BookmarkSummary(String pjid, String jobId, String title, String location) {
        this.pjid = pjid;
        this.jobId = jobId;
        this.title = title;
        this.location = location;
    }

    public String getPjid() {
        return pjid;
    }

    public void setPjid(String pjid) {
        this.pjid = pjid;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
