import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import { useStore } from '../store';

export const ExplorerScreen: React.FC = () => {
  const { selectedPollutant, setSelectedPollutant } = useStore();
  const [timeRange, setTimeRange] = useState({ start: '', end: '' });
  const [selectedSources, setSelectedSources] = useState<string[]>(['EPA']);
  const [selectedArea, setSelectedArea] = useState('全市');

  const sources = ['EPA', '微感測', '光達', 'UAV'];
  const areas = ['全市', '桃園區', '中壢區', '大園區', '觀音區', '龜山區'];

  const toggleSource = (source: string) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  const mockResults = [
    {
      id: '1',
      time: '2024-01-15 14:00',
      station: '桃園站',
      value: 52,
      source: 'EPA',
      qc: '通過',
      version: 'v2.1'
    },
    {
      id: '2',
      time: '2024-01-15 14:00',
      station: '中壢站',
      value: 45,
      source: 'LOCAL',
      qc: '通過',
      version: 'v2.1'
    },
    {
      id: '3',
      time: '2024-01-15 14:00',
      station: '觀音站',
      value: 68,
      source: 'MOENV',
      qc: '異常',
      version: 'v2.0'
    }
  ];

  return (
    <LinearGradient
      colors={['#F4F2E9', '#E8E6D3']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>資料檢索</Text>

        {/* Query Conditions */}
        <GlassCard style={styles.queryCard}>
          <Text style={styles.sectionTitle}>查詢條件</Text>
          
          {/* Pollutant Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>污染物</Text>
            <View style={styles.pollutantButtons}>
              {(['PM25', 'O3', 'NOX', 'VOCs'] as const).map((pollutant) => (
                <TouchableOpacity
                  key={pollutant}
                  style={[
                    styles.pollutantButton,
                    selectedPollutant === pollutant && styles.activePollutantButton
                  ]}
                  onPress={() => setSelectedPollutant(pollutant)}
                >
                  <Text style={[
                    styles.pollutantButtonText,
                    selectedPollutant === pollutant && styles.activePollutantButtonText
                  ]}>
                    {pollutant === 'PM25' ? 'PM2.5' : pollutant}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Range */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>時間範圍</Text>
            <View style={styles.timeInputs}>
              <TextInput
                style={styles.timeInput}
                placeholder="開始時間"
                value={timeRange.start}
                onChangeText={(text) => setTimeRange(prev => ({ ...prev, start: text }))}
              />
              <Text style={styles.timeSeparator}>至</Text>
              <TextInput
                style={styles.timeInput}
                placeholder="結束時間"
                value={timeRange.end}
                onChangeText={(text) => setTimeRange(prev => ({ ...prev, end: text }))}
              />
            </View>
          </View>

          {/* Area Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>空間範圍</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.areaButtons}>
                {areas.map((area) => (
                  <TouchableOpacity
                    key={area}
                    style={[
                      styles.areaButton,
                      selectedArea === area && styles.activeAreaButton
                    ]}
                    onPress={() => setSelectedArea(area)}
                  >
                    <Text style={[
                      styles.areaButtonText,
                      selectedArea === area && styles.activeAreaButtonText
                    ]}>
                      {area}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Data Sources */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>資料來源</Text>
            <View style={styles.sourceChips}>
              {sources.map((source) => (
                <TouchableOpacity
                  key={source}
                  style={[
                    styles.sourceChip,
                    selectedSources.includes(source) && styles.activeSourceChip
                  ]}
                  onPress={() => toggleSource(source)}
                >
                  <Text style={[
                    styles.sourceChipText,
                    selectedSources.includes(source) && styles.activeSourceChipText
                  ]}>
                    {source}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetButtonText}>重設</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.queryButton}>
              <Text style={styles.queryButtonText}>執行查詢</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Results */}
        <GlassCard style={styles.resultsCard}>
          <Text style={styles.sectionTitle}>查詢結果</Text>
          
          {mockResults.map((result) => (
            <View key={result.id} style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTime}>{result.time}</Text>
                <View style={[
                  styles.qcBadge,
                  { backgroundColor: result.qc === '通過' ? '#6A8D73' : '#E76F51' }
                ]}>
                  <Text style={styles.qcBadgeText}>{result.qc}</Text>
                </View>
              </View>
              
              <View style={styles.resultContent}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>站點:</Text>
                  <Text style={styles.resultValue}>{result.station}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>數值:</Text>
                  <Text style={styles.resultValue}>{result.value} µg/m³</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>來源:</Text>
                  <Text style={styles.resultValue}>{result.source}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>版本:</Text>
                  <Text style={styles.resultValue}>{result.version}</Text>
                </View>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Data Lineage */}
        <GlassCard style={styles.lineageCard}>
          <Text style={styles.sectionTitle}>資料血緣</Text>
          <View style={styles.lineageFlow}>
            <View style={styles.lineageStep}>
              <Text style={styles.lineageStepText}>原始資料</Text>
            </View>
            <Text style={styles.lineageArrow}>→</Text>
            <View style={styles.lineageStep}>
              <Text style={styles.lineageStepText}>品質控制</Text>
            </View>
            <Text style={styles.lineageArrow}>→</Text>
            <View style={styles.lineageStep}>
              <Text style={styles.lineageStepText}>校正處理</Text>
            </View>
            <Text style={styles.lineageArrow}>→</Text>
            <View style={styles.lineageStep}>
              <Text style={styles.lineageStepText}>小時平均</Text>
            </View>
          </View>
          <Text style={styles.runId}>Run ID: RUN_240115_001</Text>
        </GlassCard>

        {/* Export Options */}
        <GlassCard style={styles.exportCard}>
          <Text style={styles.sectionTitle}>匯出選項</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>下載 CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>複製 API</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
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
  queryCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  pollutantButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pollutantButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    alignItems: 'center',
  },
  activePollutantButton: {
    backgroundColor: '#6A8D73',
  },
  pollutantButtonText: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  activePollutantButtonText: {
    color: 'white',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    fontSize: 14,
    color: '#666',
  },
  timeSeparator: {
    fontSize: 14,
    color: '#666',
  },
  areaButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  areaButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
  },
  activeAreaButton: {
    backgroundColor: '#6A8D73',
  },
  areaButtonText: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  activeAreaButtonText: {
    color: 'white',
  },
  sourceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeSourceChip: {
    backgroundColor: '#6A8D73',
    borderColor: '#6A8D73',
  },
  sourceChipText: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  activeSourceChipText: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#6A8D73',
    fontWeight: '600',
  },
  queryButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#6A8D73',
    alignItems: 'center',
  },
  queryButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(106, 141, 115, 0.1)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A8D73',
  },
  qcBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qcBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  resultContent: {
    gap: 4,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultLabel: {
    fontSize: 12,
    color: '#666',
  },
  resultValue: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  lineageCard: {
    marginBottom: 16,
  },
  lineageFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lineageStep: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    borderRadius: 12,
  },
  lineageStepText: {
    fontSize: 10,
    color: '#6A8D73',
    fontWeight: '600',
  },
  lineageArrow: {
    fontSize: 12,
    color: '#6A8D73',
    marginHorizontal: 4,
  },
  runId: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  exportCard: {
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#6A8D73',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
});