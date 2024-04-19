import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentSelectedBooking,
  setCurrentSelectedBooking,
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
import AssignGuideOrChangeGuideSelect from "../components/AssignGuideOrChangeGuideSelect";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useQueryClient } from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import { updateOneBooking } from "../utils/postData";
import { getCurrentUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

const initialState = {
  title: "",
  start: "",
  end: "",
  guide: null,
  status: "",
  color: "",
  textColor: "black",
  description: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  participants: 50,
  snacks: "",
};

function Label({ componentName }) {
  const content = <strong className="ml-[20%]">{componentName}</strong>;

  return content;
}

function EditOrCreateBooking() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector(getCurrentUser);
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const [BOOKING, SETBOOKING] = React.useState(
    selectedBooking ? { ...selectedBooking } : { ...initialState }
  );
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  const guideEmail = BOOKING.guide
    ? allGuides.find((el) => el._id === BOOKING.guide).email
    : null;

  const handleUpdateReservation = async () => {
    console.log(user.token, BOOKING, selectedBooking._id, guideEmail);
    if (
      await updateOneBooking(
        user.token,
        BOOKING,
        selectedBooking._id,
        guideEmail
      )
    ) {
      if (selectedBooking) dispatch(setCurrentSelectedBooking(BOOKING));
      queryClient.invalidateQueries();
      navigate("/");
    }
  };

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
        <div className="flex flex-wrap items-center">
          <div className="flex flex-col items-center">
            <Typography variant="h6">Title</Typography>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={2}
              value={BOOKING.title}
              name="title"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, title: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col items-center">
            <Typography variant="h6">Group Leader</Typography>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={2}
              value={BOOKING.contactPerson}
              name="title"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, contactPerson: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col items-center">
            <Typography variant="h6">Email</Typography>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={2}
              value={BOOKING.contactEmail}
              name="title"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, contactEmail: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col items-center">
            <Typography variant="h6">Phone</Typography>
            <TextField
              id="outlined-multiline-flexible"
              multiline
              maxRows={2}
              value={BOOKING.contactPhone}
              name="title"
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, contactPhone: e.target.value })
              }
            />
          </div>

          <TextField
            label="Group Size"
            placeholder={BOOKING.participants ? null : "Group Size"}
            color="primary"
            sx={{ alignSelf: "end" }}
            type="number"
            value={BOOKING.participants}
            onChange={(e) =>
              SETBOOKING({ ...BOOKING, participants: Number(e.target.value) })
            }
          />

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

            <Box sx={{ marginTop: "18px" }}>
              <AssignGuideOrChangeGuideSelect
                BOOKING={BOOKING}
                setGuideSelected={SETBOOKING}
              />
            </Box>

            <Box sx={{ marginTop: "18px" }}>
              <FormControl sx={{ minWidth: "150px" }}>
                <InputLabel id="demo-simple-select-label">
                  Snacks or Mingel
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
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
          <TextField
            sx={{ minWidth: "375px" }}
            id="outlined-textarea"
            label="Description"
            placeholder={BOOKING.description ? null : "Description"}
            multiline
            rows={6}
            value={BOOKING.description}
            onChange={(e) =>
              SETBOOKING({ ...BOOKING, description: e.target.value })
            }
          />
        </div>
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
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

export default EditOrCreateBooking;
