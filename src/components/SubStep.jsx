import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './SubStep.module.css';
import html2canvas from "html2canvas";

const SubStep = () => {
  const { id, subId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [userPath, setUserPath] = useState([]);
  const [message, setMessage] = useState("🎨 그림을 그려보세요!");

  const getStepImage = () => {
    const stepImages = {
      "1-1": "/images/line.png",
      "1-2": "/images/monariza.png",
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
    drawTemplate();
  }, [id, subId]);

  const drawTemplate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgSrc = getStepImage();
    if (imgSrc) {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        ctx.globalAlpha = 0.3;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      };
    }
  };

  const clearCanvas = () => {
    drawTemplate();
    setUserPath([]);
    setMessage("🎨 그림을 그려보세요!");
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDrawing = (e) => {
    setDrawing(true);
    setUserPath([]);
    setMessage("🖌️ 그리는 중...");
    const ctx = ctxRef.current;
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = ctxRef.current;
    const { x, y } = getMousePos(e);
    setUserPath((prevPath) => [...prevPath, { x, y }]);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
    ctxRef.current.closePath();
    checkCompletion();
  };

  const checkCompletion = () => {
    let matchCount = 0;
    const tolerance = 15;
    const templatePath = generateTemplatePath();

    userPath.forEach(({ x: ux, y: uy }) => {
      templatePath.forEach(({ x: tx, y: ty }) => {
        if (Math.abs(ux - tx) <= tolerance && Math.abs(uy - ty) <= tolerance) {
          matchCount++;
        }
      });
    });

    const matchPercentage = (matchCount / templatePath.length) * 100;
    setMessage(matchPercentage > 80 ? "🎉 성공적으로 그렸습니다!" : "❌ 다시 시도하세요!");
  };

  const generateTemplatePath = () => {
    let path = [];
    for (let angle = Math.PI; angle <= 2 * Math.PI; angle += 0.05) {
      let x = 300 + 150 * Math.cos(angle);
      let y = 200 + 150 * Math.sin(angle);
      path.push({ x, y });
    }
    return path;
  };

  // ✅ 이전 단계 이동 (1-1 이하로 내려가지 않도록 제한)
  const handlePrevStep = () => {
    const newSubId = Math.max(1, parseInt(subId) - 1);
    navigate(`/step/${id}/${newSubId}`);
  };

  // ✅ 다음 단계 이동 (1-12 이상으로 넘어가지 않도록 제한)
  const handleNextStep = () => {
    const newSubId = Math.min(12, parseInt(subId) + 1);
    navigate(`/step/${id}/${newSubId}`);
  };

  return (
    <div className={styles.subStepContainer}>
      <h2 className={styles.subStepTitle}>Step {id} - {subId}</h2>

      <div id="captureArea" className={styles.canvasWrapper}>
        {/* ✅ 초기화 버튼 추가 (캔버스 오른쪽 위 배치) */}
        <button className={styles.clearButton} onClick={clearCanvas}>🗑 초기화</button>
        
        <canvas
          ref={canvasRef}
          className={styles.drawingCanvas}
          width={2000}
          height={1600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
      </div>

      {/* ✅ 실시간 메시지 표시 */}
      <div className={styles.resultMessage}>{message}</div>

      <div className={styles.subStepControls}>
        <Button 
          text="이전으로" 
          onClick={handlePrevStep} 
          color="pink" 
        />
        <Button text="저장하기" onClick={() => alert("저장 기능!")} color="pink" />
        <Button 
          text="다음으로" 
          onClick={handleNextStep} 
          color="pink" 
        />
      </div>
    </div>
  );
};

export default SubStep;
