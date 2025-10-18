"use client";

import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useLang } from "../../src/LanguageContext";

const ErrorCard = () => {
  const { t } = useLang();

  return (
    <Card
      sx={{
        maxWidth: 400,
        height: 400,
        width: "100%",
        p: 0,
        boxShadow: 3,
        position: "relative",
      }}
    >
      <Typography variant="h6" align="center">
        {t.errorOccurred}
      </Typography>
    </Card>
  );
};

export default ErrorCard;
