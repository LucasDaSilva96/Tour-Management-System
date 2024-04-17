import Header from "../components/Header";
import { Outlet, useNavigation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./Login";
import Loading from "./Loading";

function Layout() {
  const year = new Date().getFullYear();
  const { state } = useNavigation();
  return (
    <main className=" w-[100dvw] h-[100dvh] flex flex-col relative gap-2">
      <ThemeProvider theme={defaultTheme}>
        <Header />
        {state === "loading" && <Loading />}
        <Outlet />
        <footer className=" mt-auto py-1 bg-[#2195f3ec] flex items-center justify-center w-[100dvw] text-white">
          Ⓒ {year} || Lucas Da Silva
        </footer>
      </ThemeProvider>
    </main>
  );
}

export default Layout;
