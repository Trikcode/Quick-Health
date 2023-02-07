import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Layout, Button, Text } from "@ui-kitten/components";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import logo from "../assets/quicklogo.png";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Provide a valid Email").required("Email Required"),
});

const ResetPassword = ({ navigation }) => {
  const [values, setValues] = useState({
    email: null,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (values) => {
    const { email } = values;
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccess("Password Reset Email Sent");
        setValues({ email: "" });
      })
      .catch((error) => {
        setError("We couldn't this email, Sign Up please");
      });
  };

  return (
    <Layout style={styles.loginContainer}>
      <View style={styles.imageLogo}>
        <Image source={logo} style={{ width: 305, height: 159 }} />
      </View>
      {success ? (
        <Text style={styles.success}>{success}</Text>
        
      ) : (
        <Text style={styles.error}>{error}</Text>
      )}
      <View style={styles.loginForm}>
        <Formik
          initialValues={values}
          onSubmit={handleSubmit}
          validationSchema={LoginSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <>
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

              <View style={styles.SignInBtnContainer}>
                <Button onPress={handleSubmit} style={styles.SignInBtn}>
                  Reset Password
                </Button>
              </View>
            </>
          )}
        </Formik>
        <View style={styles.NoaccContainer}>
          <TouchableOpacity>
            <Text>Missing an account ?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.noaccountyet}>Sign up here</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ paddingVertical: 10 }}>OR</Text>
        <View style={styles.NoaccContainer}>
          <TouchableOpacity>
            <Text>Remembered your credentials?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.noaccountyet}>Login</Text>
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
});

export default ResetPassword;
