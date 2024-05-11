import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack } from "@mui/material";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
  textAlign: "center",
};

// ModalWindow component
export default function ModalWindow({ open, setOpen, handleConfirm }) {
  return (
    <div>
      {/* Modal component */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="delete__booking__title"
        aria-describedby="delete__booking__description"
      >
        {/* Box component for modal content */}
        <Box sx={style}>
          <Typography id="delete__booking__title" variant="h6" component="h2">
            Delete Booking
          </Typography>
          <Typography id="delete__booking__description" sx={{ mt: 2 }}>
            Are you sure that you want to delete the selected booking permanent?
          </Typography>
          <Stack direction={"row"} spacing={"55%"} sx={{ padding: "10px 0" }}>
            {/* Button to confirm deletion */}
            <Button
              variant="outlined"
              color="error"
              onClick={async () => await handleConfirm()}
            >
              Yes
            </Button>
            {/* Button to cancel deletion */}
            <Button variant="outlined" onClick={() => setOpen(false)}>
              No
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
