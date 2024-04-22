import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useQueryClient } from "@tanstack/react-query";

function Guides() {
  const queryClient = useQueryClient();
  const allGuides = queryClient.getQueryData(["AllGuides"]);

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
            <GuideSideBox guide={guide} key={guide._id} />
          ))}
        </Box>
        <Button variant="outlined">Add New Guide</Button>
      </div>
      <h1>Hello</h1>
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

export default Guides;
