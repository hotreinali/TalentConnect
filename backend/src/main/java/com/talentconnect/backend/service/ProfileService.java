<<<<<<< Updated upstream
package com.talentconnect.backend.service;

import com.talentconnect.backend.dto.ProfileResponse;
import com.talentconnect.backend.dto.UpdateProfileRequest;

public interface ProfileService {

    /**
     * Fetches a job seeker's profile from Firebase using their ID.
     * @param jobSeekerId the unique identifier of the job seeker
     * @return ProfileResponse if found, otherwise null
     */
    ProfileResponse getProfileById(String jobSeekerId);

    /**
     * Updates a job seeker's profile in Firebase.
     * @param jobSeekerId the unique identifier of the job seeker
     * @param request the data to be updated
     */
    void updateProfile(String jobSeekerId, UpdateProfileRequest request);
}
=======
package com.talentconnect.backend.service;

import com.talentconnect.backend.dto.ProfileResponse;
import com.talentconnect.backend.dto.UpdateProfileRequest;

public interface ProfileService {

    /**
     * Fetches a job seeker's profile from Firebase using their ID.
     * @param jobSeekerId the unique identifier of the job seeker
     * @return ProfileResponse if found, otherwise null
     */
    ProfileResponse getProfileById(String jobSeekerId);

    /**
     * Updates a job seeker's profile in Firebase.
     * @param jobSeekerId the unique identifier of the job seeker
     * @param request the data to be updated
     */
    void updateProfile(String jobSeekerId, UpdateProfileRequest request);
}
>>>>>>> Stashed changes
