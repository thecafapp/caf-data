import { TabPanel, Card, Title, Text, AreaChart } from "@tremor/react";
import { useEffect, useState } from "react";
export default function AverageOverTime() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    let promiseArr = [];
    for (let i = 11; i > 0; i--) {
      promiseArr.push(fetch(`/api/average?interval=${i}`));
    }
    Promise.all(promiseArr).then((resArray) => {
      let entries = [];
      resArray.forEach((res) => {
        res.json().then((data) => {
          entries.push({
            date: data.date,
            Rating: Number(data.average).toFixed(4),
          });
          entries.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
        });
      });
      setChartData(entries);
    });
  }, []);

  return (
    <TabPanel>
      <div className="mt-6">
        <Card>
          <Title>Average Rating Over Time</Title>
          <Text>
            This chart displays the average rating of all foods regardless of
            whether or not they were served on that day.
          </Text>
          {chartData && (
            <AreaChart
              className="h-72 mt-3"
              data={chartData}
              index="date"
              categories={["Rating"]}
              colors={["blue"]}
              autoMinValue={true}
              showAnimation={true}
            />
          )}
        </Card>
      </div>
    </TabPanel>
  );
}
