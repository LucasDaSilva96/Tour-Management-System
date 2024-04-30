import { useQueryClient } from "@tanstack/react-query";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useState } from "react";

function Overview() {
  const queryClient = useQueryClient();
  const availableYears = queryClient
    .getQueryData(["AllYearsDoc"])
    .map((el) => el.year);
  const availableGuides = queryClient.getQueryData(["AllGuides"]);

  const [DATAOBJ, SETDATAOBJ] = useState({
    year: availableYears[0],
    month: "",
    guide: "",
  });

  console.log(DATAOBJ);

  return (
    <section className="flex h-full w-full py-2 px-2">
      <OverviewSearchBox
        data={DATAOBJ}
        setData={SETDATAOBJ}
        years={availableYears}
        guides={availableGuides}
      />
    </section>
  );
}

function OverviewSearchBox({ data, setData, years, guides }) {
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

  const handleYearChange = (e) => {
    setData({ ...data, year: e.target.value });
  };

  const handleGuideChange = (e) => {
    setData({ ...data, guide: e.target.value });
  };

  const handleMonthChange = (e) => {
    setData({ ...data, month: e.target.value });
  };

  const handleReset = () => {
    setData({ year: years[0], month: "", guide: "" });
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
        <Button variant="outlined" color="success">
          Search
        </Button>

        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </aside>
  );
}

function OverviewChartBox() {}

export default Overview;
