import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feed from "@/components/Feed";
import * as ImagePicker from "expo-image-picker";
import { useContext, useEffect, useState } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { router } from "expo-router";
import { UserContext } from "@/context/UserContext";
import axios from "axios";

// to get current user's email:
// import { auth } from '../firebase'
// auth.currentUser?.email
const backgroundImage = {
  uri: "https://media.gettyimages.com/id/1645930993/vector/blurred-fluid-dark-gradient-colourful-background.jpg?s=612x612&w=0&k=20&c=cEPW-qd3k8OID7CV-Z7KEp2P2z3w4Zs9QqorK32LO_8=",
};

const feedItems = [
  {
    user: "You",
    eventName: "Alicia Keys World Tour",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "saved",
    id: "10",
  },
  {
    user: "You",
    eventName: "Kaytranada World Tour",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "attended",
    id: "11",
  },
  {
    user: "You",
    eventName: "Usher",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "saved",
    id: "12",
  },
  {
    user: "You",
    eventName: "Taylor Swift World Tour",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "saved",
    id: "13",
  },
  {
    user: "You",
    eventName: "Avril Lavigne World Tour",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "saved",
    id: "14",
  },
  {
    user: "You",
    eventName: "Justin Bieber World Tour",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "saved",
    id: "15",
  },
  {
    user: "You",
    eventName: "Bruno Mars World Tour",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    action: "saved",
    id: "16",
  },
];

function ProfileImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const uploadImage = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status === "granted") {
      alert(
        "Please grant camera roll permissions inside your system's settings"
      );
    } else {
      let profileImage = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!profileImage.canceled) {
        setImage(profileImage.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.profileImageUpload}>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <TouchableOpacity
        onPress={uploadImage}
        style={styles.profileImageUploadBtn}
      >
        <EvilIcons name="pencil" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [attendedConcertsCount, setAttendedConcertsCount] = useState(0);
  const [savedConcertsCount, setSavedConcertsCount] = useState(0);
  //const [allMarkedConcerts, setAllMarkedConcerts] = useState();

  useEffect(() => {
    const getUserConcerts = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/${user.id}/concerts`;
        const response = await axios.get(url);

        console.log("Marked concerts retrieved successfully");
        const concerts = await response.data.concerts;

        const attendedConcertsCount = concerts.filter(c => c.status === "attended").length;
        const savedConcertsCount = concerts.filter(c => c.status === "saved").length;

        setAttendedConcertsCount(attendedConcertsCount);
        setSavedConcertsCount(savedConcertsCount);
      } catch (error) {
        console.error("Error:", error.response?.data?.error || error.message);
      }
    };

    /* TODO: Instead of calling endpoint twice, just call it once to fetch all concerts and
    then get the number saved and attended from there */
    getUserConcerts();
  }, []);

  /*const uploadProfileImage = async (mode: "gallery" | "camera") => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        })
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1
        })
      }
    } catch {

    }
  }*/

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ProfileImageUpload />
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>

        <Pressable
          style={styles.logOutBtn}
          onPress={() =>
            signOut(auth).then(() => {
              router.push("/login");
            })
          }
        >
          <Text style={styles.logOutBtnText}>Log Out</Text>
        </Pressable>

        <View style={styles.metricsContainer}>
          <Text style={styles.metricsText}>
            {attendedConcertsCount} concerts attended
          </Text>
          <Text style={styles.divider}>|</Text>
          <Text style={styles.metricsText}>
            {savedConcertsCount} concerts saved
          </Text>
        </View>
        <Feed feedItems={feedItems} /* feedItems={allMarkedConcerts} */ />
        {/*
                display concerts attended and saved here
                data to display:
                  - date
                  - attended vs saved
                  - name of the concert
                  - pictures
                  - some type of reaction about the event
              */}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfo: {
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },
  name: {
    color: "white",
    fontSize: 20,
  },
  username: {
    color: "white",
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: 20,
  },
  postText: {
    color: "white",
  },
  post: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1,
    height: 80,
    width: "100%",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  metricsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    color: "white",
    fontSize: 18,
  },
  profileImageUpload: {
    height: 150,
    width: 150,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    alignSelf: "center",
  },
  profileImageUploadBtn: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 25,
  },
  logOutBtn: {
    backgroundColor: "purple",
    width: 70,
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  logOutBtnText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
});
