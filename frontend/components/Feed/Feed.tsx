import { FlatList, View } from "react-native";
import FeedItem from "../FeedItem/FeedItem";
import { useUser } from "@/context/UserContext";

export interface UserEventInteraction {
  first_name?: string;
  id?: string;
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
    const feedItemUserId = item.id;
    const feedItemUserFirstName = item.first_name;
    let displayName;
    /* TODO: modify this logic for displaying name vs "You" */
    if (feedItemUserFirstName && feedItemUserId && feedItemUserId !== user?.id)
      displayName = feedItemUserFirstName;
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
