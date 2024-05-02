import React from "react";
import { useDispatch } from "react-redux";
import Layout from "./pages/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/CalenderHomePage";
import NewReservation from "./pages/NewReservation";
import Overview from "./pages/Overview";
import Guides from "./pages/Guides";
import {
  fetchAllBookingsByYear,
  fetchAllGuides,
  fetchAllYearsDoc,
} from "./utils/fetchData";
import { setAllBookings } from "./redux/bookingSlice";
import { setAllGuides } from "./redux/guideSlice";
import EditOrCreateBooking from "./pages/EditOrCreateBooking";
import { useQuery } from "@tanstack/react-query";
import Loading from "./pages/Loading";
import ErrorPage from "./pages/ErrorPage";
import SearchBooking from "./pages/SearchBooking";
import UserDashboard from "./pages/UserDashboard";
import { createTheme, ThemeProvider } from "@mui/material";
import { getMe } from "./utils/rememberMe";
import ResetPassword from "./pages/ResetPassword";

export const changeTabText = (text) => {
  return (window.document.title = `Sandgrund || ${text}`);
};

const defaultTheme = createTheme({
  palette: {
    primary: {
      light: "#4dabf5",
      main: "#2196f3",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: () => {
          return changeTabText("Calendar");
        },
      },
      {
        path: "newReservation/:dateStr",
        element: <NewReservation />,
        loader: () => changeTabText("New Reservation"),
      },
      {
        path: "Overview",
        element: <Overview />,
        loader: () => changeTabText("Overview"),
      },
      {
        path: "Guides",
        element: <Guides />,
        loader: () => changeTabText("Guides"),
      },
      {
        path: "booking/:bookingID",
        element: <EditOrCreateBooking />,
      },
      {
        path: "Search-Bookings",
        element: <SearchBooking />,
      },
      {
        path: "New-Booking",
        element: <EditOrCreateBooking />,
      },
      {
        path: "Account",
        element: <UserDashboard />,
      },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "resetPassword/:token/:email",
    element: <ResetPassword />,
  },
]);

function App() {
  const dispatch = useDispatch();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`AllBookings`],
    queryFn: async () => {
      const data = await fetchAllBookingsByYear();
      return data || [];
    },
  });

  const {
    data: guides,
    isLoading: guideLoading,
    error: guideError,
  } = useQuery({
    queryKey: ["AllGuides"],
    queryFn: async () => {
      const data = await fetchAllGuides();
      return data || [];
    },
  });

  const {
    data: allYearsDoc,
    isLoading: allYearsDocLoading,
    error: allYearsDocError,
  } = useQuery({
    queryKey: ["AllYearsDoc"],
    queryFn: async () => {
      const data = await fetchAllYearsDoc();
      return data || [];
    },
  });

  if (isLoading || guideLoading || allYearsDocLoading) {
    return <Loading />;
  }

  if (error || guideError || allYearsDocError) {
    return (
      <ErrorPage
        message={
          error.message || guideError.message || allYearsDocError.message
        }
      />
    );
  }

  dispatch(setAllBookings(bookings));
  dispatch(setAllGuides(guides));

  return (
    <div className="App">
      <ThemeProvider theme={defaultTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
