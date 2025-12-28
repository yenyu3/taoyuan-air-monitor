import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import MusicPlayer from './MusicPlayer';
import { getDistanceInfo } from '../utils/distanceUtils';
import useStore from '../store/useStore';

const { width: screenWidth } = Dimensions.get('window');

const ListingDetailModal = ({ listing, visible, onClose }) => {
  const { musicPlatform } = useStore();
  
  if (!listing) return null;

  const formatPrice = (min, max) => {
    if (min === max) {
      return `$${min.toLocaleString()}`;
    }
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const getDistanceText = (meters) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>房源詳情</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 圖片輪播 */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageContainer}
          >
            {listing.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.image}
              />
            ))}
          </ScrollView>

          <View style={styles.detailsContainer}>
            {/* 標題和價格 */}
            <Text style={styles.title}>{listing.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {formatPrice(listing.rentMin, listing.rentMax)}
              </Text>
              <Text style={styles.priceUnit}>/月</Text>
            </View>

            {/* 基本資訊 */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{listing.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="navigation" size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                  距離中大 {getDistanceText(listing.distanceToCampusMeters)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="home" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{listing.rooms}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="star" size={16} color="#F59E0B" />
                <Text style={styles.infoText}>
                  {listing.avgRating} ({listing.reviewsCount} 評價)
                </Text>
              </View>
            </View>

            {/* 聯絡資訊 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>聯絡資訊</Text>
              <Text style={styles.contactName}>{listing.contactName}</Text>
              {listing.contactPhones.map((phone, index) => (
                <Text key={index} style={styles.contactPhone}>{phone}</Text>
              ))}
            </View>

            {/* 室內設施 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>室內設施</Text>
              <View style={styles.facilitiesContainer}>
                {listing.indoorFacilities.map((facility, index) => (
                  <View key={index} style={styles.facilityChip}>
                    <Text style={styles.facilityText}>{facility}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 公共設施 */}
            {listing.publicFacilities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>公共設施</Text>
                <View style={styles.facilitiesContainer}>
                  {listing.publicFacilities.map((facility, index) => (
                    <View key={index} style={styles.facilityChip}>
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 額外費用 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>額外費用</Text>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>水費:</Text>
                <Text style={styles.feeValue}>
                  {listing.extraFees.water === 0 ? '包含' : `$${listing.extraFees.water}`}
                </Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>電費:</Text>
                <Text style={styles.feeValue}>
                  {listing.extraFees.electricity === 0 ? '包含' : `$${listing.extraFees.electricity}`}
                </Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>管理費:</Text>
                <Text style={styles.feeValue}>
                  {listing.extraFees.management === 0 ? '包含' : `$${listing.extraFees.management}`}
                </Text>
              </View>
            </View>

            {/* 音樂推薦 */}
            <View style={styles.section}>
              <MusicPlayer 
                songs={getDistanceInfo(listing.distanceToCampusMeters, musicPlatform).recommendedSongs}
                musicPlatform={musicPlatform}
                walkingTime={getDistanceInfo(listing.distanceToCampusMeters, musicPlatform).walkingTime}
              />
            </View>

            {/* 備註 */}
            {listing.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>備註</Text>
                <Text style={styles.notesText}>{listing.notes}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
  },
  image: {
    width: screenWidth,
    height: 250,
    backgroundColor: '#F3F4F6',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 28,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A4E6B',
  },
  priceUnit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 4,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: '#3A4E6B',
    marginBottom: 2,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityChip: {
    backgroundColor: '#E4DFD8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  facilityText: {
    fontSize: 14,
    color: '#3A4E6B',
    fontWeight: '500',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  feeValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  notesText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});

export default ListingDetailModal;