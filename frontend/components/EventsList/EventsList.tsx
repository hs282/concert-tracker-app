import AntDesign from "@expo/vector-icons/AntDesign";
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { MarkedEvent } from "@/app/(tabs)/profile";

// to make the button change animated:
// https://dev.to/vcapretz/instagram-like-button-in-react-native-and-reanimated-v2-3h3k

export interface TicketmasterEvent {
  dates: { start: { dateTime: string } };
  id: string;
  name: string;
  url: string;
}

type Event = TicketmasterEvent | MarkedEvent;

export default function EventsList({ events }: { events: Event[] }) {
  const { user, loading } = useUser();
  if (loading) return <Text>Loading...</Text>;
  if (!user) return <Text>Please log in</Text>;

  const markEvent = async (
    userId: string,
    ticketmasterId: string,
    eventName: string,
    eventDate: string,
    eventUrl: string,
    status: string
  ) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/concerts`,
        {
          user_id: userId,
          ticketmaster_id: ticketmasterId,
          concert_name: eventName,
          concert_date: eventDate,
          concert_url: eventUrl,
          status: status,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
    }
  };

  const [attendedEventIds, setAttendedEventIds] = useState<Set<string>>();
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>();

  useEffect(() => {
    const getUserEvents = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/user/${user.id}/concerts`;
        const response = await axios.get(url);

        const events = await response.data.concerts;

        // convert array to Set for faster lookup
        const attendedEventIds = new Set<string>(
          events
            .filter((e: MarkedEvent) => e.status === "attended")
            .map((e: MarkedEvent) => e.ticketmaster_id)
        );
        const savedEventIds = new Set<string>(
          events
            .filter((e: MarkedEvent) => e.status === "saved")
            .map((e: MarkedEvent) => e.ticketmaster_id)
        );

        setAttendedEventIds(attendedEventIds);
        setSavedEventIds(savedEventIds);
      } catch (error) {
        console.error("Error:", error.response?.data?.error || error.message);
      }
    };
    /* TODO: If events argument is of type MarkedEvent, then no need to call getUserEvents() */
    getUserEvents();
  });

  return (
    <FlatList
      data={events}
      renderItem={({ item }) => {
        let id: string;
        if ("ticketmaster_id" in item) {
          id = item.ticketmaster_id;
        } else {
          id = item.id;
        }

        const dateTime =
          "dates" in item ? item.dates.start.dateTime : item.concert_date;
        const formattedDate = new Date(dateTime).toLocaleString();

        const isAttended = attendedEventIds?.has(id);
        const isSaved = savedEventIds?.has(id);
        return (
          <View style={styles.event}>
            <Text style={[styles.eventTitle, styles.postText]}>
              {"concert_name" in item ? item.concert_name : item.name}
            </Text>
            <Text style={styles.postText}>{formattedDate}</Text>
            <Text style={styles.link} onPress={() => Linking.openURL(item.url)}>
              {item.url}
            </Text>

            <View style={styles.eventActions}>
              <Pressable
                onPress={() =>
                  markEvent(
                    user.id,
                    "ticketmaster_id" in item ? item.ticketmaster_id : item.id,
                    "concert_name" in item ? item.concert_name : item.name,
                    "concert_date" in item
                      ? item.concert_date
                      : item.dates.start.dateTime,
                    item.url,
                    "saved"
                  )
                }
                accessibilityLabel="Mark as saved"
              >
                <FontAwesome
                  name={isSaved ? "bookmark" : "bookmark-o"}
                  size={24}
                  color="white"
                />
              </Pressable>
              <Pressable
                onPress={() =>
                  markEvent(
                    user.id,
                    "ticketmaster_id" in item ? item.ticketmaster_id : item.id,
                    "concert_name" in item ? item.concert_name : item.name,
                    "concert_date" in item
                      ? item.concert_date
                      : item.dates.start.dateTime,
                    item.url,
                    "attended"
                  )
                }
                accessibilityLabel="Mark as attended"
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
      keyExtractor={(item) =>
        "user_concert_id" in item ? item.user_concert_id : item.id
      }
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
