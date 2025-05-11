<<<<<<< Updated upstream
package com.talentconnect.backend.controller;

import com.talentconnect.backend.dto.*;
import com.talentconnect.backend.mapper.JobMapper;
import com.talentconnect.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private JobService jobService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private ApplicationService applicationService;

    // profile
    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable String id) {
        ProfileResponse profile = profileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(
            @PathVariable String id,
            @RequestBody UpdateProfileRequest request) {
        profileService.updateProfile(id, request);
        return ResponseEntity.ok("Profile updated.");
    }

    // resume
    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobSeekerId") String jobSeekerId) {
        if (!"application/pdf".equals(file.getContentType())
                || file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        String resumeUrl = resumeService.uploadResume(file, jobSeekerId);
        return ResponseEntity.ok(resumeUrl);
    }

    @GetMapping("/resume/{id}")
    public ResponseEntity<String> getResume(@PathVariable String id) {
        String resumeUrl = resumeService.getResumeUrl(id);
        return ResponseEntity.ok(resumeUrl);
    }


    @PutMapping("/resume/{id}")
    public ResponseEntity<String> replaceResume(
            @PathVariable("id") String jobSeekerId,
            @RequestParam("file") MultipartFile file) {

        if (!"application/pdf".equals(file.getContentType())
                || file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        String newUrl = resumeService.replaceResume(file, jobSeekerId);
        return ResponseEntity.ok(newUrl);
    }

    @DeleteMapping("/resume/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable String id) {
        try {
            resumeService.deleteResume(id);
            return ResponseEntity.ok("Resume deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    // jobs
    @GetMapping("/jobs")
    public ResponseEntity<JobListResponse> getJobList(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {

        List<JobDTO> rawJobs = jobService.getAllJobs(title, location, category);
        List<JobSummary> summaries = rawJobs.stream()
                .map(JobMapper::toJobSummary)
                .toList();

        return ResponseEntity.ok(new JobListResponse(summaries));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDetailResponse> getJobDetail(@PathVariable String id) {
        JobDTO dto = jobService.getJobDetail(id);
        return ResponseEntity.ok(JobMapper.toJobDetail(dto));
    }


    // application
// 提交职位申请
    @PostMapping("/applications")
    public ResponseEntity<String> applyJob(@RequestBody ApplyJobRequest request) {
        applicationService.submitApplication(request);
        return ResponseEntity.ok("Application submitted.");
    }

    // 获取职位申请记录（简要信息）
    @GetMapping("/applications")
    public ResponseEntity<ApplicationListResponse> getApplications(@RequestParam String jobSeekerId) {
        List<Map<String, Object>> records = applicationService.getApplicationsByJobSeekerId(jobSeekerId);
        List<ApplicationSummary> result = new ArrayList<>();

        for (Map<String, Object> record : records) {
            String jobId = (String) record.get("jobId");
            String applicationId = (String) record.get("applicationId");
            String status = (String) record.get("status");

            JobDTO job = jobService.getJobDetail(jobId); // 获取职位信息

            ApplicationSummary summary = new ApplicationSummary();
            summary.setApplicationId(applicationId);
            summary.setJobId(jobId);
            summary.setStatus(status);
            summary.setTitle(job.getTitle());
            summary.setLocation(job.getLocation());

            result.add(summary);
        }

        return ResponseEntity.ok(new ApplicationListResponse(result));
    }

    // bookmark
// 1️⃣ 添加收藏
    @PostMapping("/bookmarks")
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkRequest request) {
        bookmarkService.addBookmark(request);
        return ResponseEntity.ok("Bookmark added.");
    }

    // 2️⃣ 删除收藏（通过 pjid）
    @DeleteMapping("/bookmarks/{pjid}")
    public ResponseEntity<String> removeBookmark(@PathVariable String pjid) {
        bookmarkService.removeBookmarkByPjid(pjid);
        return ResponseEntity.ok("Bookmark removed.");
    }

    // 3️⃣ 查询某用户的所有收藏职位（带职位信息）
    @GetMapping("/bookmarks")
    public ResponseEntity<BookmarkListResponse> getBookmarks(@RequestParam String jobSeekerId) {
        List<Map<String, Object>> records = bookmarkService.getBookmarksByJobSeekerId(jobSeekerId);
        List<BookmarkSummary> result = new ArrayList<>();

        for (Map<String, Object> record : records) {
            String jobId = (String) record.get("jobId");
            String pjid = (String) record.get("pjid");

            JobDTO job = jobService.getJobDetail(jobId); // 你之前已经写好
            BookmarkSummary summary = new BookmarkSummary(pjid, jobId, job.getTitle(), job.getLocation());
            result.add(summary);
        }

        return ResponseEntity.ok(new BookmarkListResponse(result));
    }
}
=======
package com.talentconnect.backend.controller;

import com.talentconnect.backend.dto.*;
import com.talentconnect.backend.mapper.JobMapper;
import com.talentconnect.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private JobService jobService;

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private ApplicationService applicationService;

    // profile
    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable String id) {
        ProfileResponse profile = profileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(
            @PathVariable String id,
            @RequestBody UpdateProfileRequest request) {
        profileService.updateProfile(id, request);
        return ResponseEntity.ok("Profile updated.");
    }

    // resume
    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobSeekerId") String jobSeekerId) {
        if (!"application/pdf".equals(file.getContentType())
                || file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        String resumeUrl = resumeService.uploadResume(file, jobSeekerId);
        return ResponseEntity.ok(resumeUrl);
    }

    @GetMapping("/resume/{id}")
    public ResponseEntity<String> getResume(@PathVariable String id) {
        String resumeUrl = resumeService.getResumeUrl(id);
        return ResponseEntity.ok(resumeUrl);
    }


    @PutMapping("/resume/{id}")
    public ResponseEntity<String> replaceResume(
            @PathVariable("id") String jobSeekerId,
            @RequestParam("file") MultipartFile file) {

        if (!"application/pdf".equals(file.getContentType())
                || file.getOriginalFilename() == null
                || !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are allowed.");
        }

        String newUrl = resumeService.replaceResume(file, jobSeekerId);
        return ResponseEntity.ok(newUrl);
    }

    @DeleteMapping("/resume/{id}")
    public ResponseEntity<String> deleteResume(@PathVariable String id) {
        try {
            resumeService.deleteResume(id);
            return ResponseEntity.ok("Resume deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }


    // jobs
    @GetMapping("/jobs")
    public ResponseEntity<JobListResponse> getJobList(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String category) {

        List<JobDTO> rawJobs = jobService.getAllJobs(title, location, category);
        List<JobSummary> summaries = rawJobs.stream()
                .map(JobMapper::toJobSummary)
                .toList();

        return ResponseEntity.ok(new JobListResponse(summaries));
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDetailResponse> getJobDetail(@PathVariable String id) {
        JobDTO dto = jobService.getJobDetail(id);
        return ResponseEntity.ok(JobMapper.toJobDetail(dto));
    }


    // application
// 提交职位申请
    @PostMapping("/applications")
    public ResponseEntity<String> applyJob(@RequestBody ApplyJobRequest request) {
        applicationService.submitApplication(request);
        return ResponseEntity.ok("Application submitted.");
    }

    // 获取职位申请记录（简要信息）
    @GetMapping("/applications")
    public ResponseEntity<ApplicationListResponse> getApplications(@RequestParam String jobSeekerId) {
        List<Map<String, Object>> records = applicationService.getApplicationsByJobSeekerId(jobSeekerId);
        List<ApplicationSummary> result = new ArrayList<>();

        for (Map<String, Object> record : records) {
            String jobId = (String) record.get("jobId");
            String applicationId = (String) record.get("applicationId");
            String status = (String) record.get("status");

            JobDTO job = jobService.getJobDetail(jobId); // 获取职位信息

            ApplicationSummary summary = new ApplicationSummary();
            summary.setApplicationId(applicationId);
            summary.setJobId(jobId);
            summary.setStatus(status);
            summary.setTitle(job.getTitle());
            summary.setLocation(job.getLocation());

            result.add(summary);
        }

        return ResponseEntity.ok(new ApplicationListResponse(result));
    }

    // bookmark
// 1️⃣ 添加收藏
    @PostMapping("/bookmarks")
    public ResponseEntity<String> addBookmark(@RequestBody BookmarkRequest request) {
        bookmarkService.addBookmark(request);
        return ResponseEntity.ok("Bookmark added.");
    }

    // 2️⃣ 删除收藏（通过 pjid）
    @DeleteMapping("/bookmarks/{pjid}")
    public ResponseEntity<String> removeBookmark(@PathVariable String pjid) {
        bookmarkService.removeBookmarkByPjid(pjid);
        return ResponseEntity.ok("Bookmark removed.");
    }

    // 3️⃣ 查询某用户的所有收藏职位（带职位信息）
    @GetMapping("/bookmarks")
    public ResponseEntity<BookmarkListResponse> getBookmarks(@RequestParam String jobSeekerId) {
        List<Map<String, Object>> records = bookmarkService.getBookmarksByJobSeekerId(jobSeekerId);
        List<BookmarkSummary> result = new ArrayList<>();

        for (Map<String, Object> record : records) {
            String jobId = (String) record.get("jobId");
            String pjid = (String) record.get("pjid");

            JobDTO job = jobService.getJobDetail(jobId); // 你之前已经写好
            BookmarkSummary summary = new BookmarkSummary(pjid, jobId, job.getTitle(), job.getLocation());
            result.add(summary);
        }

        return ResponseEntity.ok(new BookmarkListResponse(result));
    }
}
>>>>>>> Stashed changes
