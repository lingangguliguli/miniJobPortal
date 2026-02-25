import React, { useState, useEffect } from 'react';

const mockPosts = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: [
    "Frontend Developer", "Backend Engineer", "Product Manager",
    "UI/UX Designer", "Data Scientist", "DevOps Engineer",
    "Full Stack Developer", "QA Engineer", "Android Developer",
    "iOS Developer"
  ][i % 10],
  body: "Responsible for building and maintaining software solutions that meet business requirements and deliver great user experiences.",
}));

const JobPortal = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('All');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => {
        const mappedJobs = data.map(post => ({
          id: post.id,
          role: post.title,
          description: post.body,
        }));
        setJobs(mappedJobs);
      })
      .catch(() => {
        const mappedJobs = mockPosts.map(post => ({
          id: post.id,
          role: post.title,
          description: post.body,
        }));
        setJobs(mappedJobs);
      });
  }, []);

  const handleSaveJob = (job) => {
    if (!savedJobs.some(savedJob => savedJob.id === job.id)) {
      setSavedJobs([...savedJobs, job]);
    }
  };

  const handleRemoveSavedJob = (id) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  const displayedJobs = viewMode === 'All' ? jobs : savedJobs;

  const filteredJobs = displayedJobs.filter(job =>
    job.role.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f0f2f5;
        }

        .portal-wrapper {
          max-width: 750px;
          margin: 40px auto;
          padding: 0 16px 60px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #1a1a1a;
        }

        .portal-header {
          background: #1d3557;
          color: white;
          padding: 20px 24px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .portal-header h1 {
          font-size: 1.3rem;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .saved-badge {
          background: #457b9d;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 180px;
          padding: 9px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.95rem;
          outline: none;
          background: white;
        }

        .search-input:focus {
          border-color: #457b9d;
        }

        .view-btn {
          padding: 9px 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: white;
          font-size: 0.9rem;
          cursor: pointer;
          color: #444;
        }

        .view-btn.active {
          background: #1d3557;
          color: white;
          border-color: #1d3557;
          font-weight: 600;
        }

        .job-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .job-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .job-info {
          flex: 1;
        }

        .job-role {
          font-size: 1rem;
          font-weight: 600;
          color: #1d3557;
          margin-bottom: 4px;
          text-transform: capitalize;
        }

        .job-desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }

        .save-btn {
          padding: 7px 14px;
          border: none;
          border-radius: 5px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          background: #2a9d8f;
          color: white;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .save-btn:disabled {
          background: #ccc;
          cursor: default;
          color: #888;
        }

        .remove-btn {
          padding: 7px 14px;
          border: none;
          border-radius: 5px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          background: #e63946;
          color: white;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .empty-msg {
          text-align: center;
          color: #999;
          padding: 40px 0;
          font-size: 0.95rem;
        }
      `}</style>

      <div className="portal-wrapper">
        <div className="portal-header">
          <h1>Job Listing Mini Portal</h1>
          <span className="saved-badge">Saved: {savedJobs.length}</span>
        </div>

        <div className="controls">
          <input
            type="text"
            placeholder="Search by role..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button
            className={`view-btn ${viewMode === 'All' ? 'active' : ''}`}
            onClick={() => setViewMode('All')}
          >
            All Jobs
          </button>
          <button
            className={`view-btn ${viewMode === 'Saved' ? 'active' : ''}`}
            onClick={() => setViewMode('Saved')}
          >
            Saved Jobs ({savedJobs.length})
          </button>
        </div>

        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <p className="empty-msg">
              {viewMode === 'Saved' ? 'No saved jobs yet.' : 'No jobs found.'}
            </p>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="job-card">
                <div className="job-info">
                  <p className="job-role">{job.role}</p>
                  <p className="job-desc">{job.description}</p>
                </div>

                {viewMode === 'All' ? (
                  <button
                    className="save-btn"
                    onClick={() => handleSaveJob(job)}
                    disabled={savedJobs.some(savedJob => savedJob.id === job.id)}
                  >
                    {savedJobs.some(savedJob => savedJob.id === job.id) ? 'Saved ✓' : 'Save Job'}
                  </button>
                ) : (
                  <button className="remove-btn" onClick={() => handleRemoveSavedJob(job.id)}>
                    Remove
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default JobPortal;
