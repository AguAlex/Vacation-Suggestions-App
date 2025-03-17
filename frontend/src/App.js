import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/test/index')  // URL-ul backend-ului Rails
      .then((response) => response.json())
      .then((data) => {
        console.log('Mesaj din API:', data);
        setMessage(data.message);  // Setezi mesajul în state
      })
      .catch((error) => {
        console.error('Eroare la fetch:', error);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Test React + Rails API</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
