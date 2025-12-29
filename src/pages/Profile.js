import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import MissionList from '../components/MissionList';
import { StatCard } from '../components/StatisticsCharts';
import { themes } from '../utils/themes';
import useStore from '../store/useStore';
import { useRef, useEffect } from 'react';

const Profile = ({ scrollRef }) => {
  const { 
    currentUser, 
    getBadgeInfo, 
    musicPlatform, 
    setMusicPlatform,
    getUserBehaviorStats,
    getViewedListings,
    currentTheme,
    setTheme
  } = useStore();
  
  const scrollViewRef = useRef(null);
  
  // 獲取統計數據
  const userStats = getUserBehaviorStats();
  const viewedListings = getViewedListings();
  const theme = themes[currentTheme];
  
  // 獲取徽章資訊
  const getUserBadges = () => {
    return currentUser.badges.map(badgeName => getBadgeInfo(badgeName));
  };
  
  const userBadges = getUserBadges();

  // 計算進度條
  const currentLevelPoints = (currentUser.level - 1) * 100;
  const nextLevelPoints = currentUser.level * 100;
  const progressPercentage = ((currentUser.points - currentLevelPoints) / 100) * 100;

  const pointsToNextLevel = nextLevelPoints - currentUser.points;

  useEffect(() => {
    if (scrollRef) {
      scrollRef(scrollViewRef.current);
    }
  }, [scrollRef]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Feather name="user" size={24} color="white" />
            <Text style={styles.headerTitle}>我的檔案</Text>
          </View>
          <Text style={styles.headerSubtitle}>查看你的租屋成就</Text>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        {/* 使用者資訊卡片 */}
        <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{currentUser.nickname.charAt(0)}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>{currentUser.nickname}</Text>
              <Text style={[styles.userMeta, { color: theme.colors.textSecondary }]}>{currentUser.department} {currentUser.grade}</Text>
            </View>
          </View>

          {/* 等級和點數 */}
          <View style={styles.levelSection}>
            <View style={styles.levelHeader}>
              <Text style={[styles.levelText, { color: theme.colors.text }]}>等級 {currentUser.level}</Text>
              <Text style={[styles.pointsText, { color: theme.colors.textSecondary }]}>
                {currentUser.points} / {nextLevelPoints} 點數
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progressPercentage, 100)}%` }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              還需要 {pointsToNextLevel} 點數升級
            </Text>
          </View>

          {/* 統計資訊 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.points}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>總點數</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.level}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>等級</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser.badges.length}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>徽章</Text>
            </View>
          </View>
        </View>

        {/* 音樂平台設定 */}
        <View style={[styles.musicPlatformCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Feather name="music" size={20} color="#3A4E6B" />
            <Text style={styles.sectionTitle}>音樂平台偏好</Text>
          </View>
          
          <Text style={[styles.platformDescription, { color: theme.colors.textSecondary }]}>
            選擇你喜歡的音樂平台，歌曲推薦將會使用對應的連結
          </Text>
          
          <View style={styles.platformOptions}>
            <TouchableOpacity
              style={[
                styles.platformOption,
                musicPlatform === 'spotify' && styles.selectedPlatform
              ]}
              onPress={() => setMusicPlatform('spotify')}
            >
              <View style={styles.platformContent}>
                <View style={[
                  styles.platformIcon,
                  { backgroundColor: musicPlatform === 'spotify' ? '#1DB954' : '#E5E7EB' }
                ]}>
                  <Feather 
                    name="music" 
                    size={20} 
                    color={musicPlatform === 'spotify' ? 'white' : '#6B7280'} 
                  />
                </View>
                <View style={styles.platformInfo}>
                  <Text style={[
                    styles.platformName,
                    musicPlatform === 'spotify' && styles.selectedPlatformText
                  ]}>Spotify</Text>
                  <Text style={styles.platformSubtitle}>全球最大的音樂串流平台</Text>
                </View>
              </View>
              {musicPlatform === 'spotify' && (
                <Feather name="check-circle" size={20} color="#1DB954" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.platformOption,
                musicPlatform === 'youtube' && styles.selectedPlatform
              ]}
              onPress={() => setMusicPlatform('youtube')}
            >
              <View style={styles.platformContent}>
                <View style={[
                  styles.platformIcon,
                  { backgroundColor: musicPlatform === 'youtube' ? '#FF0000' : '#E5E7EB' }
                ]}>
                  <Feather 
                    name="play" 
                    size={20} 
                    color={musicPlatform === 'youtube' ? 'white' : '#6B7280'} 
                  />
                </View>
                <View style={styles.platformInfo}>
                  <Text style={[
                    styles.platformName,
                    musicPlatform === 'youtube' && styles.selectedPlatformText
                  ]}>YouTube Music</Text>
                  <Text style={styles.platformSubtitle}>Google 的音樂串流服務</Text>
                </View>
              </View>
              {musicPlatform === 'youtube' && (
                <Feather name="check-circle" size={20} color="#FF0000" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 主題設定 */}
        <View style={[styles.themeCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Feather name="moon" size={20} color={theme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>主題設定</Text>
          </View>
          
          <Text style={[styles.themeDescription, { color: theme.colors.textSecondary }]}>
            選擇你喜歡的主題風格，個人化你的使用體驗
          </Text>
          
          <View style={styles.themeOptions}>
            {Object.entries(themes).map(([key, themeOption]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeOption,
                  { borderColor: theme.colors.border },
                  currentTheme === key && { borderColor: theme.colors.primary, backgroundColor: theme.colors.surface }
                ]}
                onPress={() => setTheme(key)}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.themeColorPrimary, { backgroundColor: themeOption.colors.primary }]} />
                  <View style={[styles.themeColorSecondary, { backgroundColor: themeOption.colors.secondary }]} />
                  <View style={[styles.themeColorAccent, { backgroundColor: themeOption.colors.accent }]} />
                </View>
                <Text style={[styles.themeName, { color: theme.colors.text }]}>{themeOption.name}</Text>
                {currentTheme === key && (
                  <Feather name="check-circle" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 用戶行為統計 */}
        <View style={[styles.statisticsCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Feather name="activity" size={20} color={theme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>用戶行為統計</Text>
          </View>
          
          <View style={styles.statsRow}>
            <StatCard 
              title="總瀏覽量" 
              value={userStats.totalViews} 
              icon="👀"
            />
            <StatCard 
              title="總收藏數" 
              value={userStats.totalFavorites} 
              icon="❤️"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard 
              title="搜尋次數" 
              value={userStats.totalSearches} 
              icon="🔍"
            />
            <StatCard 
              title="平均停留" 
              value={userStats.avgSessionTime} 
              icon="⏱️"
            />
          </View>
          
          <View style={styles.keywordsSection}>
            <Text style={styles.keywordsTitle}>🔍 熱門搜尋關鍵字</Text>
            {userStats.topSearchKeywords.length > 0 ? (
              userStats.topSearchKeywords.slice(0, 3).map((item, index) => (
                <View key={index} style={styles.keywordItem}>
                  <Text style={styles.keywordText}>{item.keyword}</Text>
                  <Text style={styles.keywordCount}>{item.count}次</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>還沒有搜尋記錄</Text>
            )}
          </View>
          
          <View style={styles.viewHistorySection}>
            <Text style={styles.keywordsTitle}>👀 最近瀏覽 (3天內)</Text>
            {viewedListings.length > 0 ? (
              viewedListings.slice(0, 5).map((listing, index) => (
                <View key={listing.id} style={styles.viewHistoryItem}>
                  <View style={styles.viewHistoryInfo}>
                    <Text style={styles.viewHistoryTitle} numberOfLines={1}>
                      {listing.title}
                    </Text>
                    <Text style={styles.viewHistoryAddress} numberOfLines={1}>
                      {listing.address}
                    </Text>
                    <Text style={styles.viewHistoryTime}>
                      {new Date(listing.viewedAt).toLocaleDateString('zh-TW', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <Text style={styles.viewHistoryPrice}>
                    NT${listing.rentMin}-{listing.rentMax}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>還沒有瀏覽記錄</Text>
            )}
          </View>
        </View>

        {/* 徽章展示 */}
        <View style={[styles.badgesCard, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={20} color={theme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>我的徽章 ({currentUser.badges.length})</Text>
          </View>
          
          {currentUser.badges.length === 0 ? (
            <View style={styles.emptyBadges}>
              <Feather name="award" size={48} color="#D1D5DB" />
              <Text style={[styles.emptyBadgesTitle, { color: theme.colors.textSecondary }]}>還沒有獲得任何徽章</Text>
              <Text style={[styles.emptyBadgesSubtitle, { color: theme.colors.textSecondary }]}>完成任務來獲得你的第一個徽章吧！</Text>
            </View>
          ) : (
            <View style={styles.badgesGrid}>
              {userBadges.map((badge, index) => (
                <View key={index} style={styles.badgeItem}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={[styles.badgeName, { color: theme.colors.accent }]}>{badge.name}</Text>
                  <Text style={[styles.badgeDescription, { color: theme.colors.textSecondary }]}>{badge.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 任務系統 */}
        <View style={[styles.missionCard, { backgroundColor: theme.colors.card }]}>
          <MissionList />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#9BB7D4',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  userCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: '#9BB7D4',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userDetails: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userMeta: {
    fontSize: 16,
  },
  levelSection: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 14,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9BB7D4',
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9BB7D4',
  },
  statLabel: {
    fontSize: 12,
  },
  badgesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyBadges: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyBadgesTitle: {
    fontSize: 16,
    marginTop: 8,
  },
  emptyBadgesSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    backgroundColor: 'rgba(155, 183, 212, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '47%',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  pointsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pointsList: {
    marginBottom: 16,
  },
  pointItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pointAction: {
    fontSize: 14,
    color: '#374151',
  },
  pointValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9BB7D4',
  },
  levelRule: {
    backgroundColor: 'rgba(228, 223, 216, 0.3)',
    borderRadius: 8,
    padding: 12,
  },
  levelRuleTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A4E6B',
    marginBottom: 8,
  },
  levelRuleText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  missionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  musicPlatformCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  platformDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  platformOptions: {
    gap: 12,
  },
  platformOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  selectedPlatform: {
    borderColor: '#9BB7D4',
    backgroundColor: 'rgba(155, 183, 212, 0.05)',
  },
  platformContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  selectedPlatformText: {
    color: '#3A4E6B',
  },
  platformSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  statisticsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  keywordsSection: {
    marginTop: 8,
  },
  keywordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A4E6B',
    marginBottom: 12,
  },
  keywordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  keywordText: {
    fontSize: 14,
    color: '#333',
  },
  keywordCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9BB7D4',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
  viewHistorySection: {
    marginTop: 16,
  },
  viewHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  viewHistoryInfo: {
    flex: 1,
    marginRight: 12,
  },
  viewHistoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  viewHistoryAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  viewHistoryTime: {
    fontSize: 11,
    color: '#999',
  },
  viewHistoryPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9BB7D4',
  },
  themeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#F9FAFB',
  },
  themePreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  themeColorPrimary: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  themeColorSecondary: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  themeColorAccent: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});

export default Profile;