import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useSearchParams } from "next/navigation";

export default function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address");

  const handleClick = async (type: "onramper" | "stripe") => {
    await selectionFeedback();
    if (type === "onramper") {
      router.push("/wallet/buy/onramper?address=" + address);
    } else if (type === "stripe") {
      router.push("/wallet/buy/stripe?address=" + address);
    }
  };

  const onRampProviders = [
    {
      id: "onramper",
      label: "Choose the best",
      description: "Compare multiple providers and rates",
      icon: <ShoppingCartIcon />,
      action: () => handleClick("onramper"),
      hasChevron: true,
    },
    {
      id: "stripe",
      label: "Stripe",
      description: "For EU only",
      icon: <CreditCardIcon />,
      action: () => handleClick("stripe"),
      hasChevron: true,
    },
  ];

  const renderListItem = (item: any, isLast: boolean = false) => (
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
            color: "#8B5CF6",
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

  return (
    <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
      <Card
        sx={{
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
          border: "1px solid rgba(139, 92, 246, 0.06)",
          mb: 3,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#1F2937",
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Choose Provider
          </Typography>
        </Box>
        <List sx={{ p: 0, pb: 1 }}>
          {onRampProviders.map((item, index) =>
            renderListItem(item, index === onRampProviders.length - 1),
          )}
        </List>
      </Card>

      {/* Security Notice */}
      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          px: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "#6B7280",
            lineHeight: 1.6,
            bgcolor: "rgba(139, 92, 246, 0.04)",
            border: "1px solid rgba(139, 92, 246, 0.08)",
            borderRadius: "12px",
            p: 3,
          }}
        >
          💳 Choose your preferred payment method and provider to buy crypto
          <br />
          <Box
            component="span"
            sx={{
              color: "#8B5CF6",
              fontWeight: 500,
              mt: 1,
              display: "block",
            }}
          >
            Secure and trusted providers
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
