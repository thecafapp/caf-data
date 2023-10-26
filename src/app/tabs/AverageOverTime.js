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
  MultiSelect,
  MultiSelectItem,
} from "@tremor/react";
import { useEffect, useState } from "react";
export default function AverageOverTime() {
  const [chartData, setChartData] = useState([]);
  const [timeInterval, setTimeInterval] = useState("1");
  const [numOfDataPoints, setNumOfDataPoints] = useState(30);
  const [chartValue, setChartValue] = useState(null);
  const [categories, setCategories] = useState(["Cumulative Food Rating"]);

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
                "Cumulative Food Rating": Number(data.foodAverage).toFixed(4),
                "Meal Rating":
                  data.mealAverage != null
                    ? Number(data.mealAverage).toFixed(4)
                    : null,
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
    if (numOfDataPoints > 2 && numOfDataPoints < 61) {
      setChartData([]);
      setTimeout(loadChart, 1000);
    }
  }, [timeInterval, numOfDataPoints]);

  return (
    <TabPanel>
      <div className="mt-6">
        <Card>
          <Flex justifyContent="between">
            <Title>Average Rating Over Time</Title>
            <Flex className="w-85">
              <NumberInput
                className="w-20 mr-2"
                max={60}
                min={2}
                error={numOfDataPoints < 2 || numOfDataPoints > 60}
                errorMessage="Please only request up to 60 data points."
                value={numOfDataPoints}
                onValueChange={setNumOfDataPoints}
              />
              <Select
                className="w-40 mr-2"
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
              <MultiSelect value={categories} onValueChange={setCategories}>
                <MultiSelectItem value="Cumulative Food Rating">
                  Cumulative Food Rating
                </MultiSelectItem>
                <MultiSelectItem value="Meal Rating">
                  Meal Rating
                </MultiSelectItem>
              </MultiSelect>
            </Flex>
          </Flex>
          <Text>recorded per day</Text>
          {chartData.length > 1 ? (
            <AreaChart
              className="h-72 mt-3"
              data={chartData}
              index="date"
              onValueChange={setChartValue}
              categories={categories}
              colors={["blue", "indigo"]}
              autoMinValue={true}
              showAnimation={true}
              connectNulls={true}
            />
          ) : (
            <Flex justifyContent="center" className="h-72 mt-3">
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
