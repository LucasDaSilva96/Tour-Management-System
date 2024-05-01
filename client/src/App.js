import React from "react";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, isLoggedIn } from "./redux/userSlice";
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

export const changeTabText = (text) => {
  return (window.document.title = `Sandgrund || ${text}`);
};

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
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
