import {
  ImageBackground,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { APP_CONFIG } from "../constants/config";

export default function EventDetails() {
  const { eventName, eventDate, eventUrl } = useLocalSearchParams();
  const router = useRouter();

  const parsedName = Array.isArray(eventName) ? eventName[0] : eventName;
  const parsedDate = Array.isArray(eventDate) ? eventDate[0] : eventDate;
  const parsedUrl = Array.isArray(eventUrl) ? eventUrl[0] : eventUrl;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={APP_CONFIG.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.backButton}>
          <Pressable onPress={() => router.back()}>
            <FontAwesome name="chevron-left" color="white" size={24} />
          </Pressable>
        </View>

        <View style={styles.event}>
          <Text style={[styles.eventTitle, styles.postText]}>{parsedName}</Text>
          <Text style={styles.postText}>{parsedDate}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL(parsedUrl)}>
            {parsedUrl}
          </Text>

          {/* TODO: add saved/attended icons */}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 20,
  },
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
});
