package com.talentconnect.backend.mapper;

import com.talentconnect.backend.dto.JobDTO;
import com.talentconnect.backend.dto.JobSummary;
import com.talentconnect.backend.dto.JobDetailResponse;

public class JobMapper {

    public static JobSummary toJobSummary(JobDTO dto) {
        return new JobSummary(dto.getJobId(), dto.getTitle(), dto.getLocation());
    }

    public static JobDetailResponse toJobDetail(JobDTO dto) {
        JobDetailResponse res = new JobDetailResponse();
        res.setJobId(dto.getJobId());
        res.setTitle(dto.getTitle());
        res.setDescription(dto.getDescription());
        res.setLocation(dto.getLocation());
        res.setCategory(dto.getCategory());
        res.setEmploymentType(dto.getEmploymentType());
        res.setEmployerId(dto.getEmployerId());
        return res;
    }
}
