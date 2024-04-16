import axios from "axios";

// TODO update all urls
export const updateOneBooking = async (token, data, bookingID) => {
  console.log(token, bookingID);
  try {
    await axios.patch(
      `http://localhost:8000/api/v1/tours/booking/update?bookingID=${bookingID}`,
      {
        ...data,
      },

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};
