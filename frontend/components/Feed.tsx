import { FlatList, View } from "react-native";
import FeedItem from "./FeedItem";
import { useUser } from "@/context/UserContext";

export interface UserEventInteraction {
  first_name?: string;
  user_concert_id: string;
  concert_name: string;
  concert_date: string;
  marked_date: string;
  status: string;
  url: string;
}

export default function Feed({
  feedItems,
}: {
  feedItems: UserEventInteraction[];
}) {
  const { user, loading } = useUser();
  if (loading) {
    return <div>Loading...</div>;
  }

  const renderItem = ({ item }: { item: UserEventInteraction }) => {
    const userFirstName = item.first_name;
    let displayName;
    if (userFirstName && userFirstName !== user?.first_name)
      displayName = userFirstName;
    else displayName = "You";

    return (
      <FeedItem
        user={displayName}
        userEventID={item.user_concert_id}
        eventName={item.concert_name}
        eventDate={item.concert_date}
        markedDate={item.marked_date}
        status={item.status}
        eventUrl={item.url}
      />
    );
  };
  return (
    <FlatList
      data={feedItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.user_concert_id}
    />
  );
}
