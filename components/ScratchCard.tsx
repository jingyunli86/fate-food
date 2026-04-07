"use client";

import React, { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  image: string; // 刮开后显示的图片
  title: string; // 刮开后显示的食物名字
  onComplete: () => void; // 刮完后的回调（比如弹出最终卡片）
}

const ScratchCard: React.FC<ScratchCardProps> = ({ image, title, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [scrapedPercentage, setScrapedPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // --- 修正 1：强制设定画布尺寸 ---
    canvas.width = 300;
    canvas.height = 300;

    // --- 修正 2：初始化涂层 (必须先设为 source-over) ---
    ctx.globalCompositeOperation = 'source-over'; 
    ctx.fillStyle = '#888888'; 
    ctx.fillRect(0, 0, 300, 300);

    // 增加涂层纹理（文字）
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'center';
    ctx.fillText('命运涂层', 150, 160);

    // --- 修正 3：切换刮除模式 (只对后续的划动生效) ---
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 40; 
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    let isDrawing = false;

    // 下面的 getCoord 和事件监听保持原样即可
    const getCoord = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e instanceof MouseEvent) {
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      } else {
        const touch = (e as TouchEvent).touches[0];
        return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      }
    };
    const checkPercentage = () => {
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        const imageData = ctx.getImageData(0, 0, 300, 300);
        const pixels = imageData.data;
        let transparentPixels = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] === 0) transparentPixels++;
        }
        const percentage = (transparentPixels / (300 * 300)) * 100;
        
        if (percentage > 60 && !isDone) {
          setIsDone(true);
          setTimeout(onComplete, 1000);
        }
      };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || isDone) return;
      e.preventDefault();
      const coord = getCoord(e);
      ctx.lineTo(coord.x, coord.y);
      ctx.stroke();
      checkPercentage(); 
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      ctx.beginPath();
      const coord = getCoord(e);
      ctx.moveTo(coord.x, coord.y);
    };

    const stopDrawing = () => { isDrawing = false; };

    // 计算进度的函数 checkPercentage ... (保持不变)

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    window.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('touchmove', draw);
      window.removeEventListener('mouseup', stopDrawing);
    };
  }, [image, isDone]); // 只要图片变了，或者重置了，就重新涂色

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      
      {/* 底部显示的食物内容 (刮开后可见) */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#fff', borderRadius: '16px', border: '1px solid #ddd', padding: '20px', textAlign: 'center'
      }}>
        <img src={image} style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }} />
        <h3 style={{ fontSize: '1.8rem', color: '#333', fontWeight: 'bold' }}>{title}</h3>
      </div>

      {/* 顶部的 Canvas 涂层 */}
      <canvas 
        ref={canvasRef} 
        width="300" 
        height="300" 
        style={{
          position: 'absolute', top: 0, left: 0,
          cursor: 'url(https://raw.githubusercontent.com/ai/size-limit/main/assets/check.svg) 15 15, crosshair', // 增加一个刮刮乐指针图标
          borderRadius: '16px'
        }}
      />

      {/* 提示信息 */}
      {scrapedPercentage < 10 && (
        <p style={{
          position: 'absolute', bottom: '-40px', left: 0, width: '100%', textAlign: 'center',
          color: '#aaa', fontSize: '0.9rem', animation: 'shimmer 1.5s infinite'
        }}>
          动手刮开你的命运吧...
        </p>
      )}
    </div>
  );
};

export default ScratchCard;