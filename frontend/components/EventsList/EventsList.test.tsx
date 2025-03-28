import { screen, render, waitFor } from "@testing-library/react-native";
import EventsList from "./EventsList";
import { MarkedEvent } from "@/app/(tabs)/profile";
import axios from "axios";

jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("axios");

jest.mock("expo-font");

describe("EventsList", () => {
  const mockEvents: MarkedEvent[] = [
    {
      concert_date: "2025-04-04T04:44:40.910Z",
      concert_name: "Billy Joel World Tour",
      marked_date: "2025-03-03T04:44:40.910Z",
      status: "saved",
      ticketmaster_id: "abc1",
      user_concert_id: "1",
      url: "https://www.sample-url-billy.com",
    },
    {
      concert_date: "2025-03-05T04:44:40.910Z",
      concert_name: "Taylor Swift World Tour",
      marked_date: "2025-03-09T04:44:40.910Z",
      status: "attended",
      ticketmaster_id: "abc2",
      user_concert_id: "2",
      url: "https://www.sample-url-taylor.com",
    },
    {
      concert_date: "2025-04-05T04:44:40.910Z",
      concert_name: "Akon World Tour",
      marked_date: "2025-03-05T04:44:40.910Z",
      status: "saved",
      ticketmaster_id: "abc3",
      user_concert_id: "3",
      url: "https://www.sample-url-akon.com",
    },
  ];

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_BASE_URL = "https://mockapi.com";
    require("@/context/UserContext").useUser.mockReturnValue({
      user: {
        id: "123",
        profile_photo_url: "abc",
        email: "test@example.com",
        first_name: "Bob",
        last_name: "Dylan",
        username: "bobdylan",
        firebase_uid: "abc123",
      },
      loading: false,
      setUser: jest.fn(),
    });

    // Mock axios.get to return mock API response
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        concerts: mockEvents,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders event title, date, and URL correctly", async () => {
    render(<EventsList events={mockEvents} />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(await screen.getByText("Billy Joel World Tour")).toBeTruthy();
    expect(await screen.getByText("4/4/2025, 12:44:40 AM")).toBeTruthy();
    expect(
      await screen.getByText("https://www.sample-url-billy.com")
    ).toBeTruthy();

    expect(await screen.getByText("Taylor Swift World Tour")).toBeTruthy();
    expect(await screen.getByText("3/4/2025, 11:44:40 PM")).toBeTruthy();
    expect(
      await screen.getByText("https://www.sample-url-taylor.com")
    ).toBeTruthy();
  });
});
