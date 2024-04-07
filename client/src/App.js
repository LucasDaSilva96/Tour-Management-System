import React from "react";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { getLoadingState } from "./redux/loadingSlice";
import Loading from "./pages/Loading";
import { getErrorState, getErrorMessage } from "./redux/errorSlice";
import { isLoggedIn } from "./redux/userSlice";
import AlertComponent from "./components/AlertNotis";
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
  const isLoadingState = useSelector(getLoadingState);
  const errorFound = useSelector(getErrorState);
  const errorMessage = useSelector(getErrorMessage);
  const userLoggedIn = useSelector(isLoggedIn);
  return (
    <div className="App">
      {isLoadingState ? <Loading /> : null}
      {errorFound ? (
        <AlertComponent type="error">{errorMessage}</AlertComponent>
      ) : null}
      {userLoggedIn ? <RouterProvider router={router} /> : <Login />}
    </div>
  );
}

export default App;
