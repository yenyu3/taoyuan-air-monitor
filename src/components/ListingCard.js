import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import useStore from '../store/useStore';

const ListingCard = ({ listing, onPress }) => {
  const { currentUser, toggleFavorite } = useStore();
  const isFavorited = currentUser.favorites.includes(listing.id);
  
  const handleFavoritePress = () => {
    toggleFavorite(listing.id);
  };

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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: listing.photos[0] }} style={styles.image} />
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
      >
        <Feather
          name="heart"
          size={20}
          color={isFavorited ? "#EF4444" : "#9CA3AF"}
        />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatPrice(listing.rentMin, listing.rentMax)}
          </Text>
          <Text style={styles.priceUnit}>/月</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text style={styles.address} numberOfLines={1}>
            {listing.address}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Feather name="navigation" size={14} color="#6B7280" />
          <Text style={styles.distance}>
            距離中大 {getDistanceText(listing.distanceToCampusMeters)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={14} color="#F59E0B" />
            <Text style={styles.rating}>{listing.avgRating}</Text>
            <Text style={styles.reviewCount}>({listing.reviewsCount})</Text>
          </View>
          
          <View style={styles.roomTypeContainer}>
            <Text style={styles.roomType}>{listing.rooms}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3A4E6B',
  },
  priceUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  roomTypeContainer: {
    backgroundColor: '#E4DFD8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roomType: {
    fontSize: 12,
    color: '#3A4E6B',
    fontWeight: '500',
  },
});

export default ListingCard;