import React, { useState } from 'react';
import axios from 'axios';

function AddJobForm({ onJobAdded }) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState('Applied');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!jobTitle.trim() || !companyName.trim()) {
      setSubmitError('Job Title and Company Name cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    const jobData = { /* ... (same as before) ... */
        job_title: jobTitle.trim(),
        company_name: companyName.trim(),
        status: status,
        job_url: jobUrl.trim() || null,
        job_description: jobDescription.trim() || null,
        notes: notes.trim() || null,
    };

    try {
      const response = await axios.post('/api/jobs', jobData);
      if (response.status === 201) {
        setSubmitSuccess(true);
        setJobTitle(''); setCompanyName(''); setStatus('Applied');
        setJobUrl(''); setJobDescription(''); setNotes('');
        if (onJobAdded) { onJobAdded(); }
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else { /* ... (same as before) ... */
        setSubmitError(`Unexpected response status: ${response.status}`);
      }
    } catch (err) { /* ... (same error handling as before) ... */
       console.error("Error submitting job:", err);
       const errorData = err.response?.data;
       const message = errorData?.messages
         ? Object.values(errorData.messages).flat().join(' ')
         : errorData?.error || 'An unknown error occurred.';
       setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Use className from CSS
    <div className="add-job-form">
      <h2>Add New Job Application</h2>
      <form onSubmit={handleSubmit}>
        {/* Messages */}
        {submitSuccess && <div className="form-message success">Job added successfully!</div>}
        {submitError && <div className="form-message error">Error: {submitError}</div>}

        {/* Form Fields */}
        <div>
          <label htmlFor="add_jobTitle">Job Title*:</label>
          <input type="text" id="add_jobTitle" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="add_companyName">Company Name*:</label>
          <input type="text" id="add_companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="add_status">Status:</label>
          <select id="add_status" value={status} onChange={(e) => setStatus(e.target.value)} disabled={isSubmitting}>
            {/* ... options ... */}
            <option value="Wishlist">Wishlist</option>
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>
        <div>
          <label htmlFor="add_jobUrl">Job URL:</label>
          <input type="url" id="add_jobUrl" placeholder="https://..." value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="add_jobDescription">Job Description:</label>
          <textarea id="add_jobDescription" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} disabled={isSubmitting} />
        </div>
        <div>
          <label htmlFor="add_notes">Notes:</label>
          <textarea id="add_notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} disabled={isSubmitting} />
        </div>

        {/* Actions */}
        <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Application'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default AddJobForm;