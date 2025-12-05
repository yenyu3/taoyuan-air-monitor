import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import useStore from '../store/useStore';

const FilterChips = () => {
  const { selectedFilters, setFilters } = useStore();

  const priceRanges = [
    { label: '全部', value: [0, 20000] },
    { label: '2K以下', value: [0, 2000] },
    { label: '2K-3K', value: [2000, 3000] },
    { label: '3K-4K', value: [3000, 4000] },
    { label: '4K以上', value: [4000, 20000] },
  ];

  const roomTypes = [
    { label: '全部', value: '' },
    { label: '套房', value: '套房' },
    { label: '雅房', value: '雅房' },
  ];

  const facilities = [
    { label: '停車場', key: 'hasParking' },
    { label: '家具', key: 'hasFurniture' },
  ];

  const handlePriceRangePress = (range) => {
    setFilters({ ...selectedFilters, priceRange: range });
  };

  const handleRoomTypePress = (roomType) => {
    setFilters({ ...selectedFilters, roomType });
  };

  const handleFacilityPress = (key) => {
    setFilters({ ...selectedFilters, [key]: !selectedFilters[key] });
  };

  const isPriceRangeSelected = (range) => {
    return selectedFilters.priceRange[0] === range[0] && 
           selectedFilters.priceRange[1] === range[1];
  };

  return (
    <View style={styles.container}>
      {/* 價格範圍 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>價格範圍</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {priceRanges.map((range, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  isPriceRangeSelected(range.value) && styles.chipSelected
                ]}
                onPress={() => handlePriceRangePress(range.value)}
              >
                <Text style={[
                  styles.chipText,
                  isPriceRangeSelected(range.value) && styles.chipTextSelected
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 房型 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>房型</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {roomTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  selectedFilters.roomType === type.value && styles.chipSelected
                ]}
                onPress={() => handleRoomTypePress(type.value)}
              >
                <Text style={[
                  styles.chipText,
                  selectedFilters.roomType === type.value && styles.chipTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 設施 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>設施</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {facilities.map((facility, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chip,
                  selectedFilters[facility.key] && styles.chipSelected
                ]}
                onPress={() => handleFacilityPress(facility.key)}
              >
                <Text style={[
                  styles.chipText,
                  selectedFilters[facility.key] && styles.chipTextSelected
                ]}>
                  {facility.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipSelected: {
    backgroundColor: '#3A4E6B',
    borderColor: '#3A4E6B',
  },
  chipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: 'white',
  },
});

export default FilterChips;