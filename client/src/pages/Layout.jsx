import Header from "../components/Header";
import { Outlet, useNavigation } from "react-router-dom";
import Login from "./Login";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../redux/userSlice";
import { changeTabText } from "../App";

function Layout() {
  const year = new Date().getFullYear();
  const userLoggedIn = useSelector(isLoggedIn);

  if (!userLoggedIn) {
    changeTabText("Login");
  } else {
    changeTabText("Calendar");
  }

  const { state } = useNavigation();

  if (!userLoggedIn) return <Login />;

  return (
    <main className=" w-[100dvw] h-[100dvh] flex flex-col relative gap-2 overflow-x-hidden overflow-y-auto">
      <Header />
      {state === "loading" && <Loading />}
      <Outlet />
      <footer className=" mt-auto py-1 bg-[#2195f3ec] flex items-center justify-center w-[100dvw] text-white">
        ⒸCopyright {year} Lucas Da Silva
      </footer>
    </main>
  );
}

export default Layout;
