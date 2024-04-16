import Box from "@mui/material/Box";

function DescriptionTextBox({ description }) {
  return (
    <Box
      height={150}
      width={500}
      p={1}
      sx={{
        marginTop: "10px",
        borderRadius: "8px",
        border: "1px solid grey",
        maxWidth: "500px",
        alignSelf: "center",
        overflowY: "auto",
        display: "inline",
      }}
    >
      {description}
    </Box>
  );
}

export default DescriptionTextBox;
