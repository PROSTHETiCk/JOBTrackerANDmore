import React, { useState } from 'react';
import axios from 'axios';

function ResumeDisplay() {
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateResume = async () => {
    setIsLoading(true);
    setError(null);
    setResumeText(''); // Clear previous resume

    try {
      const response = await axios.get('/api/resume'); // Call the new backend endpoint
      if (response.data && response.data.resume_text) {
        setResumeText(response.data.resume_text);
      } else {
        // Handle case where backend might return empty if profile is empty but exists
        setResumeText('Profile data found, but it might be empty.');
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
      // Handle specific 404 if profile doesn't exist
      if (err.response && err.response.status === 404) {
           setError(err.response?.data?.error || 'User profile not found. Please fill out your profile first.');
      } else {
           setError(err.response?.data?.error || 'Failed to generate resume.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resume-display"> {/* Use className for styling */}
      <h2>Basic Resume Auto-Fill (MVP)</h2>
      <p>Click the button below to generate a simple text-based resume using your saved profile data.</p>

      <button onClick={handleGenerateResume} disabled={isLoading} style={{marginBottom: 'var(--gap-md)'}}>
        {isLoading ? 'Generating...' : 'Generate Basic Resume'}
      </button>

      {/* Display Results, Loading, or Error */}
      {isLoading && <div className="loading-state">Generating resume...</div>}
      {error && <div className="form-message error">{error}</div>}
      {resumeText && (
        <div className="resume-output" style={{marginTop: 'var(--gap-md)'}}>
          <h3>Generated Resume Text:</h3>
          {/* Using <pre> preserves whitespace and line breaks from the backend */}
          <pre className="display-box" style={{ maxHeight: '500px' }}>{resumeText}</pre>
        </div>
      )}
    </div>
  );
}

export default ResumeDisplay;