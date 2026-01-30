import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../components/Logo';
import { GlassCard } from '../components/GlassCard';
import { useStore } from '../store';
import { getEvents, setScenario } from '../api';
import { Severity } from '../types';

interface EventsScreenProps {
  scrollRef?: (ref: any) => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ scrollRef }) => {
  const { 
    events, 
    setEvents, 
    selectedScenario,
    isLoading,
    setIsLoading
  } = useStore();
  
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);

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
      <ScrollView ref={scrollRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>事件庫</Text>
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
                <TouchableOpacity 
                  style={styles.evidenceCard} 
                  onPress={() => setSelectedEvidence('地圖回放')}
                >
                  <Text style={styles.evidenceCardTitle}>地圖回放</Text>
                  <View style={styles.evidencePlaceholder}>
                    <View style={styles.mockChart}>
                      <View style={[styles.mockBar, { height: 20, backgroundColor: '#6A8D73' }]} />
                      <View style={[styles.mockBar, { height: 35, backgroundColor: '#F4A261' }]} />
                      <View style={[styles.mockBar, { height: 45, backgroundColor: '#E76F51' }]} />
                      <View style={[styles.mockBar, { height: 30, backgroundColor: '#6A8D73' }]} />
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.evidenceCard}
                  onPress={() => setSelectedEvidence('趨勢分析')}
                >
                  <Text style={styles.evidenceCardTitle}>趨勢分析</Text>
                  <View style={styles.evidencePlaceholder}>
                    <View style={styles.mockLineChart}>
                      <View style={styles.chartLine} />
                      <View style={styles.chartPoints}>
                        {[20, 35, 45, 30, 25].map((height, i) => (
                          <View key={i} style={[styles.chartPoint, { bottom: height }]} />
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.evidenceCard}
                  onPress={() => setSelectedEvidence('風場資料')}
                >
                  <Text style={styles.evidenceCardTitle}>風場資料</Text>
                  <View style={styles.evidencePlaceholder}>
                    <View style={styles.mockWindChart}>
                      <Text style={styles.windArrow}>→</Text>
                      <Text style={styles.windSpeed}>12 m/s</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.evidenceCard}
                  onPress={() => setSelectedEvidence('垂直剖面')}
                >
                  <Text style={styles.evidenceCardTitle}>垂直剖面</Text>
                  <View style={styles.evidencePlaceholder}>
                    <View style={styles.mockProfileChart}>
                      <View style={[styles.profileLayer, { backgroundColor: '#E76F51', width: '80%' }]} />
                      <View style={[styles.profileLayer, { backgroundColor: '#F4A261', width: '60%' }]} />
                      <View style={[styles.profileLayer, { backgroundColor: '#6A8D73', width: '40%' }]} />
                      <View style={[styles.profileLayer, { backgroundColor: '#6A8D73', width: '20%' }]} />
                    </View>
                  </View>
                </TouchableOpacity>
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

      {/* Evidence Detail Modal */}
      <Modal
        visible={selectedEvidence !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEvidence(null)}
      >
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.evidenceModal}>
            <Text style={styles.modalTitle}>{selectedEvidence}</Text>
            
            <View style={styles.evidenceDetail}>
              {selectedEvidence === '地圖回放' && (
                <View style={styles.detailChart}>
                  <View style={styles.chartGrid}>
                    {Array.from({ length: 16 }, (_, i) => (
                      <View 
                        key={i} 
                        style={[
                          styles.gridCell, 
                          { backgroundColor: `rgba(106, 141, 115, ${0.2 + (i % 4) * 0.2})` }
                        ]} 
                      />
                    ))}
                  </View>
                  <Text style={styles.chartLabel}>PM2.5 濃度分布 (μg/m³)</Text>
                </View>
              )}
              
              {selectedEvidence === '趨勢分析' && (
                <View style={styles.detailChart}>
                  <View style={styles.lineChart}>
                    <View style={styles.chartLine} />
                    <View style={styles.chartPoints}>
                      {[20, 35, 45, 30, 25].map((height, i) => (
                        <View key={i} style={[styles.chartPoint, { bottom: height }]} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.chartLabel}>24小時變化趨勢</Text>
                </View>
              )}
              
              {selectedEvidence === '風場資料' && (
                <View style={styles.detailChart}>
                  <View style={styles.windChart}>
                    <Text style={styles.windDirection}>→</Text>
                    <Text style={styles.windSpeed}>12 m/s</Text>
                    <Text style={styles.windInfo}>東北風</Text>
                    <Text style={styles.windTemp}>溫度: 25°C</Text>
                    <Text style={styles.windHumidity}>濕度: 65%</Text>
                  </View>
                  <Text style={styles.chartLabel}>氣象條件</Text>
                </View>
              )}
              
              {selectedEvidence === '垂直剖面' && (
                <View style={styles.detailChart}>
                  <View style={styles.profileChart}>
                    <View style={styles.profileAxis}>
                      <Text style={styles.axisLabel}>1000m</Text>
                      <Text style={styles.axisLabel}>500m</Text>
                      <Text style={styles.axisLabel}>100m</Text>
                      <Text style={styles.axisLabel}>0m</Text>
                    </View>
                    <View style={styles.profileBars}>
                      <View style={[styles.profileBar, { height: 60, backgroundColor: '#E76F51' }]} />
                      <View style={[styles.profileBar, { height: 45, backgroundColor: '#F4A261' }]} />
                      <View style={[styles.profileBar, { height: 30, backgroundColor: '#6A8D73' }]} />
                      <View style={[styles.profileBar, { height: 20, backgroundColor: '#6A8D73' }]} />
                    </View>
                  </View>
                  <Text style={styles.chartLabel}>高度分布剖面</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedEvidence(null)}
            >
              <Text style={styles.modalCloseText}>關閉</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>
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
  mockChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 40,
    width: '100%',
  },
  mockBar: {
    width: 8,
    borderRadius: 2,
  },
  mockLine: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  mockLineChart: {
    width: '100%',
    height: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  mockWindChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  windArrow: {
    fontSize: 20,
    color: '#6A8D73',
    marginBottom: 4,
  },
  mockProfileChart: {
    width: '100%',
    gap: 4,
    alignItems: 'flex-start',
  },
  profileLayer: {
    height: 8,
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceModal: {
    margin: 20,
    padding: 20,
    minWidth: 300,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 20,
    textAlign: 'center',
  },
  evidenceDetail: {
    marginBottom: 20,
  },
  detailChart: {
    alignItems: 'center',
  },
  chartGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  gridCell: {
    width: 48,
    height: 48,
    margin: 1,
    borderRadius: 4,
  },
  lineChart: {
    width: 200,
    height: 100,
    position: 'relative',
    marginBottom: 10,
  },
  chartLine: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#6A8D73',
  },
  chartPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  chartPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6A8D73',
    position: 'absolute',
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#6A8D73',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  windChart: {
    alignItems: 'center',
    padding: 20,
  },
  windDirection: {
    fontSize: 40,
    color: '#6A8D73',
    marginBottom: 10,
  },
  windSpeed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A8D73',
    marginBottom: 5,
  },
  windInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  windTemp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  windHumidity: {
    fontSize: 14,
    color: '#666',
  },
  profileChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 10,
  },
  profileAxis: {
    justifyContent: 'space-between',
    height: 100,
    marginRight: 10,
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
  },
  profileBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    flex: 1,
  },
  profileBar: {
    flex: 1,
    borderRadius: 4,
  },
});