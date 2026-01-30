import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { GlassCard } from '../components/GlassCard';
import { KpiCard } from '../components/KpiCard';
import { Logo } from '../components/Logo';
import { HealthBadge } from '../components/HealthBadge';
import { getMeta, getGrid, getAlerts, getEvents, setScenario } from '../api';

interface DashboardScreenProps {
  scrollRef?: (ref: any) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ scrollRef }) => {
  const { 
    role, 
    setRole, 
    selectedScenario, 
    setSelectedScenario,
    gridCells,
    setGridCells,
    alerts,
    setAlerts,
    events,
    setEvents,
    isLoading,
    setIsLoading
  } = useStore();

  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [selectedScenario]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      setScenario(selectedScenario);
      const [meta, grid, alertsData, eventsData] = await Promise.all([
        getMeta(),
        getGrid({ pollutant: 'PM25' }),
        getAlerts(),
        getEvents()
      ]);
      
      setGridCells(grid);
      setAlerts(alertsData);
      setEvents(eventsData);
      setLastUpdate(new Date(meta.lastUpdate).toLocaleTimeString());
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getKpiData = () => {
    if (gridCells.length === 0) return null;
    
    const avgPM25 = Math.round(
      gridCells.reduce((sum, cell) => sum + cell.values.value, 0) / gridCells.length
    );
    
    const maxCell = gridCells.reduce((max, cell) => 
      cell.values.value > max.values.value ? cell : max
    );
    
    const healthyCount = gridCells.filter(cell => cell.health.aqi <= 50).length;
    const totalCells = gridCells.length;
    
    if (role === 'epa') {
      return {
        avgPM25,
        hotspot: `${maxCell.gridId} (${Math.round(maxCell.values.value)}µg/m³)`,
        peak24h: Math.round(avgPM25 * 1.2),
        change2h: Math.round((Math.random() - 0.5) * 10),
        healthyRatio: Math.round((healthyCount / totalCells) * 100)
      };
    } else {
      return {
        dataCompleteness: Math.round(95 + Math.random() * 5),
        qcAnomalies: Math.floor(Math.random() * 5),
        pipelineId: `RUN_${Date.now().toString().slice(-6)}`,
        apiLatency: Math.round(150 + Math.random() * 100),
        healthyRatio: Math.round((healthyCount / totalCells) * 100)
      };
    }
  };

  const kpiData = getKpiData();

  if (isLoading || !kpiData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A8D73" />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#F4F2E9', '#E8E6D3']}
      style={styles.container}
    >
      <ScrollView ref={scrollRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Logo size="medium" />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Taoyuan Air</Text>
              <Text style={styles.subtitle}>Hourly • 3km Grid • Forecast + Health</Text>
            </View>
          </View>
        </View>

        {/* Role Switch */}
        <GlassCard style={styles.roleSwitch}>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, role === 'epa' && styles.activeSegment]}
              onPress={() => setRole('epa')}
            >
              <Text style={[styles.segmentText, role === 'epa' && styles.activeSegmentText]}>
                EPA
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, role === 'team' && styles.activeSegment]}
              onPress={() => setRole('team')}
            >
              <Text style={[styles.segmentText, role === 'team' && styles.activeSegmentText]}>
                Team
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Scenario Switch */}
        <GlassCard style={styles.scenarioSwitch}>
          <Text style={styles.sectionTitle}>情境模式</Text>
          <View style={styles.scenarioButtons}>
            {(['normal', 'industrial', 'event'] as const).map((scenario) => (
              <TouchableOpacity
                key={scenario}
                style={[
                  styles.scenarioButton,
                  selectedScenario === scenario && styles.activeScenarioButton
                ]}
                onPress={() => setSelectedScenario(scenario)}
              >
                <Text style={[
                  styles.scenarioButtonText,
                  selectedScenario === scenario && styles.activeScenarioButtonText
                ]}>
                  {scenario === 'normal' ? '正常' : scenario === 'industrial' ? '工業' : '事件'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* KPI Cards */}
        <View style={styles.kpiSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kpiScrollContainer}
          >
            {role === 'epa' ? (
              <>
                <View style={[styles.kpiCard, { width: 140 }]}>
                  <Text style={styles.kpiTitle}>全市 PM2.5</Text>
                  <View style={styles.kpiValueRow}>
                    <Text style={styles.kpiValue}>{kpiData.avgPM25}</Text>
                    <Text style={styles.kpiUnit}>μg/m³</Text>
                  </View>
                </View>
                <View style={[styles.kpiCard, { width: 200 }]}>
                  <Text style={styles.kpiTitle}>最高熱點</Text>
                  <Text style={styles.kpiValue} numberOfLines={1} ellipsizeMode="tail">{kpiData.hotspot}</Text>
                </View>
                <View style={[styles.kpiCard, { width: 140 }]}>
                  <Text style={styles.kpiTitle}>24h 峰值</Text>
                  <View style={styles.kpiValueRow}>
                    <Text style={styles.kpiValue}>{kpiData.peak24h}</Text>
                    <Text style={styles.kpiUnit}>μg/m³</Text>
                  </View>
                </View>
                <View style={[styles.kpiCard, { width: 150 }]}>
                  <Text style={styles.kpiTitle}>近2h變化</Text>
                  <View style={styles.kpiValueRow}>
                    <Text style={styles.kpiValue}>
                      {kpiData.change2h > 0 ? `+${kpiData.change2h}` : kpiData.change2h}
                    </Text>
                    <Text style={styles.kpiUnit}>μg/m³</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.kpiCard, { width: 150 }]}>
                  <Text style={styles.kpiTitle}>資料完整率</Text>
                  <View style={styles.kpiValueRow}>
                    <Text style={styles.kpiValue}>{kpiData.dataCompleteness}</Text>
                    <Text style={styles.kpiUnit}>%</Text>
                  </View>
                </View>
                <View style={[styles.kpiCard, { width: 120 }]}>
                  <Text style={styles.kpiTitle}>QC異常</Text>
                  <View style={styles.kpiValueRow}>
                    <Text style={styles.kpiValue}>{kpiData.qcAnomalies}</Text>
                    <Text style={styles.kpiUnit}>筆</Text>
                  </View>
                </View>
                <View style={[styles.kpiCard, { width: 160 }]}>
                  <Text style={styles.kpiTitle}>Pipeline ID</Text>
                  <Text style={styles.kpiValue}>{kpiData.pipelineId}</Text>
                </View>
                <View style={[styles.kpiCard, { width: 130 }]}>
                  <Text style={styles.kpiTitle}>API延遲</Text>
                  <View style={styles.kpiValueRow}>
                    <Text style={styles.kpiValue}>{kpiData.apiLatency}</Text>
                    <Text style={styles.kpiUnit}>ms</Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>

        {/* Health Card */}
        <GlassCard style={styles.healthCard}>
          <Text style={styles.sectionTitle}>健康狀況</Text>
          <View style={styles.healthContent}>
            <HealthBadge 
              level={kpiData.healthyRatio > 80 ? '良好' : kpiData.healthyRatio > 60 ? '普通' : '對敏感族群不健康'} 
              size="large" 
            />
            <Text style={styles.healthText}>
              {kpiData.healthyRatio}% 區域空氣品質良好
            </Text>
          </View>
        </GlassCard>

        {/* Alerts Preview */}
        <GlassCard style={styles.alertsPreview}>
          <Text style={styles.sectionTitle}>警報概覽</Text>
          {alerts.slice(0, 3).map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={[styles.alertBadge, { backgroundColor: alert.kind === 'GOV' ? '#6A8D73' : '#F4A261' }]}>
                <Text style={styles.alertBadgeText}>{alert.kind === 'GOV' ? '治理' : '健康'}</Text>
              </View>
              <Text style={styles.alertText}>{alert.message}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Events Ticker */}
        <GlassCard style={styles.eventsPreview}>
          <Text style={styles.sectionTitle}>近期事件</Text>
          {events.slice(0, 2).map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <Text style={styles.eventType}>{event.type}</Text>
              <Text style={styles.eventArea}>{event.area}</Text>
              <Text style={styles.eventNote}>{event.note}</Text>
            </View>
          ))}
        </GlassCard>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F2E9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6A8D73',
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A8D73',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  roleSwitch: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    borderRadius: 20,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeSegment: {
    backgroundColor: '#6A8D73',
  },
  segmentText: {
    fontSize: 14,
    color: '#6A8D73',
    fontWeight: '600',
  },
  activeSegmentText: {
    color: 'white',
  },
  scenarioSwitch: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 12,
  },
  scenarioButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scenarioButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    alignItems: 'center',
  },
  activeScenarioButton: {
    backgroundColor: '#6A8D73',
  },
  scenarioButtonText: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  activeScenarioButtonText: {
    color: 'white',
  },
  kpiSection: {
    marginBottom: 16,
  },
  kpiScrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  kpiCard: {
    backgroundColor: 'rgba(244, 242, 233, 0.8)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#6A8D73',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(106, 141, 115, 0.15)',
    height: 80,
  },
  kpiValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A8D73',
    marginBottom: 4,
  },
  kpiUnit: {
    fontSize: 12,
    color: '#666',
  },
  healthCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  healthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  healthText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  alertsPreview: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  alertText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  eventsPreview: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  eventItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(106, 141, 115, 0.1)',
  },
  eventType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A8D73',
  },
  eventArea: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  eventNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 100,
  },
});