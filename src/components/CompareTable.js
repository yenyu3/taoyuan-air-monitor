import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getDistanceInfo } from '../utils/distanceUtils';

const CompareTable = ({ listings }) => {
  if (listings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>請選擇 2-3 間房源進行比較</Text>
      </View>
    );
  }

  const compareItems = [
    { key: 'title', label: '房源名稱' },
    { key: 'rent', label: '租金' },
    { key: 'rooms', label: '房型' },
    { key: 'distance', label: '距離中大' },
    { key: 'rating', label: '評價' },
    { key: 'facilities', label: '主要設施' },
    { key: 'parking', label: '停車位' },
    { key: 'contact', label: '聯絡人' }
  ];

  const renderCell = (listing, key) => {
    switch (key) {
      case 'title':
        return listing.title;
      case 'rent':
        return `$${listing.rentMin.toLocaleString()}${listing.rentMin !== listing.rentMax ? ` - ${listing.rentMax.toLocaleString()}` : ''}`;
      case 'rooms':
        return listing.rooms;
      case 'distance':
        const distanceInfo = getDistanceInfo(listing.distanceToCampusMeters);
        return `${distanceInfo.distance} (${distanceInfo.walkingTime}分鐘)`;
      case 'rating':
        return (
          <View style={styles.ratingContainer}>
            <Feather name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{listing.avgRating}</Text>
          </View>
        );
      case 'facilities':
        return listing.indoorFacilities.slice(0, 3).join(', ') + 
               (listing.indoorFacilities.length > 3 ? '...' : '');
      case 'parking':
        return listing.publicFacilities.includes('停車場') ? '✅' : '❌';
      case 'contact':
        return listing.contactName;
      default:
        return '';
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* 表頭 */}
        <View style={styles.headerRow}>
          <View style={[styles.cell, styles.headerCell, styles.labelCell]}>
            <Text style={styles.headerText}>比較項目</Text>
          </View>
          {listings.map((listing) => (
            <View key={listing.id} style={[styles.cell, styles.headerCell, styles.dataCell]}>
              <Text style={styles.headerText} numberOfLines={2}>
                {listing.title}
              </Text>
            </View>
          ))}
        </View>

        {/* 表格內容 */}
        {compareItems.map((item) => (
          <View key={item.key} style={styles.row}>
            <View style={[styles.cell, styles.labelCell, styles.labelCellBg]}>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
            {listings.map((listing) => (
              <View key={listing.id} style={[styles.cell, styles.dataCell]}>
                <View style={styles.cellContent}>
                  {typeof renderCell(listing, item.key) === 'string' ? (
                    <Text style={styles.cellText} numberOfLines={3}>
                      {renderCell(listing, item.key)}
                    </Text>
                  ) : (
                    renderCell(listing, item.key)
                  )}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
  table: {
    minWidth: 600,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  headerCell: {
    backgroundColor: '#F3F4F6',
  },
  labelCell: {
    width: 120,
  },
  dataCell: {
    width: 200,
  },
  labelCellBg: {
    backgroundColor: '#F9FAFB',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  cellContent: {
    minHeight: 20,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
  },
});

export default CompareTable;