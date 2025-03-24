import { ImageBackground, StyleSheet, TextInput, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useEffect, useState } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import EventsList, { TicketmasterEvent } from "@/components/EventsList";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import { APP_CONFIG } from "@/constants/config";

export default function Search() {
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(new Date());

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (selectedDate) setDate(selectedDate);
  };

  /* TODO: add try catch */
  /* TODO: add endDateTime query param */
  /* TODO: allow for picking a date range */
  useEffect(() => {
    const getEvents = async () => {
      const formattedDate = date.toISOString().split(".")[0] + "Z"; // date without milliseconds
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/concerts`,
          {
            params: {
              keyword: keyword,
              city: city,
              startDateTime: formattedDate,
            },
          }
        );

        const events = await res.data;
        setEvents(events);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (!keyword && !city) setEvents([]);
    else getEvents();
  }, [keyword, city, date]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={APP_CONFIG.backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.searchParams}>
            <View style={styles.searchSection}>
              <EvilIcons name="search" size={28} style={styles.searchIcon} />
              <TextInput
                style={styles.searchBar}
                placeholder="Search artist or event name"
                placeholderTextColor="white"
                value={keyword}
                onChangeText={setKeyword}
                clearButtonMode="always"
              />
            </View>

            <View style={styles.searchSection}>
              <EvilIcons name="location" size={28} color="white" />
              <TextInput
                style={styles.searchBar}
                value={city}
                onChangeText={setCity}
                placeholder="City" // include zip code
                placeholderTextColor="white"
              />
            </View>

            <DateTimePicker
              value={date}
              style={styles.datePicker}
              onChange={handleDateChange}
            />
          </View>
          <EventsList events={events} />
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
  },
  searchBar: {
    flex: 1,
    borderRadius: 10,
    color: "white",
    padding: 8,
    fontSize: 16,
  },
  datePicker: {
    backgroundColor: "white",
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "white",
    marginBottom: 20,
    paddingLeft: 10,
  },
  searchIcon: {
    color: "white",
  },
  searchParams: {
    marginBottom: 20,
  },
});
