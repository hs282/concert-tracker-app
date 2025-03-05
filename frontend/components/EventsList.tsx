import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { auth } from "@/firebase";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// to make the button change animated:
// https://dev.to/vcapretz/instagram-like-button-in-react-native-and-reanimated-v2-3h3k

export default function EventsList({ events }) {
  const { user, setUser } = useContext(UserContext);

  const markConcert = async (
    userId,
    ticketmasterId,
    concertName,
    concertDate,
    concertUrl,
    status
  ) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/concerts`,
        {
          user_id: userId,
          ticketmaster_id: ticketmasterId,
          concert_name: concertName,
          concert_date: concertDate,
          concert_url: concertUrl,
          status: status,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Concert marked successfully");
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
    }
  };

  // get user's saved concerts
  // get user's attended concerts
  // if this concert is in user's saved concerts, then display saved icon
  // if this concert is in user's attended concerts, then display attended icon

  // allConcerts = get all of user's concerts
  // for each concert, if the concert's ticketmaster id is equal to
  // any of the ticketmaster id's in allConcerts ,

  const [attendedConcerts, setAttendedConcerts] = useState<Set<string>>();
  const [savedConcerts, setSavedConcerts] = useState<Set<string>>();

  const getUserConcerts = async () => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/${user.id}/concerts`;
      const response = await axios.get(url);

      console.log("Marked concerts retrieved successfully");
      const concerts = await response.data.concerts;

      // convert array to Set for faster lookup
      const attendedConcerts = new Set<string>(
        concerts
          .filter((c) => c.status === "attended")
          .map((c) => c.ticketmaster_id)
      );
      const savedConcerts = new Set<string>(
        concerts
          .filter((c) => c.status === "saved")
          .map((c) => c.ticketmaster_id)
      );

      setAttendedConcerts(attendedConcerts);
      setSavedConcerts(savedConcerts);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
    }
  };

  getUserConcerts();

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => {
        const formattedDate = new Date(
          item.dates.start.dateTime
        ).toLocaleString();

        const isAttended = attendedConcerts?.has(item.id);
        const isSaved = savedConcerts?.has(item.id);
        return (
          <View style={styles.event}>
            <Text style={[styles.eventTitle, styles.postText]}>
              {item.name}
            </Text>
            <Text style={styles.postText}>{formattedDate}</Text>
            <Text style={styles.link} onPress={() => Linking.openURL(item.url)}>
              {item.url}
            </Text>
            <Text style={styles.postText}>3 friends saved this event</Text>

            <View style={styles.eventActions}>
              <Pressable
                onPress={() =>
                  markConcert(
                    user?.id,
                    item.id,
                    item.name,
                    item.dates.start.dateTime,
                    item.url,
                    "saved"
                  )
                }
              >
                <FontAwesome
                  name={isSaved ? "bookmark" : "bookmark-o"}
                  size={24}
                  color="white"
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  markConcert(
                    user?.id,
                    item.id,
                    item.name,
                    item.dates.start.dateTime,
                    item.url,
                    "attended"
                  )
                }
              >
                <AntDesign
                  name={isAttended ? "checkcircle" : "checkcircleo"}
                  size={24}
                  color="white"
                />
              </Pressable>
            </View>
          </View>
        );
      }}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ gap: 10 }}
    />
  );
}

const styles = StyleSheet.create({
  event: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1,
    width: "100%",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  eventTitle: {
    fontSize: 18,
  },
  postText: {
    color: "white",
  },
  link: {
    color: "skyblue",
  },
  eventActions: {
    flexDirection: "row",
    gap: 20,
    alignSelf: "flex-end",
  },
});
