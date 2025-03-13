import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './SubStep.module.css';

const SubStep = () => {
  const { id, subId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // Step별 도안 이미지 설정
  const getStepImage = () => {
    const stepImages = {
      "1-1": "/images/line.png",
      "1-2": "/images/diagonal.png",
      "1-3": "/images/cross.png",
      "1-4": "/images/semi-circle.png",
      "1-5": "/images/circle.png",
      "2-1": "/images/fish.png",
      "2-2": "/images/clover.png",
      "2-3": "/images/dog.png",
      "2-4": "/images/car.png",
      "3-1": "/images/starry-night.png",
      "3-2": "/images/mona-lisa.png"
    };
    return stepImages[`${id}-${subId}`] || null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 도안 이미지 적용
    const imgSrc = getStepImage();
    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        ctx.globalAlpha = 0.3; // 반투명 설정
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0; // 이후 그림은 원래대로
      };
    }
  }, [id, subId]);

  // 그림 그리기 기능 추가 (캔버스에서 선이 나오도록)
  const startDrawing = (e) => {
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const rect = canvas.getBoundingClientRect(); // 🔥 캔버스의 정확한 위치 정보 가져오기
  
    const x = e.clientX - rect.left; // 🔥 정확한 X 좌표 계산
    const y = e.clientY - rect.top;  // 🔥 정확한 Y 좌표 계산
  
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const rect = canvas.getBoundingClientRect(); // 🔥 캔버스 위치 정보 가져오기
  
    const x = e.clientX - rect.left; // 🔥 X 좌표 보정
    const y = e.clientY - rect.top;  // 🔥 Y 좌표 보정
  
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setDrawing(false);
    ctxRef.current.closePath();
  };

  return (
    <div className={styles.subStepContainer}>
      <h2 className={styles.subStepTitle}>Step {id} - {subId}</h2>
      
      <canvas
        ref={canvasRef}
        className={styles.drawingCanvas}
        width={600}
        height={400}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      ></canvas>

      <div className={styles.subStepControls}>
        <Button 
          text="이전으로" 
          onClick={() => navigate(`/step/${id}/${parseInt(subId) - 1}`)} 
          color="pink" 
        />
        <Button text="저장하기" onClick={() => alert('그림 저장하기!')} color="pink" />
        <Button 
          text="다음으로" 
          onClick={() => navigate(`/step/${id}/${parseInt(subId) + 1}`)} 
          color="pink" 
        />
      </div>
    </div>
  );
};

export default SubStep;