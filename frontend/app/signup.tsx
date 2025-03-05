import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    View,
    KeyboardAvoidingView,
  } from "react-native";
  import { useEffect, useState } from "react";
  import { auth } from "../firebase";
  import { router } from "expo-router";
import axios from "axios";
  
  export default function SignUpScreen({}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
  
    useEffect(() => {
      // when we leave this screen, it's gonna unsubscribe
      // from this listener so that it doesn't keep listening
      // when it shouldn't
      const unsubscribe = auth.onAuthStateChanged((user) => {
        // if we have a user, use useRouter from expo-router
        // to navigate to home screen
        if (user) {
        }
      });
      return unsubscribe;
    }, []);
  
    const handleSignup = async () => {
      // create the user in Firebase
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Signed up with:", user?.email);
          router.push("/");
        })
        .catch((error) => alert(error.message));
        
        // call the create user API endpoint
        try {
            const response = await axios.post(`${process.env.EXPO_PUBLIC_API_BASE_URL}/user`, {
                first_name: firstName,
                last_name: lastName,
                email: email,
                username: username,
                password: password
            })
            console.log("User created successfully")
        } catch (error) {
            console.error("Error:", error.response?.data?.error || error.message)
        }
    };
  
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setUsername(text)}
            value={username}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
          />
        </View>
  
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text onPress={() => {router.back()}} style={styles.footerLink}>
            Log in
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
    },
    inputContainer: {
      width: "80%",
    },
    input: {
      backgroundColor: "white",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: "60%",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 40,
      gap: 10,
    },
    button: {
      backgroundColor: "purple",
      width: "100%",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
    },
    footerView: {},
    footerText: {
      fontSize: 20,
    },
    footerLink: {
      fontSize: 20,
      color: "blue",
      width: "100%"
    },
  });
  