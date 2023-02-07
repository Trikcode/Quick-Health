import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../components/Helper function";
const Police = ({ route }) => {
  const { username, latitude, longitude } = route.params || {};
  useEffect(() => {
    if (latitude && longitude) {
      showSuccessMessage(`${username} Your location has been received `);
    } else {
      showErrorMessage(
        `${username} Go to settings and allow QuickHealth to access your location `
      );
    }
  }, [latitude, longitude]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        style={styles.map}
      />
    </View>
  );
};

export default Police;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
