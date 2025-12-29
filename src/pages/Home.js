import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Logo from '../components/Logo';
import FilterChips from '../components/FilterChips';
import ListingCard from '../components/ListingCard';
import ListingDetailModal from '../components/ListingDetailModal';
import { PopularListingItem } from '../components/StatisticsCharts';
import { getPopularListings } from '../utils/statisticsUtils';
import { themes } from '../utils/themes';
import useStore from '../store/useStore';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Home = ({ scrollRef }) => {
  const { getFilteredListings, searchQuery, setSearchQuery, recordListingView, currentTheme } = useStore();
  const scrollViewRef = useRef(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showPopularModal, setShowPopularModal] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  const filteredListings = getFilteredListings();
  const popularListings = getPopularListings().slice(0, 10);
  const theme = themes[currentTheme];

  const handleListingClick = (listing) => {
    recordListingView(listing.id); // 記錄瀏覽
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const avgRating = filteredListings.length > 0 
    ? (filteredListings.reduce((sum, listing) => sum + listing.avgRating, 0) / filteredListings.length).toFixed(1)
    : '0.0';
  
  const avgRent = filteredListings.length > 0
    ? Math.round(filteredListings.reduce((sum, listing) => sum + listing.rentMin, 0) / filteredListings.length / 1000) + 'K'
    : '0K';

  useEffect(() => {
    if (scrollRef) {
      scrollRef(scrollViewRef.current);
    }
  }, [scrollRef]);

  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();
    return () => bounceAnimation.stop();
  }, [bounceAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        {/* 第一屏：藍色漸層背景的主要內容區 */}
        <LinearGradient
          colors={theme.gradients.hero}
          style={styles.heroSection}
        >
          {/* 頂部 Logo 區域 */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Feather name="home" size={28} color="white" />
              </View>
              <View style={styles.logoText}>
                <Text style={styles.appName}>NCU RentEase</Text>
                <Text style={styles.appSubtitle}>中大校外租屋小幫手</Text>
              </View>
            </View>
          </View>

          {/* 主標題區域 */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>找到你的理想租屋</Text>
            <Text style={styles.description}>中大周邊優質房源，一鍵搜尋</Text>
            
            {/* 特色標籤 */}
            <View style={styles.featureTags}>
              <View style={styles.featureTag}>
                <Feather name="shield-check" size={14} color="white" />
                <Text style={styles.featureTagText}>安全認證</Text>
              </View>
              <View style={styles.featureTag}>
                <Feather name="star" size={14} color="white" />
                <Text style={styles.featureTagText}>真實評價</Text>
              </View>
              <View style={styles.featureTag}>
                <Feather name="zap" size={14} color="white" />
                <Text style={styles.featureTagText}>快速匹配</Text>
              </View>
            </View>
          </View>

          {/* 搜尋框區域 */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="搜尋地址、房源標題或關鍵字"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* 分隔漸層 */}
          <View style={styles.dividerSection}>
            <LinearGradient
              colors={['rgba(107, 155, 210, 0.1)', 'rgba(107, 155, 210, 0.05)', 'transparent']}
              style={styles.gradientDivider}
            />
          </View>

          {/* 熱門房源按鈕 */}
          <TouchableOpacity 
            style={styles.popularButton}
            onPress={() => setShowPopularModal(true)}
          >
            <Feather name="trending-up" size={18} color="white" />
            <Text style={styles.popularButtonText}>熱門房源</Text>
          </TouchableOpacity>

          {/* 統計資訊區域 */}
          <View style={styles.statsSection}>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="home" size={20} color="white" />
                </View>
                <Text style={styles.statNumber}>{filteredListings.length}</Text>
                <Text style={styles.statLabel}>可租房源</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="star" size={20} color="white" />
                </View>
                <Text style={styles.statNumber}>{avgRating}</Text>
                <Text style={styles.statLabel}>平均評分</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Feather name="dollar-sign" size={20} color="white" />
                </View>
                <Text style={styles.statNumber}>{avgRent}</Text>
                <Text style={styles.statLabel}>平均租金</Text>
              </View>
            </View>
          </View>

          {/* 底部提示區域 */}
          <View style={styles.hintSection}>
            <View style={styles.scrollIndicator}>
              <Animated.View style={[styles.scrollHint, { transform: [{ translateY: bounceAnim }] }]}>
                <Feather name="chevron-down" size={24} color="rgba(255, 255, 255, 0.8)" />
              </Animated.View>
            </View>
          </View>
        </LinearGradient>
        
        {/* 第二屏：房源列表區域 */}
        <View style={[styles.contentSection, { backgroundColor: theme.colors.surface }]}>
          {/* 篩選按鈕 */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Feather name="filter" size={18} color="#6B9BD2" />
              <Text style={styles.filterButtonText}>
                {showFilters ? '隱藏篩選' : '篩選條件'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 篩選條件 */}
          {showFilters && (
            <View style={styles.filtersContainer}>
              <FilterChips />
            </View>
          )}
          
          {/* 房源列表標題 */}
          <View style={styles.listHeader}>
            <View style={styles.listTitle}>
              <Feather name="trending-up" size={20} color="#6B9BD2" />
              <Text style={[styles.listTitleText, { color: theme.colors.text }]}>推薦房源</Text>
            </View>
            <Text style={[styles.listCount, { color: theme.colors.textSecondary }]}>共 {filteredListings.length} 間</Text>
          </View>
          
          {/* 房源列表 */}
          {filteredListings.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="map-pin" size={48} color="#D1D5DB" />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.textSecondary }]}>沒有找到符合條件的房源</Text>
              <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>試試調整搜尋條件或篩選器</Text>
            </View>
          ) : (
            <View style={styles.listingsContainer}>
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onPress={() => handleListingClick(listing)}
                />
              ))}
              <View style={{ height: 100 }} />
            </View>
          )}
        </View>
      </ScrollView>
      
      <ListingDetailModal
        listing={selectedListing}
        visible={isModalOpen}
        onClose={closeModal}
      />
      
      {/* 熱門房源模態框 */}
      <Modal
        visible={showPopularModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPopularModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>熱門房源 TOP 10</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowPopularModal(false)}
            >
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {popularListings.map((listing, index) => (
              <TouchableOpacity
                key={listing.id}
                onPress={() => {
                  setShowPopularModal(false);
                  handleListingClick(listing);
                }}
              >
                <PopularListingItem 
                  listing={listing} 
                  rank={index + 1} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  
  // 第一屏整體布局 - 增加高度並優化布局
  heroSection: {
    minHeight: screenHeight * 0.92,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: 'space-evenly',
  },

  // 頂部 Logo 區域 - 置頂
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoIcon: {
    marginRight: 12,
  },
  logoText: {
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },

  // 主標題區域 - 置中
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '500',
  },
  
  // 特色標籤區域
  featureTags: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureTagText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 4,
    fontWeight: '600',
  },

  // 搜尋框區域
  searchSection: {
    paddingHorizontal: 8,
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 18,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    paddingLeft: 50,
    paddingRight: 20,
    paddingVertical: 18,
    fontSize: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    color: '#1E293B',
    fontWeight: '500',
  },

  // 分隔漸層區域
  dividerSection: {
    alignItems: 'center',
  },
  gradientDivider: {
    width: screenWidth * 0.3,
    height: 1,
    borderRadius: 1,
  },

  // 統計資訊區域
  statsSection: {
    marginTop: -16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  statCard: {
    width: (screenWidth - 96) / 3,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 10,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 14,
  },

  // 底部提示區域
  hintSection: {
    alignItems: 'center',
  },
  scrollIndicator: {
    alignItems: 'center',
  },
  scrollHint: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },

  // 第二屏房源列表區域
  contentSection: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: screenHeight,
    paddingTop: 24,
  },
  
  // 篩選按鈕區域
  filterSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  filterButtonText: {
    color: '#6B9BD2',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  filtersContainer: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  listTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listTitleText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
  listCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyStateSubtitle: {
    fontSize: 14,
  },
  listingsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  
  // 熱門房源按鈕樣式
  popularButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -8,
    backgroundColor: '#3A4E6B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  popularButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  // 模態框樣式
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
});

export default Home;