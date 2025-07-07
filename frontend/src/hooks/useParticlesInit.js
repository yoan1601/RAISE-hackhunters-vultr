// src/hooks/useParticlesInit.js
import { useState, useEffect } from 'react';
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

/**
 * Custom hook to handle the initialization of the tsparticles engine.
 * @returns {boolean} A boolean indicating whether the particle engine is initialized.
 */
const useParticlesInit = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        // This effect runs once on component mount to initialize the particles engine.
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []); // Empty dependency array ensures this runs only once.

    return init;
};

export default useParticlesInit;