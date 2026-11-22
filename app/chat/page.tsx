"use client";

import Box from "@mui/material/Box";
import ChatView from "./_components/chat-view";

export default function ChatPage() {
  return (
    <Box
      sx={{
        minHeight: "unset",
        pb: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ChatView />
    </Box>
  );
}
