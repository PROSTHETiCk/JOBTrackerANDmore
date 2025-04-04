import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JobDetail({ jobId, onBack, onUpdateSuccess }) { // Added onUpdateSuccess callback
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode

  // State for editable form fields (initialized when editing starts)
  const [editData, setEditData] = useState({});

  // --- Fetching Job Data ---
  const fetchJobDetail = async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    setIsEditing(false); // Reset edit mode on refetch/new ID
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      setJob(response.data);
      // Initialize edit form data when job data is loaded
      setEditData({
          job_title: response.data.job_title || '',
          company_name: response.data.company_name || '',
          status: response.data.status || 'Applied',
          job_url: response.data.job_url || '',
          job_description: response.data.job_description || '',
          notes: response.data.notes || '',
      });
    } catch (err) {
      console.error(`Error fetching job detail for ID ${jobId}:`, err);
      setError(err.response?.data?.error || `Failed to fetch details: ${err.message}`);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]); // Refetch if jobId changes

  // --- Handling Edit Form ---
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Indicate activity during update
    setError(null);

    // Basic validation
     if (!editData.job_title?.trim() || !editData.company_name?.trim()) {
       setError('Job Title and Company Name cannot be empty.');
       setLoading(false);
       return;
     }

    try {
      const response = await axios.put(`/api/jobs/${jobId}`, editData); // Send updated data
      if (response.status === 200) {
        setJob(response.data); // Update displayed data with response
        setIsEditing(false); // Exit edit mode
        // Notify parent if needed (e.g., to refresh list if status changed)
        if (onUpdateSuccess) {
            onUpdateSuccess();
        }
      } else {
        setError(`Update failed with status: ${response.status}`);
      }
    } catch (err) {
       console.error(`Error updating job ID ${jobId}:`, err);
       const errorData = err.response?.data;
       const message = errorData?.messages
         ? Object.values(errorData.messages).flat().join(' ')
         : errorData?.error || 'An unknown error occurred during update.';
       setError(message);
    } finally {
      setLoading(false);
    }
  };


  // --- Render Logic ---
  if (loading && !isEditing) return <div className="loading-state">Loading job details...</div>; // Show loading only if not editing
  // Corrected error display logic to ensure button is always available if needed
  if (error && !isEditing) return <div className="form-message error">Error: {error} <button onClick={onBack} className="btn-secondary">Back</button></div>;
  if (!job && !loading) return <div className="empty-state">Job not found. <button onClick={onBack} className="btn-secondary">Back</button></div>;
  // Handle case where job is null initially while loading
  if (!job && loading) return <div className="loading-state">Loading job details...</div>;


  return (
    <div className="job-detail">
       <button onClick={onBack} className="btn-secondary" style={{ marginBottom: 'var(--gap-md)' }}>&larr; Back to List</button>

      {!isEditing ? (
        // --- Display Mode ---
        <div>
          <h2>Job Details</h2>
          <h3>{job.job_title}</h3>
          <p><strong>Company:</strong> {job.company_name}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Date Applied:</strong> {new Date(job.date_applied).toLocaleString()}</p>
          {/* Corrected conditional rendering blocks */}
          {job.job_url && (
            <p><strong>URL:</strong> <a href={job.job_url} target="_blank" rel="noopener noreferrer">{job.job_url}</a></p>
          )}
          {job.job_description && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Description:</strong>
              <pre className="display-box">{job.job_description}</pre>
            </div>
          )}
          {job.notes && (
             <div style={{ marginTop: '1rem' }}>
              <strong>Notes:</strong>
              <pre className="display-box">{job.notes}</pre>
             </div>
          )}
          {/* End of corrected blocks */}
          <button onClick={() => setIsEditing(true)} className="btn-edit" style={{marginTop: 'var(--gap-md)'}}>Edit</button>
        </div>
      ) : (
        // --- Edit Mode ---
        <div>
          <h2>Edit Job Application</h2>
          <form onSubmit={handleEditSubmit}>
            {error && <div className="form-message error">Error: {error}</div>}
            {/* Form Fields */}
            <div><label htmlFor="edit_job_title">Job Title*:</label><input type="text" id="edit_job_title" name="job_title" value={editData.job_title} onChange={handleInputChange} required disabled={loading} /></div>
            <div><label htmlFor="edit_company_name">Company Name*:</label><input type="text" id="edit_company_name" name="company_name" value={editData.company_name} onChange={handleInputChange} required disabled={loading} /></div>
            <div>
                <label htmlFor="edit_status">Status:</label>
                <select id="edit_status" name="status" value={editData.status} onChange={handleInputChange} disabled={loading}>
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Withdrawn">Withdrawn</option>
                </select>
            </div>
            <div><label htmlFor="edit_job_url">Job URL:</label><input type="url" id="edit_job_url" name="job_url" placeholder="https://" value={editData.job_url} onChange={handleInputChange} disabled={loading} /></div>
            <div><label htmlFor="edit_job_description">Job Description:</label><textarea id="edit_job_description" name="job_description" value={editData.job_description} onChange={handleInputChange} rows={4} disabled={loading} /></div>
            <div><label htmlFor="edit_notes">Notes:</label><textarea id="edit_notes" name="notes" value={editData.notes} onChange={handleInputChange} rows={3} disabled={loading} /></div>
            {/* Actions */}
            <div className="form-actions">
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" onClick={() => setIsEditing(false)} disabled={loading} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default JobDetail;