import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

const lastDate = dayjs()
  .set("day", new Date().getDay())
  .set("month", new Date().getMonth())
  .set("year", new Date().getFullYear() + 3);

const minDate = dayjs()
  .set("day", new Date().getDay())
  .set("month", new Date().getMonth())
  .set("year", new Date().getFullYear() - 3);

const today = dayjs();

export default function Calender() {
  return (
    <div className=" px-2 py-1 border-r-4 border-[#cecece]">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={today}
          maxDate={lastDate}
          minDate={minDate}
          onChange={(e) => console.log(e.$d.toISOString())}
        />
      </LocalizationProvider>
    </div>
  );
}
