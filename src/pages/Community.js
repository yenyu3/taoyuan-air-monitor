import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { themes } from '../utils/themes';
import useStore from '../store/useStore';

// 轉租專區元件
const SubleaseTab = ({ theme }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', contact: '' });
  const [subleaseListings, setSubleaseListings] = useState([
    {
      id: 1,
      title: '急轉！中大後門套房',
      content: '因為要出國交換，急轉中大後門套房，租金8000/月，設備齊全，可立即入住...',
      contact: 'Line ID: student123',
      createdAt: '2024-01-20'
    },
    {
      id: 2,
      title: '學期末轉租 中央路套房',
      content: '學期結束要回家，轉租中央路附近套房，租金7500/月，附近生活機能佳...',
      contact: '電話: 0912-345-678',
      createdAt: '2024-01-18'
    }
  ]);

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content || !newPost.contact) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }
    
    const post = {
      id: Date.now(),
      ...newPost,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSubleaseListings(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', contact: '' });
    setShowPostForm(false);
    Alert.alert('成功', '轉租資訊已發布！');
  };

  return (
    <View style={styles.subleaseTab}>
      {/* 發布轉租按鈕 */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowPostForm(true)}
        >
          <Feather name="plus" size={16} color="white" />
          <Text style={styles.addButtonText}>發布轉租</Text>
        </TouchableOpacity>
      </View>

      {/* 發布轉租表單 */}
      {showPostForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>發布轉租資訊</Text>
          
          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>標題</Text>
            <TextInput
              style={styles.textInput}
              value={newPost.title}
              onChangeText={(text) => setNewPost({...newPost, title: text})}
              placeholder="例：急轉！中大附近套房"
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>內容描述</Text>
            <TextInput
              style={styles.textArea}
              value={newPost.content}
              onChangeText={(text) => setNewPost({...newPost, content: text})}
              placeholder="詳細描述房源狀況、轉租原因等..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>聯絡方式</Text>
            <TextInput
              style={styles.textInput}
              value={newPost.contact}
              onChangeText={(text) => setNewPost({...newPost, contact: text})}
              placeholder="Line ID 或電話"
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPost}>
              <Text style={styles.submitButtonText}>發布</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowPostForm(false)}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 安全提醒 */}
      <View style={styles.safetyWarning}>
        <View style={styles.warningHeader}>
          <Feather name="alert-triangle" size={16} color="#D97706" />
          <Text style={styles.warningTitle}>安全租屋提醒</Text>
        </View>
        <View style={styles.warningList}>
          <Text style={styles.warningItem}>• 看房時請找朋友陪同</Text>
          <Text style={styles.warningItem}>• 簽約前務必確認房東身份</Text>
          <Text style={styles.warningItem}>• 避免提前匯款或支付訂金</Text>
          <Text style={styles.warningItem}>• 有疑慮請撥打165反詐騙專線</Text>
        </View>
      </View>

      {/* 轉租貼文列表 */}
      <ScrollView style={styles.postsList} showsVerticalScrollIndicator={false}>
        {subleaseListings.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={[styles.postTitle, { color: theme.colors.accent }]}>{post.title}</Text>
            <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
            <View style={styles.postFooter}>
              <Text style={styles.postDate}>發布時間：{post.createdAt}</Text>
              <Text style={styles.postContact}>聯絡：{post.contact}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const Community = ({ scrollRef }) => {
  const { reviews, listings, addReview, currentUser, currentTheme } = useStore();
  const theme = themes[currentTheme];
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedTag, setSelectedTag] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ 
    listingId: '', 
    rating: 5, 
    tags: [], 
    comment: '' 
  });

  // 獲取所有評價標籤
  const allTags = [...new Set(reviews.flatMap(review => review.tags))];

  // 篩選評價
  const filteredReviews = selectedTag 
    ? reviews.filter(review => review.tags.includes(selectedTag))
    : reviews;

  // 獲取房源名稱
  const getListingTitle = (listingId) => {
    const listing = listings.find(l => l.id === listingId);
    return listing ? listing.title : '未知房源';
  };

  const handleSubmitReview = () => {
    if (!newReview.listingId || !newReview.comment) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }
    
    const review = {
      id: Date.now(),
      userId: currentUser.id,
      ...newReview,
      listingId: parseInt(newReview.listingId),
      createdAt: new Date().toISOString().split('T')[0]
    };
    addReview(review);
    setNewReview({ listingId: '', rating: 5, tags: [], comment: '' });
    setShowReviewForm(false);
    Alert.alert('成功', '評價已發布！');
  };

  const toggleReviewTag = (tag) => {
    setNewReview(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const availableTags = ['房東友善', '生活機能佳', '交通便利', '安全', '便宜', '設備新', '管理佳', '室友友善'];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Feather
        key={i}
        name="star"
        size={14}
        color={i < rating ? '#F59E0B' : '#D1D5DB'}
      />
    ));
  };

  const renderRatingStars = (rating, onPress) => {
    return Array.from({ length: 5 }, (_, i) => (
      <TouchableOpacity key={i} onPress={() => onPress && onPress(i + 1)}>
        <Feather
          name="star"
          size={20}
          color={i < rating ? '#F59E0B' : '#D1D5DB'}
        />
      </TouchableOpacity>
    ));
  };

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
            <Feather name="message-circle" size={24} color="white" />
            <Text style={styles.headerTitle}>租屋社群</Text>
          </View>
          <Text style={styles.headerSubtitle}>分享經驗，互相幫助</Text>
        </SafeAreaView>
      </View>

      {/* 分頁標籤 */}
      <View style={[styles.tabContainer, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && { color: theme.colors.primary, fontWeight: '500' }, activeTab !== 'reviews' && { color: theme.colors.textSecondary }]}>
            評價牆
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sublease' && styles.activeTab]}
          onPress={() => setActiveTab('sublease')}
        >
          <Text style={[styles.tabText, activeTab === 'sublease' && { color: theme.colors.primary, fontWeight: '500' }, activeTab !== 'sublease' && { color: theme.colors.textSecondary }]}>
            轉租專區
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        {activeTab === 'reviews' ? (
          <View style={styles.reviewsTab}>
            {/* 標籤篩選 */}
            <View style={styles.filterSection}>
              <View style={styles.filterHeader}>
                <Feather name="filter" size={16} color="#6B7280" />
                <Text style={styles.filterTitle}>篩選標籤</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tagContainer}>
                  <TouchableOpacity
                    style={[styles.tag, selectedTag === '' && styles.activeTag]}
                    onPress={() => setSelectedTag('')}
                  >
                    <Text style={[styles.tagText, selectedTag === '' && styles.activeTagText]}>
                      全部
                    </Text>
                  </TouchableOpacity>
                  {allTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[styles.tag, selectedTag === tag && styles.activeTag]}
                      onPress={() => setSelectedTag(tag)}
                    >
                      <Text style={[styles.tagText, selectedTag === tag && styles.activeTagText]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* 新增評價按鈕 */}
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowReviewForm(true)}
              >
                <Feather name="edit-3" size={16} color="white" />
                <Text style={styles.addButtonText}>撰寫評價</Text>
              </TouchableOpacity>
            </View>

            {/* 新增評價表單 */}
            {showReviewForm && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>撰寫房源評價</Text>
                
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>選擇房源</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.listingSelection}>
                      {listings.slice(0, 10).map(listing => (
                        <TouchableOpacity
                          key={listing.id}
                          style={[
                            styles.listingOption,
                            newReview.listingId === listing.id.toString() && styles.selectedListingOption
                          ]}
                          onPress={() => setNewReview({...newReview, listingId: listing.id.toString()})}
                        >
                          <Text style={[
                            styles.listingOptionText,
                            newReview.listingId === listing.id.toString() && styles.selectedListingOptionText
                          ]} numberOfLines={2}>
                            {listing.title.length > 30 ? listing.title.substring(0, 30) + '...' : listing.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>評分</Text>
                  <View style={styles.starsContainer}>
                    {renderRatingStars(newReview.rating, (rating) => 
                      setNewReview({...newReview, rating})
                    )}
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>標籤</Text>
                  <View style={styles.tagSelectionContainer}>
                    {availableTags.map(tag => (
                      <TouchableOpacity
                        key={tag}
                        style={[
                          styles.selectableTag,
                          newReview.tags.includes(tag) && styles.selectedTag
                        ]}
                        onPress={() => toggleReviewTag(tag)}
                      >
                        <Text style={[
                          styles.selectableTagText,
                          newReview.tags.includes(tag) && styles.selectedTagText
                        ]}>
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>評價內容</Text>
                  <TextInput
                    style={styles.textArea}
                    value={newReview.comment}
                    onChangeText={(text) => setNewReview({...newReview, comment: text})}
                    placeholder="分享你的租屋經驗..."
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                    <Text style={styles.submitButtonText}>發布評價</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setShowReviewForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>取消</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 評價列表 */}
            <View style={styles.reviewsList}>
              {filteredReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewTitle, { color: theme.colors.accent }]}>
                      {getListingTitle(review.listingId)}
                    </Text>
                    <View style={styles.reviewMeta}>
                      <View style={styles.starsRow}>
                        {renderStars(review.rating)}
                      </View>
                      <Text style={styles.reviewDate}>{review.createdAt}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.reviewTags}>
                    {review.tags.map((tag) => (
                      <View key={tag} style={styles.reviewTag}>
                        <Text style={styles.reviewTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
              <View style={{ height: 100 }} />
            </View>
          </View>
        ) : (
          <SubleaseTab theme={theme} />
        )}
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9BB7D4',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingBottom: 100,
  },
  reviewsTab: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTag: {
    backgroundColor: '#9BB7D4',
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  activeTagText: {
    color: 'white',
  },
  actionBar: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#9BB7D4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  listingSelection: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  listingOption: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 120,
    maxWidth: 200,
  },
  selectedListingOption: {
    backgroundColor: '#9BB7D4',
    borderColor: '#9BB7D4',
  },
  listingOptionText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  selectedListingOptionText: {
    color: 'white',
    fontWeight: '500',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  tagSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectableTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedTag: {
    backgroundColor: '#9BB7D4',
  },
  selectableTagText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedTagText: {
    color: 'white',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  submitButton: {
    backgroundColor: '#9BB7D4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  reviewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  reviewTag: {
    backgroundColor: 'rgba(155, 183, 212, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewTagText: {
    fontSize: 12,
    color: '#9BB7D4',
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  subleaseTab: {
    flex: 1,
    padding: 16,
  },
  safetyWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
    marginLeft: 8,
  },
  warningList: {
    gap: 4,
  },
  warningItem: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  postsList: {
    flex: 1,
  },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postContact: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
});

export default Community;