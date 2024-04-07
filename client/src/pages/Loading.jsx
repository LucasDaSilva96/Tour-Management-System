import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loading() {
  return (
    <div className=" fixed top-0 left-0 w-[100dvw] h-[100dvh] backdrop-blur-sm z-50 flex items-center justify-center">
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    </div>
  );
}

export default Loading;
