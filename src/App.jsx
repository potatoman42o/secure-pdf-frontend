import React, { useState } from 'react';
import './App.css';

function App() {
  const [key, setKey] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://your-backend-url.onrender.com/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.valid) {
        setValidated(true);
        setError('');
      } else {
        setError('Invalid key');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="app">
      {!validated ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your access key"
          />
          <button type="submit">View PDF</button>
          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <iframe
          src={`https://your-backend-url.onrender.com/api/pdf?key=${key}`}
          width="100%"
          height="600px"
          title="Secure PDF Viewer"
        ></iframe>
      )}
    </div>
  );
}

export default App;
