// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/step/1');
  };

  return (
    <Button text="Play" onClick={handlePlay} color="orange" />
  );
};

export default Home;