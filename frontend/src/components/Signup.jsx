import React, { useState } from 'react';

const Signup = () => {
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { nume, email, parola } }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('User creat:', data);
        alert('Cont creat cu succes!');
      })
      .catch((error) => {
        console.error('Eroare:', error);
        alert('Eroare la înregistrare!');
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nume"
          value={nume}
          onChange={(e) => setNume(e.target.value)}
          style={{ display: 'block', margin: '10px auto' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', margin: '10px auto' }}
        />
        <input
          type="password"
          placeholder="Parola"
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          style={{ display: 'block', margin: '10px auto' }}
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
