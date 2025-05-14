package com.talentconnect.backend.service;

import com.talentconnect.backend.dto.JobDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class JobService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String EMPLOYER_API_BASE = "http://localhost:8080/employer/jobs";

    // 只保留 getJobDetail，供申请记录和收藏使用
    public JobDTO getJobDetail(String jobId) {
        String url = EMPLOYER_API_BASE + "/" + jobId;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        Map<String, Object> jobMap = (Map<String, Object>) response.get("job");

        JobDTO dto = new JobDTO();
        dto.setJobId((String) jobMap.get("jobId"));
        dto.setTitle((String) jobMap.get("title"));
        dto.setDescription((String) jobMap.get("description"));
        dto.setLocation((String) jobMap.get("location"));
        dto.setCategory((String) jobMap.get("category"));
        dto.setEmploymentType((String) jobMap.get("employmentType"));
        dto.setEmployerId((String) jobMap.get("employerId"));

        return dto;
    }
}
