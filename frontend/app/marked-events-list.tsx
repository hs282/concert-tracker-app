import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import EventsList from "@/components/EventsList";
import { APP_CONFIG } from "@/constants/config";

export default function MarkedEventsList() {
  const { status, events } = useLocalSearchParams();
  const router = useRouter();

  const parsedEvents = Array.isArray(events) ? events[0] : events;
  const parsedEventsArr = JSON.parse(parsedEvents);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={APP_CONFIG.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Pressable onPress={() => router.back()}>
          <FontAwesome name="chevron-left" color="white" size={24} />
        </Pressable>

        <View>
          <Text style={styles.tabHeader}>{status} Concerts</Text>
        </View>

        <EventsList events={parsedEventsArr} />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabHeader: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30,
    color: "white",
    marginLeft: 20,
    alignSelf: "center",
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: 20,
  },
});
