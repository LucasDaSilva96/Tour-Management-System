import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentSelectedBooking,
  getCurrentSelectedBookingModified,
  getReservationModalStatus,
  toggleReservationModal,
} from "../redux/bookingSlice";
import { Divider, Typography } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeFilledOutlinedIcon from "@mui/icons-material/AccessTimeFilledOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import DescriptionTextBox from "./DescriptionTextBox";
import Button from "@mui/material/Button";
import ChangeReservationStatusSelect from "./ChangeReservationStatusSelect";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
export default function ReservationModal() {
  const modalOpen = useSelector(getReservationModalStatus);
  const dispatch = useDispatch();
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const selectedBookingWasModified = useSelector(
    getCurrentSelectedBookingModified
  );

  if (!selectedBooking.start || !selectedBooking.end) return null;

  const toggleDrawer = (newOpen) => () => {
    dispatch(toggleReservationModal());
  };
  const [startHour, startMinute] = selectedBooking.start
    .split("T")[1]
    .split(".")[0]
    .split(":");

  const [endHour, endMinute] = selectedBooking.end
    .split("T")[1]
    .split(".")[0]
    .split(":");

  const DrawerList = (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        display: "grid",
        gridTemplateColumns: "repeat( auto-fit, minmax(250px, 1fr) )",
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <CalendarMonthOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Start Date"
          secondary={dayjs(selectedBooking.start).format("DD/MM/YYYY")}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccessTimeFilledOutlinedIcon />
          </Avatar>
        </ListItemAvatar>

        <ListItemText
          primary="Start Time"
          secondary={[startHour, startMinute].join(":")}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <EventBusyOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="End Date"
          secondary={dayjs(selectedBooking.end).format("DD/MM/YYYY")}
        />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccessTimeOutlinedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="End Time"
          secondary={[endHour, endMinute].join(":")}
        />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <LocalActivityIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Status" secondary={selectedBooking.status} />
      </ListItem>

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <AccessibilityNewIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Group Leader"
          secondary={selectedBooking.contactPerson}
        />
      </ListItem>

      {selectedBooking.contactPhone ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalPhoneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Phone Number"
            secondary={selectedBooking.contactPhone}
          />
        </ListItem>
      ) : null}

      {selectedBooking.contactEmail ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EmailIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Email"
            secondary={selectedBooking.contactEmail}
          />
        </ListItem>
      ) : null}

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <GroupsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Participants"
          secondary={selectedBooking.participants}
        />
      </ListItem>

      {selectedBooking.guide ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar
              alt={selectedBooking.guide.fullName}
              src={selectedBooking.guide.photo}
            />
          </ListItemAvatar>
          <ListItemText
            primary="Guide"
            secondary={selectedBooking.guide.fullName}
          />
        </ListItem>
      ) : null}

      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <GroupsIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Coffee/Mingle"
          secondary={selectedBooking.snacks === true ? "Yes" : "No"}
        />
      </ListItem>
    </List>
  );

  return (
    <aside>
      <Drawer
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
        }}
        anchor="right"
        open={modalOpen}
        onClose={toggleDrawer()}
      >
        <Typography variant="h5" align="center" sx={{ py: 1 }}>
          {selectedBooking.title}
        </Typography>
        {DrawerList}
        <Divider />
        {selectedBooking.description ? (
          <DescriptionTextBox description={selectedBooking.description} />
        ) : null}
        <Stack
          spacing={2}
          direction="row"
          sx={{ alignSelf: "center", marginTop: "10px" }}
        >
          <Button variant="contained">Edit Reservation</Button>
          <ChangeReservationStatusSelect />
        </Stack>
        {selectedBookingWasModified ? (
          <Button
            variant="contained"
            color="success"
            sx={{
              width: "300px",
              alignSelf: "center",
              marginTop: "auto",
              marginBottom: "10px",
            }}
          >
            Save
          </Button>
        ) : null}
      </Drawer>
    </aside>
  );
}
