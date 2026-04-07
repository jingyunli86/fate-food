'use client';

import { useState, useEffect } from 'react';
import { getBlacklist, removeFromBlacklist, foodDatabase } from '@/lib/foods';

interface BlacklistProps {
  onClose: () => void;
}

export default function Blacklist({ onClose }: BlacklistProps) {
  const [blacklist, setBlacklist] = useState<string[]>([]);

  useEffect(() => {
    setBlacklist(getBlacklist());
  }, []);

  const handleRemove = (food: string) => {
    removeFromBlacklist(food);
    setBlacklist(getBlacklist());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🚫 黑名单</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">×</button>
        </div>
        
        <p className="text-gray-500 text-sm mb-4">这些食物不会再出现在转盘中</p>
        
        {blacklist.length === 0 ? (
          <p className="text-center text-gray-400 py-8">暂无黑名单，什么都可以吃～</p>
        ) : (
          <div className="space-y-2">
            {blacklist.map((food) => (
              <div key={food} className="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3">
                <span className="text-gray-800">{food}</span>
                <button
                  onClick={() => handleRemove(food)}
                  className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition"
                >
                  解除
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg transition"
        >
          完成
        </button>
      </div>
    </div>
  );
}