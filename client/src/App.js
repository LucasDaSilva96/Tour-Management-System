import React from "react";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { isLoggedIn } from "./redux/userSlice";
import Layout from "./pages/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/CalenderHomePage";
import NewReservation from "./pages/NewReservation";
import Overview from "./pages/Overview";
import Guides from "./pages/Guides";

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
        loader: () => changeTabText("Calendar"),
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
  return (
    <div className="App">
      {userLoggedIn ? <RouterProvider router={router} /> : <Login />}
    </div>
  );
}

export default App;
