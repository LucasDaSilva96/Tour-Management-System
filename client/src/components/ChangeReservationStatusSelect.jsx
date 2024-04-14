import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
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

const STATUS = ["preliminary", "confirmed", "cancelled"];

function ChangeReservationStatusSelect() {
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const [status, setStatus] = React.useState(selectedBooking.status);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setStatus(event.target.value);
    dispatch(
      setCurrentSelectedBooking({
        ...selectedBooking,
        status: event.target.value,
      })
    );
    dispatch(setCurrentSelectedBookingModified(true));
  };

  return (
    <div>
      <FormControl sx={{ width: 200 }}>
        <InputLabel
          variant="filled"
          sx={{ fontSize: "18px", marginLeft: "2px" }}
          id="status"
        >
          Status
        </InputLabel>
        <Select
          sx={{
            backgroundColor:
              status === "confirmed"
                ? "#2dc653"
                : status === "cancelled"
                ? "#f21b3f"
                : "yellow",
          }}
          labelId="status"
          id="select-status"
          value={status}
          onChange={handleChange}
          input={<OutlinedInput label="Status" />}
          MenuProps={MenuProps}
        >
          {STATUS.map((stat) => (
            <MenuItem key={stat} value={stat}>
              {stat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default ChangeReservationStatusSelect;
