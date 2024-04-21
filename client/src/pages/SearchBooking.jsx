import Container from "@mui/material/Container";
import { useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

const initialState = {
  title: "",
  start: dayjs(),
  end: "",
  guide: null,
  status: "preliminary",
  description: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  participants: 50,
  snacks: false,
  year: dayjs().get("year"),
};

function Label({ componentName }) {
  const content = <strong>{componentName}</strong>;

  return content;
}

function SearchBooking() {
  const [BOOKING, SETBOOKING] = React.useState(initialState);

  const queryClient = useQueryClient();
  const allYearsDoc = queryClient.getQueryData(["AllYearsDoc"]);
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const minDate = dayjs(`${allYearsDoc[0].year}-01-01`);
  const maxDate = dayjs(`${allYearsDoc[allYearsDoc.length - 1].year}-12-31`);

  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Box
        component="form"
        sx={{
          "& > :not(style)": {
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
        <div className="py-2">
          <Typography variant="subtitle2">Group Title</Typography>
          <TextField id="outlined-basic" label="Title" variant="outlined" />
        </div>
        <div className="py-2">
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
                  defaultValue={dayjs(BOOKING.start)}
                  format="DD/MM/YYYY"
                  onChange={(date) =>
                    SETBOOKING({
                      ...BOOKING,
                      start: dayjs(date).toISOString(),
                      year: dayjs(date).get("year"),
                    })
                  }
                />
              </DemoItem>
            </Box>
          </LocalizationProvider>
        </div>
      </Box>
      {/* *** */}

      <Box>Result</Box>
    </Container>
  );
}

export default SearchBooking;
