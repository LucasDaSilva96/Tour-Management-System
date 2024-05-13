import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentSelectedBooking,
  getReservationModalStatus,
  setCurrentSelectedBooking,
  toggleReservationModal,
} from "../redux/bookingSlice";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Container, Typography } from "@mui/material";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useQueryClient } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import {
  createNewBooking,
  deleteOneBooking,
  removeGuideFromBooking,
  updateOneBooking,
} from "../utils/postData";
import { getCurrentUser } from "../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import ModalWindow from "../components/Modal";

// Extend dayjs with necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

// Define possible booking status options
const STATUS = ["preliminary", "confirmed", "cancelled"];

// Define MenuProps for Select components
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

// Initial state for a booking
const initialState = {
  title: "",
  start: dayjs().utc().hour(new Date().getHours()),
  end: dayjs()
    .utc()
    .hour(new Date().getHours() + 1),
  guide: "",
  status: "preliminary",
  color: "",
  textColor: "black",
  description: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  participants: 50,
  snacks: false,
};

// Label component for rendering label with specific styling
function Label({ componentName }) {
  const content = <strong className="ml-[20%]">{componentName}</strong>;

  return content;
}

// Main component for editing or creating a booking
function EditOrCreateBooking() {
  const queryClient = useQueryClient();
  const user = useSelector(getCurrentUser);
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const { bookingID, dateStr } = useParams();
  const navigate = useNavigate();

  return (
    <>
      {bookingID && !dateStr && (
        <EditBooking
          user={user}
          allGuides={allGuides}
          navigate={navigate}
          queryClient={queryClient}
        />
      )}
      {!bookingID && dateStr && (
        <CreateNewBooking
          queryClient={queryClient}
          user={user}
          allGuides={allGuides}
          navigate={navigate}
          dateStr={dateStr}
        />
      )}
    </>
  );
}

// Edit booking component
function EditBooking({ user, allGuides, navigate, queryClient }) {
  const { bookingID } = useParams();
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const [BOOKING, SETBOOKING] = React.useState({
    ...selectedBooking,
    guide: selectedBooking.guide ? selectedBooking.guide : "",
  });
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [open, setOpen] = React.useState(false);
  const reservationModalStatus = useSelector(getReservationModalStatus);
  const dispatch = useDispatch();
  const [guide, setGuide] = React.useState(
    BOOKING.guide ? allGuides.find((el) => el._id === BOOKING.guide) : ""
  );

  // Function to handle updating a reservation
  const handleUpdateReservation = async () => {
    // Update booking data on the server
    if (await updateOneBooking(user.token, BOOKING, BOOKING._id, guide.email)) {
      // Dispatch action to update current selected booking in Redux state
      if (selectedBooking) dispatch(setCurrentSelectedBooking(BOOKING));
      // Invalidate query to fetch updated data
      queryClient.invalidateQueries();
      // Close reservation modal if open
      if (reservationModalStatus) {
        dispatch(toggleReservationModal());
      }
      // Navigate to home page after updating reservation
      navigate("/");
    }
  };

  // Function to handle deleting a booking
  const handleDeleteBooking = async () => {
    // Delete booking from the server
    if (await deleteOneBooking(user.token, BOOKING)) {
      // Invalidate query to fetch updated data
      queryClient.invalidateQueries();
      // Clear current selected booking in Redux state
      dispatch(setCurrentSelectedBooking({}));
      // Close modal window
      setOpen(false);
    }
  };

  // Function to handle change in booking status
  const handleChangeStatus = (e) => {
    SETBOOKING({ ...BOOKING, status: e.target.value });
  };

  // Function to handle change in guide selection
  const handleChangeGuide = async (e) => {
    // Find the selected guide
    setGuide(allGuides.find((el) => el._id === e.target.value) || "");

    // Remove guide from booking if selected guide is empty
    if (BOOKING.guide && e.target.value === "") {
      await removeGuideFromBooking(user.token, bookingID);
      // Invalidate query to fetch updated data
      queryClient.invalidateQueries();
    }

    // Update booking with selected guide
    SETBOOKING({
      ...BOOKING,
      guide: e.target.value,
    });
  };

  // JSX rendering for EditBooking component
  return (
    <>
      <ModalWindow
        open={open}
        setOpen={setOpen}
        handleConfirm={handleDeleteBooking}
      />
      <Container maxWidth="lg">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": {
              m: 1,
              width: "25ch",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            },
          }}
          noValidate
          autoComplete="off"
        >
          {/* Form fields for editing booking details */}
          <div className="flex flex-wrap items-center">
            <div className="flex flex-col items-center">
              <Typography variant="subtitle2">Title</Typography>
              <TextField
                id="edit__or__create__booking__title"
                multiline
                maxRows={2}
                value={BOOKING.title}
                name="title"
                onChange={(e) =>
                  SETBOOKING({ ...BOOKING, title: e.target.value })
                }
              />
            </div>
            {/* Group Leader */}
            <div className="flex flex-col items-center">
              <Typography variant="subtitle2">Group Leader</Typography>
              <TextField
                id="edit__or__create__booking__leader"
                multiline
                maxRows={2}
                value={BOOKING.contactPerson}
                name="group__leader"
                onChange={(e) =>
                  SETBOOKING({ ...BOOKING, contactPerson: e.target.value })
                }
              />
            </div>
            {/* Email */}
            <div className="flex flex-col items-center">
              <Typography variant="subtitle2">Email</Typography>
              <TextField
                id="edit__or__create__booking__email"
                multiline
                maxRows={2}
                value={BOOKING.contactEmail}
                name="email"
                onChange={(e) =>
                  SETBOOKING({ ...BOOKING, contactEmail: e.target.value })
                }
              />
            </div>
            {/* Phone */}
            <div className="flex flex-col items-center">
              <Typography variant="subtitle2">Phone</Typography>
              <TextField
                id="edit__or__create__booking__phone"
                multiline
                maxRows={2}
                value={BOOKING.contactPhone}
                name="phone"
                onChange={(e) =>
                  SETBOOKING({ ...BOOKING, contactPhone: e.target.value })
                }
              />
            </div>
            {/* Group Size */}
            <TextField
              label="Group Size"
              id="edit__or__create__booking__size"
              placeholder={BOOKING.participants ? null : "Group Size"}
              color="primary"
              sx={{ alignSelf: "end" }}
              type="number"
              value={BOOKING.participants}
              name="size"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, participants: Number(e.target.value) })
              }
            />
            {/* Date and time pickers for start and end */}
            <div className="flex items-center flex-wrap gap-2">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  components={["DateTimePicker"]}
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <DemoItem
                    label={
                      <Label
                        componentName="Start Date & Time"
                        valueType="date time"
                      />
                    }
                  >
                    <DateTimePicker
                      ampm={false}
                      timezone="UTC"
                      defaultValue={dayjs(BOOKING.start) || selectedDate}
                      format="DD/MM/YYYY HH:mm"
                      onChange={(date) =>
                        SETBOOKING({
                          ...BOOKING,
                          start: dayjs(date).toISOString(),
                        })
                      }
                    />
                  </DemoItem>
                  <DemoItem
                    label={
                      <Label
                        componentName="End Date & Time"
                        valueType="date time"
                      />
                    }
                  >
                    <DateTimePicker
                      timezone="UTC"
                      defaultValue={dayjs(BOOKING.end) || null}
                      ampm={false}
                      format="DD/MM/YYYY HH:mm"
                      onChange={(date) =>
                        SETBOOKING({
                          ...BOOKING,
                          end: dayjs(date).toISOString(),
                        })
                      }
                    />
                  </DemoItem>
                </Box>
              </LocalizationProvider>

              {/* Select guide */}
              <Box sx={{ marginTop: "18px" }}>
                <FormControl variant="standard" sx={{ width: 200 }}>
                  <InputLabel id="Guide">Guide</InputLabel>
                  <Select
                    variant="standard"
                    labelId="select-guide__label"
                    id="select-guide"
                    value={BOOKING.guide}
                    onChange={handleChangeGuide}
                    MenuProps={MenuProps}
                  >
                    <MenuItem key={"none"} value={""}>
                      None
                    </MenuItem>
                    {allGuides.map((guide) => (
                      <MenuItem key={guide._id} value={guide._id}>
                        {guide.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Select snacks or mingel */}
              <Box sx={{ marginTop: "18px" }}>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                  <InputLabel id="edit__or__create__booking__snacks__label">
                    Snacks || Mingel
                  </InputLabel>
                  <Select
                    labelId="edit__or__create__booking__snacks__label"
                    id="edit__or__create__booking__snacks"
                    value={BOOKING.snacks}
                    label="Snacks"
                    onChange={(e) =>
                      SETBOOKING({ ...BOOKING, snacks: e.target.value })
                    }
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>

            {/* Select booking status */}

            <FormControl variant="standard" sx={{ m: 1, width: 200 }}>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                id="status-select"
                value={BOOKING.status}
                onChange={handleChangeStatus}
                label="Status"
              >
                {STATUS.map((stat) => (
                  <MenuItem value={stat} key={stat}>
                    {stat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description */}
            <TextField
              sx={{ minWidth: "375px" }}
              id="edit__or__create__booking__description"
              label="Description"
              multiline
              name="description"
              rows={6}
              value={BOOKING.description}
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, description: e.target.value })
              }
            />
          </div>
          {/* Buttons for saving, canceling, and deleting booking */}
          <Stack direction={"row"} spacing={2} sx={{ marginLeft: ".7%" }}>
            <Button
              variant="outlined"
              sx={{ padding: "10px 35px" }}
              onClick={async () => await handleUpdateReservation()}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ padding: "10px 35px" }}
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpen(true)}
            >
              Delete Booking
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}

// Create new booking component
function CreateNewBooking({ queryClient, user, allGuides, navigate, dateStr }) {
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

  const [BOOKING, SETBOOKING] = React.useState({
    ...initialState,
    start: dayjs(new Date(dateStr)).utc().hour(new Date().getHours()),
    end: dayjs(new Date(dateStr))
      .utc()
      .hour(new Date().getHours() + 1),
  });
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [guide, setGuide] = React.useState("");

  // Function to handle change in guide selection
  const handleChangeGuide = (e) => {
    const guide = allGuides.find((el) => el.fullName === e.target.value);
    setGuide(guide.fullName);
    SETBOOKING({ ...BOOKING, guide: guide._id });
  };

  const handleRemoveGuide = () => {
    setGuide("");
    SETBOOKING({ ...BOOKING, guide: null });
  };

  // Function to handle creating a new booking
  const handleCreateBooking = async () => {
    if (BOOKING.guide) {
      const guideEmail = allGuides.find((el) => el._id === BOOKING.guide).email;

      // Create new booking on the server with guide
      if (await createNewBooking(user.token, BOOKING, guideEmail)) {
        // Invalidate query to fetch updated data
        queryClient.invalidateQueries();
        // Close reservation modal if open
        SETBOOKING({ ...initialState });
      }
    } else {
      // Delete guide from BOOKING if no guide has been assigned
      delete BOOKING.guide;
      // Create new booking on the server without guide
      if (await createNewBooking(user.token, BOOKING)) {
        queryClient.invalidateQueries();
        SETBOOKING({ ...initialState });
      }
    }
  };

  // JSX rendering for CreateNewBooking component
  return (
    <Container maxWidth="lg">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {
            m: 1,
            width: "25ch",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          },
        }}
        noValidate
        autoComplete="off"
      >
        {/* Title */}
        <div className="flex flex-wrap items-center">
          <div className="flex flex-col items-center">
            <Typography variant="subtitle2">Title</Typography>
            <TextField
              required
              label="Required"
              id="edit__or__create__booking__title"
              multiline
              maxRows={2}
              value={BOOKING.title}
              name="title"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, title: e.target.value })
              }
            />
          </div>

          {/* Group Leader */}
          <div className="flex flex-col items-center">
            <Typography variant="subtitle2">Group Leader</Typography>
            <TextField
              id="edit__or__create__booking__title__leader"
              required
              label="Required"
              multiline
              maxRows={2}
              value={BOOKING.contactPerson}
              name="group__leader"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, contactPerson: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="flex flex-col items-center">
            <Typography variant="subtitle2">Email</Typography>
            <TextField
              required
              label="Phone or email required"
              id="edit__or__create__booking__email"
              multiline
              maxRows={2}
              value={BOOKING.contactEmail}
              name="email"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, contactEmail: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center">
            <Typography variant="subtitle2">Phone</Typography>
            <TextField
              required
              label="Phone or email required"
              id="edit__or__create__booking__phone"
              multiline
              maxRows={2}
              value={BOOKING.contactPhone}
              name="phone"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, contactPhone: e.target.value })
              }
            />
          </div>

          {/* Group Size */}
          <TextField
            label="Group Size"
            placeholder={BOOKING.participants ? null : "Group Size"}
            color="primary"
            sx={{ alignSelf: "end" }}
            type="number"
            value={BOOKING.participants}
            name="size"
            onChange={(e) =>
              SETBOOKING({ ...BOOKING, participants: Number(e.target.value) })
            }
          />

          {/* Date and time pickers for start and end */}
          <div className="flex items-center flex-wrap gap-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box
                components={["DateTimePicker"]}
                sx={{ display: "flex", flexWrap: "wrap" }}
              >
                <DemoItem
                  label={
                    <Label
                      componentName="Start Date & Time*"
                      valueType="date time"
                    />
                  }
                >
                  <DateTimePicker
                    ampm={false}
                    timezone="UTC"
                    defaultValue={dayjs(BOOKING.start) || selectedDate}
                    format="DD/MM/YYYY HH:mm"
                    disablePast={true}
                    onChange={(date) =>
                      SETBOOKING({
                        ...BOOKING,
                        start: dayjs(date).toISOString(),
                      })
                    }
                  />
                </DemoItem>
                <DemoItem
                  label={
                    <Label
                      componentName="End Date & Time*"
                      valueType="date time"
                    />
                  }
                >
                  <DateTimePicker
                    timezone="UTC"
                    defaultValue={dayjs(BOOKING.end) || null}
                    ampm={false}
                    format="DD/MM/YYYY HH:mm"
                    disablePast={true}
                    onChange={(date) =>
                      SETBOOKING({
                        ...BOOKING,
                        end: dayjs(date).toISOString(),
                      })
                    }
                  />
                </DemoItem>
              </Box>
            </LocalizationProvider>

            {/* Select guide */}
            <Box sx={{ marginTop: "18px" }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="Guide">Guide</InputLabel>
                <Select
                  labelId="Guide"
                  id="select-guide"
                  value={guide}
                  MenuProps={MenuProps}
                  onChange={handleChangeGuide}
                  label="Guide"
                >
                  {allGuides.map((guide) => (
                    <MenuItem key={guide._id} value={guide.fullName}>
                      {guide.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {BOOKING.guide && (
              <Box sx={{ marginTop: "2.5dvh" }}>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ padding: "15px 10px" }}
                  onClick={handleRemoveGuide}
                >
                  Remove Guide
                </Button>
              </Box>
            )}

            {/* Select snacks or mingel */}
            <Box sx={{ marginTop: "18px" }}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="edit__or__create__booking__snacks__label">
                  Snacks || Mingel
                </InputLabel>
                <Select
                  labelId="edit__or__create__booking__snacks__label"
                  id="edit__or__create__booking__snacks"
                  value={BOOKING.snacks}
                  label="Snacks"
                  onChange={(e) =>
                    SETBOOKING({ ...BOOKING, snacks: e.target.value })
                  }
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          {/* Description */}
          <TextField
            sx={{ minWidth: "375px" }}
            id="edit__or__create__booking__description"
            label="Description"
            placeholder={BOOKING.description ? null : "Description"}
            multiline
            rows={6}
            value={BOOKING.description}
            name="description"
            onChange={(e) =>
              SETBOOKING({ ...BOOKING, description: e.target.value })
            }
          />
        </div>

        {/* Button for saving new booking */}
        <Stack direction={"row"} spacing={2} sx={{ marginLeft: ".7%" }}>
          <Button
            variant="outlined"
            sx={{ padding: "10px 35px" }}
            onClick={async () => await handleCreateBooking()}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ padding: "10px 35px" }}
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
export default EditOrCreateBooking;
