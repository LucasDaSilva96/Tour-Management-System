import axios from "axios";
import toast from "react-hot-toast";
export const fetchAllBookingsByYear = async (
  year = new Date().getFullYear()
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/tours/bookings?year=${year}`
    );

    return res.data.result;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const fetchAllGuides = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/guides/getGuides`
    );

    return res.data.guides;
  } catch (e) {
    toast.error("ERROR: ", +e.response.data.message);
  }
};

export const fetchAllYearsDoc = async () => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_URL}/api/v1/tours/tourDocs`
    );

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
    if (VALUE === "" || VALUE === undefined || VALUE === null) {
      delete OBJ[KEY];
    }
  }

  const filteredBookings = bookingDoc.bookings.filter((booking) => {
    let shouldInclude = true; // Assume booking should be included by default

    for (const [key, value] of Object.entries(OBJ)) {
      switch (key) {
        case "guide":
          if (booking.guide === value) {
            return (shouldInclude = true);
          } else {
            return (shouldInclude = false);
          }

        case "title":
          if (!booking.title.includes(value)) {
            shouldInclude = false;
          }
          break;
        case "status":
          if (booking.status !== value) {
            shouldInclude = false;
          }
          break;
        case "start":
          const start = new Date(booking.start).toISOString().split("T")[0];
          const Value = new Date(value).toISOString().split("T")[0];

          if (start !== Value) {
            shouldInclude = false;
          } else {
            shouldInclude = true;
          }
          break;
        case "contactPerson":
          if (!String(booking.contactPerson).includes(value)) {
            shouldInclude = false;
          }
          break;
        case "contactPhone":
          if (String(booking.contactPhone) !== String(value)) {
            shouldInclude = false;
          }
          break;
        case "contactEmail":
          if (String(booking.contactEmail) !== String(value)) {
            shouldInclude = false;
          }
          break;
        case "snacks":
          if (booking.snacks !== value) {
            shouldInclude = false;
          }
          break;
        default:
          break;
      }

      // If shouldInclude is false for any condition, no need to check further
      if (!shouldInclude) {
        break;
      }
    }

    return shouldInclude;
  });

  toast.dismiss(toastId);
  return filteredBookings;
};

export const getResetPasswordToken = async (email) => {
  const toastId = toast.loading("Loading...");
  if (!email) {
    toast.dismiss(toastId);
    toast.error("No email provided");
    return {
      status: "fail",
      resetToken: null,
    };
  }
  try {
    const req = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/v1/users/resetPassword`,
      {
        email,
      }
    );

    toast.success("Token successfully retrieved.");
    return {
      status: "success",
      resetToken: req.data.resetToken,
    };
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return {
      status: "fail",
      resetToken: null,
    };
  } finally {
    toast.dismiss(toastId);
  }
};
