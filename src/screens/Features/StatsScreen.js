import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { UserContext } from '../../context/UserContext';
import { TrendingUp, Frown, Cloud, Brain, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const StatsScreen = () => {
  const { points } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('4w'); // '1w', '4w', '3m'

  // Datos Dinámicos
  const dataMap = {
      '1w': {
          labels: ["L", "T", "W", "T", "F", "S", "S"],
          data: [10, 20, 15, 30, 45, 50, points > 60 ? 60 : points]
      },
      '4w': {
          labels: ["week 1", "week 2", "week 3", "week 4"],
          data: [150, 230, 310, points > 400 ? points : 450]
      },
      '3m': {
          labels: ["Oct", "Nov", "Dic"],
          data: [800, 1200, points > 1500 ? points : 1800]
      }
  };

  const chartConfig = {
    backgroundGradientFrom: "#1e1e1e",
    backgroundGradientTo: "#1e1e1e",
    color: (opacity = 1) => `rgba(167, 243, 208, ${opacity})`, 
    strokeWidth: 3,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#10B981" },
    decimalPlaces: 0,
    labelColor: () => "rgba(255,255,255,0.5)",
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0F172A', '#1E293B', '#000000']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.headerTitle}>Performance</Text>

          {/* FILTROS ACTIVOS */}
          <View style={styles.filterRow}>
              {['1w', '4w', '3m'].map((tab) => (
                  <TouchableOpacity 
                    key={tab} 
                    onPress={() => setActiveTab(tab)}
                    style={[styles.filterBtn, activeTab === tab && styles.filterActive]}
                  >
                      <Text style={[styles.filterText, activeTab === tab && {color:'#FFF', fontWeight:'bold'}]}>
                          {tab === '1w' ? '1 week' : tab === '4w' ? '1 Month' : '3 Months'}
                      </Text>
                  </TouchableOpacity>
              ))}
          </View>

          <View style={styles.mainCard}>
              <View style={styles.mainCardHeader}>
                  <View>
                      <Text style={styles.mainStatTitle}>Positive Trend</Text>
                      <Text style={styles.mainStatSub}>Your perseverance is paying off 🌱</Text>
                  </View>
                  <View style={styles.pillBadge}><Text style={styles.pillText}>+18%</Text></View>
              </View>

              <LineChart
                data={{
                    labels: dataMap[activeTab].labels,
                    datasets: [{ data: dataMap[activeTab].data }]
                }}
                width={width - 60}
                height={180}
                withDots={true}
                withInnerLines={false}
                withOuterLines={false}
                chartConfig={chartConfig}
                bezier
                style={{ marginTop: 20 }}
              />
          </View>

          <View style={styles.grid}>
              <MetricCard icon={<Frown color="#fff" size={24} />} color={['#8B5CF6', '#6D28D9']} title="Depression" value="▼ 23%" sub="Going down" />
              <MetricCard icon={<Cloud color="#fff" size={24} />} color={['#38BDF8', '#0284C7']} title="Anxiety" value="▼ 21%" sub="Controlled" />
              <MetricCard icon={<Brain color="#fff" size={24} />} color={['#2DD4BF', '#0F766E']} title="Approach" value="▲ 19%" sub="Improving" positive />
              <MetricCard icon={<Heart color="#fff" size={24} />} color={['#FBBF24', '#D97706']} title="Self-esteem" value="▲ 27%" sub="Big improvement" positive />
          </View>

          <Text style={styles.sectionTitle}>Progress by Area</Text>
          <View style={styles.progressList}>
              <ProgressBar label="Sadness" percent={75} color="#38BDF8" />
              <ProgressBar label="TDAH" percent={62} color="#F87171" />
              <ProgressBar label="Stress" percent={48} color="#FBBF24" />
              <ProgressBar label="Self-esteem" percent={85} color="#4ADE80" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MetricCard = ({ icon, color, title, value, sub, positive }) => (
    <View style={styles.metricCard}>
        <LinearGradient colors={color} style={styles.iconCircle}>{icon}</LinearGradient>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={[styles.metricValue, {color: positive ? '#6EE7B7' : '#fff'}]}>{value}</Text>
        <Text style={styles.metricSub}>{sub}</Text>
    </View>
);

const ProgressBar = ({ label, percent, color }) => (
    <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>• {label}</Text>
        <View style={styles.track}><View style={[styles.fill, { width: `${percent}%`, backgroundColor: color }]} /></View>
        <Text style={styles.progressPercent}>{percent}%</Text>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 20, paddingBottom: 50 },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  
  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.05)', padding: 5, borderRadius: 20, alignSelf: 'center' },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15 },
  filterActive: { backgroundColor: '#334155' },
  filterText: { color: '#94A3B8', fontSize: 13 },

  mainCard: { backgroundColor: '#1E293B', borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155' },
  mainCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  mainStatTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  mainStatSub: { color: '#94A3B8', fontSize: 13, marginTop: 4 },
  pillBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pillText: { color: '#6EE7B7', fontWeight: 'bold', fontSize: 12 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  metricCard: { width: '48%', backgroundColor: '#1E293B', borderRadius: 20, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  iconCircle: { width: 45, height: 45, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  metricTitle: { color: 'white', fontWeight: 'bold', marginBottom: 2, fontSize: 14 },
  metricValue: { fontSize: 16, fontWeight: '900', marginBottom: 2 },
  metricSub: { color: '#64748B', fontSize: 11 },

  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  progressList: { gap: 15 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressLabel: { color: '#94A3B8', width: 80, fontSize: 13 },
  track: { flex: 1, height: 6, backgroundColor: '#334155', borderRadius: 4 },
  fill: { height: '100%', borderRadius: 4 },
  progressPercent: { color: '#94A3B8', width: 35, textAlign: 'right', fontSize: 12 }
});

export default StatsScreen;