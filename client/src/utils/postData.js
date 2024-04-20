import axios from "axios";
import toast from "react-hot-toast";
import store from "../redux/store";
import { v4 as uuidv4 } from "uuid";
export const updateOneBooking = async (token, data, bookingID, guideEmail) => {
  // * This is for removing the doc-id, because we don't want to change the doc-id & the guide
  let { _id, guide, ...DATA } = data;
  DATA = { ...DATA, uuid: uuidv4() };

  const toastId = toast.loading("Loading...");
  if (!token || !bookingID) {
    toast.dismiss(toastId);
    toast.error("No user-token or bookingID provided");
    return false;
  }
  try {
    if (guide) {
      await axios.post(
        `http://localhost:8000/api/v1/tours/booking/assignGuide?guide=${guideEmail}&bookingID=${bookingID}`,
        {}, // Empty request body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    await axios.patch(
      `http://localhost:8000/api/v1/tours/booking/update?bookingID=${bookingID}`,
      DATA,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Booking successfully updated");
    return true;
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

export const removeGuideFromBooking = async (token, bookingID) => {
  const toastId = toast.loading("Loading...");
  if (!bookingID) {
    toast.dismiss(toastId);
    toast.error("No bookingID provided");
    return false;
  }

  const BOOKING = store
    .getState()
    .bookingState.allBookings.find((booking) => booking._id === bookingID);

  if (BOOKING.guide) {
    try {
      const req = await axios.post(
        `http://localhost:8000/api/v1/tours/booking/removeGuide?bookingID=${bookingID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(req.data.message);
      return true;
    } catch (e) {
      toast.error("ERROR: " + e.response.data.message);
      return false;
    } finally {
      toast.dismiss(toastId);
    }
  } else {
    toast.dismiss(toastId);
    return false;
  }
};

export const createNewBooking = async (token) => {
  const toastId = toast.loading("Loading...");
  if (!token) {
    toast.dismiss(toastId);
    toast.error("No user-token provided");
    return false;
  }

  try {
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};
