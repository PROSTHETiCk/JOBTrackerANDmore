import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobList({ refreshTrigger, onEdit }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async () => { /* ... (same as before) ... */
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/jobs');
      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.error("API response is not an array:", response.data);
        setError("Received unexpected data format.");
        setJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.response?.data?.error || `Failed to fetch jobs: ${err.message}`);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [refreshTrigger]);

  const handleDelete = async (jobId) => { /* ... (same as before) ... */
     if (!window.confirm('Are you sure you want to delete this application?')) {
       return;
     }
     try {
       const response = await axios.delete(`/api/jobs/${jobId}`);
       if (response.status === 204) {
         fetchJobs(); // Refresh list
       } else { /* ... */ }
     } catch (err) { /* ... */ }
  };

  // --- Render Logic ---
  if (loading) return <div className="loading-state">Loading applications...</div>;
  if (error) return <div className="form-message error">Error loading applications: {error}</div>;

  return (
    // Use className from CSS
    <div className="job-list">
      <h2>Job Applications</h2>
      {jobs.length === 0 ? (
        <p className="empty-state">No applications found. Add one using the form above!</p>
      ) : (
        <ul>
          {jobs.map(job => (
            (typeof job === 'object' && job !== null && job.id != null) ? (
              // Use className from CSS
              <li key={job.id} className="job-list-item">
                <h3>{job.job_title || 'No Title'}</h3>
                <p><strong>Company:</strong> {job.company_name || 'N/A'}</p>
                <p><strong>Status:</strong> {job.status || 'N/A'}</p>
                <p><strong>Date Applied:</strong> {job.date_applied ? new Date(job.date_applied).toLocaleDateString() : 'N/A'}</p>
                {job.job_url && (
                  <p><a href={job.job_url} target="_blank" rel="noopener noreferrer">Job Link</a></p>
                )}
                 {/* Use className from CSS */}
                 <div className="job-actions">
                   {/* Use className from CSS */}
                   <button onClick={() => onEdit(job.id)} className="btn-edit">Edit</button>
                   <button onClick={() => handleDelete(job.id)} className="btn-delete">Delete</button>
                 </div>
              </li>
            ) : null // Skip invalid items silently or render placeholder
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;