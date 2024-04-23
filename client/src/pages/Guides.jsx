import { Divider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useQueryClient } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Stack from "@mui/material/Stack";

function Guides() {
  const queryClient = useQueryClient();
  const allGuides = queryClient.getQueryData(["AllGuides"]);
  const [selectedGuide, setSelectedGuide] = useState(null);

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        padding: "15px 0",
      }}
    >
      <div className="flex flex-col gap-4">
        <Box
          sx={{
            bgcolor: "primary.light",
            minWidth: "28dvw",
            maxHeight: "65dvh",
            borderRadius: "8px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {allGuides.map((guide) => (
            <article key={guide._id} onClick={() => setSelectedGuide(guide)}>
              <GuideSideBox guide={guide} />
            </article>
          ))}
        </Box>
        <Button variant="outlined">Add New Guide</Button>
      </div>
      {selectedGuide && <GuideOverviewEdit selectedGuide={selectedGuide} />}
    </Container>
  );
}

function GuideSideBox({ guide }) {
  return (
    <Box
      bgcolor={"paper"}
      sx={{
        padding: "10px 15px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        border: "1px solid transparent",
        "&:hover": {
          cursor: "pointer",
          borderColor: "primary.dark",
        },
      }}
    >
      <Avatar alt={guide.fullName} src={guide.photo} />
      <Typography variant="subtitle2">{guide.fullName}</Typography>
    </Box>
  );
}

function GuideOverviewEdit({ selectedGuide }) {
  const [disabled, setDisabled] = useState(true);
  const [GUIDE, SETGUIDE] = useState({ ...selectedGuide });

  const handleEditName = (e) => {
    SETGUIDE({ ...GUIDE, fullName: e.target.value });
  };

  const handleEditEmail = (e) => {
    SETGUIDE({ ...GUIDE, email: e.target.value });
  };

  const handleEditPhone = (e) => {
    SETGUIDE({ ...GUIDE, phone: e.target.value });
  };

  useEffect(() => {
    SETGUIDE({ ...selectedGuide });
  }, [selectedGuide]);

  const toggleEditMode = () => {
    setDisabled(!disabled);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        border: "1px solid #2196f3",
        padding: "10px 30px",
        borderRadius: "10px",
        maxWidth: "650px",
        display: "flex",
        flexDirection: "column",
      }}
      noValidate
      autoComplete="off"
    >
      <div className="flex gap-2">
        <div className="relative min-h-full flex flex-col items-end">
          <Avatar
            alt={GUIDE.fullName}
            src={GUIDE.photo}
            sx={{ width: 86, height: 86 }}
          />
          <div className="z-50 mt-[-10px]">
            <input id="guide_photo__uploader" type="file" disabled={disabled} />
            <label htmlFor="guide_photo__uploader">
              <CloudUploadOutlinedIcon
                color={disabled ? "action" : "success"}
                sx={{ width: "32px", height: "32px" }}
              />
            </label>
          </div>
        </div>
        {/*  */}
        <div className="grid grid-cols-2">
          <TextField
            onChange={handleEditName}
            disabled={disabled}
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={GUIDE.fullName}
          />

          <TextField
            onChange={handleEditEmail}
            disabled={disabled}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={GUIDE.email}
          />

          <TextField
            onChange={handleEditPhone}
            disabled={disabled}
            id="outlined-basic"
            label="Phone"
            variant="outlined"
            value={GUIDE.phone}
          />
        </div>
        {/*  */}
      </div>

      <Stack
        sx={{ alignSelf: "center", padding: "15px 0" }}
        spacing={2}
        direction={"row"}
      >
        <Button variant="contained" onClick={toggleEditMode}>
          Edit
        </Button>
        <Button variant="outlined" color="error">
          Delete
        </Button>

        <Button variant="outlined" color="success">
          Save
        </Button>
      </Stack>
    </Box>
  );
}

export default Guides;
