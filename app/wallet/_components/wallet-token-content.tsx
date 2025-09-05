import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card } from "@mui/material";
import WalletTokenContentGraph from "./wallet-token-content-graph";

export default function WalletTokenContent({
  id,
  totalSupply,
}: {
  id: string;
  totalSupply: string;
}) {
  return (
    <Card>
      <Box p={3}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 3 }}>
          <Box>
            <Box>
              <Typography component="h2" variant="h6" fontStyle="bold">
                Address
              </Typography>
              <Typography variant="body1">{id}</Typography>
            </Box>
            <Box mb={2}>
              <Typography component="h2" variant="h6">
                Total supply
              </Typography>
              <Typography variant="body1">{totalSupply}</Typography>
            </Box>
            <WalletTokenContentGraph />
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
