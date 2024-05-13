import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentSelectedBooking,
  setCurrentSelectedBooking,
  setCurrentSelectedBookingModified,
} from "../redux/bookingSlice";

// Constants for menu height
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Array of possible status values
const STATUS = ["preliminary", "confirmed", "cancelled"];

// Component for changing reservation status
function ChangeReservationStatusSelect() {
  const selectedBooking = useSelector(getCurrentSelectedBooking); // Getting currently selected booking from Redux store
  const [status, setStatus] = React.useState(selectedBooking.status); // State for selected status
  const dispatch = useDispatch(); // Dispatch function from Redux

  // Function to handle status change
  const handleChange = (event) => {
    setStatus(event.target.value); // Setting selected status
    // Dispatching action to update selected booking with new status
    dispatch(
      setCurrentSelectedBooking({
        ...selectedBooking,
        status: event.target.value,
      })
    );
    // Dispatching action to mark booking as modified
    dispatch(setCurrentSelectedBookingModified(true));
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, width: 200 }}>
        <InputLabel id="status">Status</InputLabel>
        <Select
          labelId="status"
          id="status-select"
          value={selectedBooking.status}
          onChange={handleChange}
          label="Status"
        >
          {STATUS.map((stat) => (
            <MenuItem value={stat} key={stat}>
              {stat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default ChangeReservationStatusSelect;
