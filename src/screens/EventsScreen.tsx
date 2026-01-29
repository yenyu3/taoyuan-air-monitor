import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../components/Logo';
import { GlassCard } from '../components/GlassCard';
import { useStore } from '../store';
import { getEvents, setScenario } from '../api';
import { Severity } from '../types';

export const EventsScreen: React.FC = () => {
  const { 
    events, 
    setEvents, 
    selectedScenario,
    isLoading,
    setIsLoading 
  } = useStore();

  useEffect(() => {
    loadEvents();
  }, [selectedScenario]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      setScenario(selectedScenario);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case '低': return '#6A8D73';
      case '中': return '#F4A261';
      case '高': return '#E76F51';
      default: return '#6A8D73';
    }
  };

  const getHealthImpactColor = (impact: Severity) => {
    switch (impact) {
      case '低': return '#6A8D73';
      case '中': return '#F4A261';
      case '高': return '#E76F51';
      default: return '#6A8D73';
    }
  };

  return (
    <LinearGradient
      colors={['#F4F2E9', '#E8E6D3']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Logo size="medium" />
            <Text style={styles.title}>事件庫</Text>
          </View>
        </View>

        {/* Event List */}
        {events.map((event) => (
          <GlassCard key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <View style={styles.eventTitleRow}>
                <Text style={styles.eventType}>{event.type}</Text>
                <View style={styles.badges}>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(event.severity) }]}>
                    <Text style={styles.badgeText}>嚴重度: {event.severity}</Text>
                  </View>
                  <View style={[styles.healthBadge, { backgroundColor: getHealthImpactColor(event.healthImpact) }]}>
                    <Text style={styles.badgeText}>健康影響: {event.healthImpact}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.eventMeta}>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString('zh-TW')} {new Date(event.date).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.eventArea}>{event.area}</Text>
              </View>
            </View>

            <Text style={styles.eventNote}>{event.note}</Text>

            {/* Event Detail Placeholder */}
            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>證據資料</Text>
              <View style={styles.evidenceGrid}>
                <View style={styles.evidenceCard}>
                  <Text style={styles.evidenceCardTitle}>地圖回放</Text>
                  <View style={styles.evidencePlaceholder}>
                    <Text style={styles.placeholderText}>時空分布</Text>
                  </View>
                </View>
                <View style={styles.evidenceCard}>
                  <Text style={styles.evidenceCardTitle}>趨勢分析</Text>
                  <View style={styles.evidencePlaceholder}>
                    <Text style={styles.placeholderText}>時間序列</Text>
                  </View>
                </View>
                <View style={styles.evidenceCard}>
                  <Text style={styles.evidenceCardTitle}>風場資料</Text>
                  <View style={styles.evidencePlaceholder}>
                    <Text style={styles.placeholderText}>氣象條件</Text>
                  </View>
                </View>
                <View style={styles.evidenceCard}>
                  <Text style={styles.evidenceCardTitle}>垂直剖面</Text>
                  <View style={styles.evidencePlaceholder}>
                    <Text style={styles.placeholderText}>高度分布</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Expert Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>專家註記</Text>
              <TextInput
                style={styles.notesInput}
                placeholder={
                  event.severity === '高' 
                    ? '此事件可能與工業排放異常有關，建議進一步調查排放源...' 
                    : '點擊添加專家註記...'
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>匯出 PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                <Text style={[styles.actionButtonText, styles.primaryButtonText]}>提交審核</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        ))}

        {/* Empty State */}
        {events.length === 0 && !isLoading && (
          <GlassCard style={styles.emptyState}>
            <Text style={styles.emptyStateText}>目前沒有事件記錄</Text>
            <Text style={styles.emptyStateSubtext}>當系統偵測到異常事件時，會自動在此顯示</Text>
          </GlassCard>
        )}

        {/* Add Event Button */}
        <TouchableOpacity style={styles.addEventButton}>
          <Text style={styles.addEventButtonText}>+ 新增事件</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A8D73',
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A8D73',
    flex: 1,
  },
  badges: {
    gap: 4,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  eventMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 12,
    color: '#888',
  },
  eventArea: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  eventNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  evidenceSection: {
    marginBottom: 16,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 8,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  evidenceCard: {
    width: '48%',
    backgroundColor: 'rgba(106, 141, 115, 0.05)',
    borderRadius: 12,
    padding: 8,
  },
  evidenceCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 4,
  },
  evidencePlaceholder: {
    height: 60,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#888',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 60,
    backgroundColor: 'rgba(106, 141, 115, 0.05)',
    borderRadius: 12,
    padding: 12,
    fontSize: 12,
    color: '#666',
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#6A8D73',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  primaryButtonText: {
    color: 'white',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  addEventButton: {
    backgroundColor: '#6A8D73',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addEventButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});