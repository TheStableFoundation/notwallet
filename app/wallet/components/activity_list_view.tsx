import * as React from "react";
import { Card, CardContent, Typography, Stack, Avatar } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import InfoIcon from "@mui/icons-material/Info";

import type { Activity } from "./transactions";

interface ActivityListViewProps {
  activities: Activity[];
}

export default function ActivityListView({
  activities,
}: ActivityListViewProps) {
  return (
    <Stack spacing={2}>
      {activities.map((activity) => (
        <Card
          key={activity.id}
          sx={{
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(173, 90, 215, 0.08)",
            bgcolor: "#f7f2fa",
            border: "1px solid #e1c8f7",
            display: "flex",
            alignItems: "center",
            px: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor:
                activity.type === "received"
                  ? "#AD5AD7"
                  : activity.type === "airdrop"
                    ? "#FFD700"
                    : "#fff",
              color:
                activity.type === "received"
                  ? "#fff"
                  : activity.type === "airdrop"
                    ? "#AD5AD7"
                    : "#AD5AD7",
              mr: 2,
              boxShadow:
                activity.type === "received"
                  ? "0 0 8px #AD5AD7"
                  : activity.type === "airdrop"
                    ? "0 0 8px #FFD700"
                    : "none",
            }}
          >
            {activity.type === "received" ? (
              <ArrowDownwardIcon />
            ) : activity.type === "sent" ? (
              <ArrowUpwardIcon />
            ) : (
              <InfoIcon />
            )}
          </Avatar>
          <CardContent sx={{ flex: 1, py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoIcon sx={{ color: "#AD5AD7" }} />
              <Typography
                variant="subtitle1"
                sx={{ color: "#AD5AD7", fontWeight: 600 }}
              >
                {activity.coin}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 1, color: "#212529" }}>
              {activity.type === "received"
                ? "Received"
                : activity.type === "sent"
                  ? "Sent"
                  : "Airdrop"}{" "}
              {activity.coin}
            </Typography>
            <Typography variant="h6" sx={{ color: "#AD5AD7", fontWeight: 700 }}>
              {activity.type === "received"
                ? "+"
                : activity.type === "sent"
                  ? "-"
                  : "+"}
              ${activity.amount.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: "#90a4ae" }}>
              {activity.date}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
