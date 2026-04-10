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
  "拉面": "/food/lamian.png",
  "泡面":"/food/paomian.png",
  "关东煮":"food/guandongzhu.png",
  "粥":"food/zhou.png",
  "馄饨":"food/huntun.png",
  "饺子":"food/jiaozi.png"

};

// 食物配置
const config = {
  brk: { name: "早餐", icon: "☀️", options: ["豆浆油条", "小笼包", "三明治", "麦芬", "饭团", "手抓饼", "煎饼果子", "胡辣汤"] },
  lun: { name: "午餐", icon: "🌞", options: ["台式卤肉饭", "东北菜", "寿司", "黄焖鸡", "麻辣烫", "拉面", "螺蛳粉", "汉堡"] },
  din: { name: "晚餐", icon: "🌙", options: ["火锅", "烧烤", "小龙虾", "披萨", "炸鸡", "烤鱼", "砂锅", "咖喱饭"] },
  night: { name: "深夜食堂", icon: "✨", options: ["烧烤", "小龙虾", "炸鸡", "泡面", "关东煮", "粥", "馄饨", "饺子"] }
};

type MealType = 'brk' | 'lun' | 'din' | 'night';

const getMealRemainingKey = (meal: MealType) => `remaining_${meal}`;
const getMealDateKey = (meal: MealType) => `date_${meal}`;

const getAllFoodOptions = () => {
  return [
    ...config.brk.options,
    ...config.lun.options,
    ...config.din.options,
    ...config.night.options
  ];
};

export default function FateFood() {
  const [meal, setMeal] = useState<MealType>('lun');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState("");
  const [totalDeg, setTotalDeg] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showBlindBox, setShowBlindBox] = useState(false);
  const [scratchImage, setScratchImage] = useState("");
  
  const [remainingSpins, setRemainingSpins] = useState<Record<MealType, number>>({
    brk: 2, lun: 2, din: 2, night: 2
  });
  
  const [blindBoxRemaining, setBlindBoxRemaining] = useState(3);
  const [cooldown, setCooldown] = useState(0);
  const [showPromise, setShowPromise] = useState(false);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [customBlacklist, setCustomBlacklist] = useState<string[]>([]);
  const [newBlacklistItem, setNewBlacklistItem] = useState('');     
  const [foodHistory, setFoodHistory] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  const colors = ['#FFF5E6', '#FFF0E0', '#FFEDD5', '#FFE8CC', '#FFE5C5', '#FFE2BF', '#FFDEB8', '#FFDBB2'];

  // 获取过滤后的选项
  const getFilteredOptions = () => {
    const allBlacklist = [...blacklist, ...customBlacklist];
    return config[meal].options.filter(opt => !allBlacklist.includes(opt));
  };
  
  const getBlindBoxOptions = () => {
    const allBlacklist = [...blacklist, ...customBlacklist];
    return getAllFoodOptions().filter(opt => !allBlacklist.includes(opt));
  };

  const currentOptions = getFilteredOptions();

  // Canvas绘制转盘
  useEffect(() => {
    const canvas = document.getElementById('wheelCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const options = getFilteredOptions();
    const count = options.length;
    if (count === 0) return;
    
    const angle = (Math.PI * 2) / count;
    const centerX = 140;
    const centerY = 140;
    const radius = 140;
    
    ctx.clearRect(0, 0, 280, 280);
    
    for (let i = 0; i < count; i++) {
      const startAngle = i * angle;
      const endAngle = (i + 1) * angle;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#E8D5B5';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const textAngle = startAngle + angle / 2;
      const textRadius = radius * 0.65;
      const x = centerX + Math.cos(textAngle) * textRadius;
      const y = centerY + Math.sin(textAngle) * textRadius;
      
      const text = options[i];
      const chars = text.split('');
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#A0784A';
      ctx.font = 'bold 14px "PingFang SC", "Microsoft YaHei"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const lineHeight = 18;
      const startY = -((chars.length - 1) * lineHeight) / 2;
      chars.forEach((char, idx) => {
        ctx.fillText(char, 0, startY + idx * lineHeight);
      });
      
      ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#F5E6D3';
    ctx.fill();
    ctx.strokeStyle = '#E8D5B5';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [meal, blacklist, customBlacklist]);

  // 初始化
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) setMeal('brk');
    else if (hour >= 10 && hour < 14) setMeal('lun');
    else if (hour >= 14 && hour < 21) setMeal('din');
    else setMeal('night');
    
    const today = new Date().toDateString();
    
    const savedBlacklist = localStorage.getItem('blacklist');
    if (savedBlacklist) setBlacklist(JSON.parse(savedBlacklist));
    const savedCustomBlacklist = localStorage.getItem('customBlacklist');
    if (savedCustomBlacklist) setCustomBlacklist(JSON.parse(savedCustomBlacklist));
    
    const newRemaining = { brk: 2, lun: 2, din: 2, night: 2 };
    (['brk', 'lun', 'din', 'night'] as MealType[]).forEach(m => {
      const savedDate = localStorage.getItem(getMealDateKey(m));
      if (savedDate === today) {
        const saved = localStorage.getItem(getMealRemainingKey(m));
        if (saved) newRemaining[m] = parseInt(saved);
      } else {
        newRemaining[m] = 2;
        localStorage.setItem(getMealRemainingKey(m), '2');
        localStorage.setItem(getMealDateKey(m), today);
      }
    });
    setRemainingSpins(newRemaining);
    
    const blindDate = localStorage.getItem('blindBox_date');
    if (blindDate === today) {
      const savedBlind = localStorage.getItem('blindBox_remaining');
      if (savedBlind) setBlindBoxRemaining(parseInt(savedBlind));
    } else {
      setBlindBoxRemaining(3);
      localStorage.setItem('blindBox_remaining', '3');
      localStorage.setItem('blindBox_date', today);
    }
  }, []);

  const getDeliveryUrl = (food: string) => {
    return `https://www.meituan.com/s?w=${encodeURIComponent(food)}`;
  };

  const spin = () => {
    if (isSpinning) return;
    if (cooldown > 0) return;
    if (remainingSpins[meal] <= 0) {
      alert(`🎯 今日${config[meal].name}的2次机会已用完！明天再来吧～`);
      return;
    }
    const currentOptions = getFilteredOptions();
    if (currentOptions.length === 0) {
      alert("🎯 你屏蔽了所有选项，先取消几个吧～");
      return;
    }
    setShowPromise(true);
  };

  const confirmSpin = () => {
    setShowPromise(false);
    const currentOptions = getFilteredOptions();
    const randomDeg = Math.floor(Math.random() * 360) + 3600;
    const newTotalDeg = totalDeg + randomDeg;
    
    setTotalDeg(newTotalDeg);
    setIsSpinning(true);
    setShowCard(false);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newTotalDeg % 360;
      const sectorDeg = 360 / currentOptions.length;
      let winningIndex = Math.floor((360 - actualDeg + (sectorDeg / 2)) % 360 / sectorDeg);
      const foodName = currentOptions[winningIndex % currentOptions.length];
      
      setSelectedFood(foodName);
      setScratchImage(foodImageDatabase[foodName] || "/food/default.png");
      
      const newRemaining = { ...remainingSpins };
      newRemaining[meal] = remainingSpins[meal] - 1;
      setRemainingSpins(newRemaining);
      localStorage.setItem(getMealRemainingKey(meal), newRemaining[meal].toString());
      
      setShowCard(true);
      setFoodHistory(prev => [foodName, ...prev].slice(0, 10));
      
      if (foodHistory.length >= 2 && !achievements.includes('🎖️ 连续2天')) {
        setAchievements(prev => [...prev, '🎖️ 连续2天']);
      }
    }, 4000);
  };

  const openBlindBox = () => {
    if (blindBoxRemaining <= 0) {
      alert("🎁 今日3次盲盒机会已用完！明天再来吧～");
      return;
    }
    setShowBlindBox(true);
  };

  const confirmBlindBox = () => {
    setShowBlindBox(false);
    const allOptions = getBlindBoxOptions();
    if (allOptions.length === 0) {
      alert("🎯 你屏蔽了所有选项，先取消几个吧～");
      return;
    }
    const luckyPick = allOptions[Math.floor(Math.random() * allOptions.length)];
    
    setSelectedFood(luckyPick);
    setScratchImage(foodImageDatabase[luckyPick] || "/food/default.png");
    
    const newRemaining = blindBoxRemaining - 1;
    setBlindBoxRemaining(newRemaining);
    localStorage.setItem('blindBox_remaining', newRemaining.toString());
    
    setShowCard(true);
    setFoodHistory(prev => [luckyPick, ...prev].slice(0, 10));
  };

  const toggleBlacklist = (food: string) => {
    let newBlacklist;
    if (blacklist.includes(food)) {
      newBlacklist = blacklist.filter(f => f !== food);
    } else {
      newBlacklist = [...blacklist, food];
    }
    setBlacklist(newBlacklist);
    localStorage.setItem('blacklist', JSON.stringify(newBlacklist));
  };
  
  const addCustomBlacklist = () => {
    const item = newBlacklistItem.trim();
    if (item === '') return;
    if (customBlacklist.includes(item)) {
      alert(`「${item}」已经在黑名单中`);
      return;
    }
    const newCustomList = [...customBlacklist, item];
    setCustomBlacklist(newCustomList);
    setNewBlacklistItem('');
    localStorage.setItem('customBlacklist', JSON.stringify(newCustomList));
  };
  
  const removeCustomBlacklist = (item: string) => {
    const newCustomList = customBlacklist.filter(i => i !== item);
    setCustomBlacklist(newCustomList);
    localStorage.setItem('customBlacklist', JSON.stringify(newCustomList));
  };
  
  const resetDaily = () => {
    const today = new Date().toDateString();
    const newRemaining = { brk: 2, lun: 2, din: 2, night: 2 };
    setRemainingSpins(newRemaining);
    setBlindBoxRemaining(3);
    setCooldown(0);
    (['brk', 'lun', 'din', 'night'] as MealType[]).forEach(m => {
      localStorage.setItem(getMealRemainingKey(m), '2');
      localStorage.setItem(getMealDateKey(m), today);
    });
    localStorage.setItem('blindBox_remaining', '3');
    localStorage.setItem('blindBox_date', today);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#FFF9F0',
      padding: '20px',
      fontFamily: "'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    }}>
      {/* 顶部状态栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#FFFFFF',
        borderRadius: '32px',
        padding: '16px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid #FFF0D0'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ background: '#FFF5E6', padding: '6px 14px', borderRadius: '40px', fontSize: '13px', fontWeight: '500', color: '#C47A2E' }}>
            🎡 {config[meal].name}剩余 {remainingSpins[meal]}/2
          </span>
          <span style={{ background: '#FFF5E6', padding: '6px 14px', borderRadius: '40px', fontSize: '13px', fontWeight: '500', color: '#C47A2E' }}>
            🎁 盲盒 {blindBoxRemaining}/3
          </span>
        </div>
        <button onClick={resetDaily} style={{ background: '#F5E6D3', border: 'none', padding: '8px 20px', borderRadius: '40px', fontWeight: '500', color: '#C47A2E', cursor: 'pointer' }}>
          🔄 重置
        </button>
      </div>

      {/* 时段切换 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        {(['brk', 'lun', 'din', 'night'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => {setMeal(m); setTotalDeg(0); setShowCard(false);}} 
            style={{ 
              padding: '10px 24px',
              borderRadius: '40px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px',
              background: meal === m ? '#F5E6D3' : '#FFFFFF',
              color: meal === m ? '#C47A2E' : '#8B7355',
              boxShadow: meal === m ? '0 2px 8px rgba(196,122,46,0.15)' : '0 2px 4px rgba(0,0,0,0.01)',
              border: meal === m ? '1px solid #E8D5B5' : '1px solid #F0E4D0'
            }}
          >
            {config[m].icon} {config[m].name}
          </button>
        ))}
      </div>

      {/* 标题 */}
      <h1 style={{ textAlign: 'center', color: '#C47A2E', fontSize: '28px', fontWeight: '600', marginBottom: '8px', letterSpacing: '-0.5px' }}>
        {config[meal].icon} 今天{config[meal].name}？
      </h1>
      <p style={{ textAlign: 'center', color: '#B8956A', fontSize: '14px', marginBottom: '32px' }}>
        {cooldown > 0 ? `⏳ 冷却中 ${cooldown}秒` : '转动转盘，接受命运的安排'}
      </p>

      {/* 转盘区域 - Canvas版本 */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '48px',
        padding: '30px 20px',
        margin: '0 auto 30px',
        maxWidth: '380px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        border: '1px solid #F0E4D0'
      }}>
        <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto' }}>
          {/* 顶部指针 */}
          <div style={{ 
            position: 'absolute', 
            top: '-30px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '16px solid transparent',
            borderRight: '16px solid transparent',
            borderTop: '40px solid #E8B860',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            zIndex: 10
          }} />
          <div style={{ 
            position: 'absolute', 
            top: '-38px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: '12px',
            height: '12px',
            background: '#D4A050',
            borderRadius: '50%',
            zIndex: 11
          }} />
          
          {/* Canvas转盘 */}
          <canvas
            id="wheelCanvas"
            width="280"
            height="280"
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              border: '3px solid #E8D5B5',
              transition: 'transform 4s cubic-bezier(0.2, 0.9, 0.3, 1.1)',
              transform: `rotate(${totalDeg}deg)`
            }}
          />
        </div>
      </div>

      {/* 按钮区 */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '30px' }}>
        <button 
          onClick={spin} 
          disabled={isSpinning || remainingSpins[meal] <= 0 || cooldown > 0} 
          style={{ 
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '48px',
            border: 'none',
            background: remainingSpins[meal] <= 0 || cooldown > 0 ? '#E8E0D5' : '#F5E6D3',
            color: remainingSpins[meal] <= 0 || cooldown > 0 ? '#B8A088' : '#C47A2E',
            cursor: 'pointer',
            boxShadow: remainingSpins[meal] <= 0 || cooldown > 0 ? 'none' : '0 4px 12px rgba(196,122,46,0.2)'
          }}
        >
          🎡 转转盘
        </button>
        
        <button 
          onClick={openBlindBox} 
          disabled={blindBoxRemaining <= 0}
          style={{ 
            padding: '14px 36px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '48px',
            border: 'none',
            background: blindBoxRemaining <= 0 ? '#E8E0D5' : '#F0DCC0',
            color: blindBoxRemaining <= 0 ? '#B8A088' : '#C47A2E',
            cursor: 'pointer',
            boxShadow: blindBoxRemaining <= 0 ? 'none' : '0 4px 12px rgba(196,122,46,0.2)'
          }}
        >
          🎁 盲盒 ({blindBoxRemaining}/3)
        </button>
      </div>

      {/* 黑名单 - 增强版 */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '32px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        border: '1px solid #F0E4D0'
      }}>
        <p style={{ color: '#B8956A', fontSize: '13px', marginBottom: '12px', fontWeight: '500' }}>
          🚫 不想吃什么？点一下屏蔽（食材可多选）
        </p>
        
        {/* 预设标签 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#C47A2E', marginBottom: '8px' }}>📌 常见忌口</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['香菜', '紫菜', '芹菜', '洋葱', '折耳根', '大蒜'].map(food => (
              <button
                key={food}
                onClick={() => toggleBlacklist(food)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '40px',
                  border: 'none',
                  background: blacklist.includes(food) ? '#E8D5B5' : '#FFF5E6',
                  color: blacklist.includes(food) ? '#A0784A' : '#C47A2E',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {blacklist.includes(food) ? `✓ ${food}` : food}
              </button>
            ))}
          </div>
        </div>
        
        {/* 当前时段食物屏蔽 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#C47A2E', marginBottom: '8px' }}>
            🍽️ 当前{config[meal].name}选项
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {config[meal].options.map(food => (
              <button
                key={food}
                onClick={() => toggleBlacklist(food)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '40px',
                  border: 'none',
                  background: blacklist.includes(food) ? '#E8D5B5' : '#F0E4D0',
                  color: blacklist.includes(food) ? '#A0784A' : '#8B7355',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {blacklist.includes(food) ? `✓ ${food}` : food}
              </button>
            ))}
          </div>
        </div>
        
        {/* 自定义黑名单 */}
        <div style={{ borderTop: '1px dashed #F0E4D0', paddingTop: '12px' }}>
          <div style={{ fontSize: '12px', color: '#C47A2E', marginBottom: '8px' }}>
            ✏️ 自定义屏蔽（输入后永久屏蔽）
          </div>
          
          {customBlacklist.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {customBlacklist.map(item => (
                <span
                  key={item}
                  style={{
                    background: '#E8D5B5',
                    padding: '4px 12px',
                    borderRadius: '40px',
                    fontSize: '12px',
                    color: '#A0784A',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🚫 {item}
                  <button
                    onClick={() => removeCustomBlacklist(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#A0784A',
                      padding: '0 4px'
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newBlacklistItem}
              onChange={(e) => setNewBlacklistItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomBlacklist()}
              placeholder="输入要屏蔽的食物，如：苦瓜"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '40px',
                border: '1px solid #F0E4D0',
                background: '#FFFCF8',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={addCustomBlacklist}
              style={{
                padding: '8px 20px',
                borderRadius: '40px',
                border: 'none',
                background: '#F5E6D3',
                color: '#C47A2E',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              添加
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#B8A088', marginTop: '8px' }}>
            💡 提示：自定义屏蔽会全局生效，可点击 ✕ 移除
          </p>
        </div>
      </div>

      {/* 心理契约弹窗 */}
      {showPromise && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '48px', padding: '32px 28px', textAlign: 'center', width: '280px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📜</div>
            <h3 style={{ color: '#C47A2E', marginBottom: '16px' }}>命运契约</h3>
            <p style={{ color: '#8B7355', marginBottom: '24px', fontSize: '14px', lineHeight: 1.5 }}>
              我承诺：无论抽中什么，<br/>我都接受命运的安排！
            </p>
            <button onClick={confirmSpin} style={{ padding: '12px 32px', background: '#F5E6D3', border: 'none', borderRadius: '40px', fontWeight: '600', color: '#C47A2E', cursor: 'pointer' }}>✅ 我接受</button>
          </div>
        </div>
      )}

      {/* 盲盒弹窗 */}
      {showBlindBox && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '48px', padding: '32px 28px', textAlign: 'center', width: '280px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎁</div>
            <h3 style={{ color: '#C47A2E' }}>盲盒惊喜</h3>
            <p style={{ color: '#8B7355', margin: '16px 0', fontSize: '13px' }}>剩余 {blindBoxRemaining}/3 次</p>
            <button onClick={confirmBlindBox} style={{ padding: '12px 32px', background: '#F5E6D3', border: 'none', borderRadius: '40px', fontWeight: '600', color: '#C47A2E', cursor: 'pointer' }}>✨ 开启 ✨</button>
          </div>
        </div>
      )}

     
      {/* 结果卡片 */}
{showCard && (
  <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#FFFFFF', borderRadius: '48px', padding: '24px 20px', boxShadow: '0 30px 50px rgba(0,0,0,0.2)', zIndex: 1000, width: '340px', textAlign: 'center' }}>
    <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
    <h3 style={{ color: '#B8956A', marginBottom: '8px', fontSize: '14px' }}>命运决定：</h3>
    <h2 style={{ fontSize: '28px', color: '#C47A2E', marginBottom: '12px' }}>{selectedFood}</h2>
    <img 
      src={scratchImage} 
      alt={selectedFood} 
      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50px', margin: '0 auto 16px', border: '4px solid #F0E4D0' }}
      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"; }}
    />
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* 双平台并排按钮 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* 美团按钮 - 直接唤起App */}
        <button 
          onClick={() => {
            const food = selectedFood;
            // 先复制食物名称到剪贴板
            navigator.clipboard.writeText(food);
            
            // 检测是否为手机
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
              // 美团外卖URL Scheme（直接搜索）
              const meituanScheme = `meituanwaimai://search?keyword=${encodeURIComponent(food)}`;
              const meituanFallback = `meituan://www.meituan.com/search?keyword=${encodeURIComponent(food)}`;
              
              // 尝试唤起美团App
              window.location.href = meituanScheme;
              
              // 2秒后如果还在页面，尝试备用scheme或跳转下载页
              setTimeout(() => {
                window.location.href = meituanFallback;
              }, 1500);
              
              setTimeout(() => {
                window.location.href = 'https://m.meituan.com';
              }, 3000);
            } else {
              window.open(`https://www.meituan.com/s?w=${encodeURIComponent(food)}`, '_blank');
            }
            
            // 提示已复制
            alert(`已复制「${food}」到剪贴板，正在打开美团...`);
          }} 
          style={{ flex: 1, padding: '12px 0', borderRadius: '48px', border: 'none', background: '#F5E6D3', fontWeight: '600', cursor: 'pointer', fontSize: '14px', color: '#C47A2E' }}
        >
          🍔 美团
        </button>
        
        {/* 淘宝/饿了么按钮 - 直接唤起淘宝App */}
        <button 
          onClick={() => {
            const food = selectedFood;
            // 先复制食物名称到剪贴板
            navigator.clipboard.writeText(food);
            
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
              // 淘宝URL Scheme（直接搜索）
              const taobaoScheme = `tbopen://m.taobao.com/tbopen/index.html?h5Url=https://s.taobao.com/search?q=${encodeURIComponent(food)}`;
              const elemeScheme = `eleme://search?keyword=${encodeURIComponent(food)}`;
              
              // 尝试唤起淘宝/饿了么
              window.location.href = taobaoScheme;
              
              // 1.5秒后尝试饿了么
              setTimeout(() => {
                window.location.href = elemeScheme;
              }, 1500);
              
              // 3秒后跳转网页版
              setTimeout(() => {
                window.location.href = `https://s.taobao.com/search?q=${encodeURIComponent(food)}`;
              }, 3000);
            } else {
              window.open(`https://s.taobao.com/search?q=${encodeURIComponent(food)}`, '_blank');
            }
            
            alert(`已复制「${food}」到剪贴板，正在打开淘宝...`);
          }} 
          style={{ flex: 1, padding: '12px 0', borderRadius: '48px', border: 'none', background: '#E8F5E9', fontWeight: '600', cursor: 'pointer', fontSize: '14px', color: '#4CAF50' }}
        >
          🛵 饿了么/淘宝
        </button>
      </div>
      
      {/* 复制名称按钮 */}
      <button 
        onClick={() => {
          navigator.clipboard.writeText(selectedFood);
          alert(`已复制「${selectedFood}」到剪贴板，可打开外卖App手动搜索`);
        }} 
        style={{ padding: '12px', borderRadius: '48px', border: '1px solid #E8D5B5', background: '#FFFFFF', fontWeight: '500', cursor: 'pointer', fontSize: '13px', color: '#B8956A' }}
      >
        📋 复制名称
      </button>
      
      {/* 收起按钮 */}
      <button 
        onClick={() => setShowCard(false)} 
        style={{ padding: '12px', borderRadius: '48px', border: 'none', background: 'transparent', color: '#B8A088', cursor: 'pointer', fontSize: '13px' }}
      >
        收起
      </button>
    </div>
    </div>
    )
    }
     {/* 成就 */}
      {achievements.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', background: '#FFFFFF', padding: '8px 18px', borderRadius: '40px', fontSize: '12px', color: '#C47A2E', fontWeight: '500', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F0E4D0' }}>
          {achievements.join(' ')}
        </div>
      )}
    </div>
  );
}
