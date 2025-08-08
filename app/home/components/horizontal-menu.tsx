"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuItem = ({ icon, label, onClick }: MenuItemProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 80,
    }}
  >
    <Tooltip title={label} arrow>
      <IconButton
        sx={{
          width: 56,
          height: 56,
          bgcolor: "#fff",
          color: "#9932CC",
          boxShadow: "0 2px 12px rgba(153, 50, 204, 0.15)",
          border: "1px solid rgba(153, 50, 204, 0.1)",
          "&:hover": {
            bgcolor: "#f5f6fa",
            boxShadow: "0 4px 16px rgba(153, 50, 204, 0.25)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
    <Typography
      variant="caption"
      sx={{
        mt: 1,
        color: "#666",
        fontWeight: 500,
        fontSize: "0.75rem",
        textAlign: "center",
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default function HorizontalMenu() {
  const router = useRouter();

  const handleDAO = async () => {
    await selectionFeedback();
    router.push("/dao");
  };

  const menuItems = [
    {
      icon: <AccountBalanceIcon fontSize="medium" />,
      label: "DAO",
      onClick: handleDAO,
    },
    // Add more menu items here as needed
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 480,
        px: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
          border: "1px solid rgba(153, 50, 204, 0.05)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#333",
            fontWeight: 600,
            mb: 2,
            textAlign: "center",
          }}
        >
          Quick Actions
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              onClick={item.onClick}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
