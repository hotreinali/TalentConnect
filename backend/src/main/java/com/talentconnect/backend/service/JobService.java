<<<<<<< Updated upstream
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
=======
package com.talentconnect.backend.service;

import com.talentconnect.backend.dto.JobDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

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
        String url = EMPLOYER_API_BASE + "/" + jobId;

        // Fetch the response as a generic Map
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        // Extract the nested "job" object
        Map<String, Object> jobMap = (Map<String, Object>) response.get("job");

        // Manually map to JobDTO
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
>>>>>>> Stashed changes
