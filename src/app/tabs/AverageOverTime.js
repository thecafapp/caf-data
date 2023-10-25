import { CalendarIcon, ExclamationIcon } from "@heroicons/react/outline";
import {
  TabPanel,
  Card,
  Grid,
  Title,
  Text,
  AreaChart,
  Flex,
  Select,
  SelectItem,
  NumberInput,
  Subtitle,
  Callout,
} from "@tremor/react";
import { useEffect, useState } from "react";
export default function AverageOverTime() {
  const [chartData, setChartData] = useState([]);
  const [timeInterval, setTimeInterval] = useState("7");
  const [numOfDataPoints, setNumOfDataPoints] = useState(8);

  const loadChart = () => {
    let promiseArr = [];
    for (let i = numOfDataPoints * timeInterval; i > 0; i -= timeInterval) {
      promiseArr.push(fetch(`/api/average?offset=${i}`));
    }
    Promise.all(promiseArr).then((resArray) => {
      let entries = [];
      resArray.forEach((res) => {
        res
          .json()
          .then((data) => {
            if (res.ok) {
              entries.push({
                date: data.date,
                Rating: Number(data.foodAverage).toFixed(4),
              });
              entries.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
              });
              setChartData(entries);
            }
          })
          .catch(() => {
            console.log("");
          });
      });
    });
  };

  useEffect(() => {
    setChartData([]);
    setTimeout(loadChart, 1000);
  }, [timeInterval, numOfDataPoints]);

  return (
    <TabPanel>
      <div className="mt-6">
        <Card>
          <Flex justifyContent="between">
            <div>
              <Title>Average Rating Over Time</Title>
              <Text>
                This chart displays the average rating of all foods regardless
                of whether or not they were served on that day.
              </Text>
            </div>
            <Flex className="w-85">
              <NumberInput
                className="w-20 mr-5"
                max={20}
                min={2}
                error={numOfDataPoints < 2 || numOfDataPoints > 20}
                errorMessage="Maximum datapoints is 20."
                value={numOfDataPoints}
                onValueChange={setNumOfDataPoints}
              />
              <Select
                className="w-40"
                placeholder="Interval..."
                icon={CalendarIcon}
                value={timeInterval}
                enableClear={false}
                onChange={setTimeInterval}
              >
                <SelectItem value="1">By day</SelectItem>
                <SelectItem value="7">By week</SelectItem>
                <SelectItem value="30">By month</SelectItem>
              </Select>
            </Flex>
          </Flex>
          {chartData.length > 1 ? (
            <AreaChart
              className="h-72 mt-3"
              data={chartData}
              index="date"
              categories={["Rating"]}
              colors={["blue"]}
              autoMinValue={true}
              showAnimation={true}
            />
          ) : (
            <Flex justifyContent="center" className="mt-20 mb-20">
              <Subtitle>Loading data...</Subtitle>
            </Flex>
          )}
        </Card>
        <Grid numItemsMd={2} className="mt-6 gap-6">
          <Card>
            <Callout
              title="Data disclaimer"
              icon={ExclamationIcon}
              color="yellow"
            >
              This chart only has access to data since August 17, 2023. It must
              also be noted that more foods are added to the database all the
              time, meaning that increased average rating does not necessarily
              correlating to individual foods getting better in quality.
            </Callout>
          </Card>
          <Card>
            <Flex justifyContent="center" className="h-full">
              <Subtitle>More features coming soon!</Subtitle>
            </Flex>
          </Card>
        </Grid>
      </div>
    </TabPanel>
  );
}
