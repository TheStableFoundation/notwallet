"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { store } from "@/lib/store/store";

type OnboardingCardUsernameProps = {
  open: boolean;
  onClose: () => void;
};

export default function OnboardingCardUsername({
  open,
  onClose,
}: OnboardingCardUsernameProps) {
  const [username, setUsername] = React.useState("");
  const [usernameSaved, setUsernameSaved] = React.useState(false);

  const handleSaveUsername = async () => {
    try {
      await store().set("username", username);
      setUsernameSaved(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      // Optionally handle error
      setUsernameSaved(false);
    }
  };

  if (!open) return null;

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 480,
        mb: 3,
        borderRadius: 4,
        boxShadow: 6,
        background: "linear-gradient(135deg, #9932CC 0%, #AD5AD7 100%)",
        color: "#fff",
        position: "relative",
        overflow: "visible",
        border: "2px solid #AD5AD7",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "#AD5AD7",
          bgcolor: "#fff",
          "&:hover": { bgcolor: "#F5F6FA" },
          zIndex: 2,
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mt: 2,
            color: "#fff",
            textShadow: "0 2px 8px #AD5AD799",
            letterSpacing: 1,
          }}
        >
          👤 Set Your Username
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            color: "#b0bec5",
            fontWeight: 500,
            fontSize: "1.1rem",
          }}
        >
          Choose a username to personalize your wallet.
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your username"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUsername(e.target.value)
          }
          sx={{
            mb: 2,
            bgcolor: "#f3f4f6",
            borderRadius: 2,
            input: { color: "#212529" },
            "& .MuiOutlinedInput-root": {
              bgcolor: "#f3f4f6",
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#b0bec5",
              },
              "&:hover fieldset": {
                borderColor: "#90caf9",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1e88e5",
              },
            },
            "& input::placeholder": {
              color: "#b0bec5",
              opacity: 1,
              fontStyle: "italic",
            },
          }}
          inputProps={{
            style: {
              fontFamily: "monospace",
              fontSize: "1.1rem",
              color: "#212529",
            },
            maxLength: 32,
          }}
          disabled={usernameSaved}
        />
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: "#fff",
            color: "#AD5AD7",
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: 2,
            boxShadow: 2,
            px: 4,
            py: 1.5,
            "&:hover": { bgcolor: "#F5F6FA" },
            transition: "all 0.2s",
          }}
          onClick={handleSaveUsername}
          disabled={!username || usernameSaved}
        >
          {usernameSaved ? "Saved!" : "Save Username"}
        </Button>
        {usernameSaved && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: "#b0bec5",
              fontWeight: 500,
            }}
          >
            Username saved successfully!
          </Typography>
        )}
      </Box>
    </Card>
  );
}
