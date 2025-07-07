// src/LandingPage.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react"; // <<< Naya Import
import { loadSlim } from "@tsparticles/slim"; // <<< Naya Import
import particlesConfig from './particlesConfig';
import { FaLaptopCode, FaTrophy, FaUsers } from 'react-icons/fa';
import './LandingPage.css';

function LandingPage() {
  const [init, setInit] = useState(false);

  // This effect runs once on component mount to initialize the particles engine.
  useEffect(() => {
    const initializeParticles = async () => {
      await initParticlesEngine(async (engine) => {
        // Load the slim version of tsparticles, which is sufficient for this config.
        await loadSlim(engine);
      });
      setInit(true);
    };

    initializeParticles();
  }, []); // The empty dependency array ensures this effect runs only once.

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
