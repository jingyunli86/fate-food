'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  food: string;
  onClose: () => void;
}

export default function ResultModal({ food, onClose }: ResultModalProps) {
  useEffect(() => {
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
  }, []);

  const handleConfirm = () => {
    const searchUrl = `https://www.meituan.com/s/${encodeURIComponent(food)}`;
    window.open(searchUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-8 max-w-sm w-full mx-4 transform animate-in zoom-in duration-300">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">命运选择了</h2>
          <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent my-4">
            {food}
          </p>
          <p className="text-gray-500 text-sm mb-6">别看了，就是它了！</p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-300 transition"
            >
              换一个
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl text-white font-medium hover:shadow-lg transition"
            >
              就吃这个 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}