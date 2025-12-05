import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import useStore from '../store/useStore';

const MissionList = () => {
  const { missions, completeMission } = useStore();

  const handleCompleteMission = (missionId) => {
    completeMission(missionId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="award" size={20} color="#3A4E6B" />
        <Text style={styles.title}>每日任務</Text>
      </View>
      
      <View style={styles.missionsList}>
        {missions.map((mission) => (
          <View
            key={mission.id}
            style={[
              styles.missionCard,
              mission.completed && styles.completedCard
            ]}
          >
            <View style={styles.missionContent}>
              <View style={styles.missionHeader}>
                <Feather 
                  name={mission.completed ? "check-circle" : "circle"} 
                  size={20} 
                  color={mission.completed ? "#10B981" : "#9CA3AF"} 
                />
                <Text style={[
                  styles.missionTitle,
                  mission.completed && styles.completedTitle
                ]}>
                  {mission.title}
                </Text>
              </View>
              
              <Text style={styles.missionDescription}>
                {mission.description}
              </Text>
              
              <View style={styles.missionFooter}>
                <Text style={styles.pointsText}>
                  +{mission.points} 點數
                </Text>
                {!mission.completed && (
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleCompleteMission(mission.id)}
                  >
                    <Text style={styles.completeButtonText}>完成</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A4E6B',
    marginLeft: 8,
  },
  missionsList: {
    gap: 12,
  },
  missionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  missionContent: {
    flex: 1,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3A4E6B',
    marginLeft: 8,
    flex: 1,
  },
  completedTitle: {
    color: '#059669',
  },
  missionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9BB7D4',
  },
  completeButton: {
    backgroundColor: '#9BB7D4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MissionList;