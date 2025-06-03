export const postJob = async (jobData) => {
  try {
    const response = await fetch('http://3.106.192.156:8080/employer/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      throw new Error('Failed to post job');
    }

    const jobId = await response.text();
    return jobId;
  } catch (error) {
    console.error('API Error - postJob:', error);
    throw error;
  }
};