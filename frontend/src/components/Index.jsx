import React from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Bine ai venit!</h1>
      <button
        style={{ margin: '10px', padding: '10px 20px' }}
        onClick={() => navigate('/login')}
      >
        Login
      </button>
      <button
        style={{ margin: '10px', padding: '10px 20px' }}
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </button>
    </div>
  );
};

export default IndexPage;
