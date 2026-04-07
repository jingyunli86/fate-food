export const foodDatabase = {
    breakfast: ['🥐 可颂', '🥣 燕麦', '🍳 煎蛋', '🥑 吐司', '🥛 酸奶'],
    lunch: ['🍱 日式便当', '🍜 牛肉面', '🥗 沙拉', '🍛 咖喱饭', '🌯 卷饼'],
    dinner: ['🍲 火锅', '🍕 披萨', '🍣 寿司', '🍝 意面', '🥘 炖菜'],
    lateNight: ['🍜 泡面', '🍗 炸鸡', '🥟 饺子', '🍢 关东煮', '🍺 小酒']
  };
  
  export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'lateNight';
  
  export function getCurrentMealTime(): MealTime {
    const hour = new Date().getHours();
    if (hour < 10) return 'breakfast';
    if (hour < 14) return 'lunch';
    if (hour < 21) return 'dinner';
    return 'lateNight';
  }
  
  const BLACKLIST_KEY = 'chisha_blacklist';
  
  export function getBlacklist(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(BLACKLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  export function addToBlacklist(food: string) {
    const current = getBlacklist();
    if (!current.includes(food)) {
      localStorage.setItem(BLACKLIST_KEY, JSON.stringify([...current, food]));
    }
  }
  
  export function removeFromBlacklist(food: string) {
    const current = getBlacklist();
    localStorage.setItem(BLACKLIST_KEY, JSON.stringify(current.filter(f => f !== food)));
  }
  
  export function getAvailableFoods(mealTime: MealTime): string[] {
    const allFoods = foodDatabase[mealTime];
    const blacklist = getBlacklist();
    return allFoods.filter(food => !blacklist.includes(food));
  }
  
  export function spinWheel(mealTime: MealTime): string {
    const available = getAvailableFoods(mealTime);
    if (available.length === 0) return '😅 没得选了，先去解除黑名单吧';
    return available[Math.floor(Math.random() * available.length)];
  }