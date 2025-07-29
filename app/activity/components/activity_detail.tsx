import { useSearchParams } from "next/navigation";
import * as React from "react";
import Box from "@mui/material/Box";
import { feed } from "@/app/home/components/feed";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function ActivityDetailContent() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const activity = feed.find((item) => item.id === id);

  // Display an error message if ID is invalid
  if (!activity) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="error" variant="h6">
          Activity not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "unset",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        py: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: 4,
          p: 3,
          background: "linear-gradient(135deg, #f5f6fa 60%, #e3f2fd 100%)",
        }}
      >
        <CardHeader
          avatar={
            <Avatar src={activity.user.avatar} alt={activity.user.name}>
              {activity.user.name[0]}
            </Avatar>
          }
          title={
            <Typography fontWeight="bold" variant="h6">
              {activity.user.name}
            </Typography>
          }
          subheader={
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.95rem",
                wordBreak: "break-all",
                display: "block",
              }}
            >
              {activity.user.wallet}
            </Typography>
          }
        />
        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{ mb: 1, color: "#AD5AD7" }}
        >
          {activity.action}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {activity.description}
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: activity.amount.startsWith("+") ? "#43a047" : "#e53935",
            fontFamily: "monospace",
            mb: 2,
          }}
        >
          {activity.amount}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Date row with icon */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CalendarMonthIcon
            fontSize="small"
            sx={{ mr: 1, color: "#90a4ae" }}
          />
          <Typography variant="body2" sx={{ color: "#212529" }}>
            <b>Date:</b> {activity.time}
          </Typography>
        </Box>

        {/* Wallet row with icon */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AccountBalanceWalletIcon
            fontSize="small"
            sx={{ mr: 1, color: "#90a4ae" }}
          />
          <Typography variant="body2" sx={{ color: "#212529" }}>
            <b>Wallet:</b> {activity.user.wallet}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default ActivityDetailContent;
