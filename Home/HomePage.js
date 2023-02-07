import { Button, View } from "react-native";
import React, { useState } from "react";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import app from "../firebaseConfig";
import Police from "./Police";
import User from "./User";
import Ambulance from "./Ambulance";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const HomePage = ({ success, navigation }) => {
  const [username, setUsername] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  React.useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      const displayName = user.displayName;
      const email = user.email;
      setUsername(displayName);
      setEmail(email);
    }
  }, []);

  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {email === "police@gmail.com" ? (
        <Police navigation={navigation} username={username} />
      ) : email === "ambulance@gmail.com" ? (
        <Ambulance navigation={navigation} username={username} />
      ) : (
        <User navigation={navigation} username={username} />
      )}
    </Layout>
  );
};

export default HomePage;
