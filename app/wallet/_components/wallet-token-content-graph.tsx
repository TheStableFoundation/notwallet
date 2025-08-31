import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ButtonGroup, useTheme } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
  TooltipItem,
} from "chart.js";
import { useState } from "react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ChartTimeframeData {
  labels: string[];
  values: number[];
}

interface ChartDataByTimeframe {
  [key: string]: ChartTimeframeData;
}

export default function WalletTokenContentGraph() {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState("7d");

  // Mock data for different timeframes
  const chartData: ChartDataByTimeframe = {
    "24h": {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      values: [
        420, 430, 425, 440, 445, 450, 460, 470, 480, 470, 460, 465, 470, 480,
        490, 495, 490, 485, 480, 490, 500, 510, 505, 510,
      ],
    },
    "7d": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [420, 450, 480, 460, 490, 505, 510],
    },
    "30d": {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
      values: [
        400, 410, 420, 430, 435, 440, 450, 460, 465, 470, 465, 460, 470, 480,
        490, 485, 480, 475, 480, 490, 500, 495, 490, 485, 490, 500, 505, 510,
        515, 510,
      ],
    },
    "1y": {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [300, 320, 350, 380, 410, 440, 460, 480, 450, 470, 490, 510],
    },
  };

  const data: ChartData<"line"> = {
    labels: chartData[timeframe].labels,
    datasets: [
      {
        label: "Token Price (USD)",
        data: chartData[timeframe].values,
        fill: true,
        backgroundColor: `${theme.palette.primary.main}20`, // Transparent version of primary color
        borderColor: theme.palette.primary.main,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context: TooltipItem<"line">) {
            return `$${(context.raw as number).toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: `${theme.palette.divider}50`, // Subtle grid lines
        },
        ticks: {
          callback: function (value): string {
            return "$" + value;
          },
        },
      },
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  // Get the current price (last value in the current timeframe)
  const currentPrice =
    chartData[timeframe].values[chartData[timeframe].values.length - 1];

  // Calculate percentage change
  const firstPrice = chartData[timeframe].values[0];
  const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <>
      <Box mb={2}>
        <Typography variant="h4">
          ${currentPrice.toFixed(2)}
          {" (demo)"}
        </Typography>
        <Typography
          variant="subtitle1"
          color={isPositive ? "success.main" : "error.main"}
        >
          {isPositive ? "+" : ""}
          {priceChange.toFixed(2)}% ({timeframe})
        </Typography>
      </Box>

      <ButtonGroup variant="outlined" size="small" sx={{ mb: 3 }}>
        <Button
          onClick={() => setTimeframe("24h")}
          variant={timeframe === "24h" ? "contained" : "outlined"}
        >
          24H
        </Button>
        <Button
          onClick={() => setTimeframe("7d")}
          variant={timeframe === "7d" ? "contained" : "outlined"}
        >
          7D
        </Button>
        <Button
          onClick={() => setTimeframe("30d")}
          variant={timeframe === "30d" ? "contained" : "outlined"}
        >
          30D
        </Button>
        <Button
          onClick={() => setTimeframe("1y")}
          variant={timeframe === "1y" ? "contained" : "outlined"}
        >
          1Y
        </Button>
      </ButtonGroup>
      <Box height={300}>
        <Line data={data} options={options} />
      </Box>
    </>
  );
}
