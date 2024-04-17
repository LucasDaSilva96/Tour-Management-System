import axios from "axios";
import toast from "react-hot-toast";
export const updateOneBooking = async (token, data, bookingID, guideEmail) => {
  // * This is for removing the doc-id, because we don't want to change the doc-id & the guide
  const { _id, guide, ...DATA } = data;
  const toastId = toast.loading("Loading...");
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
    toast.dismiss(toastId);
    toast.success("Booking successfully updated");
  } catch (e) {
    toast.error("ERROR: " + e.message);
    return null;
  }
};
