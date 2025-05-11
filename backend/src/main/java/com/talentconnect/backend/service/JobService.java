package com.talentconnect.backend.service;

import com.talentconnect.backend.dto.JobDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;

@Service
public class JobService {

    private final RestTemplate restTemplate = new RestTemplate();

    // TODO: 填入真实 API 地址
    private static final String EMPLOYER_API_BASE = "http://localhost:8080/employer/jobs";

    public List<JobDTO> getAllJobs(String title, String location, String category) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(EMPLOYER_API_BASE);

        if (title != null) builder.queryParam("title", title);
        if (location != null) builder.queryParam("location", location);
        if (category != null) builder.queryParam("category", category);

        JobDTO[] jobs = restTemplate.getForObject(builder.toUriString(), JobDTO[].class);
        return Arrays.asList(jobs);
    }

    public JobDTO getJobDetail(String jobId) {
        return restTemplate.getForObject(EMPLOYER_API_BASE + "/" + jobId, JobDTO.class);
    }
}
