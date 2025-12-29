import { create } from 'zustand';
import { listings, reviews, user, missions, badgeDefinitions } from '../data/mockData';

const useStore = create((set, get) => ({
  // 資料狀態
  listings: listings,
  reviews: reviews,
  currentUser: user,
  missions: missions,
  
  // 用戶行為追蹤
  userBehavior: {
    viewHistory: [], // { listingId, timestamp }
    searchHistory: [], // { query, timestamp }
    totalViews: 0,
    totalSearches: 0,
    sessionStartTime: Date.now(),
  },
  
  // UI 狀態
  searchQuery: '',
  selectedFilters: {
    priceRange: [0, 20000],
    roomType: '',
    hasParking: false,
    hasFurniture: false
  },
  
  // 音樂平台偏好
  musicPlatform: 'spotify', // 'spotify' 或 'youtube'
  
  // 主題設定
  currentTheme: 'light', // 'light', 'dark', 'sunset', 'ocean', 'forest'
  
  // 設定音樂平台
  setMusicPlatform: (platform) => set({ musicPlatform: platform }),
  
  // 設定主題
  setTheme: (theme) => set({ currentTheme: theme }),
  
  // 記錄房源瀏覽
  recordListingView: (listingId) => set((state) => {
    const now = Date.now();
    const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
    
    // 過濾掉3天前的記錄
    const recentViews = state.userBehavior.viewHistory.filter(
      view => view.timestamp > threeDaysAgo
    );
    
    // 添加新的瀏覽記錄
    const newView = { listingId, timestamp: now };
    const updatedViews = [newView, ...recentViews.filter(v => v.listingId !== listingId)];
    
    return {
      userBehavior: {
        ...state.userBehavior,
        viewHistory: updatedViews,
        totalViews: state.userBehavior.totalViews + 1
      }
    };
  }),
  
  // 記錄搜尋
  recordSearch: (query) => set((state) => {
    if (!query.trim()) return state;
    
    const now = Date.now();
    const newSearch = { query: query.trim(), timestamp: now };
    
    return {
      userBehavior: {
        ...state.userBehavior,
        searchHistory: [newSearch, ...state.userBehavior.searchHistory.slice(0, 19)], // 保留最近20次
        totalSearches: state.userBehavior.totalSearches + 1
      }
    };
  }),
  
  // 獲取瀏覽記錄中的房源
  getViewedListings: () => {
    const { listings, userBehavior } = get();
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
    
    const recentViews = userBehavior.viewHistory.filter(
      view => view.timestamp > threeDaysAgo
    );
    
    return recentViews.map(view => {
      const listing = listings.find(l => l.id === view.listingId);
      return { ...listing, viewedAt: view.timestamp };
    }).filter(Boolean);
  },
  
  // 獲取用戶行為統計
  getUserBehaviorStats: () => {
    const { userBehavior, currentUser } = get();
    const sessionTime = Math.floor((Date.now() - userBehavior.sessionStartTime) / 1000 / 60);
    
    // 統計搜尋關鍵字
    const keywordCounts = {};
    userBehavior.searchHistory.forEach(search => {
      const words = search.query.toLowerCase().split(' ');
      words.forEach(word => {
        if (word.length > 1) {
          keywordCounts[word] = (keywordCounts[word] || 0) + 1;
        }
      });
    });
    
    const topKeywords = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([keyword, count]) => ({ keyword, count }));
    
    return {
      totalViews: userBehavior.totalViews,
      totalFavorites: currentUser.favorites.length,
      totalSearches: userBehavior.totalSearches,
      avgSessionTime: `${sessionTime}分鐘`,
      topSearchKeywords: topKeywords
    };
  },
  
  // 收藏功能
  toggleFavorite: (listingId) => set((state) => {
    const currentFavorites = state.currentUser.favorites;
    const isFavorited = currentFavorites.includes(listingId);
    
    const updatedFavorites = isFavorited
      ? currentFavorites.filter(id => id !== listingId)
      : [...currentFavorites, listingId];
    
    return {
      currentUser: {
        ...state.currentUser,
        favorites: updatedFavorites
      }
    };
  }),
  
  // 搜尋功能
  setSearchQuery: (query) => set((state) => {
    // 記錄搜尋
    if (query.trim()) {
      const now = Date.now();
      const newSearch = { query: query.trim(), timestamp: now };
      
      const updatedBehavior = {
        ...state.userBehavior,
        searchHistory: [newSearch, ...state.userBehavior.searchHistory.slice(0, 19)],
        totalSearches: state.userBehavior.totalSearches + 1
      };
      
      return {
        searchQuery: query,
        userBehavior: updatedBehavior
      };
    }
    
    return { searchQuery: query };
  }),
  
  // 篩選功能
  setFilters: (filters) => set({ selectedFilters: filters }),
  
  // 獲取篩選後的房源
  getFilteredListings: () => {
    const { listings, searchQuery, selectedFilters } = get();
    
    return listings.filter(listing => {
      // 搜尋條件
      if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !listing.address.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // 價格範圍
      if (listing.rentMin > selectedFilters.priceRange[1] || 
          listing.rentMax < selectedFilters.priceRange[0]) {
        return false;
      }
      
      // 房型
      if (selectedFilters.roomType && listing.rooms !== selectedFilters.roomType) {
        return false;
      }
      
      // 停車位
      if (selectedFilters.hasParking && !listing.publicFacilities.includes('停車場')) {
        return false;
      }
      
      // 家具
      if (selectedFilters.hasFurniture && 
          !listing.indoorFacilities.some(facility => 
            ['電冰箱', '洗衣機', '書桌', '衣櫃'].includes(facility))) {
        return false;
      }
      
      return true;
    });
  },
  
  // 任務系統
  completeMission: (missionId) => set((state) => {
    const mission = state.missions.find(m => m.id === missionId);
    if (!mission || mission.completed) return state;
    
    const updatedMissions = state.missions.map(m =>
      m.id === missionId ? { ...m, completed: true } : m
    );
    
    const newPoints = state.currentUser.points + mission.points;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    // 檢查是否獲得新徽章
    let newBadges = [...state.currentUser.badges];
    
    // 根據任務類型給予徽章
    if (mission.type === 'review' && !newBadges.includes('評論新手')) {
      newBadges.push('評論新手');
    }
    if (mission.type === 'favorite' && !newBadges.includes('第一間收藏')) {
      newBadges.push('第一間收藏');
    }
    if (mission.type === 'explore' && !newBadges.includes('地圖探索者')) {
      newBadges.push('地圖探索者');
    }
    
    return {
      missions: updatedMissions,
      currentUser: {
        ...state.currentUser,
        points: newPoints,
        level: newLevel,
        badges: newBadges
      }
    };
  }),
  
  // 獲取徽章資訊
  getBadgeInfo: (badgeName) => {
    return badgeDefinitions.find(badge => badge.name === badgeName) || 
           { name: badgeName, icon: '🏆', description: '特殊徽章' };
  },
  
  // 新增評價
  addReview: (review) => set((state) => {
    const newReview = { ...review, id: Date.now() };
    
    // 完成評價任務
    const reviewMission = state.missions.find(m => m.type === 'review' && !m.completed);
    let updatedMissions = state.missions;
    let updatedUser = state.currentUser;
    
    if (reviewMission) {
      updatedMissions = state.missions.map(m =>
        m.id === reviewMission.id ? { ...m, completed: true } : m
      );
      
      const newPoints = state.currentUser.points + reviewMission.points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      let newBadges = [...state.currentUser.badges];
      
      if (!newBadges.includes('評論新手')) {
        newBadges.push('評論新手');
      }
      
      updatedUser = {
        ...state.currentUser,
        points: newPoints,
        level: newLevel,
        badges: newBadges
      };
    }
    
    return {
      reviews: [...state.reviews, newReview],
      missions: updatedMissions,
      currentUser: updatedUser
    };
  }),
  
  // 獲取房源評價
  getListingReviews: (listingId) => {
    const { reviews } = get();
    return reviews.filter(review => review.listingId === listingId);
  },
  
  // 獲取收藏的房源
  getFavoriteListings: () => {
    const { listings, currentUser } = get();
    return listings.filter(listing => currentUser.favorites.includes(listing.id));
  }
}));

export default useStore;