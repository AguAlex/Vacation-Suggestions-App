import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, parola }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Login reușit!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Eroare la login!');
      });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
