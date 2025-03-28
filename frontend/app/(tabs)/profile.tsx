import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { Link, router } from "expo-router";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { APP_CONFIG } from "@/constants/config";
import Feed from "@/components/Feed/Feed";

// to get current user's email:
// import { auth } from '../firebase'
// auth.currentUser?.email

export interface MarkedEvent {
  concert_date: string;
  concert_name: string;
  marked_date: string;
  status: string;
  ticketmaster_id: string;
  user_concert_id: string;
  url: string;
}

/* const uploadProfileImage = async (mode: "gallery" | "camera") => {
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
  } */

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
  const { user, loading } = useUser();
  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>Please log in</Text>;

  const [attendedEventsCount, setAttendedEventsCount] = useState(0);
  const [savedEventsCount, setSavedEventsCount] = useState(0);
  const [attendedEvents, setAttendedEvents] = useState<MarkedEvent[]>([]);
  const [savedEvents, setSavedEvents] = useState<MarkedEvent[]>([]);
  const [allMarkedEvents, setAllMarkedEvents] = useState([]);

  const getUserEvents = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/${user.id}/concerts`;
      const response = await axios.get(url);

      const events = await response.data.concerts;

      setAllMarkedEvents(events);

      const attendedEvents = events.filter(
        (e: MarkedEvent) => e.status === "attended"
      );

      const savedEvents = events.filter(
        (e: MarkedEvent) => e.status === "saved"
      );

      setAttendedEvents(attendedEvents);
      setSavedEvents(savedEvents);

      setAttendedEventsCount(attendedEvents.length);
      setSavedEventsCount(savedEvents.length);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
    }
  };

  getUserEvents();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={APP_CONFIG.backgroundImage}
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
          {/* TODO: refactor this so that attended and saved are done
          using map() */}
          <Pressable>
            <Link
              href={{
                pathname: "/marked-events-list",
                params: {
                  status: "Attended",
                  events: JSON.stringify(attendedEvents),
                },
              }}
            >
              <Text style={styles.metricsText}>
                {attendedEventsCount} concert
                {attendedEventsCount !== 1 && "s"} attended
              </Text>
            </Link>
          </Pressable>

          <Text style={styles.divider}>|</Text>

          <Pressable>
            <Link
              href={{
                pathname: "/marked-events-list",
                params: {
                  status: "Saved",
                  events: JSON.stringify(savedEvents),
                },
              }}
            >
              <Text style={styles.metricsText}>
                {savedEventsCount} concert{savedEventsCount !== 1 && "s"} saved
              </Text>
            </Link>
          </Pressable>
        </View>
        <Feed feedItems={allMarkedEvents} />
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
  backgroundImage: {
    flex: 1,
    paddingTop: 20,
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
