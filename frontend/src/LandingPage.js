// src/LandingPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import Particles from "@tsparticles/react";
import particlesConfig from './particlesConfig';
import { FaUsers } from 'react-icons/fa'; // Removed unused FaLaptopCode, FaTrophy
import './LandingPage.css';
import useParticlesInit from './hooks/useParticlesInit';

function LandingPage() {
  const init = useParticlesInit();

  return (
    <div className="landing-container">
      {init && (
        <Particles
          id="tsparticles"
          options={particlesConfig}
        />
      )}

      <header className="landing-header">
        <div className="sponsor-logos">
          <span>POWERED BY:</span> <strong>Groq</strong>, <strong>Meta</strong>
        </div>
        <div className="sponsor-logos">
          <span>SPONSORED BY:</span> <strong>Vultr</strong>,
        </div>
      </header>

      <div className="landing-content">
        <h1 className="landing-title anim-item">
          Decentralized Multi-Agent Workflow
        </h1>
        <p className="landing-subtitle anim-item">
          FOR ENTERPRISE AUTOMATION
        </p>
        <p className="landing-description anim-item">
          A collaborative AI system where agents for Design, Marketing, Sales, and Support sequentially build a comprehensive business strategy from a single idea.
        </p>
        <Link to="/app" className="cta-button anim-item">
          Launch The App
        </Link>
      </div>

      <footer className="info-cards-container anim-item">
        <div className="info-card">
          <FaUsers size={20} className="info-icon" />
          <div>
            <h3>VULTR TRACK</h3>
            <p>RAISE YOUR HACK 2025</p>
          </div>
        </div>


      </footer>
    </div>
  );
}

export default LandingPage;
