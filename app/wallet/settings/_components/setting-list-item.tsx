"use client";

import * as React from "react";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function SettingListItem(item: any, isLast: boolean = false) {
  return (
    <React.Fragment key={item.id}>
      <ListItem
        sx={{
          px: 0,
          py: 2,
          cursor: "pointer",
          borderRadius: "12px",
          mx: 2,
          mb: 1,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: "rgba(139, 92, 246, 0.04)",
            transform: "scale(1.01)",
          },
          "&:active": {
            transform: "scale(0.99)",
          },
        }}
        onClick={item.action}
        component="li"
        disablePadding
      >
        <ListItemIcon
          sx={{
            color: item.isDanger ? "#DC2626" : "#8B5CF6",
            minWidth: 48,
            ml: 2,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          secondary={item.description}
          primaryTypographyProps={{
            sx: {
              fontSize: "16px",
              fontWeight: 500,
              color: "#1F2937",
              letterSpacing: "-0.01em",
              mb: 0.25,
            },
          }}
          secondaryTypographyProps={{
            sx: {
              fontSize: "14px",
              color: "#6B7280",
            },
          }}
        />
        {item.hasChevron && (
          <ChevronRightIcon
            sx={{
              color: "#9CA3AF",
              mr: 4,
              fontSize: "20px",
            }}
          />
        )}
      </ListItem>
      {!isLast && (
        <Divider
          sx={{
            mx: 6,
            borderColor: "rgba(139, 92, 246, 0.08)",
          }}
        />
      )}
    </React.Fragment>
  );
}
