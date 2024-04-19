import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentSelectedBooking,
  setCurrentSelectedBooking,
  setCurrentSelectedBookingModified,
} from "../redux/bookingSlice";
import { getAllGuides } from "../redux/guideSlice";
import { removeGuideFromBooking } from "../utils/postData";
import { getCurrentUser } from "../redux/userSlice";

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
  const user = useSelector(getCurrentUser);
  const allGuides = useSelector(getAllGuides);
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const [guide, setGuide] = React.useState(
    selectedBooking.guide
      ? allGuides.find((e) => e._id === selectedBooking.guide).fullName
      : ""
  );
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const selectedFullName = event.target.value; // Get the selected fullName
    setGuide(selectedFullName); // Store the selected fullName in state

    // Find the corresponding guide object and extract its ID
    const selectedGuide = allGuides.find(
      (el) => el.fullName === selectedFullName
    )._id;

    // Dispatch actions with the selected guide ID
    dispatch(
      setCurrentSelectedBooking({
        ...selectedBooking,
        guide: selectedGuide,
      })
    );
    dispatch(setCurrentSelectedBookingModified(true));
  };

  const handleRemoveGuide = async () => {
    if (await removeGuideFromBooking(user.token, selectedBooking._id)) {
      dispatch(
        setCurrentSelectedBooking({
          ...selectedBooking,
          guide: null,
        })
      );
      dispatch(setCurrentSelectedBookingModified(true));
      setGuide("");
    }
  };

  return (
    <div className="flex items-center gap-2">
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
          {allGuides.map((guide) => (
            <MenuItem key={guide._id} value={guide.fullName}>
              {guide.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedBooking.guide && (
        <Button
          variant="outlined"
          color="error"
          sx={{ padding: "15px 10px" }}
          onClick={async () => await handleRemoveGuide()}
        >
          Remove Guide
        </Button>
      )}
    </div>
  );
}

export default AssignGuideOrChangeGuideSelect;
