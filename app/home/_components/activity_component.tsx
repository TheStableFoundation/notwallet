"use client";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useNavigate } from "react-router-dom";

export type ActivityItem = {
  id: number | string;
  user: {
    name: string;
    avatar: string;
    wallet: string;
  };
  time: string;
  action: string;
  description: string;
  image?: string;
  amount: string;
};

export default function ActivityComponent({ item }: { item: ActivityItem }) {
  const router = useNavigate();
  const handleClick = async () => {
    try {
      await selectionFeedback();
    } catch {}
    router(`/home/activity?id=${item.id}`);
  };
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
        background: "#fff",
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 6, bgcolor: "#f3f4f6" },
      }}
      onClick={handleClick}
    >
      <CardHeader
        avatar={
          <Avatar src={item.user.avatar} alt={item.user.name}>
            {item.user.name[0]}
          </Avatar>
        }
        title={
          <Box>
            <Typography fontWeight="bold" variant="subtitle1">
              {item.user.name}
            </Typography>
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
              {item.user.wallet}
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {item.time}
          </Typography>
        }
      />
      {item.image && (
        <Box
          component="img"
          src={item.image}
          alt={item.action}
          sx={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            bgcolor: "#f3f4f6",
          }}
        />
      )}
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" sx={{ flex: 1 }}>
            {item.action}
          </Typography>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{
              color: "#9932CC",
              bgcolor: "rgba(153, 50, 204, 0.1)",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.95rem",
              ml: 1,
            }}
          >
            {item.amount}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, lineHeight: 1.5 }}
        >
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
