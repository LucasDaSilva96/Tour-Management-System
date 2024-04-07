import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./Login";

function Layout() {
  const year = new Date().getFullYear();
  return (
    <main className=" w-[100dvw] h-[100dvh] flex flex-col">
      <ThemeProvider theme={defaultTheme}>
        <Header />
        <Outlet />
        <footer className=" mt-auto py-1 bg-[#2195f3ec] flex items-center justify-center w-[100dvw] text-white">
          Ⓒ {year} || Lucas Da Silva
        </footer>
      </ThemeProvider>
    </main>
  );
}

export default Layout;
