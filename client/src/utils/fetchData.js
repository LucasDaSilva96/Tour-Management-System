import axios from "axios";

// TODO Update all URL's after deployment

export const fetchAllBookingsByYear = async (
  token,
  year = new Date().getFullYear()
) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.get(
    `http://localhost:8000/api/v1/tours/bookings?year=${year}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.result;
};

export const fetchAllGuides = async (token) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.get(`http://localhost:8000/api/v1/guides/getGuides`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.guides;
};
