import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import ListingCard from '../components/ListingCard';
import ListingDetailModal from '../components/ListingDetailModal';
import CompareTable from '../components/CompareTable';
import useStore from '../store/useStore';

const Favorites = () => {
  const { getFavoriteListings } = useStore();
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState({});

  const favoriteListings = getFavoriteListings();

  const handleCompareToggle = (listing) => {
    setSelectedForCompare(prev => {
      const isSelected = prev.some(item => item.id === listing.id);
      if (isSelected) {
        return prev.filter(item => item.id !== listing.id);
      } else if (prev.length < 3) {
        return [...prev, listing];
      }
      return prev;
    });
  };

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const handleNoteChange = (listingId, note) => {
    setNotes(prev => ({ ...prev, [listingId]: note }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Feather name="heart" size={24} color="white" />
            <Text style={styles.headerTitle}>我的收藏</Text>
          </View>
          <Text style={styles.headerSubtitle}>管理你收藏的房源</Text>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteListings.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="heart" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>還沒有收藏任何房源</Text>
            <Text style={styles.emptyStateSubtitle}>去首頁或地圖找找喜歡的房源吧！</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <View style={styles.controlBar}>
              <Text style={styles.countText}>已收藏 {favoriteListings.length} 間房源</Text>
              <View style={styles.controlButtons}>
                {selectedForCompare.length >= 2 && (
                  <TouchableOpacity 
                    style={styles.compareButton}
                    onPress={() => setShowCompare(!showCompare)}
                  >
                    <Feather name="bar-chart-2" size={16} color="white" />
                    <Text style={styles.compareButtonText}>
                      {showCompare ? '隱藏比較' : `比較 (${selectedForCompare.length})`}
                    </Text>
                  </TouchableOpacity>
                )}
                {selectedForCompare.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => setSelectedForCompare([])}
                  >
                    <Text style={styles.clearButtonText}>清除選擇</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 比較表格 */}
            {showCompare && selectedForCompare.length >= 2 && (
              <View style={styles.compareTableContainer}>
                <Text style={styles.compareTableTitle}>房源比較</Text>
                <CompareTable listings={selectedForCompare} />
              </View>
            )}

            {favoriteListings.map((listing) => (
              <View key={listing.id} style={styles.listingContainer}>
                <View style={styles.compareSection}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => handleCompareToggle(listing)}
                  >
                    <View style={[
                      styles.checkbox,
                      selectedForCompare.some(item => item.id === listing.id) && styles.checkboxSelected
                    ]}>
                      {selectedForCompare.some(item => item.id === listing.id) && (
                        <Feather name="check" size={16} color="white" />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>加入比較</Text>
                  </TouchableOpacity>
                  {selectedForCompare.length >= 3 && !selectedForCompare.some(item => item.id === listing.id) && (
                    <Text style={styles.maxSelectText}>最多選擇3間</Text>
                  )}
                </View>

                <ListingCard listing={listing} onPress={() => handleListingClick(listing)} />

                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>個人筆記</Text>
                  <TextInput
                    style={styles.noteInput}
                    value={notes[listing.id] || ''}
                    onChangeText={(text) => handleNoteChange(listing.id, text)}
                    placeholder="記錄你對這間房源的想法..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <ListingDetailModal
        listing={selectedListing}
        visible={isModalOpen}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  compareButton: {
    backgroundColor: '#3A4E6B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  compareButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 12,
  },
  listingContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compareSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3A4E6B',
    borderColor: '#3A4E6B',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  maxSelectText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noteSection: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  compareTableContainer: {
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
  compareTableTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A4E6B',
    marginBottom: 16,
  },
});

export default Favorites;