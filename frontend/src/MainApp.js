// src/MainApp.js

import React, { useState } from 'react';
import Particles from '@tsparticles/react';
import apiClient from './api'; // Import the axios client
import particlesConfig from './particlesConfig';
import './MainApp.css';
import useParticlesInit from './hooks/useParticlesInit';

// Helper function to parse the log string (no changes here)
const parseWorkflowStep = (stepString) => {
  const match = stepString.match(/\[(.*?)\]\s*(received|response):\s*(.*)/s);
  if (!match) return null;
  return { agentName: match[1], type: match[2], content: match[3] };
};

function MainApp() {
  const [idea, setIdea] = useState('');
  const [workflow, setWorkflow] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const init = useParticlesInit();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea.trim()) {
      setError('Please enter an idea to process.');
      return;
    }
    setIsLoading(true);
    setError('');
    setWorkflow([]);
    setIsGenerated(false);
    try {
      // Use the pre-configured axios client. The baseURL is already set.
      const response = await apiClient.post('/process-idea', { idea });

      // With axios, the response data is in the `data` property
      setWorkflow(response.data.workflow);
      setIsGenerated(true);
    } catch (err) {
      // Enhanced error handling for axios
      let errorMessage = 'Failed to process idea.';
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const serverError =
          err.response.data?.error || `Server error: ${err.response.status}`;
        errorMessage += ` Error: ${serverError}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage +=
          ' Error: No response from server. Please check your network connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage += ` Error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const agentResponses = workflow
    .map(parseWorkflowStep)
    .filter(step => step && step.type === 'response');

  return (
    <div className="main-app-page-container">
      {/* Render particles once the engine is initialized */}
      {init && (
        <Particles
          id="tsparticles-main"
          options={particlesConfig}
        />
      )}

      <div className="app-container">
        <header className="app-header">
          <h1>Multi-Agent Product Launcher</h1>
          <p>Submit your product idea and watch our AI agents collaborate to build a strategy.</p>
        </header>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="idea-form">
            <input type="text" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Enter your idea here..." className="idea-input" disabled={isLoading} />
            <button type="submit" className="idea-submit-button" disabled={isLoading}>{isLoading ? 'Processing...' : 'Submit Idea'}</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {isGenerated && (
          <div className="workflow-container">
            <h2>✅ Workflow Generated:</h2>
            <div className="timeline">
              {agentResponses.map((step, index) => {
                const agentClass = `agent-${step.agentName.replace('Agent', '').toLowerCase()}`;
                return (
                  <div key={index} className={`timeline-item ${agentClass}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="agent-header">
                        <h3>{step.agentName}</h3>
                      </div>
                      <pre className="agent-response">{step.content}</pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainApp;
