import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { resetUserPassword } from "../utils/postData";
function ResetPassword() {
  const navigate = useNavigate();
  const { token, email } = useParams();

  const [passwordObj, setPasswordObj] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [disabledBtn, setDisableBtn] = useState(true);

  const handleDisableBtn = () => {
    if (!passwordObj.password || !passwordObj.passwordConfirm) {
      setDisableBtn(true);
    } else if (passwordObj.password !== passwordObj.passwordConfirm) {
      setDisableBtn(true);
    } else {
      setDisableBtn(false);
    }
  };

  useEffect(() => {
    handleDisableBtn();
  }, [passwordObj]);

  const handleResetPassword = async () => {
    if (
      await resetUserPassword(
        token,
        passwordObj.password,
        passwordObj.passwordConfirm,
        email
      )
    ) {
      setTimeout(() => {
        navigate("/", { replace: true });
      });
    } else {
      return null;
    }
  };

  return (
    <Container
      fixed
      sx={{
        display: "flex",
        padding: "30px 0px",
        justifyContent: "center",
        height: "100dvh",
      }}
    >
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
          <TextField
            id="outlined-basic"
            label="Password*"
            variant="outlined"
            value={passwordObj.password}
            onChange={(e) =>
              setPasswordObj({ ...passwordObj, password: e.target.value })
            }
          />
          <TextField
            id="outlined-basic"
            label="Confirm Password*"
            variant="outlined"
            value={passwordObj.passwordConfirm}
            onChange={(e) =>
              setPasswordObj({
                ...passwordObj,
                passwordConfirm: e.target.value,
              })
            }
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
