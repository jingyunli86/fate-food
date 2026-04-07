"use client";
import React, { useState, useEffect } from 'react';


const foodImageDatabase: Record<string, string> = {
  "台式卤肉饭": "/food/luroufan.png",
  "东北菜": "/food/dongbeicai.png",
  "寿司": "/food/shousi.png",
  "黄焖鸡": "/food/huangmenji.png",
  "麻辣烫": "/food/malatang.png",
  "汉堡": "/food/hanbao.png",
  "饭团": "/food/fantuan.png",
  "手抓饼": "/food/shouzhuabing.png", // 修正：对应你文件夹里的 shouzhapng.png
  "煎饼果子": "/food/jianbingguozi.png",
  "胡辣汤": "/food/hulatang.png",
  "豆浆油条": "/food/doujiangyoutiao.png",
  "小笼包": "/food/xiaolongbao.png",
  "三明治": "/food/sanmingzhi.png",
  "麦芬": "/food/maifen.png",
  "螺蛳粉": "/food/luosifen.png",
  "火锅": "/food/huoguo.png",
  "烧烤": "/food/shaokao.png",
  "小龙虾": "/food/xiaolongxia.png",
  "披萨": "/food/pisa.png",
  "炸鸡": "/food/zhaji.png",
  "烤鱼": "/food/kaoyu.png",
  "砂锅": "/food/shaguo.png",
  "咖喱饭": "/food/galifan.png",
  "拉面": "/food/lamian.png"}

// --- 2. 配置信息 ---
const config = {
  brk: { options: ["豆浆油条", "小笼包", "三明治", "麦芬", "饭团", "手抓饼", "煎饼果子", "胡辣汤"] },
  lun: { options: ["台式卤肉饭", "东北菜", "寿司", "黄焖鸡", "麻辣烫", "拉面", "螺蛳粉", "汉堡"] },
  din: { options: ["火锅", "烧烤", "小龙虾", "披萨", "炸鸡", "烤鱼", "砂锅", "咖喱饭"] }
};

export default function FateFood() {
  // --- 3. 状态定义：解决所有 Cannot find name 报错 ---
  const [meal, setMeal] = useState<'brk' | 'lun' | 'din'>('lun');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState("");
  const [totalDeg, setTotalDeg] = useState(0); 
  const [showCard, setShowCard] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [scratchImage, setScratchImage] = useState("");

  const getDeliveryUrl = (food: string) => {
    return `https://s.meituan.com/search?q=${encodeURIComponent(food)}`;
  };

  // --- 4. 转盘逻辑 ---
  const spin = () => {
    if (isSpinning) return;
    
    const currentOptions = config[meal].options;
    const randomDeg = Math.floor(Math.random() * 360) + 2000;
    const newTotalDeg = totalDeg + randomDeg; // 累加角度实现顺滑旋转
    
    setTotalDeg(newTotalDeg);
    setIsSpinning(true);
    setShowCard(false);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newTotalDeg % 360;
      const sectorDeg = 360 / currentOptions.length;
      let winningIndex = Math.floor((360 - actualDeg + 270) % 360 / sectorDeg);
      const foodName = currentOptions[winningIndex];
      
      setSelectedFood(foodName);
      setScratchImage(foodImageDatabase[foodName] || "/food/default.png");
      setShowCard(true);
    }, 4200);
  };

  // --- 5. 盲盒逻辑 ---
  const openMysteryBox = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowCard(false);
    const allOptions = [...config.brk.options, ...config.lun.options, ...config.din.options];
    const luckyPick = allOptions[Math.floor(Math.random() * allOptions.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedFood(luckyPick);
      setScratchImage(foodImageDatabase[luckyPick] || "/food/default.png");
      setShowScratch(true); 
    }, 800);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        {(['brk', 'lun', 'din'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => setMeal(m)} 
            style={{ 
              padding: '10px 20px', 
              margin: '0 5px',
              backgroundColor: meal === m ? '#FFD161' : '#f0f0f0',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {m === 'brk' ? '早餐' : m === 'lun' ? '午餐' : '晚餐'}
          </button>
        ))}
      </div>

      <h1 style={{ color: '#333' }}>{meal === 'lun' ? '午餐' : meal === 'brk' ? '早餐' : '晚餐'}吃啥？</h1>
      
      {/* 转盘视觉 */}
      <div style={{ 
        width: '300px', height: '300px', border: '8px solid #FFD161', borderRadius: '50%',
        margin: '30px auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: `rotate(${totalDeg}deg)`, transition: 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)',
        fontSize: '50px', backgroundColor: '#fff9e6', position: 'relative'
      }}>
        🎡
        <div style={{ position: 'absolute', top: '-20px', fontSize: '30px' }}>📍</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={spin} disabled={isSpinning} style={{ padding: '12px 30px', borderRadius: '25px', background: '#FFD161', border: 'none', cursor: 'pointer' }}>开始转盘</button>
        <button onClick={openMysteryBox} disabled={isSpinning} style={{ padding: '12px 30px', borderRadius: '25px', background: '#eee', border: 'none', cursor: 'pointer' }}>开启盲盒</button>
      </div>

      {/* 结果弹窗 */}
      {showCard && (
        <div style={{ 
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          zIndex: 1000, width: '320px'
        }}>
          <h3 style={{ margin: '0 0 20px' }}>🎉 今天的幸运选择：</h3>
          <img 
            src={scratchImage} 
            alt={selectedFood} 
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px' }}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"; }}
          />
          <h2 style={{ fontSize: '28px', color: '#FFD161' }}>{selectedFood}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <button onClick={() => setShowCard(false)} style={{ padding: '12px', borderRadius: '20px', border: 'none', background: '#FFD161', color: 'white', fontWeight: 'bold' }}>确定</button>
            <button onClick={() => window.open(getDeliveryUrl(selectedFood), '_blank')} style={{ padding: '12px', borderRadius: '20px', border: '1px solid #FFD161', background: 'none' }}>去点美团外卖</button>
          </div>
        </div>
      )}

      {showScratch && !showCard && (
        <div 
          onClick={() => { setShowScratch(false); setShowCard(true); }} 
          style={{ cursor: 'pointer', background: '#FFF3D6', padding: '30px', borderRadius: '20px', marginTop: '20px', border: '2px dashed #FFD161' }}
        >
          🎁 点击打开盲盒，看看是什么！
        </div>
      )}
    </div>
  );
}