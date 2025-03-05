import { ImageBackground, StyleSheet, TextInput, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useEffect, useState } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import EventsList from "@/components/EventsList";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { auth } from "@/firebase";

const backgroundImage = {
  uri: "https://media.gettyimages.com/id/1645930993/vector/blurred-fluid-dark-gradient-colourful-background.jpg?s=612x612&w=0&k=20&c=cEPW-qd3k8OID7CV-Z7KEp2P2z3w4Zs9QqorK32LO_8=",
};

export default function Search() {
  const [events, setEvents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState(new Date());
  //console.log(auth.currentUser?.email);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
  };

  /* TODO: add try catch */
  /* TODO: add endDateTime query param */
  /* TODO: allow for picking a date range */
  useEffect(() => {
    const getEvents = async () => {
      const formattedDate = date.toISOString().split(".")[0] + "Z"; // date without milliseconds
      const response = await fetch(
        `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&keyword=${keyword}&city=${city}&startDateTime=${formattedDate}&apikey=GQsmw6b9MrQKuZAQtUavE0tv9rxDiw00`
      );
      const data = await response.json();
      const embedded = await data._embedded;
      const events = await embedded.events;

      setEvents(events);
    };

    getEvents();
  }, [keyword, city, date]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/*<View><Text style={styles.tabHeader}>Search</Text></View> */}

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
  tabHeader: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30,
    color: "white",
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
    padding: 20,
  },
  postText: {
    color: "white",
  },
  post: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1,
    height: 80,
    width: "100%",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  scrollView: {
    backgroundColor: "pink",
  },
  event: {
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1,
    height: 80,
    width: "100%",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    //height: 40,
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
  locationIcon: {},
  searchParams: {
    marginBottom: 20,
  },
});
