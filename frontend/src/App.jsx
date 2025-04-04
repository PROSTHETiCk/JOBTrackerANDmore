import React, { useState, useEffect } from 'react';
import JobList from './components/JobList.jsx';
import AddJobForm from './components/AddJobForm.jsx';
import JobDetail from './components/JobDetail.jsx';
import UserProfilePage from './components/UserProfilePage.jsx';
import JobAnalyzer from './components/JobAnalyzer.jsx';
import ResumeDisplay from './components/ResumeDisplay.jsx';
// Styles should be in index.css imported in main.jsx

function App() {
  // --- State ---
  const [refreshKey, setRefreshKey] = useState(0);
  const [activePage, setActivePage] = useState('jobs'); // Default to 'jobs'
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [theme, setTheme] = useState(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
  });

  // --- Effects ---
  // Theme effect
  useEffect(() => {
      document.body.className = theme === 'dark' ? 'dark-mode' : '';
      localStorage.setItem('theme', theme);
      console.log(`DEBUG: Theme set to: ${theme}`); // Log theme changes
  }, [theme]);

  // --- Event Handlers ---
  const triggerRefresh = () => { setRefreshKey(prevKey => prevKey + 1); };
  const handleJobAdded = () => { triggerRefresh(); };
  const handleJobUpdated = () => { triggerRefresh(); };

  // --- Navigation Handlers with Logging ---
  const showJobDetail = (jobId) => {
    console.log('DEBUG: Navigating to Job Detail, ID:', jobId); // DEBUG LOG
    setSelectedJobId(jobId);
    setActivePage('jobDetail');
  };
  const showJobList = () => {
    console.log('DEBUG: Navigating to Jobs List'); // DEBUG LOG
    setSelectedJobId(null);
    setActivePage('jobs');
  };
  const showProfile = () => {
    console.log('DEBUG: Navigating to Profile'); // DEBUG LOG
    setSelectedJobId(null);
    setActivePage('profile');
  };
  const showResume = () => {
    console.log('DEBUG: Navigating to Resume'); // DEBUG LOG
    setSelectedJobId(null);
    setActivePage('resume');
  };
  const toggleTheme = () => {
      console.log('DEBUG: Toggling theme'); // DEBUG LOG
      setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // --- Render Logic ---
  const renderActivePage = () => {
    // Log which page is about to be rendered
    console.log('DEBUG: Rendering page:', activePage); // DEBUG LOG

    switch (activePage) {
      case 'profile':
        // Pass showJobList as the onBack prop
        return <UserProfilePage onBack={showJobList} />;
      case 'jobDetail':
        // Pass showJobList as the onBack prop
        return selectedJobId ? (
            <JobDetail
                jobId={selectedJobId}
                onBack={showJobList}
                onUpdateSuccess={handleJobUpdated}
            />
         ) : null;
      case 'resume':
         // Pass showJobList as onBack for consistency
        return <ResumeDisplay /* onBack={showJobList} */ />;
      case 'jobs':
      default:
        // This is the main view
        return (
          <>
            <section className="add-job-section"><AddJobForm onJobAdded={handleJobAdded} /></section>
            <hr />
            <section className="job-analyzer-section"><JobAnalyzer /></section>
            <hr />
            <section className="job-list-section"><JobList key={refreshKey} refreshTrigger={refreshKey} onEdit={showJobDetail} /></section>
          </>
        );
    }
  };

  return (
    <div className="App">
       <header className="App-header">
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--gap-md)' }}>
            <h1>Job Tracker</h1>
            {/* Navigation & Theme Toggle Container */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-md)', flexWrap: 'wrap' }}>
                <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Ensure onClick handlers are correctly assigned */}
                    {activePage !== 'jobs' && ( <button onClick={showJobList} className="btn-secondary">Jobs</button> )}
                    {activePage !== 'profile' && ( <button onClick={showProfile} className="btn-secondary">Profile</button> )}
                    {activePage !== 'resume' && ( <button onClick={showResume} className="btn-secondary">Resume</button> )}
                </nav>
                <button onClick={toggleTheme} className="btn-secondary" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
                </button>
            </div>
         </div>
      </header>
      <main>
        {/* General Back Button (Optional - could be handled within components) */}
        {/* We added onBack props to Profile and Detail, maybe remove this one? */}
        {/* {activePage !== 'jobs' && (
             <button onClick={showJobList} className="btn-secondary" style={{ marginBottom: 'var(--gap-md)' }}>&larr; Back to Jobs List</button>
        )} */}
        {renderActivePage()}
      </main>
    </div>
  );
}

export default App;