//import firebase/auth
import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Layout, Button, Text } from "@ui-kitten/components";
import Ionicons from "@expo/vector-icons/Ionicons";
import app from "../firebaseConfig";
import logo from "../assets/quicklogo.png";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
LogBox.ignoreLogs([
  "Warning: Async Storage has been extracted from react-native core",
]);

const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username is Too Short!")
    .max(50, "Username is Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Provide a valid email")
    .required("Email is Required"),
  password: Yup.string()
    .min(6, "Password is Too Short!")
    .max(50, "Password is Too Long!")
    .required("Password is Required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password is Required"),
});

const SignUp = ({ navigation }) => {
  const [values, setValues] = React.useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const handleSubmit = (values) => {
    setLoading(true);
    const auth = getAuth();
    const { email, password, username } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            console.log("Profile updated");
          })
          .catch((error) => {
            console.log(error);
          });
        setLoading(false);
        setValues({
          username: "",
          email: "",
          password: "",
          password2: "",
        });
        navigation.navigate("Login", {
          signupsuccess: "Your account has been created. Please log in.",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("It seems that this email is already in use.");
        setLoading(false);
      });
  };

  return (
    <Layout style={styles.loginContainer}>
      <View style={styles.imageLogo}>
        <Image source={logo} style={{ width: 305, height: 159 }} />
      </View>
      {error && <Text>{error}</Text>}
      {loading && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#171435" />
        </View>
      )}
      <View style={styles.loginForm}>
        <Text style={styles.companyDescriptionH1}>
          Let's create an account for you
        </Text>
        <Formik
          initialValues={values}
          onSubmit={handleSubmit}
          validationSchema={SignUpSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <>
              <TextInput
                name="username"
                placeholder="Username"
                style={styles.textInput}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
              {errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}
              <TextInput
                name="email"
                placeholder="Email Address"
                style={styles.textInput}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}
              <TextInput
                name="password"
                placeholder="Password"
                style={styles.textInput}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <TextInput
                name="password2"
                placeholder="Confirm Password"
                style={styles.textInput}
                onChangeText={handleChange("password2")}
                onBlur={handleBlur("password2")}
                value={values.password2}
                secureTextEntry
              />
              {errors.password2 && (
                <Text style={styles.error}>{errors.password2}</Text>
              )}

              <View style={styles.SignInBtnContainer}>
                <Button onPress={handleSubmit} style={styles.SignInBtn}>
                  Sign Up{" "}
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
      <View style={styles.NoaccContainer}>
        <TouchableOpacity>
          <Text>Already have an account?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.noaccountyet}>Login Here</Text>
        </TouchableOpacity>
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

export default SignUp;
