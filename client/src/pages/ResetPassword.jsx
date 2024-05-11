import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { resetUserPassword } from "../utils/postData";
import { forgetMe } from "../utils/rememberMe";
function ResetPassword() {
  const navigate = useNavigate();
  const { token, email } = useParams();

  // State variables to hold password and confirmation, initially empty
  const [passwordObj, setPasswordObj] = useState({
    password: "",
    passwordConfirm: "",
  });

  // State variable to manage button disable state, initially true
  const [disabledBtn, setDisableBtn] = useState(true);

  // Function to enable or disable the reset password button based on password validity
  const handleDisableBtn = () => {
    if (!passwordObj.password || !passwordObj.passwordConfirm) {
      setDisableBtn(true);
    } else if (passwordObj.password !== passwordObj.passwordConfirm) {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  };

  // Effect to handle button state whenever passwordObj changes
  useEffect(() => {
    handleDisableBtn();
  }, [passwordObj]);

  // Function to handle password reset process
  const handleResetPassword = async () => {
    if (
      await resetUserPassword(
        token,
        passwordObj.password,
        passwordObj.passwordConfirm,
        email
      )
    ) {
      forgetMe(); // Clear any stored user data
      // Navigate back to home page after successful password reset
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } else {
      return null;
    }
  };

  return (
    // Container to center align the password reset form
    <Container
      fixed
      sx={{
        display: "flex",
        padding: "30px 0px",
        justifyContent: "center",
        height: "100dvh",
      }}
    >
      {/* Title */}
      <div className="w-[475px] flex flex-col items-center gap-[25px]">
        <Typography fontSize={36}>Reset password</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            border: "1px solid #2196f3",
            padding: "20px 15px",
            borderRadius: "10px",
          }}
        >
          {/* Password and confirmation text fields */}
          <TextField
            id="reset__password__password"
            label="Password*"
            variant="outlined"
            value={passwordObj.password}
            onChange={(e) =>
              setPasswordObj({ ...passwordObj, password: e.target.value })
            }
            name="password"
          />
          <TextField
            id="reset__password__password__confirm"
            label="Confirm Password*"
            variant="outlined"
            value={passwordObj.passwordConfirm}
            onChange={(e) =>
              setPasswordObj({
                ...passwordObj,
                passwordConfirm: e.target.value,
              })
            }
            name="password__confirm"
          />
        </Box>
        <Button
          disabled={disabledBtn}
          variant="contained"
          onClick={async () => await handleResetPassword()}
        >
          Reset password
        </Button>
      </div>
    </Container>
  );
}

export default ResetPassword;
