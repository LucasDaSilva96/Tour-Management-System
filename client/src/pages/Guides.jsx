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
import { createNewGuide, deleteGuide, updateGuide } from "../utils/postData";
import toast from "react-hot-toast";
import { fetchAllGuides } from "../utils/fetchData";

function Guides() {
  // React Query client instance
  const queryClient = useQueryClient();
  // State for storing all guides
  const [allGuides, setAllGuides] = useState(
    queryClient.getQueryData(["AllGuides"])
  );
  // State for storing the selected guide
  const [selectedGuide, setSelectedGuide] = useState(
    allGuides.length > 0 ? allGuides[0] : null
  );
  // State for managing the disabled state of form fields
  const [disabled, setDisabled] = useState(true);
  // Redux state selector for getting the current user
  const user = useSelector(getCurrentUser);
  // State for managing the visibility of the new guide form modal
  const [openNewGuideForm, setOpenNewGuideForm] = useState(false);

  // Function to handle saving a guide
  const handleSaveGuide = async () => {
    if (await updateGuide(user.token, selectedGuide)) {
      // Invalidate the query to fetch all guides
      queryClient.invalidateQueries();
      // Disable form fields
      setDisabled(true);
      // Refresh all guides data
      setTimeout(() => {
        setAllGuides(queryClient.getQueryData(["AllGuides"]));
      }, 1000);
    }
  };

  // Function to handle adding a new guide
  const handleAddNewGuide = () => {
    setSelectedGuide(null);
    setOpenNewGuideForm(true);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        padding: "15px 0",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <div className="flex flex-col gap-12 ">
        {/* Display all guides */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            maxWidth: "650px",
            maxHeight: "400px",
            padding: "10px 10px 20px 10px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            overflowY: "scroll",
            borderRadius: "10px",
          }}
        >
          {allGuides.map((guide) => (
            <article
              className=" border rounded h-[130px] w-[200px] flex items-center justify-center hover:cursor-pointer hover:bg-[#2196f3]"
              key={guide._id}
              onClick={() => {
                setSelectedGuide(guide);
                setDisabled(true);
                setOpenNewGuideForm(false);
              }}
            >
              <GuideSideBox guide={guide} />
            </article>
          ))}
        </Box>
        {/* Button to add a new guide */}
        <Button
          variant="outlined"
          onClick={handleAddNewGuide}
          sx={{ maxWidth: "450px", alignSelf: "center", minWidth: "300px" }}
        >
          Add New Guide
        </Button>
      </div>
      {/* Display selected guide details for editing */}
      {selectedGuide && (
        <GuideOverviewEdit
          disabled={disabled}
          setDisabled={setDisabled}
          selectedGuide={selectedGuide}
          handleSaveGuide={handleSaveGuide}
          setSelectedGuide={setSelectedGuide}
          setAllGuides={setAllGuides}
          queryClient={queryClient}
        />
      )}
      {/* Display new guide form */}
      {openNewGuideForm && (
        <NewGuideForm
          setAllGuides={setAllGuides}
          queryClient={queryClient}
          setOpenNewGuideForm={setOpenNewGuideForm}
        />
      )}
    </Container>
  );
}

// Component to display guide information in a box
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
      }}
    >
      <Avatar
        sx={{ width: 86, height: 86 }}
        alt={guide.fullName}
        src={guide.photo}
      />
      <Typography variant="subtitle2">{guide.fullName}</Typography>
    </Box>
  );
}

// Component to display and edit guide details
function GuideOverviewEdit({
  selectedGuide,
  disabled,
  setDisabled,
  handleSaveGuide,
  setSelectedGuide,
  setAllGuides,
  queryClient,
}) {
  // State for storing the guide photo
  const [file, setFile] = useState(selectedGuide.photo);

  // State for managing the visibility of the delete modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Function to open the delete modal
  const handleOpeDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    setFile(selectedGuide.photo);
  }, [selectedGuide]);

  // Functions to handle editing guide details
  const handleEditName = (e) => {
    setSelectedGuide({ ...selectedGuide, fullName: e.target.value });
  };

  const handleEditEmail = (e) => {
    setSelectedGuide({ ...selectedGuide, email: e.target.value });
  };

  const handleEditPhone = (e) => {
    setSelectedGuide({ ...selectedGuide, phone: e.target.value });
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setDisabled(!disabled);
  };

  // Function to handle changing guide photo
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
        maxHeight: "250px",
        overflowY: "auto",
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
      noValidate
      autoComplete="off"
    >
      <div className="flex gap-2">
        <div className="relative flex flex-col justify-around">
          <Avatar
            alt={selectedGuide.fullName}
            src={typeof file == "object" ? URL.createObjectURL(file) : file}
            sx={{ width: 86, height: 86 }}
          />

          <input
            id="guide_photo__uploader"
            type="file"
            disabled={disabled}
            onChange={handleChangeGuidePhoto}
            name="image"
          />
        </div>
        {/*  */}
        <div className="flex items-center justify-evenly flex-wrap">
          <TextField
            onChange={handleEditName}
            disabled={disabled}
            id="edit__or__create__booking__name"
            label="Name"
            variant="outlined"
            value={selectedGuide.fullName}
            name="name"
          />

          <TextField
            onChange={handleEditEmail}
            disabled={disabled}
            id="edit__or__create__booking__email"
            label="Email"
            variant="outlined"
            value={selectedGuide.email}
            name="email"
          />

          <TextField
            onChange={handleEditPhone}
            disabled={disabled}
            id="edit__or__create__booking__phone"
            label="Phone"
            variant="outlined"
            value={selectedGuide.phone}
            name="phone"
          />
        </div>
        {/*  */}
      </div>

      {/* Buttons for toggling edit mode, deleting guide, and saving changes */}
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
      {/* Modal for confirming guide deletion */}
      <GuideModal
        selectedGuide={selectedGuide}
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        setAllGuides={setAllGuides}
        queryClient={queryClient}
        setSelectedGuide={setSelectedGuide}
      />
    </Box>
  );
}

// Styles for the modal
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

// Modal component for confirming guide deletion
function GuideModal({
  selectedGuide,
  setOpenDeleteModal,
  openDeleteModal,
  queryClient,
  setAllGuides,
  setSelectedGuide,
}) {
  const user = useSelector(getCurrentUser);

  // Function to handle guide deletion
  const handleDeleteGuide = async () => {
    if (await deleteGuide(user.token, selectedGuide._id)) {
      queryClient.invalidateQueries(["AllGuides"]);

      setTimeout(async () => {
        const newAllGuides = await fetchAllGuides(user.token);
        setAllGuides(newAllGuides);
        setSelectedGuide(null);
        setOpenDeleteModal(false);
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

// Component for creating a new guide
function NewGuideForm({ setAllGuides, queryClient, setOpenNewGuideForm }) {
  const user = useSelector(getCurrentUser);
  // State for storing the new guide information
  const [newGuide, setNewGuide] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  // Function to handle creating a new guide
  const handleCreateGuide = async () => {
    if (!newGuide.fullName || !newGuide.email || !newGuide.phone) {
      toast.error(
        "Please enter the name, email and phone number of the guide."
      );
      return;
    }

    if (await createNewGuide(user.token, newGuide)) {
      queryClient.invalidateQueries(["AllGuides"]);

      const newAllGuides = await fetchAllGuides(user.token);

      setAllGuides(newAllGuides);

      setOpenNewGuideForm(false);
    }
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
        maxHeight: "250px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
      noValidate
      autoComplete="off"
    >
      <div className="flex gap-2">
        <div className="relative min-h-full flex flex-col items-end">
          <Avatar
            alt="New guide default image"
            src="/img/default.jpg"
            sx={{ width: 86, height: 86 }}
          />
        </div>
        {/*  */}
        <div className="grid grid-cols-2">
          <TextField
            id="new__guide__name"
            label="Name"
            variant="outlined"
            onChange={(e) =>
              setNewGuide({ ...newGuide, fullName: e.target.value })
            }
            value={newGuide.fullName}
          />
          <TextField
            id="new__guide__email"
            label="Email"
            variant="outlined"
            onChange={(e) =>
              setNewGuide({ ...newGuide, email: e.target.value })
            }
            value={newGuide.email}
            name="email"
          />
          <TextField
            id="new__guide__phone"
            label="Phone"
            variant="outlined"
            onChange={(e) =>
              setNewGuide({ ...newGuide, phone: e.target.value })
            }
            value={newGuide.phone}
            name="phone"
          />
        </div>
        {/*  */}
      </div>

      <Stack
        sx={{ alignSelf: "center", padding: "15px 0" }}
        spacing={2}
        direction={"row"}
      >
        <Button
          variant="outlined"
          color="success"
          onClick={async () => await handleCreateGuide()}
        >
          Save
        </Button>

        <Button variant="outlined" onClick={() => setOpenNewGuideForm(false)}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}

export default Guides;
