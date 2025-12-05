import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Logo = ({ size = 'md' }) => {
  const isLarge = size === 'lg';
  
  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, isLarge && styles.logoContainerLarge]}>
        <Feather 
          name="home" 
          size={isLarge ? 32 : 24} 
          color="#3A4E6B" 
        />
        <Text style={[styles.logoText, isLarge && styles.logoTextLarge]}>
          NCU RentEase
        </Text>
      </View>
      {isLarge && (
        <Text style={styles.subtitle}>中大校外租屋小幫手</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoContainerLarge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A4E6B',
    marginLeft: 8,
  },
  logoTextLarge: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
});

export default Logo;