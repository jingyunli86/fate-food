"use client";
import React, { useState } from 'react';

// --- 1. 图片数据库：严格对应你的 public/food 文件夹 ---
const foodImageDatabase: Record<string, string> = {
  "台式卤肉饭": "/food/luroufan.png",
  "东北菜": "/food/dongbeicai.png",
  "寿司": "/food/shousi.png",
  "黄焖鸡": "/food/huangmenji.png",
  "麻辣烫": "/food/malatang.png",
  "汉堡": "/food/hanbao.png",
  "饭团": "/food/fantuan.png",
  "手抓饼": "/food/shouzhuabing.png", 
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
  "拉面": "/food/lamian.png" 
};

const config = {
  brk: { options: ["豆浆油条", "小笼包", "三明治", "麦芬", "饭团", "手抓饼", "煎饼果子", "胡辣汤"] },
  lun: { options: ["台式卤肉饭", "东北菜", "寿司", "黄焖鸡", "麻辣烫", "拉面", "螺蛳粉", "汉堡"] },
  din: { options: ["火锅", "烧烤", "小龙虾", "披萨", "炸鸡", "烤鱼", "砂锅", "咖喱饭"] }
};

export default function FateFood() {
  const [meal, setMeal] = useState<'brk' | 'lun' | 'din'>('lun');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState("");
  const [totalDeg, setTotalDeg] = useState(0); 
  const [showCard, setShowCard] = useState(false);
  const [showScratch, setShowScratch] = useState(false);
  const [scratchImage, setScratchImage] = useState("");

  // ✅ 修复 1：美团跳转链接改为更通用的 H5 接口，解决 AppKey 报错
  const getDeliveryUrl = (food: string) => {
    return `https://i.meituan.com/s/?w=${encodeURIComponent(food)}`;
  };

  const spin = () => {
    if (isSpinning) return;
    const currentOptions = config[meal].options;
    const randomDeg = Math.floor(Math.random() * 360) + 3600; // 增加圈数，更稳健
    const newTotalDeg = totalDeg + randomDeg;
    
    setTotalDeg(newTotalDeg);
    setIsSpinning(true);
    setShowCard(false);
    setShowScratch(false);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newTotalDeg % 360;
      const sectorDeg = 360 / currentOptions.length;
      // 算法修正：考虑指针位置
      let winningIndex = Math.floor((360 - actualDeg + (sectorDeg / 2)) % 360 / sectorDeg);
      const foodName = currentOptions[winningIndex % currentOptions.length];
      
      setSelectedFood(foodName);
      setScratchImage(foodImageDatabase[foodName] || "/food/default.png");
      setShowCard(true);
    }, 4000);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* 顶部切换按钮 */}
      <div style={{ marginBottom: '20px' }}>
        {(['brk', 'lun', 'din'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => {setMeal(m); setTotalDeg(0); setShowCard(false);}} 
            style={{ 
              margin: '5px', padding: '10px 20px', borderRadius: '20px', border: 'none', 
              cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: meal === m ? '#FFD161' : '#eee',
              color: meal === m ? '#000' : '#666'
            }}
          >
            {m === 'brk' ? '早餐' : m === 'lun' ? '午餐' : '晚餐'}
          </button>
        ))}
      </div>

      <h1 style={{ color: '#333' }}>今天{meal === 'lun' ? '午餐' : meal === 'brk' ? '早餐' : '晚餐'}吃啥？</h1>

      {/* ✅ 修复 2：转盘文字渲染逻辑优化 */}
      <div style={{ position: 'relative', width: '340px', height: '340px', margin: '40px auto' }}>
        {/* 指针 */}
        <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', fontSize: '40px', zIndex: 10 }}>📍</div>
        
        {/* 转盘主体 */}
        <div style={{ 
          width: '100%', height: '100%', borderRadius: '50%', border: '10px solid #FFD161',
          position: 'relative', overflow: 'hidden', backgroundColor: '#fff',
          transition: 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)',
          transform: `rotate(${totalDeg}deg)`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          {config[meal].options.map((option, i) => {
            const count = config[meal].options.length;
            const angle = 360 / count;
            return (
              <div key={i} style={{
                position: 'absolute', width: '50%', height: '1px', backgroundColor: '#FFD161',
                top: '50%', left: '50%', transformOrigin: 'left center',
                transform: `rotate(${i * angle - 90}deg)` // 调整起始位置
              }}>
                <span style={{ 
                  position: 'absolute', left: '30px', top: '0', width: '120px', textAlign: 'right',
                  transform: `rotate(${angle / 2}deg) translateY(-50%)`, // 文字居中
                  fontSize: '14px', fontWeight: 'bold', color: '#444',
                  display: 'block', paddingRight: '10px'
                }}>
                  {option}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={spin} 
        disabled={isSpinning} 
        style={{ 
          padding: '15px 50px', fontSize: '20px', borderRadius: '40px', 
          backgroundColor: '#FFD161', border: 'none', fontWeight: 'bold',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 0 #e6b800'
        }}
      >
        {isSpinning ? '旋转中...' : '开始抽取'}
      </button>

      {/* 结果卡片 */}
      {showCard && (
        <div style={{ 
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'white', padding: '30px', borderRadius: '30px', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)', zIndex: 1000, width: '300px'
        }}>
          <h3 style={{ margin: '0 0 15px', color: '#666' }}>🎉 结果是：</h3>
          <h2 style={{ fontSize: '32px', color: '#FFD161', margin: '10px 0' }}>{selectedFood}</h2>
          <img 
            src={scratchImage} 
            alt={selectedFood} 
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '20px', margin: '10px 0' }}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"; }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
            <button onClick={() => window.open(getDeliveryUrl(selectedFood), '_blank')} style={{ padding: '12px', borderRadius: '25px', border: 'none', background: '#FFD161', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>去美团点外卖</button>
            <button onClick={() => setShowCard(false)} style={{ padding: '10px', borderRadius: '25px', border: 'none', background: '#f0f0f0', color: '#666', cursor: 'pointer' }}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}