import { songRecommendations } from '../data/mockData';

// 計算步行時間（分鐘）
export const calculateWalkingTime = (distanceMeters) => {
  const walkingSpeedMeterPerMin = 80;
  return Math.ceil(distanceMeters / walkingSpeedMeterPerMin);
};

// 計算需要幾首歌
export const calculateSongCount = (walkingTimeMinutes) => {
  const avgSongLengthMinutes = 3.5;
  return Math.ceil(walkingTimeMinutes / avgSongLengthMinutes);
};

// 根據步行時間推薦歌單
export const recommendSongs = (walkingTimeMinutes, musicPlatform = 'spotify') => {
  const songCount = calculateSongCount(walkingTimeMinutes);
  
  // 根據步行時間選擇合適的心情
  let mood = 'chill';
  if (walkingTimeMinutes > 15) {
    mood = 'energetic'; // 長距離需要有活力的歌
  } else if (walkingTimeMinutes < 5) {
    mood = 'focus'; // 短距離聽專注的歌
  }
  
  // 篩選符合心情的歌曲
  const moodSongs = songRecommendations.filter(song => song.mood === mood);
  
  // 如果符合心情的歌不夠，就加入其他歌曲
  let recommendedSongs = [...moodSongs];
  if (recommendedSongs.length < songCount) {
    const otherSongs = songRecommendations.filter(song => song.mood !== mood);
    recommendedSongs = [...recommendedSongs, ...otherSongs];
  }
  
  // 隨機選擇歌曲並限制數量，同時根據平台選擇連結
  const shuffled = recommendedSongs.sort(() => 0.5 - Math.random());
  const selectedSongs = shuffled.slice(0, Math.min(songCount, 5)); // 最多推薦5首
  
  // 根據音樂平台返回對應的連結
  return selectedSongs.map(song => ({
    ...song,
    url: musicPlatform === 'youtube' ? song.youtubeUrl : song.spotifyUrl,
    platform: musicPlatform
  }));
};

// 格式化距離顯示
export const formatDistance = (distanceMeters) => {
  if (distanceMeters < 1000) {
    return `${distanceMeters}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
};

// 獲取完整的距離資訊
export const getDistanceInfo = (distanceMeters, musicPlatform = 'spotify') => {
  const walkingTime = calculateWalkingTime(distanceMeters);
  const songCount = calculateSongCount(walkingTime);
  const recommendedSongs = recommendSongs(walkingTime, musicPlatform);
  
  return {
    distance: formatDistance(distanceMeters),
    walkingTime,
    songCount,
    recommendedSongs
  };
};