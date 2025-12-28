import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const MusicPlayer = ({ songs, musicPlatform, walkingTime }) => {
  const handleSongPress = async (song) => {
    try {
      const url = song.url;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          '無法開啟連結',
          `請確認已安裝 ${musicPlatform === 'youtube' ? 'YouTube Music' : 'Spotify'} 應用程式`
        );
      }
    } catch (error) {
      Alert.alert('錯誤', '無法開啟音樂連結');
    }
  };

  const getPlatformIcon = () => {
    return musicPlatform === 'youtube' ? 'play' : 'music';
  };

  const getPlatformColor = () => {
    return musicPlatform === 'youtube' ? '#FF0000' : '#1DB954';
  };

  if (!songs || songs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name={getPlatformIcon()} size={20} color={getPlatformColor()} />
          <Text style={styles.headerTitle}>
            步行 {walkingTime} 分鐘的歌單
          </Text>
        </View>
        <View style={styles.platformBadge}>
          <Text style={[styles.platformText, { color: getPlatformColor() }]}>
            {musicPlatform === 'youtube' ? 'YouTube Music' : 'Spotify'}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        約 {songs.length} 首歌的距離，為你推薦適合的歌曲
      </Text>

      <View style={styles.songsList}>
        {songs.map((song, index) => (
          <TouchableOpacity
            key={song.id}
            style={styles.songItem}
            onPress={() => handleSongPress(song)}
          >
            <View style={styles.songInfo}>
              <View style={styles.songNumber}>
                <Text style={styles.songNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.songDetails}>
                <Text style={styles.songTitle} numberOfLines={1}>
                  {song.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>
                  {song.artist} • {song.album}
                </Text>
              </View>
            </View>
            <View style={styles.songActions}>
              <Text style={styles.songDuration}>
                {Math.floor(song.lengthMinutes)}:{String(Math.round((song.lengthMinutes % 1) * 60)).padStart(2, '0')}
              </Text>
              <Feather name="external-link" size={16} color="#6B7280" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          點擊歌曲即可在 {musicPlatform === 'youtube' ? 'YouTube Music' : 'Spotify'} 中播放
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  platformBadge: {
    backgroundColor: 'rgba(107, 155, 210, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformText: {
    fontSize: 12,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  songsList: {
    gap: 8,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  songNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  songNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  songArtist: {
    fontSize: 12,
    color: '#6B7280',
  },
  songActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  songDuration: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default MusicPlayer;