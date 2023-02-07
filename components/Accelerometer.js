import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Card } from "@ui-kitten/components";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AccelerometerDetector = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const _toggle = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (data.x > 1.1 || data.y > 1.1 || data.z > 1.1) {
      sendPushNotification(expoPushToken, {
        messagereceived: "Accident Detected",
      });
    } else {
    }
  }, [data]);

  const { x, y, z } = data;
  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);

  return (
    <View style={styles.sensor}>
      <Card>
        <View style={styles.sensorTimer}>
          <Text style={styles.sensorTimerx}>{round(x)} </Text>
          <Text style={styles.sensorTimery}>{round(y)}</Text>
          <Text style={styles.sensorTimerz}>{round(z)}</Text>
        </View>
      </Card>
      <Card style={{ marginTop: 10 }}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={_toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={subscription ? _unsubscribe : _subscribe}
            style={[styles.button, styles.middleButton]}
          >
            <Text>{subscription ? "On" : "Off"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_slow} style={styles.button}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
};

async function sendPushNotification(expoPushToken, { messagereceived }) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: messagereceived,
    body: "Please inform your loved ones if you can",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default AccelerometerDetector;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  button: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  middleButton: {
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  sensorTimer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  sensorTimerx: {
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    backgroundColor: "#eee",
    color: "red",
    fontSize: 18,
  },
  sensorTimery: {
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: "#eee",
    color: "green",
    fontSize: 18,
  },
  sensorTimerz: {
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    backgroundColor: "#eee",
    color: "blue",
    fontSize: 18,
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
