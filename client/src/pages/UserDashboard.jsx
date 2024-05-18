import { Box, Button, Container, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, login } from "../redux/userSlice";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState, useEffect } from "react";
import { updateUser, updateUserPassword } from "../utils/postData";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function UserDashboard() {
  // Initialize query client
  const queryClient = useQueryClient();

  // Get user data from Redux store
  const { _id, role, isLoggedIn, token, ...data } = useSelector(getCurrentUser);

  // Initialize local state
  const [DATA, SETDATA] = useState({
    ...data,
    currentPassword: "",
    newPassword: "",
    _id,
  });

  // Dispatch function
  const dispatch = useDispatch();

  // Local state for user photo
  const [file, setFile] = useState(DATA.photo);

  // Local state for changing password fields visibility
  const [openChangePassword, setOpenChangePassword] = useState(false);

  // Function to handle opening/closing change password fields
  const handleOpenChangePasswordFields = () => {
    setOpenChangePassword(!openChangePassword);

    // Reset password fields if closing
    if (!openChangePassword) {
      SETDATA({ ...DATA, currentPassword: "", newPassword: "" });
    }
  };

  // Function to handle name change
  const handleChangeName = (e) => {
    SETDATA({ ...DATA, name: e.target.value });
  };

  // Function to handle email change
  const handleChangeEmail = (e) => {
    SETDATA({ ...DATA, email: e.target.value });
  };

  // Function to handle current password change
  const handleCurrentPasswordChange = (e) => {
    SETDATA({ ...DATA, currentPassword: e.target.value });
  };

  // Function to handle new password change
  const handleNewPasswordChange = (e) => {
    SETDATA({ ...DATA, newPassword: e.target.value });
  };

  // Update file state when user photo changes
  useEffect(() => {
    setFile(DATA.photo);
  }, [DATA.photo]);

  // Function to handle user photo change
  const handleChangeUserPhoto = (e) => {
    if (e.target.files[0].type.includes("image")) {
      SETDATA({ ...DATA, photo: e.target.files[0] });
      setFile(URL.createObjectURL(e.target.files[0]));
    } else {
      toast.error("The selected file is not a image.");
      return null;
    }
  };

  // Function to handle saving user data
  const handleSaveUser = async () => {
    const { status, user } = await updateUser(token, DATA);

    if (status === "success") {
      const local = JSON.parse(localStorage.getItem("user"));
      const session = JSON.parse(sessionStorage.getItem("user"));

      if (local) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, token, isLoggedIn: true })
        );
      } else if (session) {
        sessionStorage.setItem(
          "user",
          JSON.stringify({ ...user, token, isLoggedIn: true })
        );
      }
      queryClient.invalidateQueries();

      dispatch(login({ ...user, token }));
    }
  };

  // Function to handle updating user password
  const handleUpdatePassword = async () => {
    if (
      !(await updateUserPassword(
        token,
        DATA.email,
        DATA.currentPassword,
        DATA.newPassword
      ))
    ) {
      toast.error("ERROR: Failed to change user password.");
      return null;
    } else {
      setOpenChangePassword(false);
      SETDATA({ ...DATA, currentPassword: "", newPassword: "" });
    }
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
        <div className="relative flex flex-col items-center gap-4">
          <Avatar
            alt={DATA.name}
            src={typeof file == "object" ? URL.createObjectURL(file) : file}
            sx={{ width: 120, height: 150 }}
          />
          <div className="z-50 mt-[-10px]">
            <input
              id="user__photo__uploader"
              type="file"
              onChange={handleChangeUserPhoto}
              name="image"
            />
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-4">
          <TextField
            id="user__dashboard__name"
            label="Name"
            variant="outlined"
            value={DATA.name}
            disabled={openChangePassword}
            onChange={handleChangeName}
            name="user__name"
          />

          <TextField
            id="user__dashboard__email"
            label="Email"
            variant="outlined"
            value={DATA.email}
            disabled={openChangePassword}
            onChange={handleChangeEmail}
            name="user__email"
          />

          {openChangePassword && (
            <>
              <TextField
                id="user__dashboard__password"
                label="Current Password"
                variant="outlined"
                value={DATA.currentPassword}
                onChange={handleCurrentPasswordChange}
                name="user__current__password"
              />

              <TextField
                id="user__dashboard__new__password"
                label="New Password"
                variant="outlined"
                value={DATA.newPassword}
                onChange={handleNewPasswordChange}
                name="user__new__password"
              />
              {/* Buttons for changing password and saving user */}
              <Button
                variant="contained"
                onClick={async () => handleUpdatePassword()}
                disabled={
                  DATA.currentPassword &&
                  DATA.newPassword &&
                  DATA.currentPassword !== DATA.newPassword
                    ? false
                    : true
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
          onClick={async () => await handleSaveUser()}
        >
          Save
        </Button>
      </Stack>
    </Container>
  );
}

export default UserDashboard;
