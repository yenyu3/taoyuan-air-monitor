import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import MapView, { Polygon, Marker, Region } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store';
import { GlassCard } from '../components/GlassCard';
import { Logo } from '../components/Logo';
import { HealthBadge } from '../components/HealthBadge';
import { getGrid, getVerticalProfile, setScenario } from '../api';
import { GridCell, VerticalProfile } from '../types';

const TAOYUAN_REGION: Region = {
  latitude: 25.0,
  longitude: 121.25,
  latitudeDelta: 0.4,
  longitudeDelta: 0.5,
};

interface MapScreenProps {
  scrollRef?: (ref: any) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ scrollRef }) => {
  // MapView doesn't have scroll functionality, so we'll ignore the scrollRef
  React.useEffect(() => {
    if (scrollRef) {
      scrollRef(null); // Pass null since MapView doesn't scroll
    }
  }, [scrollRef]);
  const { 
    selectedPollutant,
    setSelectedPollutant,
    mode,
    setMode,
    selectedScenario,
    gridCells,
    setGridCells,
    selectedGridId,
    setSelectedGridId,
    isLoading,
    setIsLoading
  } = useStore();

  const [selectedGrid, setSelectedGrid] = React.useState<GridCell | null>(null);
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    loadGridData();
  }, [selectedPollutant, selectedScenario]);

  const loadGridData = async () => {
    setIsLoading(true);
    try {
      setScenario(selectedScenario);
      const grid = await getGrid({ pollutant: selectedPollutant });
      setGridCells(grid);
    } catch (error) {
      console.error('Failed to load grid data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGridPress = async (grid: GridCell) => {
    setSelectedGrid(grid);
    setSelectedGridId(grid.gridId);
    setShowDetails(true);
  };

  const getGridColor = (value: number) => {
    const opacity = Math.min(0.8, Math.max(0.12, value / 100));
    return `rgba(106, 141, 115, ${opacity})`;
  };

  const getPollutantLabel = () => {
    switch (selectedPollutant) {
      case 'PM25': return 'PM2.5';
      case 'O3': return 'O₃';
      case 'NOX': return 'NOₓ';
      case 'VOCs': return 'VOCs';
      default: return selectedPollutant;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={TAOYUAN_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Grid Polygons */}
        {gridCells.map((grid) => (
          <Polygon
            key={grid.gridId}
            coordinates={grid.polygonCoords}
            fillColor={getGridColor(grid.values.value)}
            strokeColor="rgba(106, 141, 115, 0.3)"
            strokeWidth={1}
            onPress={() => handleGridPress(grid)}
          />
        ))}
        
        {/* Selected Grid Highlight */}
        {selectedGrid && (
          <Polygon
            coordinates={selectedGrid.polygonCoords}
            fillColor="rgba(106, 141, 115, 0.9)"
            strokeColor="#6A8D73"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Controls and Legend */}
      <View style={styles.topControls}>
        <View style={styles.controlCard}>
          <View style={styles.pageTitle}>
            <Text style={styles.pageTitleText}>地圖監測</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.pollutantSelector}>
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
          
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'NOW' && styles.activeModeButton]}
              onPress={() => setMode('NOW')}
            >
              <Text style={[styles.modeButtonText, mode === 'NOW' && styles.activeModeButtonText]}>
                即時
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'FORECAST' && styles.activeModeButton]}
              onPress={() => setMode('FORECAST')}
            >
              <Text style={[styles.modeButtonText, mode === 'FORECAST' && styles.activeModeButtonText]}>
                預報
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          {/* Legend */}
          <View style={styles.legendSection}>
            <Text style={styles.legendTitle}>{getPollutantLabel()} (µg/m³)</Text>
            <View style={styles.legendGradient}>
              <LinearGradient
                colors={['rgba(106, 141, 115, 0.2)', 'rgba(106, 141, 115, 0.8)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBar}
              />
              <View style={styles.legendLabels}>
                <Text style={styles.legendLabel}>0</Text>
                <Text style={styles.legendLabel}>50</Text>
                <Text style={styles.legendLabel}>100+</Text>
              </View>
            </View>
          </View>
        </View>
      </View>



      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6A8D73" />
        </View>
      )}

      {/* Simple Details Modal */}
      {showDetails && selectedGrid && (
        <View style={styles.detailsOverlay}>
          <GlassCard style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>網格 {selectedGrid.gridId}</Text>
            <Text style={styles.detailsText}>
              {getPollutantLabel()}: {selectedGrid.values.value} {selectedGrid.values.unit}
            </Text>
            <HealthBadge level={selectedGrid.health.level} />
            <Text style={styles.detailsText}>{selectedGrid.health.summary}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.closeButtonText}>關閉</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
  },
  controlCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pageTitle: {
    marginBottom: 12,
  },
  pageTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A8D73',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  pollutantSelector: {
    flexDirection: 'row',
    marginBottom: 12,
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
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(106, 141, 115, 0.1)',
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#6A8D73',
  },
  modeButtonText: {
    fontSize: 12,
    color: '#6A8D73',
    fontWeight: '600',
  },
  activeModeButtonText: {
    color: 'white',
  },
  legendSection: {
    marginTop: 12,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6A8D73',
    marginBottom: 8,
  },
  legendGradient: {
    height: 20,
  },
  gradientBar: {
    height: 8,
    borderRadius: 4,
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: '#666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 242, 233, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    margin: 20,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A8D73',
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#6A8D73',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});