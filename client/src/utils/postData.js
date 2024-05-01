import axios from "axios";
import toast from "react-hot-toast";
import store from "../redux/store";
import { v4 as uuidv4 } from "uuid";

export const loginUser = async (email, password) => {
  const toastId = toast.loading("Loading...");

  if (!email || !password) {
    toast.dismiss(toastId);
    toast.error("Please provide email and password.");
    return false;
  }

  try {
    const req = await axios.post("http://localhost:8000/api/v1/users/login", {
      email,
      password,
    });

    toast.success("User successfully logged in.");
    return {
      status: "success",
      user: { ...req.data.data.user, token: req.data.token },
    };
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

export const logOutUser = async () => {};

export const updateOneBooking = async (token, data, bookingID, guideEmail) => {
  // * This is for removing the doc-id, because we don't want to change the doc-id & the guide
  let { _id, guide, ...DATA } = data;

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

export const createNewBooking = async (token, data, guideEmail) => {
  const toastId = toast.loading("Loading...");
  if (!token) {
    toast.dismiss(toastId);
    toast.error("No user-token provided");
    return false;
  }

  data = { ...data, uuid: uuidv4() };

  try {
    const { data: DATA } = await axios.post(
      `http://localhost:8000/api/v1/tours/createBooking`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (guideEmail) {
      await axios.post(
        `http://localhost:8000/api/v1/tours/booking/assignGuide?guide=${guideEmail}&bookingID=${DATA._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    toast.success("Booking successfully created.");
    return true;
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

export const deleteOneBooking = async (token, booking) => {
  const toastId = toast.loading("Loading...");
  if (!token) {
    toast.dismiss(toastId);
    toast.error("No user-token provided");
    return false;
  }

  const year = new Date(booking.start).getFullYear();

  try {
    axios.delete(
      `http://localhost:8000/api/v1/tours/booking/delete?uuid=${booking.uuid}&year=${year}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success("Booking successfully deleted.");
      window.location.assign("/");
    }, 500);
    return true;
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  }
};

export const updateGuide = async (token, guideObj) => {
  const toastId = toast.loading("Loading...");
  if (!token) {
    toast.dismiss(toastId);
    toast.error("No user-token provided");
    return false;
  }

  try {
    const { photo, _id, ...OBJ } = guideObj;
    if (typeof guideObj.photo == "object") {
      const url = `http://localhost:8000/api/v1/guides/uploadGuideImage/${guideObj._id}`;
      const formData = new FormData();
      formData.append("image", photo);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      };

      await axios.post(url, formData, config);
    }

    await axios.patch(
      `http://localhost:8000/api/v1/guides/updateGuide/${guideObj._id}`,
      OBJ,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Guide successfully updated.");
    return true;
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

export const deleteGuide = async (token, guideID) => {
  const toastId = toast.loading("Loading...");
  if (!token) {
    toast.dismiss(toastId);
    toast.error("No user-token provided");
    return false;
  }

  try {
    axios.delete(`http://localhost:8000/api/v1/guides/deleteGuide/${guideID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Guide successfully deleted.");
    return true;
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};

export const createNewGuide = async (token, guideObj) => {
  const toastId = toast.loading("Loading...");
  if (!token) {
    toast.dismiss(toastId);
    toast.error("No user-token provided");
    return false;
  }

  try {
    await axios.post(
      `http://localhost:8000/api/v1/guides/createNewGuide`,
      guideObj,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("New guide successfully created.");
    return true;
  } catch (e) {
    toast.error("ERROR: " + e.response.data.message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};
