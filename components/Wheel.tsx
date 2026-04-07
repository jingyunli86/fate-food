'use client';

import { useState } from 'react';
import { getCurrentMealTime, getAvailableFoods, spinWheel } from '@/lib/foods';
import confetti from 'canvas-confetti';

interface WheelProps {
  onResult: (food: string) => void;
}

export default function Wheel({ onResult }: WheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [currentMeal] = useState(getCurrentMealTime());

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    setTimeout(() => {
      const result = spinWheel(currentMeal);
      setSpinning(false);
      onResult(result);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 800);
  };

  const foods = getAvailableFoods(currentMeal);
  const mealNames = {
    breakfast: '🌅 早餐',
    lunch: '☀️ 午餐',
    dinner: '🌙 晚餐',
    lateNight: '🌃 深夜食堂'
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <span className="text-2xl font-bold bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm">
          {mealNames[currentMeal]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md">
        {foods.slice(0, 6).map((food, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center text-white font-medium"
          >
            {food}
          </div>
        ))}
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className={`
          mt-4 px-12 py-4 text-xl font-bold rounded-full
          transition-all duration-200 transform active:scale-95
          ${spinning 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg hover:shadow-pink-500/30'
          }
          text-white shadow-lg
        `}
      >
        {spinning ? '🎡 命运转动中...' : '🎲 开始转盘'}
      </button>

      {foods.length === 0 && (
        <p className="text-red-300 text-sm mt-4">
          ⚠️ 当前时段所有食物都被屏蔽了，请解除黑名单
        </p>
      )}
    </div>
  );
}