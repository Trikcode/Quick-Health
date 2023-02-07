import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Layout, Button, Text } from "@ui-kitten/components";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import User from "../Home/User";
import logo from "../assets/quicklogo.png";

LogBox.ignoreLogs([
  "Warning: Async Storage has been extracted from react-native core",
]);

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Provide a valid Email").required("Email Required"),
  password: Yup.string()
    .min(6, "Password Too Short!")
    .max(50, "Password Too Long!")
    .required("Password is Required"),
});

const Login = ({ navigation, route }) => {
  //get signupsuccess from route.params only if it exists
  const { signupsuccess, success, logoutsuccess, username } =
    route.params || {};

  const [values, setValues] = useState({
    email: null,
    password: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const handleSubmit = (values) => {
    setLoading(true);
    const { email, password } = values;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false);
        setValues({
          email: "",
          password: "",
        });
        navigation.navigate("HomePage", { success: "User logged in" });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        setError("Invalid Credentials");
      });
  };

  return (
    <Layout style={styles.loginContainer}>
      <View style={styles.imageLogo}>
        <Image source={logo} style={{ width: 305, height: 159 }} />
      </View>
      <View style={styles.loginForm}>
        <Text style={styles.companyDescriptionH1}>
          Get the Quick Health that you deserve.
        </Text>
        {/* <Text style={styles.companyDescriptionH2}>Sign In Now</Text> */}
        {success && <Text style={styles.success}>{success}</Text>}
        {signupsuccess && <Text style={styles.success}>{signupsuccess}</Text>}
        {logoutsuccess && (
          <Text style={styles.success}>{`${username} ${logoutsuccess}`}</Text>
        )}
        <Formik
          initialValues={values}
          onSubmit={handleSubmit}
          validationSchema={LoginSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <>
              {loading && (
                <View style={[styles.container, styles.horizontal]}>
                  <ActivityIndicator size="large" color="#171435" />
                </View>
              )}
              {error && <Text>{error}</Text>}
              <TextInput
                name="email"
                placeholder="Email Address"
                style={styles.textInput}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                required
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.error}>Please Provide a Valid Email</Text>
              )}
              <TextInput
                name="password"
                placeholder="Password"
                style={styles.textInput}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                required
                secureTextEntry={true}
              />
              {errors.password && (
                <Text style={styles.error}>
                  Password should be between 6 and 50 characters
                </Text>
              )}
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => navigation.navigate("PasswordReset")}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
              <View style={styles.SignInBtnContainer}>
                <Button onPress={handleSubmit} style={styles.SignInBtn}>
                  Sign In{" "}
                </Button>
              </View>
            </>
          )}
        </Formik>
        <View style={styles.NoaccContainer}>
          <TouchableOpacity>
            <Text>Don't have an account yet?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.noaccountyet}>Sign up </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#e5e9f0",
  },
  loginHeader: {},
  loginForm: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    width: "100%",
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },

  success: {
    color: "green",
    fontSize: 13,
    fontFamily: "sans-serif",
  },
  error: {
    color: "red",
    fontSize: 13,
    fontFamily: "sans-serif",
  },
  imageLogo: {
    marginBottom: "5%",
  },
  companyDescriptionH1: {
    fontSize: 20,
    fontFamily: "sans-serif",
    textAlign: "center",
    marginBottom: "5%",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#5271ff",
    marginBottom: "5%",
  },
  SignInBtnContainer: {
    width: "100%",
    marginBottom: "5%",
  },
  SignInBtn: {
    width: "100%",
    backgroundColor: "#da9bf9",
    borderRadius: 10,
    fontSize: 18,
  },
  NoaccContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  noaccountyet: {
    fontSize: 15,
    paddingHorizontal: 8,
    color: "#5271ff",
    textAlign: "center",
    width: "100%",
  },
  container: {
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default Login;
