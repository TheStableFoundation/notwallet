import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import LoadingCard from "@/lib/components/loading-card";
import ActivityListView from "./activity_list_view";
import { activitiesTestnet } from "./transactions";

enum State {
  Loading,
  Loaded,
  Error,
}

interface ActivityCardProps {}

export default function ActivityCard({}: ActivityCardProps) {
  // Add loading state
  const [state, setState] = React.useState(State.Loading);

  const loadActivities = async () => {
    setTimeout(() => {
      setState(State.Loaded);
    }, 2000); // 2 seconds delay
  };

  React.useEffect(() => {
    loadActivities();
  }, []);
  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: 2,
        background: "linear-gradient(135deg, #f5f6fa 60%, #e3f2fd 100%)",
        overflow: "hidden",
        p: 4,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, color: "#212529" }}
      >
        Recent Activity (demo)
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {state === State.Loading && <LoadingCard />}
      {state === State.Loaded && (
        <ActivityListView activities={activitiesTestnet} />
      )}
    </Card>
  );
}
