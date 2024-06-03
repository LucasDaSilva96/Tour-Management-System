import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentSelectedBooking,
  setCurrentSelectedBooking,
  setCurrentSelectedBookingModified,
  toggleReservationModal,
} from '../redux/bookingSlice';
import { removeGuideFromBooking } from '../utils/postData';
import { getCurrentUser } from '../redux/userSlice';
import { useQueryClient } from '@tanstack/react-query';

// Styling for the menu
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
  const queryClient = useQueryClient(); // Query client instance from React Query
  const user = useSelector(getCurrentUser); // Current user data from Redux store
  const allGuides = useQueryClient().getQueryData(['AllGuides']); // All guides data from React Query
  const selectedBooking = useSelector(getCurrentSelectedBooking); // Currently selected booking from Redux store

  // State for selected guide
  const [guide, setGuide] = React.useState(
    selectedBooking.guide
      ? allGuides.find((e) => e._id === selectedBooking.guide).fullName
      : ''
  );

  // Dispatch function from Redux
  const dispatch = useDispatch();

  // Function to handle guide change
  const handleChange = (event) => {
    const selectedFullName = event.target.value; // Get the selected fullName
    setGuide(selectedFullName); // Store the selected fullName in state

    // Find the corresponding guide object and extract its ID
    const selectedGuide = allGuides.find(
      (el) => el.fullName === selectedFullName
    )._id;

    dispatch(
      setCurrentSelectedBooking({
        ...selectedBooking,
        guide: selectedGuide, // Set the guide ID in the booking
      })
    );
    dispatch(setCurrentSelectedBookingModified(true)); // Mark the booking as modified
  };

  // Function to handle removing guide from booking
  const handleRemoveGuide = async () => {
    dispatch(
      setCurrentSelectedBooking({
        ...selectedBooking,
        guide: null, // Remove the guide from the booking
      })
    );
    setGuide(''); // Clear the selected guide

    // Remove the guide from the booking on the server side
    if (await removeGuideFromBooking(user.token, selectedBooking._id)) {
      queryClient.invalidateQueries(['AllBookings', 'AllGuides']); // Invalidate relevant queries
      dispatch(toggleReservationModal()); // Close the reservation modal
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <FormControl variant='standard' sx={{ m: 1, width: 200 }}>
        <InputLabel id='Guide'>Guide</InputLabel>
        <Select
          labelId='Guide'
          id='select-guide'
          value={guide}
          MenuProps={MenuProps}
          onChange={handleChange}
          label='Status'
        >
          {allGuides.map((guide) => (
            <MenuItem key={guide._id} value={guide.fullName}>
              {guide.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedBooking.guide ? (
        <Button
          variant='outlined'
          color='error'
          size='medium'
          sx={{ padding: '15px 10px' }}
          onClick={async () => await handleRemoveGuide()}
        >
          Remove Guide
        </Button>
      ) : null}
    </div>
  );
}

export default AssignGuideOrChangeGuideSelect;
