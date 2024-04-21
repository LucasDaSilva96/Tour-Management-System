import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentSelectedBooking,
  setCurrentSelectedBooking,
} from "../redux/bookingSlice";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, Container, OutlinedInput, Typography } from "@mui/material";
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
import {
  createNewBooking,
  deleteOneBooking,
  updateOneBooking,
} from "../utils/postData";
import { getCurrentUser } from "../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import ModalWindow from "../components/Modal";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

const initialState = {
  title: "",
  start: dayjs().utc().hour(new Date().getHours()),
  end: dayjs()
    .utc()
    .hour(new Date().getHours() + 1),
  guide: null,
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

function Label({ componentName }) {
  const content = <strong className="ml-[20%]">{componentName}</strong>;

  return content;
}

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

// ** Edit booking component
function EditBooking({ user, allGuides, navigate, queryClient }) {
  const selectedBooking = useSelector(getCurrentSelectedBooking);
  const [BOOKING, SETBOOKING] = React.useState({ ...selectedBooking });
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const guideEmail = BOOKING.guide
    ? allGuides.find((el) => el._id === BOOKING.guide).email
    : null;

  const handleUpdateReservation = async () => {
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

  const handleDeleteBooking = async () => {
    if (await deleteOneBooking(user.token, BOOKING)) {
      queryClient.invalidateQueries();
      dispatch(setCurrentSelectedBooking({}));
      setOpen(false);
    }
  };

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
          <div className="flex flex-wrap items-center">
            <div className="flex flex-col items-center">
              <Typography variant="subtitle2">Title</Typography>
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
              <Typography variant="subtitle2">Group Leader</Typography>
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
              <Typography variant="subtitle2">Email</Typography>
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
              <Typography variant="subtitle2">Phone</Typography>
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

// ** Create new booking component
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

  const handleChangeGuide = (e) => {
    const guide = allGuides.find((el) => el.fullName === e.target.value);
    setGuide(guide.fullName);
    SETBOOKING({ ...BOOKING, guide: guide._id });
  };

  const handleRemoveGuide = () => {
    setGuide("");
    SETBOOKING({ ...BOOKING, guide: null });
  };

  const handleCreateBooking = async () => {
    if (BOOKING.guide) {
      const guideEmail = allGuides.find((el) => el._id === BOOKING.guide).email;

      if (await createNewBooking(user.token, BOOKING, guideEmail)) {
        queryClient.invalidateQueries();
        SETBOOKING({ ...initialState });
      }
    } else {
      if (await createNewBooking(user.token, BOOKING)) {
        queryClient.invalidateQueries();
        SETBOOKING({ ...initialState });
      }
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
            <Typography variant="subtitle2">Title</Typography>
            <TextField
              required
              label="Required"
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
            <Typography variant="subtitle2">Group Leader</Typography>
            <TextField
              id="outlined-multiline-flexible"
              required
              label="Required"
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
            <Typography variant="subtitle2">Email</Typography>
            <TextField
              required
              label="Phone or email required"
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
            <Typography variant="subtitle2">Phone</Typography>
            <TextField
              required
              label="Phone or email required"
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

            <Box sx={{ marginTop: "18px" }}>
              <FormControl sx={{ width: 200 }}>
                <InputLabel
                  variant="filled"
                  sx={{ fontSize: "18px", marginLeft: "2px" }}
                  id="guide"
                >
                  Guide
                </InputLabel>
                <Select
                  labelId="Guide"
                  id="select-guide"
                  value={guide}
                  onChange={handleChangeGuide}
                  input={<OutlinedInput label="Guide" />}
                  MenuProps={MenuProps}
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
            // TODO
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
