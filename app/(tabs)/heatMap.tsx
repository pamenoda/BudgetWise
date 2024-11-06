import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import MapView, { Heatmap, Marker, Callout } from 'react-native-maps'; 
import * as Location from 'expo-location'; 
import Colors from '@/constants/Colors';
import dbPromise from '@/scripts/database';

const Page = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null); 
  const [heatmapData, setHeatmapData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);
    };

    const fetchHeatmapData = async () => {
      try {
        const db = await dbPromise;
        // Query to get latitude, longitude, amount, category, and date for each expense
        const result = await db.getAllAsync('SELECT latitude, longitude, amount, category, date FROM expenses');
        
        // Format the result to include all required data for the marker's callout
        const formattedData = (result as { latitude: number; longitude: number; amount: number, category: string, date: string }[]).map((expense) => ({
          latitude: expense.latitude,
          longitude: expense.longitude,
          amount: expense.amount,
          category: expense.category,
          date: new Date(expense.date).toLocaleDateString(), // Format date
        }));

        setHeatmapData(formattedData);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchLocation();
    fetchHeatmapData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.tintColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 48.8588443,
          longitude: location?.coords.longitude || 2.2943506,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {/* Render Heatmap */}
        {heatmapData.length > 0 && (
          <Heatmap
            points={heatmapData.map(point => ({
              latitude: point.latitude,
              longitude: point.longitude,
              weight: point.amount / 100, // Adjust intensity based on amount
            }))}
            radius={50}
            opacity={0.6}
            gradient={{
              colors: ['#00ff00', '#ffff00', '#ff0000'],
              startPoints: [0.1, 0.5, 1],
              colorMapSize: 256,
            }}
          />
        )}

        {/* Render a single Marker for each location with detailed information */}
        {heatmapData.map((point, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            pinColor={Colors.tintColor} 
          >
            {/* Callout to show detailed information */}
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>Expense Details</Text>
                <Text style={styles.calloutText}>Category: { point.category}</Text>
                <Text style={styles.calloutText}>Date: {point.date}</Text>
                <Text style={styles.calloutText}>Amount: {point.amount.toFixed(2) +"$" }</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
  callout: {
    width: 150,
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 12,
    color: Colors.black,
  },
});
