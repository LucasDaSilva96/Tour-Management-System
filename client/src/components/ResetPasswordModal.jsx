import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getResetPasswordToken } from "../utils/fetchData";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #2196f3",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

export default function ResetPasswordModal({ open, setOpen }) {
  const handleClose = () => setOpen(false); // Function to close the modal

  const [email, setEmail] = useState(null); // State variable to store the email input

  const navigate = useNavigate(); // Function to navigate to different routes

  // Function to handle the reset password navigation
  const handleResetPasswordNavigation = async () => {
    const res = await getResetPasswordToken(email); // Fetching the reset password token

    // If the reset password token is fetched successfully
    if (res.status === "success") {
      navigate(`resetPassword/${res.resetToken}/${email}`); // Navigating to the reset password page
      handleClose(); // Closing the modal
    }
  };

  return (
    <div>
      {/* Modal for resetting password */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography sx={{ textAlign: "center" }}>
            Enter the email of the account
          </Typography>
          <TextField
            id="reset__password__email__field"
            label="Email*"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          <Button
            variant="contained"
            disabled={email ? false : true}
            onClick={async () => await handleResetPasswordNavigation()}
          >
            Reset Password
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
