import Container from "@mui/material/Container";
import { useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Avatar, Divider, Typography } from "@mui/material";
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
import { changeTabText } from "../App";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

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

function Label({ componentName }) {
  const content = <strong>{componentName}</strong>;

  return content;
}

function SearchBooking() {
  const [BOOKING, SETBOOKING] = useState(initialState);
  const [searchResult, setSearchResult] = useState([]);
  const statusArray = ["preliminary", "confirmed", "cancelled"];
  const queryClient = useQueryClient();
  const allYearsDoc = queryClient.getQueryData(["AllYearsDoc"]);
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const minDate = dayjs(`${allYearsDoc[0].year}-01-01`);
  const maxDate = dayjs(`${allYearsDoc[allYearsDoc.length - 1].year}-12-31`);

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

  const handleReset = () => {
    SETBOOKING(initialState);
    setSearchResult([]);
  };

  const handleSearchBookings = () => {
    const result = getFilteredBookings(allYearsDoc, BOOKING.year, BOOKING);
    if (result.length > 0) {
      return setSearchResult(result);
    } else {
      toast.error("No booking found with the provided credentials.");
    }
  };

  const handleYearChange = (e) => {
    SETBOOKING({ ...BOOKING, year: e.target.value });
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-around",
        paddingTop: "10px",
        width: "100dvw",
        height: "100%",
        position: "relative",
      }}
    >
      <div className="flex items-center gap-4 flex-wrap max-w-[50dvw] h-full border-r border-[#2196f3]">
        <div>
          <Typography variant="subtitle2">Group Title</Typography>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            onChange={handleChangeTitle}
            value={BOOKING.title}
          />
        </div>
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
                  format="DD/MM/YYYY"
                  onChange={(date) =>
                    SETBOOKING({
                      ...BOOKING,
                      start: dayjs(date).toISOString(),
                    })
                  }
                />
              </DemoItem>
            </Box>
          </LocalizationProvider>
        </div>

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

        <div>
          <Typography variant="subtitle2">Group Leader</Typography>
          <TextField
            id="group__leader"
            label="Name"
            variant="outlined"
            onChange={handleChangeGroupLeader}
            value={BOOKING.contactPerson}
          />
        </div>

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

        <div>
          <Typography variant="subtitle2">Email</Typography>
          <TextField
            id="email__label"
            label="Email"
            variant="outlined"
            onChange={handleChangeEmail}
            value={BOOKING.contactEmail}
          />
        </div>

        <div>
          <Typography variant="subtitle2">Phone</Typography>
          <TextField
            id="phone__label"
            label="Phone"
            variant="outlined"
            onChange={handleChangePhone}
            value={BOOKING.contactPhone}
          />
        </div>

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

      <aside className="min-w-[25dvw] max-h-[81dvh] overflow-y-auto flex flex-col gap-2">
        {searchResult.map((booking) => (
          <BookingBox booking={booking} key={booking._id} />
        ))}
      </aside>
    </Container>
  );
}

function BookingBox({ booking }) {
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

  const handleClick = () => {
    dispatch(setCurrentSelectedBooking(booking));
    changeTabText("Edit Reservation");
    return navigate(`/booking/${booking._id}`);
  };
  return (
    <Box
      component="article"
      sx={{
        bgcolor: `${color}`,
        "&:hover": { cursor: "pointer" },
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
        marginLeft: "5px",
      }}
      onClick={handleClick}
    >
      <Typography variant="h6">{booking.title}</Typography>
      <Divider />
      <div>
        <div>
          <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
            Date
          </Typography>
          <p>
            {dayjs(booking.start).format("DD-MM-YYYY")} -{" "}
            {dayjs(booking.end).format("DD-MM-YYYY")}{" "}
          </p>
        </div>
        <div>
          <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
            Time
          </Typography>
          <p>
            {dayjs(booking.start).format("HH:mm")} -{" "}
            {dayjs(booking.end).format("HH:mm")}{" "}
          </p>
        </div>
      </div>

      <div>
        <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
          Status
        </Typography>
        <p>{booking.status}</p>
      </div>

      <div>
        <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
          Group Leader
        </Typography>
        <p>{booking.contactPerson}</p>
      </div>

      {booking.contactPhone && (
        <div>
          <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
            Phone
          </Typography>
          <p>{booking.contactPhone}</p>
        </div>
      )}

      {booking.contactEmail && (
        <div>
          <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
            Email
          </Typography>
          <p>{booking.contactEmail}</p>
        </div>
      )}

      {guide && (
        <div>
          <Typography sx={{ textDecoration: "underline" }} variant="subtitle1">
            Guide
          </Typography>
          <Avatar alt={guide.fullName} src={guide.photo} />
          <p>{guide.fullName}</p>
        </div>
      )}
    </Box>
  );
}

export default SearchBooking;
