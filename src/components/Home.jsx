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
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>
        <span className={styles.titleOrange}>Eye </span>
        <span className={styles.titleGreen}>Print</span>
      </h1>
      <div className={styles.circleContainer}>
        {/* 숫자 원들 */}
        {[5, 7, 6, 8, 3, 2, 9, 1, 4].map((num) => (
          <div key={num} className={styles.circle}>
            {num}
          </div>
        ))}
        <Button text="Play" onClick={handlePlay} color="orange" />
      </div>
      <Button text="Reset" onClick={() => alert('Reset clicked!')} color="pink" />
    </div>
  );
};

export default Home;