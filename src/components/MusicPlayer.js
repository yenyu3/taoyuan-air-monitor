import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const MusicPlayer = ({ songs, walkingTime, songCount }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  if (!songs || songs.length === 0) {
    return null;
  }

  const currentSong = songs[currentSongIndex];

  const handlePlaySong = async (song) => {
    try {
      const supported = await Linking.canOpenURL(song.spotifyUrl);
      if (supported) {
        await Linking.openURL(song.spotifyUrl);
      } else {
        Alert.alert('錯誤', '無法開啟 Spotify 連結');
      }
    } catch (error) {
      Alert.alert('錯誤', '開啟連結時發生錯誤');
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="music" size={20} color="#9BB7D4" />
        <Text style={styles.title}>步行音樂推薦</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          步行時間約 {walkingTime} 分鐘，大概 {songCount} 首歌的距離
        </Text>
      </View>

      <View style={styles.playerContainer}>
        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artistName} numberOfLines={1}>
            {currentSong.artist}
          </Text>
          <Text style={styles.albumName} numberOfLines={1}>
            {currentSong.album}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={prevSong}
            disabled={songs.length <= 1}
          >
            <Feather name="skip-back" size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={() => handlePlaySong(currentSong)}
          >
            <Feather name="play" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={nextSong}
            disabled={songs.length <= 1}
          >
            <Feather name="skip-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.songCounter}>
          {currentSongIndex + 1} / {songs.length}
        </Text>
      </View>

      <View style={styles.playlistContainer}>
        <Text style={styles.playlistTitle}>推薦歌單</Text>
        {songs.map((song, index) => (
          <TouchableOpacity
            key={song.id}
            style={[
              styles.songItem,
              index === currentSongIndex && styles.currentSongItem
            ]}
            onPress={() => setCurrentSongIndex(index)}
          >
            <View style={styles.songItemInfo}>
              <Text style={[
                styles.songItemTitle,
                index === currentSongIndex && styles.currentSongText
              ]} numberOfLines={1}>
                {song.title}
              </Text>
              <Text style={[
                styles.songItemArtist,
                index === currentSongIndex && styles.currentSongText
              ]} numberOfLines={1}>
                {song.artist} • {song.lengthMinutes.toFixed(1)}分
              </Text>
            </View>
            <TouchableOpacity
              style={styles.playIconButton}
              onPress={() => handlePlaySong(song)}
            >
              <Feather name="external-link" size={16} color="#9BB7D4" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A4E6B',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#0369A1',
    textAlign: 'center',
  },
  playerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  albumName: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 8,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    backgroundColor: '#9BB7D4',
    borderRadius: 30,
    padding: 16,
  },
  songCounter: {
    fontSize: 12,
    color: '#6B7280',
  },
  playlistContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  currentSongItem: {
    backgroundColor: '#EBF8FF',
  },
  songItemInfo: {
    flex: 1,
  },
  songItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  songItemArtist: {
    fontSize: 12,
    color: '#6B7280',
  },
  currentSongText: {
    color: '#0369A1',
  },
  playIconButton: {
    padding: 4,
  },
});

export default MusicPlayer;