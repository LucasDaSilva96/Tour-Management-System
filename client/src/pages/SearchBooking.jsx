import Container from "@mui/material/Container";
import { useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { getFilteredBookings } from "../utils/fetchData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentSelectedBooking } from "../redux/bookingSlice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import EmailIcon from "@mui/icons-material/Email";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

// Extend dayjs with timezone functionality
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

// Initial state for booking
const initialState = {
  title: "",
  start: "",
  guide: "",
  status: "preliminary",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  snacks: false,
  year: dayjs().get("year"),
};

// Component for displaying label
function Label({ componentName }) {
  const content = <strong>{componentName}</strong>;

  return content;
}

function SearchBooking() {
  // Initialize state for booking and search result
  const [BOOKING, SETBOOKING] = useState(initialState);
  const [searchResult, setSearchResult] = useState([]);

  // Constants for status and selected date
  const statusArray = ["preliminary", "confirmed", "cancelled"];
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Initialize necessary hooks
  const queryClient = useQueryClient();
  const allYearsDoc = queryClient.getQueryData(["AllYearsDoc"]);
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const minDate = dayjs(`${allYearsDoc[0].year}-01-01`);
  const maxDate = dayjs(`${allYearsDoc[allYearsDoc.length - 1].year}-12-31`);

  // Event handlers for input changes
  const handleChangeTitle = (e) => {
    SETBOOKING({ ...BOOKING, title: e.target.value });
  };
  const handleGuideChange = (e) => {
    SETBOOKING({ ...BOOKING, guide: e.target.value });
  };

  const handleStatusChange = (e) => {
    SETBOOKING({ ...BOOKING, status: e.target.value });
  };

  const handleChangeGroupLeader = (e) => {
    SETBOOKING({ ...BOOKING, contactPerson: e.target.value });
  };

  const handleChangeSnacks = (e) => {
    SETBOOKING({ ...BOOKING, snacks: e.target.value });
  };

  const handleChangeEmail = (e) => {
    SETBOOKING({ ...BOOKING, contactEmail: e.target.value });
  };

  const handleChangePhone = (e) => {
    SETBOOKING({ ...BOOKING, contactPhone: e.target.value });
  };

  // Reset booking and search result
  const handleReset = () => {
    SETBOOKING(initialState);
    setSearchResult([]);
    setSelectedDate(dayjs());
  };

  // Search bookings based on provided criteria
  const handleSearchBookings = () => {
    setSearchResult([]);
    const result = getFilteredBookings(allYearsDoc, BOOKING.year, BOOKING);
    if (result.length > 0) {
      return setSearchResult(result);
    } else {
      toast.error("No booking found with the provided credentials.");
    }
  };

  // Handle year change
  const handleYearChange = (e) => {
    SETBOOKING({ ...BOOKING, year: e.target.value });
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "space-around",
        paddingTop: "10px",
        width: "100dvw",
        height: "100%",
        position: "relative",
      }}
    >
      {/* Search criteria form */}
      <div className="flex items-center gap-4 flex-wrap max-w-[50dvw] h-full border-r border-[#2196f3]">
        <div>
          <Typography variant="subtitle2">Group Title</Typography>
          <TextField
            id="edit__or__create__booking__title"
            label="Title"
            variant="outlined"
            onChange={handleChangeTitle}
            value={BOOKING.title}
            name="group__title"
          />
        </div>
        {/* Date picker */}
        <div className="mt-[-1dvh]">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              components={["DateTimePicker"]}
              sx={{ display: "flex", flexWrap: "wrap" }}
            >
              <DemoItem
                label={<Label componentName="Start Date" valueType="date" />}
              >
                <DatePicker
                  minDate={minDate}
                  maxDate={maxDate}
                  timezone="UTC"
                  defaultValue={dayjs()}
                  value={selectedDate}
                  format="DD/MM/YYYY"
                  onChange={(date) => {
                    SETBOOKING({
                      ...BOOKING,
                      start: dayjs(date).toISOString(),
                    });
                    setSelectedDate(dayjs(date));
                  }}
                />
              </DemoItem>
            </Box>
          </LocalizationProvider>
        </div>

        {/* Year select */}
        <div className="pt-[2.5dvh]">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="year__select">Year</InputLabel>
            <Select
              labelId="year__select"
              id="year__select__box"
              defaultValue={BOOKING.year}
              value={BOOKING.year}
              label="Guide"
              onChange={handleYearChange}
            >
              {allYearsDoc.map((doc) => {
                return (
                  <MenuItem value={doc.year} key={doc._id}>
                    {doc.year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {/* Guide select */}
        <div className="pt-[2.5dvh]">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="guide__select">Guide</InputLabel>
            <Select
              labelId="guide__select"
              id="guide__select__box"
              value={BOOKING.guide}
              label="Guide"
              onChange={handleGuideChange}
            >
              <MenuItem value={""}>None</MenuItem>
              {allGuides.map((guide) => {
                return (
                  <MenuItem value={guide._id} key={guide._id}>
                    {guide.fullName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {/* Status select */}
        <div className="pt-[2.5dvh]">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="status__label">Status</InputLabel>
            <Select
              labelId="status__label"
              id="status__select"
              value={BOOKING.status}
              label="Status"
              onChange={handleStatusChange}
            >
              {statusArray.map((status) => {
                return (
                  <MenuItem value={status} key={status}>
                    {status}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>

        {/* Group leader input */}
        <div>
          <Typography variant="subtitle2">Group Leader</Typography>
          <TextField
            id="group__leader"
            label="Name"
            variant="outlined"
            onChange={handleChangeGroupLeader}
            value={BOOKING.contactPerson}
            name="group__leader"
          />
        </div>

        {/* Snacks select */}
        <div className="pt-[2.5dvh]">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="snacks__label">Snacks</InputLabel>
            <Select
              labelId="snacks__label"
              id="snacks__select"
              value={BOOKING.snacks}
              label="Status"
              onChange={handleChangeSnacks}
            >
              <MenuItem value={false}>No</MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Email input */}
        <div>
          <Typography variant="subtitle2">Email</Typography>
          <TextField
            id="email__label"
            label="Email"
            variant="outlined"
            onChange={handleChangeEmail}
            value={BOOKING.contactEmail}
            name="email"
          />
        </div>

        {/* Phone input */}
        <div>
          <Typography variant="subtitle2">Phone</Typography>
          <TextField
            id="phone__label"
            label="Phone"
            variant="outlined"
            onChange={handleChangePhone}
            value={BOOKING.contactPhone}
            name="phone"
          />
        </div>

        {/* Buttons for search and reset */}
        <Stack spacing={4} direction="row" sx={{ marginTop: "3dvh" }}>
          <Button
            variant="contained"
            sx={{ padding: "15px 30px" }}
            onClick={handleSearchBookings}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "15px 30px" }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Stack>
      </div>

      {/* Search result display */}
      <aside className="min-w-[25dvw] max-h-[81dvh] overflow-y-auto flex flex-col gap-4 py-2">
        {searchResult.map((booking) => (
          <BookingBox booking={booking} key={booking._id} />
        ))}
      </aside>
    </Container>
  );
}

// Component to display booking details
function BookingBox({ booking }) {
  // Extracting start hour and minute from selected booking start time
  const [startHour, startMinute] = booking.start
    .split("T")[1]
    .split(".")[0]
    .split(":");

  // Extracting end hour and minute from selected booking end time
  const [endHour, endMinute] = booking.end
    .split("T")[1]
    .split(".")[0]
    .split(":");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const guide = booking.guide
    ? allGuides.find((el) => el._id === booking.guide)
    : null;

  const color =
    booking.status === "confirmed"
      ? "#2dc653"
      : booking.status === "cancelled"
      ? "#f21b3f"
      : "#ffc300";

  // Handle click on booking box
  const handleClick = () => {
    dispatch(setCurrentSelectedBooking(booking));

    return navigate(`/booking/${booking._id}`);
  };
  return (
    <Box
      component="article"
      sx={{
        border: "1px solid #2196f3",
        backgroundColor: "rgb(241 245 249)",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "&:hover": {
          cursor: "pointer",
        },
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        marginLeft: "5px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
      onClick={handleClick}
    >
      {/* Booking details */}
      <Typography
        variant="h6"
        sx={{ textDecoration: "underline", padding: "0 0 5px 0" }}
      >
        {booking.title}
      </Typography>
      <div className="w-full">
        <div className="flex items-center gap-2 border-b-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <CalendarMonthIcon />
            <span>Date</span>
          </div>
          <strong>
            {dayjs(booking.start).format("DD-MM-YYYY")} -{" "}
            {dayjs(booking.end).format("DD-MM-YYYY")}{" "}
          </strong>
        </div>
        <div className="flex items-center gap-2 border-b-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <AccessTimeIcon />
            <span>Time</span>
          </div>
          <strong>
            {[startHour, startMinute].join(":")} -
            {[endHour, endMinute].join(":")}
          </strong>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 border-b-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <GroupsIcon />
          <span>Status</span>
        </div>
        <div className="flex items-center gap-2 capitalize">
          <strong>{booking.status}</strong>
          <Box
            sx={{
              bgcolor: `${color}`,
              width: "10px",
              height: "10px",
              borderRadius: "100px",
            }}
          ></Box>
        </div>
      </div>

      {/* Snacks */}
      <div className="flex items-center gap-2 border-b-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <RestaurantMenuIcon />
          <span>Snacks || Mingel</span>
        </div>
        <strong>{booking.snacks === false ? "No" : "Yes"}</strong>
      </div>

      {/* Group leader */}
      <div className="flex items-center gap-2 border-b-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <AccessibilityNewIcon />
          <span>Group Leader</span>
        </div>
        <strong>{booking.contactPerson}</strong>
      </div>

      {/* Phone number */}
      {booking.contactPhone && (
        <div className="flex items-center gap-2 border-b-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <ContactPhoneIcon />
            <span>Phone Number</span>
          </div>
          <strong>{booking.contactPhone}</strong>
        </div>
      )}

      {/* Email */}
      {booking.contactEmail && (
        <div className="flex items-center gap-2 border-b-2 w-full justify-between">
          <div className="flex items-center gap-2">
            <EmailIcon />
            <span>Email</span>
          </div>
          <strong>{booking.contactEmail}</strong>
        </div>
      )}

      {/* Guide */}
      {guide && (
        <div className="flex items-center gap-1 w-full justify-between border-b-2 py-2">
          <div className="flex items-center gap-2">
            <AssignmentIndIcon />
            <span>Guide</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar alt={guide.fullName} src={guide.photo} />
            <p>{guide.fullName}</p>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mt-2">
        <h2 className="pb-2 font-semibold underline">Description</h2>
        <div className="py-2 px-2 max-h-[80px] overflow-y-auto rounded">
          <p>{booking.description}</p>
        </div>
      </div>
    </Box>
  );
}

export default SearchBooking;
