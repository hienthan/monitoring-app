import { Chart } from "../types/metric";
import { minutesAgo } from "../../lib/time";

const makePoints = (base: number, variance: number) =>
  Array.from({ length: 20 }).map((_, idx) => ({
    ts: minutesAgo((20 - idx) * 2),
    value: Math.max(0, Math.min(100, base + Math.sin(idx) * variance + Math.random() * variance)),
  }));

export const chartsMock: Chart[] = [
  {
    id: "cpu-srv-1",
    serverId: "srv-1",
    chart: "cpu",
    series: [
      { id: "cpu", label: "CPU", unit: "%", points: makePoints(35, 10) },
    ],
  },
  {
    id: "cpu-srv-2",
    serverId: "srv-2",
    chart: "cpu",
    series: [
      { id: "cpu", label: "CPU", unit: "%", points: makePoints(60, 15) },
    ],
  },
  {
    id: "cpu-srv-3",
    serverId: "srv-3",
    chart: "cpu",
    series: [
      { id: "cpu", label: "CPU", unit: "%", points: makePoints(25, 8) },
    ],
  },
];
