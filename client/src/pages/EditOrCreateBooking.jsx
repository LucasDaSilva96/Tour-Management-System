import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  getCurrentSelectedBooking,
} from "../redux/bookingSlice";
import { getAllGuides } from "../redux/guideSlice";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Typography } from "@mui/material";
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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

function Label({ componentName }) {
  const content = <strong className="ml-[20%]">{componentName}</strong>;

  return content;
}

function EditOrCreateBooking() {
  const allBookings = useSelector(getAllBookings);
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const allGuides = useSelector(getAllGuides);
  const dispatch = useDispatch();
  const [BOOKING, SETBOOKING] = React.useState({ ...selectedBooking });
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

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
          <div>
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
            <div className="flex items-center flex-wrap mt-[2%] gap-3 pb-2">
              <div className=" ml-2">
                <AssignGuideOrChangeGuideSelect />
              </div>
              <Box>
                <FormControl sx={{ minWidth: "150px" }}>
                  <InputLabel id="demo-simple-select-label">Snacks</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={BOOKING.snacks}
                    label="Age"
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
              rows={5}
              value={BOOKING.description}
              onChange={(e) =>
                SETBOOKING({ ...BOOKING, description: e.target.value })
              }
            />
          </div>
        </div>
      </Box>
    </Container>
  );
}

export default EditOrCreateBooking;
