package com.talentconnect.backend.service;

import com.talentconnect.backend.model.*;
import com.talentconnect.backend.repository.EmployerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployerService {

    @Autowired
    private EmployerRepository employerRepository;

    public Employer getEmployer(String id) throws Exception {
        return employerRepository.getEmployer(id);
    }

    public void updateEmployer(String id, Employer employer) throws Exception {
        employerRepository.updateEmployer(id, employer);
    }

    public String createJob(Job job) throws Exception {
        return employerRepository.createJob(job);
    }

    public List<Job> getJobs(String employerId) throws Exception {
        return employerRepository.getJobsByEmployer(employerId);
    }

    public Job getJob(String jobId) throws Exception {
        return employerRepository.getJobById(jobId);
    }

    public List<Application> getApplicants(String jobId) throws Exception {
        return employerRepository.getApplicationsByJobId(jobId);
    }

    public void updateJob(String id, Job job) {
        employerRepository.updateJob(id, job);
    }

    public void updateApplicationStatus(String id, String status) {
        employerRepository.updateApplicationStatus(id, status);
    }

    public String flagCandidate(Shortlist shortlist) {
        return employerRepository.addToShortlist(shortlist);
    }

    public List<Shortlist> getShortlists(String employerId) throws Exception {
        return employerRepository.getShortlists(employerId);
    }

    public void removeShortlist(String id) {
        employerRepository.removeShortlist(id);
    }
}
