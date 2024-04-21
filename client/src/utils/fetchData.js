import axios from "axios";
import dayjs from "dayjs";
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

export const getFilteredBookings = (
  allTourYearDocs,
  year,
  filterObjOptions
) => {
  const toastId = toast.loading("Loading...");
  const bookingDoc = allTourYearDocs.find((booking) => booking.year === year);

  if (!bookingDoc) {
    toast.dismiss(toastId);
    return []; // No bookings found for the given year
  }

  const OBJ = { ...filterObjOptions };

  for (const [KEY, VALUE] of Object.entries(filterObjOptions)) {
    if (!VALUE) {
      delete OBJ[KEY];
    }
  }

  const filteredBookings = bookingDoc.bookings.filter((booking) => {
    for (const [key, value] of Object.entries(OBJ)) {
      switch (key) {
        case "guide":
          if (booking.guide && booking.guide._id !== value) return false;
          break;
        case "title":
          if (!booking.title.includes(value)) return false;
          break;
        case "status":
          if (booking.status !== value) return false;
          break;
        case "start":
          const start = new Date(booking.start).toISOString();
          if (start !== dayjs(value).toISOString()) return false;
          break;
        case "contactPerson":
          if (!booking.contactPerson.includes(value)) return false;
          break;
        case "contactPhone":
          if (!booking.contactPhone.includes(value)) return false;
          break;
        case "contactEmail":
          if (!booking.contactEmail.includes(value)) return false;
          break;
        case "snacks":
          if (booking.snacks !== value) return false;
          break;
        default:
          break;
      }
    }
    return true; // Include the booking by default if none of the conditions fail
  });

  toast.dismiss(toastId);
  return filteredBookings;
};
