import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Simple Profile Page component
function UserProfilePage({ onBack }) { // Added onBack prop for consistency
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Separate state for saving

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    setIsEditing(false); // Ensure not in edit mode when fetching
    try {
      const response = await axios.get('/api/profile'); // Assumes GET /api/profile for current user (ID 1)
      setProfileData(response.data || {}); // Handle potential empty response
      // Initialize edit form data
      setEditData(response.data || {
          full_name: '', email: '', phone: '', address: '',
          linkedin_url: '', portfolio_url: '', skills: '',
          experience: '', education: ''
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.error || `Failed to fetch profile: ${err.message}`);
      setProfileData({}); // Set to empty object on error? Or null?
      setEditData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // Fetch only on initial mount

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle saving updated profile data
  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    // Basic email validation example (add more as needed)
    if (!editData.email || !/\S+@\S+\.\S+/.test(editData.email)) {
        setError('A valid email is required.');
        setIsSaving(false);
        return;
    }

    try {
      const response = await axios.put('/api/profile', editData); // Assumes PUT /api/profile updates current user (ID 1)
       if (response.status === 200) {
        setProfileData(response.data); // Update displayed data
        setIsEditing(false); // Exit edit mode
        // Optionally show a success message
      } else {
        setError(`Update failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
       const errorData = err.response?.data;
       const message = errorData?.messages
         ? Object.values(errorData.messages).flat().join(' ')
         : errorData?.error || 'An unknown error occurred saving the profile.';
       setError(message);
    } finally {
      setIsSaving(false);
    }
  };


  // --- Render Logic ---
  if (loading) return <div className="loading-state">Loading Profile...</div>;

  return (
    <div className="user-profile-page"> {/* Use className for styling */}
       {/* Optional: Add a back button if this isn't the main view */}
       {onBack && <button onClick={onBack} className="btn-secondary" style={{ marginBottom: 'var(--gap-md)' }}>&larr; Back</button>}

       <h2>My Profile</h2>

       {/* Display Error if any, except during saving in edit mode */}
       {error && !isEditing && <div className="form-message error">Error: {error}</div>}

       {!isEditing ? (
        // --- Display Mode ---
        <div>
            <p><strong>Full Name:</strong> {profileData?.full_name || 'N/A'}</p>
            <p><strong>Email:</strong> {profileData?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {profileData?.phone || 'N/A'}</p>
            <p><strong>Address:</strong> {profileData?.address || 'N/A'}</p>
            <p><strong>LinkedIn:</strong> {profileData?.linkedin_url ? <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer">{profileData.linkedin_url}</a> : 'N/A'}</p>
            <p><strong>Portfolio:</strong> {profileData?.portfolio_url ? <a href={profileData.portfolio_url} target="_blank" rel="noopener noreferrer">{profileData.portfolio_url}</a> : 'N/A'}</p>
            {profileData?.skills && <div style={{ marginTop: 'var(--gap-sm)' }}><strong>Skills:</strong><pre className="display-box">{profileData.skills}</pre></div>}
            {profileData?.experience && <div style={{ marginTop: 'var(--gap-sm)' }}><strong>Experience:</strong><pre className="display-box">{profileData.experience}</pre></div>}
            {profileData?.education && <div style={{ marginTop: 'var(--gap-sm)' }}><strong>Education:</strong><pre className="display-box">{profileData.education}</pre></div>}

            <button onClick={() => setIsEditing(true)} className="btn-edit" style={{marginTop: 'var(--gap-lg)'}}>Edit Profile</button>
        </div>

       ) : (
        // --- Edit Mode ---
         <form onSubmit={handleSaveProfile}>
             {error && <div className="form-message error">Error: {error}</div>}

             <div><label htmlFor="profile_full_name">Full Name:</label><input type="text" id="profile_full_name" name="full_name" value={editData.full_name || ''} onChange={handleInputChange} disabled={isSaving} /></div>
             <div><label htmlFor="profile_email">Email*:</label><input type="email" id="profile_email" name="email" value={editData.email || ''} onChange={handleInputChange} required disabled={isSaving} /></div>
             <div><label htmlFor="profile_phone">Phone:</label><input type="tel" id="profile_phone" name="phone" value={editData.phone || ''} onChange={handleInputChange} disabled={isSaving} /></div>
             <div><label htmlFor="profile_address">Address:</label><input type="text" id="profile_address" name="address" value={editData.address || ''} onChange={handleInputChange} disabled={isSaving} /></div>
             <div><label htmlFor="profile_linkedin_url">LinkedIn URL:</label><input type="url" id="profile_linkedin_url" name="linkedin_url" value={editData.linkedin_url || ''} onChange={handleInputChange} disabled={isSaving} /></div>
             <div><label htmlFor="profile_portfolio_url">Portfolio URL:</label><input type="url" id="profile_portfolio_url" name="portfolio_url" value={editData.portfolio_url || ''} onChange={handleInputChange} disabled={isSaving} /></div>
             <div><label htmlFor="profile_skills">Skills:</label><textarea id="profile_skills" name="skills" value={editData.skills || ''} onChange={handleInputChange} rows={3} disabled={isSaving}></textarea></div>
             <div><label htmlFor="profile_experience">Experience:</label><textarea id="profile_experience" name="experience" value={editData.experience || ''} onChange={handleInputChange} rows={5} disabled={isSaving}></textarea></div>
             <div><label htmlFor="profile_education">Education:</label><textarea id="profile_education" name="education" value={editData.education || ''} onChange={handleInputChange} rows={3} disabled={isSaving}></textarea></div>

             <div className="form-actions">
                <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Profile'}</button>
                <button type="button" onClick={() => { setIsEditing(false); setError(null); /* Reset editData if needed */ }} disabled={isSaving} className="btn-secondary">Cancel</button>
             </div>
         </form>
       )}
    </div>
  );
}

export default UserProfilePage;