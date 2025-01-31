import EvilIcons from "@expo/vector-icons/EvilIcons";
import { StyleSheet, Text, View } from "react-native";


export default function FeedItem({
    user,
    eventName,
    date,
    action
}: {
    user: string, // should be User.name
    eventName: string,
    date: string,
    action: string, // should be Action
}) {
    return (
        <View style={styles.post}>
          <Text style={styles.postText}>{user} {action === "saved" ? "saved" : "attended"} {eventName}</Text>
          <Text style={styles.postText}>{date}</Text>
          <View style={styles.postActions}>
            <EvilIcons name="heart" size={32} color="white" />
            <EvilIcons name="comment" size={32} color="white" />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    post: {
        borderColor: "gray",
        borderBottomWidth: 1,
        width: "100%",
        justifyContent: "center",
        padding: 10,
        borderRadius: 10,
        gap: 10,
        paddingLeft: 20
    },
    postText: {
        color: "white"
    },
    postActions: {
        flexDirection: "row",
        justifyContent: "flex-end"
    }
})