import axios from "axios";
import toast from "react-hot-toast";

// TODO Update all URL's after deployment

export const fetchAllBookingsByYear = async (
  token,
  year = new Date().getFullYear()
) => {
  if (!token) {
    toast.error("No user-token provided.");
    return null;
  }
  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/tours/bookings?year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.result;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const fetchAllGuides = async (token) => {
  if (!token) {
    toast.error("No user-token provided.");
    return null;
  }

  try {
    const res = await axios.get(
      `http://localhost:8000/api/v1/guides/getGuides`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.guides;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const fetchAllYearsDoc = async (token) => {
  if (!token) {
    toast.error("No user-token provided.");
    return null;
  }

  try {
    const res = await axios.get(`http://localhost:8000/api/v1/tours/tourDocs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.data;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};
