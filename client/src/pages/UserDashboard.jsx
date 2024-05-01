import { Box, Button, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../redux/userSlice";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState, useEffect } from "react";

function UserDashboard() {
  const { _id, role, isLoggedIn, token, ...data } = useSelector(getCurrentUser);
  const [DATA, SETDATA] = useState({
    ...data,
    currentPassword: "",
    newPassword: "",
  });

  const [file, setFile] = useState(DATA.photo);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleOpenChangePasswordFields = () => {
    setOpenChangePassword(!openChangePassword);
  };

  const handleChangeName = (e) => {
    SETDATA({ ...DATA, name: e.target.value });
  };

  const handleChangeEmail = (e) => {
    SETDATA({ ...DATA, email: e.target.value });
  };

  const handleCurrentPasswordChange = (e) => {
    SETDATA({ ...DATA, currentPassword: e.target.value });
  };

  const handleNewPasswordChange = (e) => {
    SETDATA({ ...DATA, newPassword: e.target.value });
  };

  useEffect(() => {
    setFile(DATA.photo);
  }, [DATA.photo]);

  const handleChangeUserPhoto = (e) => {
    SETDATA({ ...DATA, photo: e.target.files[0] });
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Container
      fixed
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "20px",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          paddingTop: "20px",
          border: "1px solid #2196f3",
          padding: "20px 40px",
          maxWidth: "800px",
          display: "flex",
          gap: "30px",
          boxShadow:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          borderRadius: "10px",
        }}
      >
        <div className="relative flex flex-col items-end">
          <Avatar
            alt={DATA.name}
            src={typeof file == "object" ? URL.createObjectURL(file) : file}
            sx={{ width: 120, height: 150 }}
          />
          <div className="z-50 mt-[-10px]">
            <input
              id="guide_photo__uploader"
              type="file"
              onChange={handleChangeUserPhoto}
              name="image"
            />
            <label htmlFor="guide_photo__uploader">
              <CloudUploadOutlinedIcon sx={{ width: "32px", height: "32px" }} />
            </label>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-4">
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={DATA.name}
            onChange={handleChangeName}
          />

          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={DATA.email}
            onChange={handleChangeEmail}
          />

          {openChangePassword && (
            <>
              <TextField
                id="outlined-basic"
                label="Current Password"
                variant="outlined"
                value={DATA.currentPassword}
                onChange={handleCurrentPasswordChange}
              />

              <TextField
                id="outlined-basic"
                label="New Password"
                variant="outlined"
                value={DATA.newPassword}
                onChange={handleNewPasswordChange}
              />

              <Button
                variant="contained"
                disabled={
                  DATA.currentPassword && DATA.newPassword ? false : true
                }
              >
                Save new Password
              </Button>
            </>
          )}
        </div>
      </Box>
      <Stack direction="row" spacing={4}>
        <Button
          color={!openChangePassword ? "info" : "error"}
          variant="outlined"
          onClick={handleOpenChangePasswordFields}
        >
          {!openChangePassword ? "Open" : "Close"} change password
        </Button>

        <Button variant="outlined">Reset password</Button>

        <Button
          variant="contained"
          color="success"
          disabled={
            DATA.email === data.email &&
            DATA.photo === data.photo &&
            DATA.name === data.name
              ? true
              : false
          }
        >
          Save
        </Button>
      </Stack>
    </Container>
  );
}

export default UserDashboard;
