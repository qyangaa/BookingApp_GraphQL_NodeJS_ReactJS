import React from "react";
import { Bar } from "react-chartjs-2";

const BOOKINGS_BUCKETS = {
  Cheap: { min: 0, max: 20 },
  Normal: { min: 20, max: 50 },
  Expensive: { min: 50, max: 1000000 },
};
export default function BookingsChart(props) {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, cur) => {
      if (
        cur.event.price >= BOOKINGS_BUCKETS[bucket].min &&
        cur.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      // label: "My First dataset",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Bar data={chartData} />
    </div>
  );
}
