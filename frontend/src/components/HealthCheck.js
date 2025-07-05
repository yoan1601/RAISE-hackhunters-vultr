import React, { useState } from 'react';
import { checkBackendHealth } from '../api/client';
import styles from './HealthCheck.module.css';

const HealthCheck = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckHealth = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const response = await checkBackendHealth();
      setStatus(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Backend Health Check</h1>
      <button
        className={styles.button}
        onClick={handleCheckHealth}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Check Backend Health'}
      </button>
      {error && (
        <div className={`${styles.status} ${styles.error}`}>
          <h2>Error</h2>
          <pre>{error.message}</pre>
        </div>
      )}
      {status && (
        <div className={`${styles.status} ${styles.success}`}>
          <h2>Backend Status</h2>
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;
