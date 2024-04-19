import axios from "axios";
import toast from "react-hot-toast";
export const updateOneBooking = async (token, data, bookingID, guideEmail) => {
  // * This is for removing the doc-id, because we don't want to change the doc-id & the guide
  const { _id, guide, ...DATA } = data;
  const toastId = toast.loading("Loading...");
  if (!token || !bookingID) {
    toast.error("No user-token or bookingID provided");
    return null;
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
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return null;
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
};
