import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/", { replace: true });
  };

  return (
    <section className=" w-[100dvw] h-[100dvh] flex items-center justify-center">
      <article className="min-w-[375px] max-w-[500px] flex flex-col items-center h-[200px] justify-around text-center border-1 border-blue-400 rounded-md shadow-md">
        <Typography variant="h5">
          The page that you are looking for was not found.
        </Typography>
        <Button variant="contained" onClick={handleNavigation}>
          Go back
        </Button>
      </article>
    </section>
  );
}

export default ErrorPage;
