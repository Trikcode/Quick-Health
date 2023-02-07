import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, LogBox } from "react-native";
import { Text, Layout } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import Navbar from "../components/Navbar";
import AccelerometerDetector from "../components/Accelerometer";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../components/Helper function";

LogBox.ignoreLogs([
  "Warning: Async Storage has been extracted from react-native core",
]);

const User = ({ navigation, username }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isEmergencySent, setIsEmergencySent] = useState(false);
  const [isEmergencyReceived, setIsEmergencyReceived] = useState(false);

  const _getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showErrorMessage("Couldn't get your location");

      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setAddress(address);
    showSuccessMessage("Thanks for providing your location");
  };

  const _sendEmergency = async () => {
    setIsEmergency(true);
    setIsEmergencySent(true);
    const response = await fetch(
      "https://quick-health.herokuapp.com/api/emergency",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          latitude: latitude,
          longitude: longitude,
          address: address,
        }),
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      showSuccessMessage("Emergency sent successfully");
    } else {
      showErrorMessage("Emergency not sent");
    }
  };

  const _receiveEmergency = async () => {
    setIsEmergency(true);
    setIsEmergencyReceived(true);
    const response = await fetch(
      "https://quick-health.herokuapp.com/api/emergency",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      showSuccessMessage("Emergency received successfully");
    } else {
      showErrorMessage("Emergency not received");
    }
  };

  useEffect(() => {
    _getLocationAsync();
  }, []);

  return (
    <Layout style={styles.userContainer}>
      <View style={styles.Introduction}>
        <Text style={styles.greeting}>Hi</Text>
        <Text style={styles.Username}>{username}!</Text>
      </View>
      <View style={styles.Introduction}>
        <Text style={styles.welcome}>Welcome to Quick Health App</Text>
      </View>
      <View style={styles.card1}>
        <Navbar navigation={navigation} username={username} />
      </View>
      <AccelerometerDetector navigation={navigation} />
      <View style={styles.card2}>
        <View style={styles.body}>
          <View style={[styles.dot, styles.center]}>
            {[...Array(3).keys()].map((index) => {
              return (
                <MotiView
                  style={[StyleSheet.absoluteFillObject, styles.dot]}
                  key={index}
                  from={{ opacity: 0.9, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.5 }}
                  transition={{
                    type: "timing",
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    delay: 400 * index,
                    loop: true,
                    repeatReverse: false,
                  }}
                />
              );
            })}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Police", {
                  username: username,
                  latitude: latitude,
                  longitude: longitude,
                })
              }
            >
              <Ionicons
                name="person-circle-outline"
                size={32}
                color="#182f48"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default User;

const styles = StyleSheet.create({
  userContainer: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    paddingTop: 50,
    width: "100%",
    paddingHorizontal: 20,
  },
  Headcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card1: {
    width: "100%",
    borderRadius: 3,
    backgroundColor: "#182f48",
    elevation: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  card2: {
    borderRadius: 10,
    backgroundColor: "#182f48",
    paddingHorizontal: 5,
    marginTop: 60,
    height: "32%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    position: "absolute",
  },
  Introduction: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#182f48",
  },
  Username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#AC58F5",
    marginLeft: 5,
  },
  welcome: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#182f48",
    marginBottom: 10,
    textAlign: "left",
  },
});
