"use client";

import React, { useState, useEffect, useRef } from 'react';
import ScratchCard from '@/components/ScratchCard';

export default function FateFood() {
  const [meal, setMeal] = useState<'brk' | 'lun' | 'din'>('brk');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showRescue, setShowRescue] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showScratch, setShowScratch] = useState(false);
  const [scratchImage, setScratchImage] = useState("");

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const options = config[meal].options;
    const arc = (Math.PI * 2) / options.length;
    ctx.clearRect(0, 0, 600, 600);
    options.forEach((text, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = i % 2 === 0 ? "#FFFFFF" : "#F7F7F7";
      ctx.moveTo(300, 300);
      ctx.arc(300, 300, 280, i * arc, (i + 1) * arc);
      ctx.fill();
      ctx.strokeStyle = "#DDD";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.translate(300, 300);
      ctx.rotate(i * arc + arc / 2);
      ctx.fillStyle = "#333";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(text, 120, 10);
      ctx.restore();
    });
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowCard(false);

    setTimeout(() => {
      setIsSpinning(false);
      showResultCard(selectedFoodName, 'wheel');
    }, 2000);
  };

  // 盲盒玩法：跨时段随机
  const openMysteryBox = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowCard(false);

    const allOptions = [...config.brk.options, ...config.lun.options, ...config.din.options];
    const luckyPick = getRandomFood(allOptions);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedFood(luckyPick);
      setScratchImage(`https://images.unsplash.com/featured/400x400?food,${encodeURIComponent(luckyPick)}&sig=${Math.random()}`);
      setShowScratch(true);
    }, 800);
  };

  const handleScratchComplete = () => {
    setShowScratch(false);
    setLastThreeFoods(prev => {
      const newList = [selectedFood, ...prev].slice(0, 3);
      return newList;
    });
    setShowCard(true);
    setLastMode('mystery');
  };

  // 关闭卡片，回到主界面（不自动触发任何玩法）
  const closeCardAndBackToMain = () => {
    setShowCard(false);
    // 不清空任何状态，让用户自己选择转盘或盲盒
  };

  const startRescue = () => {
    setShowRescue(true);
    setProgress(0);
    let start = Date.now();
    const duration = 2000;
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (elapsed >= duration) {
        clearInterval(timer);
        setShowRescue(false);
        spin();
      }
    }, 16);
  };

  const getDeliveryUrl = (food: string) => {
    const keyword = encodeURIComponent(food);
    return `https://h5.waimai.meituan.com/waimai/mindex/search?keyword=${keyword}`;
  };

  return (
    <main style={{
      backgroundColor: config[meal].color,
      color: config[meal].accent,
      height: '100vh', width: '100vw',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', transition: 'all 1s', overflow: 'hidden'
    }}>
      {/* 时段切换 */}
      <nav style={{ marginTop: '5vh', display: 'flex', gap: '15px', zIndex: 10 }}>
        {(['brk', 'lun', 'din'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMeal(m);
              setShowCard(false);
              setShowScratch(false);
            }}
            style={{
              padding: '8px 24px', borderRadius: '20px',
              border: `1.5px solid ${config[meal].accent}`,
              background: meal === m ? config[meal].accent : 'transparent',
              color: meal === m ? config[meal].color : config[meal].accent,
              fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {config[m].name}
          </button>
        ))}
      </nav>

      {/* 转盘区域 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '14px solid transparent', borderRight: '14px solid transparent',
          borderTop: '28px solid #FF4757',
          position: 'absolute', top: 'calc(50% - 165px)', left: 'calc(50% - 14px)',
          zIndex: 5
        }} />
        <canvas
          ref={canvasRef}
          width="600" height="600"
          style={{
            width: '300px', height: '300px', borderRadius: '50%',
            transition: 'transform 2s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      {/* 操作按钮区 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '8vh' }}>
        <button
          onClick={spin}
          disabled={isSpinning}
          style={{
            padding: '18px 50px', fontSize: '1.2rem',
            background: config[meal].accent, color: config[meal].color,
            border: 'none', borderRadius: '40px', cursor: 'pointer',
            opacity: isSpinning ? 0.5 : 1, fontWeight: 'bold'
          }}
        >
          {isSpinning ? "命运轮盘中..." : "🎡 问问命运"}
        </button>

        <div 
          onClick={openMysteryBox}
          style={{
            cursor: 'pointer', fontSize: '0.9rem',
            color: config[meal].accent, opacity: 0.7,
            borderBottom: `1px solid ${config[meal].accent}`,
            paddingBottom: '2px'
          }}
        >
          🎁 开启今日盲盒（刮开有惊喜）
        </div>
      </div>

      {/* 救赎动画 */}
      {showRescue && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 300, color: 'white'
        }}>
          <p>✨ 正在连接平行时空的味蕾 ✨</p>
          <div style={{ width: '180px', height: '2px', background: '#333', marginTop: '20px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'white' }} />
          </div>
        </div>
      )}

      {/* 结果卡片 - 关闭后回到主界面，让用户自主选择 */}
      {showCard && !showScratch && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 200, color: 'white'
        }}>
          <div style={{
            background: '#fff', color: '#333', width: '320px', borderRadius: '28px',
            padding: '30px 20px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <img 
              key={scratchImage}
              src={scratchImage} 
              alt={selectedFood}
              style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '50%', marginBottom: '20px', border: '4px solid #FFD161' }}
            />
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              {lastMode === 'wheel' ? '🎡 命运选择' : '🎁 盲盒惊喜'}
            </p>
            <h2 style={{ fontSize: '1.8rem', margin: '10px 0 20px' }}>{selectedFood}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 主要行动：点外卖 */}
              <button 
                onClick={() => {
                  const url = getDeliveryUrl(selectedFood);
                  window.open(url, '_blank');
                }}
                style={{ 
                  padding: '14px', background: '#FFD161', color: '#333', 
                  border: 'none', borderRadius: '40px', fontSize: '1rem', 
                  fontWeight: 'bold', cursor: 'pointer' 
                }}
              >
                🍔 去点外卖（美团）
              </button>
              
              {/* 换一个：关闭卡片，回到主界面，让用户自己选转盘或盲盒 */}
              <button 
                onClick={closeCardAndBackToMain} 
                style={{ 
                  padding: '12px', background: '#F0F0F0', color: '#666', 
                  border: 'none', borderRadius: '40px', fontSize: '0.9rem', 
                  cursor: 'pointer' 
                }}
              >
                🔄 换一个
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 刮刮乐 */}
      {showScratch && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', zIndex: 250, color: 'white'
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>🎁 刮开查看今日宿命</h2>
          <ScratchCard 
            image={scratchImage}
            title={selectedFood}
            onComplete={handleScratchComplete}
          />
        </div>
      )}
    </main>
  );
}