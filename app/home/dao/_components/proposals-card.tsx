"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Pending" | "Completed" | "Failed";
  yesVotes: string;
  noVotes: string;
  endsIn: string;
}

const mockProposals: Proposal[] = [
  {
    id: "001",
    title: "Proposal #001: Increase Treasury Fee",
    description: "Proposal to increase the treasury fee from 0.25% to 0.35% to fund additional development initiatives and security audits.",
    status: "Active",
    yesVotes: "12,500 BACH",
    noVotes: "8,200 BACH",
    endsIn: "3 days",
  },
  {
    id: "002",
    title: "Proposal #002: New Feature Funding",
    description: "Allocate 25,000 BACH from treasury to fund development of cross-chain swap functionality and mobile app improvements.",
    status: "Pending",
    yesVotes: "5,800 BACH",
    noVotes: "2,100 BACH",
    endsIn: "7 days",
  },
];

const getStatusColor = (status: Proposal["status"]) => {
  switch (status) {
    case "Active":
      return { bgcolor: "#e3f2fd", color: "#1976d2" };
    case "Pending":
      return { bgcolor: "#fff3e0", color: "#f57c00" };
    case "Completed":
      return { bgcolor: "#e8f5e8", color: "#2e7d32" };
    case "Failed":
      return { bgcolor: "#ffebee", color: "#c62828" };
    default:
      return { bgcolor: "#f5f5f5", color: "#666" };
  }
};

export default function ProposalsCard() {
  const [state, setState] = React.useState<LoadingState>(LoadingState.Loading);
  const [proposals, setProposals] = React.useState<Proposal[]>([]);

  const loadProposals = async () => {
    try {
      setState(LoadingState.Loading);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProposals(mockProposals);
      setState(LoadingState.Loaded);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setState(LoadingState.Error);
    }
  };

  React.useEffect(() => {
    loadProposals();
  }, []);

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 3, color: "#9932CC" }}
      >
        Active Proposals
      </Typography>

      {/* Loading State */}
      {state === LoadingState.Loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} sx={{ color: "#9932CC" }} />
        </Box>
      )}

      {/* Error State */}
      {state === LoadingState.Error && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Failed to load proposals
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#9932CC",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={loadProposals}
          >
            Retry
          </Typography>
        </Box>
      )}

      {/* Loaded State */}
      {state === LoadingState.Loaded && (
        <>
          {proposals.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No active proposals at this time
              </Typography>
            </Box>
          ) : (
            proposals.map((proposal) => {
              const statusColors = getStatusColor(proposal.status);
              return (
                <Box
                  key={proposal.id}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    "&:hover": {
                      bgcolor: "#f9f9f9",
                      borderColor: "#9932CC",
                    },
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:last-child": {
                      mb: 0,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="start"
                    sx={{ mb: 1 }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "#333", flex: 1, mr: 2 }}
                    >
                      {proposal.title}
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: statusColors.bgcolor,
                        color: statusColors.color,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {proposal.status}
                    </Box>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ mb: 2, color: "#666", lineHeight: 1.5 }}
                  >
                    {proposal.description}
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Yes Votes
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#43a047"
                      >
                        {proposal.yesVotes}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        No Votes
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#e53935"
                      >
                        {proposal.noVotes}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Ends
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {proposal.endsIn}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              );
            })
          )}
        </>
      )}
    </Card>
  );
}
