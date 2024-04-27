import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useQueryClient } from "@tanstack/react-query";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { getCurrentUser } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { deleteGuide, updateGuide } from "../utils/postData";

function Guides() {
  const queryClient = useQueryClient();
  const [allGuides, setAllGuides] = useState(
    queryClient.getQueryData(["AllGuides"])
  );
  const [selectedGuide, setSelectedGuide] = useState(
    allGuides.length > 0 ? allGuides[0] : null
  );
  const [disabled, setDisabled] = useState(true);
  const user = useSelector(getCurrentUser);

  const handleSaveGuide = async () => {
    if (await updateGuide(user.token, selectedGuide)) {
      queryClient.invalidateQueries();
      setDisabled(true);
      setTimeout(() => {
        setAllGuides(queryClient.getQueryData(["AllGuides"]));
      }, 1000);
    }
  };

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
            <article
              key={guide._id}
              onClick={() => {
                setSelectedGuide(guide);
                setDisabled(true);
              }}
            >
              <GuideSideBox guide={guide} />
            </article>
          ))}
        </Box>
        <Button variant="outlined">Add New Guide</Button>
      </div>
      {selectedGuide && (
        <GuideOverviewEdit
          disabled={disabled}
          setDisabled={setDisabled}
          selectedGuide={selectedGuide}
          handleSaveGuide={handleSaveGuide}
          setSelectedGuide={setSelectedGuide}
        />
      )}
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

function GuideOverviewEdit({
  selectedGuide,
  disabled,
  setDisabled,
  handleSaveGuide,
  setSelectedGuide,
}) {
  const [file, setFile] = useState(selectedGuide.photo);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleOpeDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    setFile(selectedGuide.photo);
  }, [selectedGuide]);

  const handleEditName = (e) => {
    setSelectedGuide({ ...selectedGuide, fullName: e.target.value });
  };

  const handleEditEmail = (e) => {
    setSelectedGuide({ ...selectedGuide, email: e.target.value });
  };

  const handleEditPhone = (e) => {
    setSelectedGuide({ ...selectedGuide, phone: e.target.value });
  };

  const toggleEditMode = () => {
    setDisabled(!disabled);
  };

  const handleChangeGuidePhoto = (e) => {
    setSelectedGuide({ ...selectedGuide, photo: e.target.files[0] });
    setFile(URL.createObjectURL(e.target.files[0]));
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
            alt={selectedGuide.fullName}
            src={typeof file == "object" ? URL.createObjectURL(file) : file}
            sx={{ width: 86, height: 86 }}
          />
          <div className="z-50 mt-[-10px]">
            <input
              id="guide_photo__uploader"
              type="file"
              disabled={disabled}
              onChange={handleChangeGuidePhoto}
              name="image"
            />
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
            value={selectedGuide.fullName}
          />

          <TextField
            onChange={handleEditEmail}
            disabled={disabled}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={selectedGuide.email}
          />

          <TextField
            onChange={handleEditPhone}
            disabled={disabled}
            id="outlined-basic"
            label="Phone"
            variant="outlined"
            value={selectedGuide.phone}
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
        <Button
          variant="outlined"
          color="error"
          disabled={disabled}
          onClick={handleOpeDeleteModal}
        >
          Delete
        </Button>

        <Button
          disabled={disabled}
          variant="outlined"
          color="success"
          onClick={async () => await handleSaveGuide()}
        >
          Save
        </Button>
      </Stack>
      <GuideModal
        selectedGuide={selectedGuide}
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
      />
    </Box>
  );
}

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  minHeight: 200,
  overflow: "auto",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-around",
  borderRadius: "10px",
  textAlign: "center",
  gap: "15px",
};

function GuideModal({ selectedGuide, setOpenDeleteModal, openDeleteModal }) {
  // const queryClient = useQueryClient();
  const user = useSelector(getCurrentUser);

  const handleDeleteGuide = async () => {
    if (await deleteGuide(user.token, selectedGuide._id)) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  return (
    <Modal
      open={openDeleteModal}
      onClose={() => setOpenDeleteModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Delete {selectedGuide.fullName} ?
        </Typography>
        <Avatar
          alt={selectedGuide.fullName}
          src={selectedGuide.photo}
          sx={{ width: 86, height: 86 }}
        />
        <Stack direction={"row"} spacing={4}>
          <Button
            variant="outlined"
            color="error"
            onClick={async () => await handleDeleteGuide()}
          >
            Yes
          </Button>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
            No
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default Guides;
