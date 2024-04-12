import React from "react";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { isLoggedIn } from "./redux/userSlice";
import Layout from "./pages/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/CalenderHomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

function App() {
  const userLoggedIn = useSelector(isLoggedIn);
  return (
    <div className="App">
      {userLoggedIn ? <RouterProvider router={router} /> : <Login />}
    </div>
  );
}

export default App;
