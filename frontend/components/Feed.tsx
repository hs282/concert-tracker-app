import { FlatList, StyleSheet } from "react-native";
import FeedItem from "./FeedItem";

export default function Feed({ feedItems }: { feedItems: { user: string; eventName: string; date: string; action: string; id: string }[] }) {
    const renderItem = ({ item }) => (
        <FeedItem user={item.user} eventName={item.eventName} date={item.date} action={item.action} />
    );

    return (
        <FlatList 
            data={feedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
       />
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },

})