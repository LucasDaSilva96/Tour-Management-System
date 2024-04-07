import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";
import { getErrorState, resetError } from "../redux/errorSlice";
import { useSelector, useDispatch } from "react-redux";

function AlertComponent({ type, children }) {
  const dispatch = useDispatch();
  const errorFound = useSelector(getErrorState);
  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        zIndex: "40",
      }}
    >
      <Collapse in={errorFound}>
        <Alert
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                dispatch(resetError());
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            boxShadow:
              " rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
          }}
        >
          <AlertTitle>{`${type}`.toUpperCase()}</AlertTitle>
          {children}
        </Alert>
      </Collapse>
    </Box>
  );
}

export default AlertComponent;
