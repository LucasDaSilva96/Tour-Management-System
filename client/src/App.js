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
import { fetchAllBookingsByYear, fetchAllGuides } from "./utils/fetchData";
import { setAllBookings } from "./redux/bookingSlice";
import { setAllGuides } from "./redux/guideSlice";
import EditOrCreateBooking from "./pages/EditOrCreateBooking";

import { useQuery } from "@tanstack/react-query";
import Loading from "./pages/Loading";
import toast from "react-hot-toast";

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
    ],
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
    queryFn: () => fetchAllBookingsByYear(user.token),
  });

  const {
    data: guides,
    isLoading: guideLoading,
    error: guideError,
  } = useQuery({
    queryKey: ["AllGuides"],
    queryFn: () => fetchAllGuides(user.token),
  });

  if (isLoading || guideLoading) {
    return <Loading />;
  }

  if (error) {
    return toast.error(error.message);
  }

  if (guideError) {
    return toast.error(guideError.message);
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
