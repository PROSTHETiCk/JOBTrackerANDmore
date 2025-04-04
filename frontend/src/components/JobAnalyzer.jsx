import React, { useState } from 'react';
import axios from 'axios';

function JobAnalyzer() {
  const [description, setDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(''); // Clear previous results

    try {
      const response = await axios.post('/api/analyze', { description: description });
      if (response.data && response.data.analysis) {
        setAnalysisResult(response.data.analysis);
      } else {
        setError('Received an unexpected response from the analyzer.');
      }
    } catch (err) {
      console.error("Error analyzing job description:", err);
      setError(err.response?.data?.error || 'Failed to analyze description.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="job-analyzer"> {/* Use className for styling */}
      <h2>Job Description Analyzer (Beta)</h2>
      <p>Paste a job description below and click "Analyze" to get key insights using AI.</p>

      <div style={{ marginBottom: 'var(--gap-md)' }}>
        <label htmlFor="job_description_input">Job Description:</label>
        <textarea
          id="job_description_input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={10} // Adjust size as needed
          placeholder="Paste the full job description here..."
          disabled={isLoading}
          style={{ width: '100%', marginTop: 'var(--gap-sm)' }} // Basic inline style
        />
      </div>

      <button onClick={handleAnalyze} disabled={isLoading || !description.trim()}>
        {isLoading ? 'Analyzing...' : 'Analyze Description'}
      </button>

      {/* Display Results, Loading, or Error */}
      {isLoading && <div className="loading-state" style={{marginTop: 'var(--gap-md)'}}>Analyzing, please wait...</div>}
      {error && <div className="form-message error" style={{marginTop: 'var(--gap-md)'}}>{error}</div>}
      {analysisResult && (
        <div className="analysis-results" style={{marginTop: 'var(--gap-lg)'}}>
          <h3>Analysis Results:</h3>
          {/* Render the analysis text. Using <pre> helps preserve formatting from the AI. */}
          {/* Consider using a Markdown renderer library for better display if the AI returns Markdown */}
          <pre className="display-box">{analysisResult}</pre>
        </div>
      )}
    </div>
  );
}

export default JobAnalyzer;