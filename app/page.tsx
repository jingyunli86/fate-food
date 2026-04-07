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
  "拉面": "/food/lamian.png" 
};

const config = {
  brk: { name: "☀️ 早餐", options: ["豆浆油条", "小笼包", "三明治", "麦芬", "饭团", "手抓饼", "煎饼果子", "胡辣汤"] },
  lun: { name: "🌞 午餐", options: ["台式卤肉饭", "东北菜", "寿司", "黄焖鸡", "麻辣烫", "拉面", "螺蛳粉", "汉堡"] },
  din: { name: "🌙 晚餐", options: ["火锅", "烧烤", "小龙虾", "披萨", "炸鸡", "烤鱼", "砂锅", "咖喱饭"] },
  night: { name: "✨ 深夜食堂", options: ["烧烤", "小龙虾", "炸鸡", "泡面", "关东煮", "粥", "馄饨", "饺子"] }
};

type MealType = 'brk' | 'lun' | 'din' | 'night';

export default function FateFood() {
  const [meal, setMeal] = useState<MealType>('lun');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState("");
  const [totalDeg, setTotalDeg] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [showBlindBox, setShowBlindBox] = useState(false);
  const [scratchImage, setScratchImage] = useState("");
  
  // 核心状态：剩余抽取次数（每餐2次）
  const [remainingSpins, setRemainingSpins] = useState(2);
  const [hasUsedToday, setHasUsedToday] = useState(false);
  const [willPower, setWillPower] = useState(3);
  const [cooldown, setCooldown] = useState(0);
  const [showPromise, setShowPromise] = useState(false);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [foodHistory, setFoodHistory] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [currentSpinCount, setCurrentSpinCount] = useState(0);

  // 初始化：根据日期重置
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) setMeal('brk');
    else if (hour >= 10 && hour < 14) setMeal('lun');
    else if (hour >= 14 && hour < 21) setMeal('din');
    else setMeal('night');
    
    const lastUsed = localStorage.getItem('lastUsedDate');
    const today = new Date().toDateString();
    if (lastUsed === today) {
      setHasUsedToday(true);
      // 如果今天已用过，恢复剩余次数
      const savedRemaining = localStorage.getItem('remainingSpins');
      if (savedRemaining) setRemainingSpins(parseInt(savedRemaining));
    } else {
      // 新的一天，重置次数
      setRemainingSpins(2);
      setCurrentSpinCount(0);
    }
  }, []);

  const getDeliveryUrl = (food: string) => {
    return `https://i.meituan.com/s/?w=${encodeURIComponent(food)}`;
  };

  const getFilteredOptions = () => {
    return config[meal].options.filter(opt => !blacklist.includes(opt));
  };

  const spin = () => {
    if (isSpinning || hasUsedToday) return;
    if (cooldown > 0) return;
    if (remainingSpins <= 0) {
      alert("🎯 今天的2次机会已用完！明天再来吧～");
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
    setShowBlindBox(false);

    setTimeout(() => {
      setIsSpinning(false);
      const actualDeg = newTotalDeg % 360;
      const sectorDeg = 360 / currentOptions.length;
      let winningIndex = Math.floor((360 - actualDeg + (sectorDeg / 2)) % 360 / sectorDeg);
      const foodName = currentOptions[winningIndex % currentOptions.length];
      
      setSelectedFood(foodName);
      setScratchImage(foodImageDatabase[foodName] || "/food/default.png");
      
      // 扣减次数
      const newRemaining = remainingSpins - 1;
      setRemainingSpins(newRemaining);
      setCurrentSpinCount(prev => prev + 1);
      
      // 保存到本地
      localStorage.setItem('remainingSpins', newRemaining.toString());
      localStorage.setItem('lastUsedDate', new Date().toDateString());
      
      setShowCard(true);
      setFoodHistory(prev => [foodName, ...prev].slice(0, 10));
      
      // 如果这是第2次抽取，标记今日已用完
      if (newRemaining === 0) {
        setHasUsedToday(true);
      }
      
      // 成就检查
      if (foodHistory.length >= 2 && !achievements.includes('🎖️ 连续2天')) {
        setAchievements(prev => [...prev, '🎖️ 连续2天']);
      }
    }, 4000);
  };

  // 反悔：消耗意志力，获得额外一次机会（仅在第1次抽取后可用）
  const regret = () => {
    if (willPower <= 0) {
      alert("💪 意志力耗尽！接受命运的安排吧～");
      return;
    }
    
    // 如果是第1次抽取，反悔后增加1次机会（相当于回到未抽状态）
    if (currentSpinCount === 1 && remainingSpins === 1) {
      setWillPower(prev => prev - 1);
      setCooldown(5);
      setShowCard(false);
      
      // 恢复次数（实际上相当于重新获得一次机会）
      setRemainingSpins(2);
      setCurrentSpinCount(0);
      localStorage.setItem('remainingSpins', '2');
      
      const timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      alert(`⚡ 消耗1点意志力！\n\n获得一次重新抽取的机会～\n剩余意志力：${willPower - 1}`);
      return;
    }
    
    // 如果是第2次抽取，不可反悔
    if (currentSpinCount === 2 || remainingSpins === 0) {
      alert("🔒 这是今天的最后一次抽取，结果已锁定！");
      return;
    }
  };

  const openBlindBox = () => {
    if (hasUsedToday && remainingSpins === 0) {
      alert("🎁 今日机会已用完，明天再来吧～");
      return;
    }
    setShowBlindBox(true);
  };

  const confirmBlindBox = () => {
    setShowBlindBox(false);
    const allOptions = [...config.brk.options, ...config.lun.options, ...config.din.options, ...config.night.options];
    const filtered = allOptions.filter(opt => !blacklist.includes(opt));
    const luckyPick = filtered[Math.floor(Math.random() * filtered.length)];
    
    setSelectedFood(luckyPick);
    setScratchImage(foodImageDatabase[luckyPick] || "/food/default.png");
    
    // 盲盒消耗一次机会
    const newRemaining = remainingSpins - 1;
    setRemainingSpins(newRemaining);
    setCurrentSpinCount(prev => prev + 1);
    localStorage.setItem('remainingSpins', newRemaining.toString());
    localStorage.setItem('lastUsedDate', new Date().toDateString());
    
    setShowCard(true);
    setFoodHistory(prev => [luckyPick, ...prev].slice(0, 10));
    
    if (newRemaining === 0) {
      setHasUsedToday(true);
    }
  };

  const toggleBlacklist = (food: string) => {
    if (blacklist.includes(food)) {
      setBlacklist(prev => prev.filter(f => f !== food));
    } else {
      setBlacklist(prev => [...prev, food]);
    }
  };

  const resetDaily = () => {
    setHasUsedToday(false);
    setRemainingSpins(2);
    setCurrentSpinCount(0);
    setWillPower(3);
    setCooldown(0);
    localStorage.removeItem('lastUsedDate');
    localStorage.removeItem('remainingSpins');
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '16px', 
      minHeight: '100vh', 
      fontFamily: "'Poppins', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      background: 'linear-gradient(135deg, #FF6B35 0%, #FF3B6F 100%)',
    }}>
      {/* 多巴胺装饰 */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', width: '60px', height: '60px', borderRadius: '50%', background: '#F7C548', opacity: 0.4, filter: 'blur(20px)' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '3%', width: '80px', height: '80px', borderRadius: '50%', background: '#FF3B6F', opacity: 0.3, filter: 'blur(25px)' }} />
      <div style={{ position: 'fixed', top: '30%', right: '10%', width: '40px', height: '40px', borderRadius: '50%', background: '#F7C548', opacity: 0.5, filter: 'blur(15px)' }} />

      {/* 顶部状态栏 */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 20px', background: 'rgba(255,255,255,0.25)', borderRadius: '60px',
        marginBottom: '25px', backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>💪 意志力 {willPower}</span>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>
          🎡 剩余 {remainingSpins}/2 次
        </span>
        <button onClick={resetDaily} style={{ padding: '6px 16px', borderRadius: '40px', border: 'none', background: '#F7C548', fontWeight: 'bold', cursor: 'pointer', color: '#333' }}>
          🔄 重置
        </button>
      </div>

      {/* 时段切换 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
        {(['brk', 'lun', 'din', 'night'] as const).map(m => (
          <button 
            key={m} 
            onClick={() => {setMeal(m); setTotalDeg(0); setShowCard(false);}} 
            style={{ 
              padding: '8px 22px', borderRadius: '40px', border: 'none', 
              cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
              background: meal === m ? '#F7C548' : 'rgba(255,255,255,0.35)',
              color: meal === m ? '#333' : '#fff',
              backdropFilter: 'blur(5px)',
              boxShadow: meal === m ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            {config[m].name}
          </button>
        ))}
      </div>

      <h1 style={{ color: '#fff', textShadow: '3px 3px 0 rgba(0,0,0,0.15)', marginBottom: '8px', fontSize: '2rem' }}>
        🎡 今天吃什么？
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '30px', fontSize: '14px', fontWeight: '500' }}>
        {hasUsedToday && remainingSpins === 0 ? '✅ 今日2次机会已用完，明天再来～' : cooldown > 0 ? `⏳ 冷却中 ${cooldown}秒` : `🎯 还剩 ${remainingSpins} 次机会`}
      </p>

      {/* 转盘 */}
      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '42px', zIndex: 10 }}>🎯</div>
        <div style={{ 
          width: '100%', height: '100%', borderRadius: '50%', border: '6px solid #F7C548',
          position: 'relative', overflow: 'hidden', backgroundColor: '#fff',
          transition: 'transform 4s cubic-bezier(0.2, 0.9, 0.3, 1.1)',
          transform: `rotate(${totalDeg}deg)`,
          boxShadow: '0 20px 35px rgba(0,0,0,0.25)'
        }}>
          {getFilteredOptions().map((option, i) => {
            const count = getFilteredOptions().length;
            const angle = 360 / count;
            const colors = ['#FF6B35', '#FF3B6F', '#F7C548', '#FF8C42', '#FF5E7E', '#FFD166', '#FF9A5A', '#FF6F91'];
            return (
              <div key={i} style={{
                position: 'absolute', width: '50%', height: '1px',
                top: '50%', left: '50%', transformOrigin: 'left center',
                transform: `rotate(${i * angle - 90}deg)`
              }}>
                <div style={{
                  position: 'absolute', left: '25px', top: '-14px',
                  background: colors[i % colors.length],
                  padding: '4px 10px', borderRadius: '30px',
                  fontSize: '11px', fontWeight: 'bold', color: '#fff',
                  whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  {option}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 按钮区 */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={spin} 
          disabled={isSpinning || (hasUsedToday && remainingSpins === 0) || cooldown > 0} 
          style={{ 
            padding: '14px 38px', fontSize: '18px', borderRadius: '50px', 
            background: (hasUsedToday && remainingSpins === 0) || cooldown > 0 ? '#B0A0B0' : '#FF6B35',
            border: 'none', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 6px 0 #C0411A', transform: 'translateY(-2px)',
            color: '#fff'
          }}
        >
          🎡 转转盘 ({remainingSpins}/2)
        </button>
        
        <button 
          onClick={openBlindBox} 
          disabled={hasUsedToday && remainingSpins === 0}
          style={{ 
            padding: '14px 38px', fontSize: '18px', borderRadius: '50px', 
            background: (hasUsedToday && remainingSpins === 0) ? '#B0A0B0' : '#FF3B6F',
            border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#fff',
            boxShadow: '0 6px 0 #B71C4C', transform: 'translateY(-2px)'
          }}
        >
          🎁 盲盒
        </button>
      </div>

      {/* 黑名单 */}
      <div style={{ marginTop: '35px', padding: '15px', background: 'rgba(255,255,255,0.2)', borderRadius: '30px', backdropFilter: 'blur(10px)', width: '90%', margin: '35px auto 0' }}>
        <p style={{ color: '#fff', marginBottom: '12px', fontWeight: 'bold' }}>🚫 点一下，屏蔽不想吃的</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {config[meal].options.slice(0, 8).map(food => (
            <button
              key={food}
              onClick={() => toggleBlacklist(food)}
              style={{
                padding: '6px 14px', borderRadius: '30px', border: 'none',
                background: blacklist.includes(food) ? '#FF3B6F' : '#F7C548',
                color: blacklist.includes(food) ? '#fff' : '#333',
                fontSize: '12px', cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {blacklist.includes(food) ? `✓ ${food}` : food}
            </button>
          ))}
        </div>
      </div>

      {/* 心理契约弹窗 */}
      {showPromise && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #FF6B35, #FF3B6F)', borderRadius: '50px', padding: '35px 25px', textAlign: 'center', width: '290px' }}>
            <div style={{ fontSize: '56px', marginBottom: '10px' }}>📜</div>
            <h3 style={{ color: '#fff' }}>⚡ 多巴胺契约 ⚡</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '15px 0', fontSize: '14px' }}>
              我承诺：无论抽中什么，<br/>我都接受命运的安排！
            </p>
            <button onClick={confirmSpin} style={{ padding: '12px 35px', background: '#F7C548', border: 'none', borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer' }}>✅ 我接受</button>
          </div>
        </div>
      )}

      {/* 盲盒弹窗 */}
      {showBlindBox && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #FF3B6F, #F7C548)', borderRadius: '50px', padding: '40px 25px', textAlign: 'center', width: '290px' }}>
            <div style={{ fontSize: '64px', marginBottom: '10px' }}>🎁</div>
            <h3 style={{ color: '#fff' }}>盲盒惊喜</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '15px 0' }}>消耗1次机会，跨时段随机抽取</p>
            <button onClick={confirmBlindBox} style={{ padding: '12px 35px', background: '#fff', border: 'none', borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer', color: '#FF3B6F' }}>✨ 开启 ✨</button>
          </div>
        </div>
      )}

      {/* 结果卡片 */}
      {showCard && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '50px', padding: '30px 20px', boxShadow: '0 30px 50px rgba(0,0,0,0.4)', zIndex: 1000, width: '320px', textAlign: 'center' }}>
          <div style={{ fontSize: '52px' }}>🎉</div>
          <h3 style={{ color: '#FF6B35', margin: '0 0 8px' }}>命运决定：</h3>
          <h2 style={{ fontSize: '34px', color: '#FF3B6F', margin: '5px 0' }}>{selectedFood}</h2>
          <img 
            src={scratchImage} 
            alt={selectedFood} 
            style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '50%', margin: '15px auto', border: '5px solid #F7C548' }}
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"; }}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
            <button 
              onClick={() => window.open(getDeliveryUrl(selectedFood), '_blank')} 
              style={{ padding: '14px', borderRadius: '50px', border: 'none', background: '#FF6B35', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', color: '#fff', boxShadow: '0 4px 0 #C0411A' }}
            >
              🍔 去美团下单
            </button>
            
            {remainingSpins > 0 && currentSpinCount === 1 && willPower > 0 && (
              <button 
                onClick={regret} 
                style={{ padding: '12px', borderRadius: '50px', border: 'none', background: '#F7C548', color: '#333', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
              >
                😤 我不吃这个（消耗1意志力，再抽一次）
              </button>
            )}
            
            <button 
              onClick={() => setShowCard(false)} 
              style={{ padding: '10px', borderRadius: '50px', border: 'none', background: 'transparent', color: '#999', cursor: 'pointer', fontSize: '12px' }}
            >
              收起
            </button>
          </div>
        </div>
      )}

      {/* 成就 */}
      {achievements.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.65)', padding: '8px 18px', borderRadius: '30px', fontSize: '12px', color: '#F7C548', fontWeight: 'bold' }}>
          {achievements.join(' ')}
        </div>
      )}
    </div>
  );
}