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
  const availableYears = queryClient
    .getQueryData(["AllYearsDoc"])
    .map((el) => el.year);
  const availableGuides = queryClient.getQueryData(["AllGuides"]);
  const allBookings = queryClient.getQueryData(["AllYearsDoc"]);

  const [DATAOBJ, SETDATAOBJ] = useState({
    year: availableYears[0],
    month: "",
    guide: "",
    status: "all",
  });

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

  const [CHART_DATA, SET_CHART_DATA] = useState([]);

  return (
    <section className="relative w-full h-full py-2 px-2">
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

  const handleReset = () => {
    const toastId = toast.loading("Loading...");
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

  const handleSearch = () => {
    setChartData(formatChartData(data, allBookings, guides));
  };

  return (
    <aside className="flex flex-col items-center relative w-[340px] gap-8">
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.year}
          label="Year"
          onChange={handleYearChange}
        >
          {years.map((year, index) => (
            <MenuItem value={year} key={index}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.status}
          label="Status"
          onChange={handleStatusChange}
        >
          {statusOpts.map((status, index) => (
            <MenuItem value={status} key={index}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Month</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.month}
          label="Month"
          onChange={handleMonthChange}
        >
          {months.map((_month, index) => (
            <MenuItem value={index} key={index}>
              {months[index]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Guide</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.guide}
          label="Guide"
          onChange={handleGuideChange}
        >
          {guides.map((guide, index) => (
            <MenuItem value={guide.fullName} key={index}>
              {guide.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
