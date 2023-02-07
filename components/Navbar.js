import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Icon,
  MenuItem,
  OverflowMenu,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebaseConfig";

const MenuIcon = (props) => <Icon {...props} name="more-vertical" />;

const InfoIcon = (props) => <Icon {...props} name="info" />;

const LogoutIcon = (props) => <Icon {...props} name="log-out" />;

const TopNavigationImageTitleShowcase = ({ navigation, username }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderOverflowMenuAction = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem accessoryLeft={InfoIcon} title="About" />
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={handleLogout}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  const renderTitle = (props) => (
    <View style={styles.titleContainer}>
      <Avatar style={styles.logo} source={require("../assets/Health.png")} />
    </View>
  );

  const auth = getAuth();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Login", {
          logoutsuccess: "You have successfully been logged out",
          username: username,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <TopNavigation
      title={renderTitle}
      accessoryRight={renderOverflowMenuAction}
    />
  );
};

export default TopNavigationImageTitleShowcase;
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    marginHorizontal: 10,
  },
});
