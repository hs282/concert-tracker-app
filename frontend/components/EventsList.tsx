import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from '@expo/vector-icons/Feather';
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";

// to make the button change animated:
// https://dev.to/vcapretz/instagram-like-button-in-react-native-and-reanimated-v2-3h3k

export default function EventsList({ events }) {
    return (
        <FlatList
            data={events}
            renderItem={({ item }) => 
                <View style={styles.event}>
                    <Text style={[styles.eventTitle, styles.postText]}>{item.name}</Text>
                    <Text style={styles.postText}>{item.dates.start.localDate}</Text>
                    <Text style={styles.link} onPress={() => Linking.openURL(item.url)}>{item.url}</Text>
                    <Text style={styles.postText}>3 friends saved this event</Text>
                    
                    <View style={styles.eventActions}>
                        <Pressable onPress={() => {}} >
                            <Feather name="bookmark" size={24} color="white"/>
                        </Pressable>
                        <Pressable onPress={() => {}} >
                            <AntDesign name="checkcircleo" size={24} color="white" />
                        </Pressable>
                    </View>
                </View>
            }
            keyExtractor={item => item.id}
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
        gap: 10
    },
    eventTitle: {
        fontSize: 18,
    },
    postText: {
        color: "white"
    },
    link: {
        color: "skyblue",
    },
    eventActions: {
        flexDirection: "row",
        gap: 20,
        alignSelf: "flex-end"
    },
})