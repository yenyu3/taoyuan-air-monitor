// 統計工具函數
import { listings } from '../data/mockData';

// 計算租金趨勢數據
export const getRentTrends = () => {
  return [
    { month: '2024-01', avgRent: 3200, count: 45 },
    { month: '2024-02', avgRent: 3250, count: 48 },
    { month: '2024-03', avgRent: 3300, count: 52 },
    { month: '2024-04', avgRent: 3280, count: 49 },
    { month: '2024-05', avgRent: 3350, count: 55 },
    { month: '2024-06', avgRent: 3400, count: 58 }
  ];
};

// 獲取熱門房源排行
export const getPopularListings = () => {
  return listings
    .map(listing => ({
      ...listing,
      popularityScore: listing.avgRating * listing.reviewsCount + (listing.reviewsCount * 10)
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 10);
};

// 計算房源分布
export const getAreaDistribution = () => {
  const areas = {};
  
  listings.forEach(listing => {
    const area = listing.address.includes('中央路') ? '中央路周邊' :
                 listing.address.includes('五興路') ? '五興路周邊' :
                 listing.address.includes('平鎮') ? '平鎮區' : '其他區域';
    
    areas[area] = (areas[area] || 0) + 1;
  });
  
  return Object.entries(areas).map(([name, count]) => ({ name, count }));
};

// 計算價格分布
export const getPriceDistribution = () => {
  const ranges = {
    '1000-2000': 0,
    '2000-3000': 0,
    '3000-4000': 0,
    '4000-5000': 0
  };
  
  listings.forEach(listing => {
    const avgRent = (listing.rentMin + listing.rentMax) / 2;
    if (avgRent < 2000) ranges['1000-2000']++;
    else if (avgRent < 3000) ranges['2000-3000']++;
    else if (avgRent < 4000) ranges['3000-4000']++;
    else ranges['4000-5000']++;
  });
  
  return Object.entries(ranges).map(([range, count]) => ({ range, count }));
};