import { render, screen } from "@testing-library/react-native";
import Feed, { UserEventInteraction } from "./Feed";

jest.mock("@/context/UserContext", () => ({
  useUser: jest.fn(),
}));

jest.mock("expo-font");

describe("Feed", () => {
  const mockFeedItems: UserEventInteraction[] = [
    {
      id: "1",
      first_name: "Louis",
      user_concert_id: "1",
      concert_name: "Beyonce World Tour",
      concert_date: "2025-04-04T04:44:40.910Z",
      marked_date: "2025-03-03T04:44:40.910Z",
      status: "saved",
      url: "https://www.sample-url-beyonce.com",
    },
    {
      id: "2",
      first_name: "Maria",
      user_concert_id: "2",
      concert_name: "Bruno Mars World Tour",
      concert_date: "2025-02-04T04:44:40.910Z",
      marked_date: "2025-03-09T04:44:40.910Z",
      status: "attended",
      url: "https://www.sample-url-bruno.com",
    },
  ];

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_BASE_URL = "https://mockapi.com";
    require("@/context/UserContext").useUser.mockReturnValue({
      user: {
        id: "2",
        profile_photo_url: "abc",
        email: "test@example.com",
        first_name: "Maria",
        last_name: "Gomez",
        username: "maria123",
        firebase_uid: "abc123",
      },
      loading: false,
      setUser: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders user, marking action, concert name, concert date, and marked date correctly in news feed", async () => {
    render(<Feed feedItems={mockFeedItems} />);
    expect(await screen.getByText(/Louis\s+saved/)).toBeTruthy();
    expect(await screen.getByText("Beyonce World Tour")).toBeTruthy();
    expect(await screen.getByText(/happening\s+on\s+4\/4\/2025/)).toBeTruthy();
    expect(await screen.getByText("3/2/2025, 11:44:40 PM")).toBeTruthy();

    expect(await screen.getByText(/You\s+attended/)).toBeTruthy();
    expect(await screen.getByText("Bruno Mars World Tour")).toBeTruthy();
    expect(await screen.getByText(/on\s+2\/3\/2025/)).toBeTruthy();
    expect(await screen.getByText("3/8/2025, 11:44:40 PM")).toBeTruthy();
  });
});
