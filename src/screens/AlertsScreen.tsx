import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { GlassCard } from '../components/GlassCard';
import { useStore } from '../store';
import { getAlerts, setScenario } from '../api';
import { AlertKind } from '../types';

export const AlertsScreen: React.FC = () => {
  const { 
    alerts, 
    setAlerts, 
    selectedScenario,
    isLoading,
    setIsLoading 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'GOV' | 'HEALTH'>('GOV');
  const [thresholds, setThresholds] = useState({
    pm25: 35,
    o3: 100,
    nox: 200
  });

  useEffect(() => {
    loadAlerts();
  }, [selectedScenario]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      setScenario(selectedScenario);
      const alertsData = await getAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => alert.kind === activeTab);

  const getAlertColor = (kind: AlertKind) => {
    return kind === 'GOV' ? '#6A8D73' : '#F4A261';
  };

  const estimateAffectedAlerts = (threshold: number) => {
    // Mock calculation based on threshold
    const baseCount = 5;
    const factor = threshold < 50 ? 1.5 : threshold > 70 ? 0.5 : 1;
    return Math.round(baseCount * factor);
  };

  return (
    <LinearGradient
      colors={['#F4F2E9', '#E8E6D3']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>警報與 AI</Text>

        {/* Tab Selector */}
        <GlassCard style={styles.tabSelector}>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, activeTab === 'GOV' && styles.activeSegment]}
              onPress={() => setActiveTab('GOV')}
            >
              <Text style={[styles.segmentText, activeTab === 'GOV' && styles.activeSegmentText]}>
                治理警報
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, activeTab === 'HEALTH' && styles.activeSegment]}
              onPress={() => setActiveTab('HEALTH')}
            >
              <Text style={[styles.segmentText, activeTab === 'HEALTH' && styles.activeSegmentText]}>
                健康提醒
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Threshold Settings */}
        <GlassCard style={styles.thresholdCard}>
          <Text style={styles.sectionTitle}>門檻設定</Text>
          
          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Text style={styles.thresholdLabel}>PM2.5</Text>
              <Text style={styles.thresholdValue}>{thresholds.pm25} µg/m³</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
              value={thresholds.pm25}
              onValueChange={(value) => setThresholds(prev => ({ ...prev, pm25: Math.round(value) }))}
              minimumTrackTintColor="#6A8D73"
              maximumTrackTintColor="rgba(106, 141, 115, 0.3)"
              thumbStyle={styles.sliderThumb}
            />
            <Text style={styles.thresholdImpact}>
              預計影響 {estimateAffectedAlerts(thresholds.pm25)} 個警報
            </Text>
          </View>

          <View style={styles.thresholdItem}>
            <View style={styles.thresholdHeader}>
              <Text style={styles.thresholdLabel}>O₃</Text>
              <Text style={styles.thresholdValue}>{thresholds.o3} µg/m³</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={200}
              value={thresholds.o3}
              onValueChange={(value) => setThresholds(prev => ({ ...prev, o3: Math.round(value) }))}
              minimumTrackTintColor="#6A8D73"
              maximumTrackTintColor="rgba(106, 141, 115, 0.3)"
              thumbStyle={styles.sliderThumb}
            />
            <Text style={styles.thresholdImpact}>
              預計影響 {estimateAffectedAlerts(thresholds.o3)} 個警報
            </Text>
          </View>
        </GlassCard>

        {/* Alerts List */}
        <GlassCard style={styles.alertsList}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'GOV' ? '治理警報' : '健康提醒'} ({filteredAlerts.length})
          </Text>
          
          {filteredAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <View style={styles.alertTitleRow}>
                  <View style={[styles.alertBadge, { backgroundColor: getAlertColor(alert.kind) }]}>
                    <Text style={styles.alertBadgeText}>
                      {alert.kind === 'GOV' ? '治理' : '健康'}
                    </Text>
                  </View>
                  <Switch
                    value={alert.enabled}
                    onValueChange={() => {
                      // Toggle alert enabled state
                      const updatedAlerts = alerts.map(a => 
                        a.id === alert.id ? { ...a, enabled: !a.enabled } : a
                      );
                      setAlerts(updatedAlerts);
                    }}
                    trackColor={{ false: '#E0E0E0', true: '#6A8D73' }}
                    thumbColor={alert.enabled ? '#FFFFFF' : '#F4F4F4'}
                  />
                </View>
                
                <Text style={styles.alertMessage}>{alert.message}</Text>
                
                <View style={styles.alertMeta}>
                  <Text style={styles.alertTarget}>
                    {alert.targetType}: {alert.targetId}
                  </Text>
                  <Text style={styles.alertThreshold}>
                    門檻: {alert.threshold} µg/m³
                  </Text>
                </View>
                
                <Text style={styles.alertDate}>
                  建立於 {new Date(alert.createdAt).toLocaleDateString('zh-TW')}
                </Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* AI Section */}
        <GlassCard style={styles.aiSection}>
          <Text style={styles.sectionTitle}>AI 分析</Text>
          
          {/* Anomaly Detection */}
          <View style={styles.aiCard}>
            <Text style={styles.aiCardTitle}>異常偵測</Text>
            <Text style={styles.aiCardContent}>
              偵測到 3 個站點同步突升，可能為區域性污染事件
            </Text>
            <View style={styles.aiCardActions}>
              <TouchableOpacity style={styles.aiActionButton}>
                <Text style={styles.aiActionButtonText}>查看詳情</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cause Analysis */}
          <View style={styles.aiCard}>
            <Text style={styles.aiCardTitle}>成因分析</Text>
            <Text style={styles.aiCardContent}>
              主要影響因子：風場變化 (40%)、工業廊帶 (35%)、邊界層高度 (25%)
            </Text>
            <View style={styles.aiCardActions}>
              <TouchableOpacity style={styles.aiActionButton}>
                <Text style={styles.aiActionButtonText}>詳細分析</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forecast */}
          <View style={styles.aiCard}>
            <Text style={styles.aiCardTitle}>預報建議</Text>
            <View style={styles.forecastRow}>
              <View style={styles.forecastItem}>
                <Text style={styles.forecastLabel}>+1h</Text>
                <Text style={styles.forecastValue}>52±8</Text>
              </View>
              <View style={styles.forecastItem}>
                <Text style={styles.forecastLabel}>+3h</Text>
                <Text style={styles.forecastValue}>48±12</Text>
              </View>
              <View style={styles.forecastItem}>
                <Text style={styles.forecastLabel}>+6h</Text>
                <Text style={styles.forecastValue}>45±15</Text>
              </View>
            </View>
          </View>

          {/* Recommended Actions */}
          <View style={styles.aiCard}>
            <Text style={styles.aiCardTitle}>建議動作</Text>
            <View style={styles.recommendedActions}>
              <TouchableOpacity style={styles.recommendedAction}>
                <Text style={styles.recommendedActionText}>啟動健康提醒</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recommendedAction}>
                <Text style={styles.recommendedActionText}>建立事件草稿</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>

        {/* Add Alert Button */}
        <TouchableOpacity style={styles.addAlertButton}>
          <Text style={styles.addAlertButtonText}>+ 新增警報</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A8D73',
    marginTop: 40,
    marginBottom: 20,
  },
  tabSelector: {
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
  thresholdCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 16,
  },
  thresholdItem: {
    marginBottom: 20,
  },
  thresholdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  thresholdValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A8D73',
  },
  slider: {
    height: 40,
    marginBottom: 4,
  },
  sliderThumb: {
    backgroundColor: '#6A8D73',
    width: 20,
    height: 20,
  },
  thresholdImpact: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  alertsList: {
    marginBottom: 16,
  },
  alertItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(106, 141, 115, 0.1)',
  },
  alertHeader: {
    gap: 8,
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  alertMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertTarget: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  alertThreshold: {
    fontSize: 12,
    color: '#888',
  },
  alertDate: {
    fontSize: 10,
    color: '#888',
  },
  aiSection: {
    marginBottom: 16,
  },
  aiCard: {
    backgroundColor: 'rgba(106, 141, 115, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 8,
  },
  aiCardContent: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 8,
  },
  aiCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  aiActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#6A8D73',
    borderRadius: 12,
  },
  aiActionButtonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  forecastItem: {
    alignItems: 'center',
  },
  forecastLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
  },
  forecastValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A8D73',
  },
  recommendedActions: {
    flexDirection: 'row',
    gap: 8,
  },
  recommendedAction: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  recommendedActionText: {
    fontSize: 10,
    color: '#6A8D73',
    fontWeight: '600',
  },
  addAlertButton: {
    backgroundColor: '#6A8D73',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  addAlertButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});