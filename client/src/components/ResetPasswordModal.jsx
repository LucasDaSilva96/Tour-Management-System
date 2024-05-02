import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { forgetMe } from "../utils/rememberMe";
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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [email, setEmail] = useState(null);

  const navigate = useNavigate();

  const handleResetPasswordNavigation = async () => {
    const res = await getResetPasswordToken(email);

    if (res.status === "success") {
      navigate(`resetPassword/${res.resetToken}/${email}`);
      handleClose();
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography sx={{ textAlign: "center" }}>
            Enter the email of the account
          </Typography>
          <TextField
            id="outlined-basic"
            label="Email*"
            variant="outlined"
            onChange={(e) => setEmail(e.target.value)}
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
