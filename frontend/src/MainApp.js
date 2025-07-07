// src/MainApp.js

import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import particlesConfig from './particlesConfig';
import './MainApp.css';

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

  // State to track particle engine initialization
  const [init, setInit] = useState(false);

  // This effect runs once on component mount to initialize the particles engine.
  useEffect(() => {
    const initializeParticles = async () => {
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });
      setInit(true);
    };
    initializeParticles();
  }, []); // The empty dependency array ensures this effect runs only once.

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/process-idea`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Invalid server response' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setWorkflow(data.workflow);
      setIsGenerated(true);
    } catch (err) {
      setError(`Failed to process idea. Error: ${err.message}`);
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
