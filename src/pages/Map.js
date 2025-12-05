import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import ListingCard from '../components/ListingCard';
import ListingDetailModal from '../components/ListingDetailModal';
import useStore from '../store/useStore';
import { getDistanceInfo } from '../utils/distanceUtils';

const { width, height } = Dimensions.get('window');

const Map = () => {
  const { getFilteredListings } = useStore();
  const [selectedListing, setSelectedListing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // distance, rating, price
  
  const listings = getFilteredListings();
  
  // 排序房源
  const sortedListings = [...listings].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distanceToCampusMeters - b.distanceToCampusMeters;
      case 'rating':
        return b.avgRating - a.avgRating;
      case 'price':
        return a.rentMin - b.rentMin;
      default:
        return 0;
    }
  });

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  const getSortButtonStyle = (type) => [
    styles.sortButton,
    sortBy === type && styles.activeSortButton
  ];

  const getSortButtonTextStyle = (type) => [
    styles.sortButtonText,
    sortBy === type && styles.activeSortButtonText
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Feather name="map" size={24} color="white" />
            <Text style={styles.headerTitle}>地圖找房</Text>
          </View>
          <Text style={styles.headerSubtitle}>以距離為主的房源列表</Text>
        </SafeAreaView>
      </View>

      {/* Google Maps */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 24.9675,
            longitude: 121.1950,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* 中央大學標記 */}
          <Marker
            coordinate={{
              latitude: 24.9675,
              longitude: 121.1950,
            }}
            title="中央大學"
            description="National Central University"
          >
            <View style={styles.universityMarker}>
              <Feather name="book" size={20} color="white" />
            </View>
          </Marker>
          
          {/* 房源標記 */}
          {sortedListings.map((listing) => (
            <Marker
              key={listing.id}
              coordinate={{
                latitude: listing.location.lat,
                longitude: listing.location.lng,
              }}
              title={listing.title}
              description={`$${listing.rentMin.toLocaleString()} - ${getDistanceInfo(listing.distanceToCampusMeters).distance}`}
              onPress={() => handleListingClick(listing)}
            >
              <View style={styles.customMarker}>
                <Feather name="home" size={20} color="white" />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {/* 排序控制 */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>排序方式：</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortButtons}>
            <TouchableOpacity 
              style={getSortButtonStyle('distance')}
              onPress={() => setSortBy('distance')}
            >
              <Text style={getSortButtonTextStyle('distance')}>距離最近</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={getSortButtonStyle('rating')}
              onPress={() => setSortBy('rating')}
            >
              <Text style={getSortButtonTextStyle('rating')}>評分最高</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={getSortButtonStyle('price')}
              onPress={() => setSortBy('price')}
            >
              <Text style={getSortButtonTextStyle('price')}>價格最低</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* 房源列表 */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>附近房源 ({sortedListings.length})</Text>
        </View>
        
        {sortedListings.map((listing, index) => {
          const distanceInfo = getDistanceInfo(listing.distanceToCampusMeters);
          return (
            <View key={listing.id} style={styles.listingWrapper}>
              <View style={styles.distanceInfo}>
                <View style={styles.distanceRow}>
                  <Feather name="navigation" size={16} color="#9BB7D4" />
                  <Text style={styles.distanceText}>
                    {distanceInfo.distance} • 步行 {distanceInfo.walkingTime} 分鐘
                  </Text>
                </View>
                <View style={styles.songInfo}>
                  <Feather name="music" size={14} color="#6B7280" />
                  <Text style={styles.songText}>
                    約 {distanceInfo.songCount} 首歌的距離
                  </Text>
                </View>
              </View>
              <ListingCard 
                listing={listing} 
                onPress={() => handleListingClick(listing)} 
              />
            </View>
          );
        })}
        
        <View style={styles.bottomPadding} />
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
  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    backgroundColor: '#9BB7D4',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  universityMarker: {
    backgroundColor: '#DC2626',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeSortButton: {
    backgroundColor: '#9BB7D4',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeSortButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    paddingVertical: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A4E6B',
  },
  listingWrapper: {
    marginBottom: 16,
  },
  distanceInfo: {
    backgroundColor: 'rgba(155, 183, 212, 0.1)',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3A4E6B',
    marginLeft: 6,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  bottomPadding: {
    height: 100,
  },
});

export default Map;