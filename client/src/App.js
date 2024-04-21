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

const changeTabText = (text) => {
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
    ],
    errorElement: <ErrorPage />,
  },
]);

function App() {
  const userLoggedIn = useSelector(isLoggedIn);
  if (!userLoggedIn) {
    changeTabText("Login");
  } else {
    changeTabText("Calendar");
  }

  const user = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`AllBookings`],
    queryFn: async () => {
      const data = await fetchAllBookingsByYear(user.token);
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
      const data = await fetchAllGuides(user.token);
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
      const data = await fetchAllYearsDoc(user.token);
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
      {userLoggedIn ? <RouterProvider router={router} /> : <Login />}
    </div>
  );
}

export default App;
