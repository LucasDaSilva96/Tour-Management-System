import { useQueryClient } from "@tanstack/react-query";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { formatChartData } from "../utils/formatData";
import toast from "react-hot-toast";

function Overview() {
  const queryClient = useQueryClient();
  // Retrieve available years, guides, and bookings data from query client
  const availableYears = queryClient
    .getQueryData(["AllYearsDoc"])
    .map((el) => el.year);
  const availableGuides = queryClient.getQueryData(["AllGuides"]);
  const allBookings = queryClient.getQueryData(["AllYearsDoc"]);

  // State to hold selected filters for overview
  const [DATAOBJ, SETDATAOBJ] = useState({
    year: availableYears[0],
    month: "",
    guide: "",
    status: "all",
  });

  // Array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // State to hold chart data
  const [CHART_DATA, SET_CHART_DATA] = useState([]);

  return (
    <section className="relative w-full h-full py-2 px-2">
      {/* Display selected filters */}
      <h1 className=" text-center flex items-center gap-3 w-full justify-center  text-lg">
        {DATAOBJ.year && (
          <span className="py-1 px-2 border rounded-lg bg-slate-100 shadow-sm">
            Year: {DATAOBJ.year}
          </span>
        )}
        {DATAOBJ.status && (
          <span className="py-1 px-2 border rounded-lg bg-slate-100 shadow-sm">
            Status: {DATAOBJ.status}
          </span>
        )}
        {DATAOBJ.month && DATAOBJ.month >= 0 && (
          <span className="py-1 px-2 border rounded-lg bg-slate-100 shadow-sm">
            Month: {months[DATAOBJ.month]}
          </span>
        )}
        {DATAOBJ.guide && (
          <span className="py-1 px-2 border rounded-lg bg-slate-100 shadow-sm">
            Guide: {DATAOBJ.guide}
          </span>
        )}
      </h1>
      <div className="flex h-full w-full items-center justify-around">
        <OverviewSearchBox
          data={DATAOBJ}
          setData={SETDATAOBJ}
          years={availableYears}
          guides={availableGuides}
          allBookings={allBookings}
          setChartData={SET_CHART_DATA}
          months={months}
        />

        {/* Display chart if data is available */}
        {CHART_DATA.length > 0 && <OverviewChartBox DATA={CHART_DATA} />}
      </div>
    </section>
  );
}

function OverviewSearchBox({
  data,
  setData,
  years,
  guides,
  allBookings,
  setChartData,
  months,
}) {
  const statusOpts = ["all", "preliminary", "confirmed", "cancelled"];

  // Handlers for changing filters
  const handleYearChange = (e) => {
    setData({ ...data, year: e.target.value });
  };

  const handleGuideChange = (e) => {
    setData({ ...data, guide: e.target.value });
  };

  const handleMonthChange = (e) => {
    setData({ ...data, month: e.target.value });
  };

  const handleStatusChange = (e) => {
    setData({ ...data, status: e.target.value });
  };

  // Function to reset filters and fetch new data
  const handleReset = () => {
    const toastId = toast.loading("Loading...");
    // Reset filters
    setData({ year: years[0], month: "", guide: "", status: "all" });

    setChartData(
      formatChartData(
        { year: years[0], month: "", guide: "", status: "all" },
        allBookings,
        guides
      )
    );
    toast.dismiss(toastId);
  };

  // Function to search data with current filters
  const handleSearch = () => {
    setChartData(formatChartData(data, allBookings, guides));
  };

  return (
    <aside className="flex flex-col items-center relative w-[340px] gap-8">
      <FormControl fullWidth>
        {/* Year filter */}
        <InputLabel id="overview__year__label">Year</InputLabel>
        <Select
          labelId="overview__year__label"
          id="overview__year"
          value={data.year}
          label="Year"
          onChange={handleYearChange}
          name="year"
        >
          {years.map((year, index) => (
            <MenuItem value={year} key={index}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status filter */}
      <FormControl fullWidth>
        <InputLabel id="overview__status__label">Status</InputLabel>
        <Select
          labelId="overview__status__label"
          id="overview__status"
          value={data.status}
          label="Status"
          name="status"
          onChange={handleStatusChange}
        >
          {statusOpts.map((status, index) => (
            <MenuItem value={status} key={index}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Month filter */}
      <FormControl fullWidth>
        <InputLabel id="overview__month__label">Month</InputLabel>
        <Select
          labelId="overview__month__label"
          id="overview__month"
          value={data.month}
          label="Month"
          name="month"
          onChange={handleMonthChange}
        >
          {months.map((_month, index) => (
            <MenuItem value={index} key={index}>
              {months[index]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Guide filter */}
      <FormControl fullWidth>
        <InputLabel id="overview__guide__label">Guide</InputLabel>
        <Select
          labelId="overview__guide__label"
          id="overview__guide"
          value={data.guide}
          label="Guide"
          onChange={handleGuideChange}
          name="guide"
        >
          {guides.map((guide, index) => (
            <MenuItem value={guide.fullName} key={index}>
              {guide.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Buttons for searching and resetting */}
      <Stack
        direction="row"
        sx={{ justifyContent: "space-around" }}
        width="100%"
      >
        <Button variant="outlined" color="success" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </aside>
  );
}

function OverviewChartBox({ DATA }) {
  return (
    // Responsive container for the bar chart
    <ResponsiveContainer width={700} height="80%">
      <BarChart data={DATA}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"></XAxis>
        <YAxis
          allowDecimals={false}
          dataKey="amount"
          label={{
            value: "Amount of bookings",
            angle: -90,
            position: "insideLeft",
            textAnchor: "middle",
          }}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#2196f3">
          <LabelList dataKey="amount" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Overview;
