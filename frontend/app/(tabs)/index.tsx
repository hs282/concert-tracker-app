import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Feed from "@/components/Feed/Feed";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import axios from "axios";
import { APP_CONFIG } from "@/constants/config";

export default function Index() {
  const { user, loading } = useUser();
  const [feedItems, setFeedItems] = useState([]);

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (!user)
    return (
      <View>
        <Text>Please log in</Text>
      </View>
    );

  const getNewsFeed = async () => {
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/newsfeed/${user.id}`
      );
      const feedItems = await res.data.newsfeed;
      setFeedItems(feedItems);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  getNewsFeed();

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={APP_CONFIG.backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View>
          <Text style={styles.tabHeader}>Friend Activity</Text>
        </View>
        <Feed feedItems={feedItems} />
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
});
