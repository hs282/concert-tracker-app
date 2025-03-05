import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FeedItem from "@/components/FeedItem";
import Feed from "@/components/Feed";

const backgroundImage = {
  uri: "https://media.gettyimages.com/id/1645930993/vector/blurred-fluid-dark-gradient-colourful-background.jpg?s=612x612&w=0&k=20&c=cEPW-qd3k8OID7CV-Z7KEp2P2z3w4Zs9QqorK32LO_8=",
};

export default function Index() {
  const feedItems = [
    {
      user: "Elise",
      eventName: "Alicia Keys Tour",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      action: "saved",
      id: "1",
    },
    {
      user: "Fernando",
      eventName: "Kaytranada World Tour",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      action: "attended",
      id: "2",
    },
    {
      user: "Lisa",
      eventName: "Usher",
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      action: "saved",
      id: "3",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={backgroundImage}
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
