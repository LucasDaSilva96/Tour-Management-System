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
import { getAllGuides } from "../redux/guideSlice";

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

function AssignGuideOrChangeGuideSelect() {
  const allGuides = useSelector(getAllGuides);
  const GUIDES = allGuides.map((el) => el);
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const [guide, setGuide] = React.useState(
    selectedBooking.guide
      ? allGuides.find((el) => el._id === selectedBooking.guide)
      : null
  );
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setGuide(allGuides.find((el) => el.fullName === event.target.value));
    dispatch(
      setCurrentSelectedBooking({
        ...selectedBooking,
        guide: GUIDES.find((el) => el.fullName === event.target.value)._id,
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
          id="guide"
        >
          Guide
        </InputLabel>
        <Select
          labelId="Guide"
          id="select-guide"
          value={guide}
          onChange={handleChange}
          input={<OutlinedInput label="Guide" />}
          MenuProps={MenuProps}
        >
          {GUIDES.map((guide) => (
            <MenuItem key={guide._id} value={guide.fullName}>
              {guide.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default AssignGuideOrChangeGuideSelect;
