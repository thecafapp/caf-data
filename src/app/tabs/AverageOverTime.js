import {
  CalendarIcon,
  CubeTransparentIcon,
  CursorClickIcon,
  ExclamationIcon,
  StarIcon,
} from "@heroicons/react/outline";
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
  Badge,
  List,
  ListItem,
  MultiSelect,
  MultiSelectItem,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionList,
  Icon,
} from "@tremor/react";
import { useEffect, useState } from "react";
export default function AverageOverTime() {
  const [chartData, setChartData] = useState([]);
  const [timeInterval, setTimeInterval] = useState("1");
  const [numOfDataPoints, setNumOfDataPoints] = useState(30);
  const [selectedDot, setSelectedDot] = useState(null);
  const [categories, setCategories] = useState(["Cumulative Food Rating"]);
  const [dayData, setDayData] = useState(null);

  useEffect(() => {
    console.log("CHANGE!", selectedDot);
    if (selectedDot?.eventType == "dot" && selectedDot?.date) {
      fetch(`/api/raw?file=cafdata-${selectedDot.date}.json`)
        .then((res) => res.json())
        .then((json) => {
          setDayData(json);
        });
    } else {
      setSelectedDot(null);
      setDayData(null);
    }
  }, [selectedDot]);

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

  const computeMealAvg = (ratingArray) => {
    let sum = 0,
      count = 0;
    ratingArray.forEach((obj) => {
      sum += obj.rating;
      count++;
    });
    const avg = sum / count;
    return avg ? avg.toFixed(2) : (0).toFixed(2);
  };

  const historicalFoodRating = (item, ratingArray) => {
    item = item.toLowerCase();
    const arr = ratingArray.filter((obj) => {
      let oName = obj.name;
      oName = oName.toLowerCase();
      return oName == item;
    });
    return arr ? arr[0]?.rating?.toFixed(2) || "—" : "—";
  };

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
              onValueChange={setSelectedDot}
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
            <Flex justifyContent="center" className="h-full">
              {dayData ? (
                <Flex
                  flexDirection="col"
                  alignItems="start"
                  className="self-start"
                >
                  <Title>Meals on {dayData.date.replaceAll("-", "/")}</Title>
                  <Text>{}</Text>
                  <AccordionList className="w-full mt-2">
                    {Object.keys(dayData.meals).map((key) => (
                      <Accordion key={key}>
                        <AccordionHeader>
                          {key.charAt(0).toUpperCase() + key.substring(1)}
                          <Badge
                            icon={StarIcon}
                            tooltip={`${dayData.meals[key].mealRatings.length}
                          ratings`}
                            className="ml-2"
                            color={
                              computeMealAvg(dayData.meals[key].mealRatings) ==
                                0 && "red"
                            }
                          >
                            {computeMealAvg(dayData.meals[key].mealRatings)}
                          </Badge>
                        </AccordionHeader>
                        <AccordionBody>
                          {dayData.meals[key].menu.length > 0 ? (
                            <List>
                              {dayData.meals[key].menu.map((m) => (
                                <ListItem key={m}>
                                  <span className="capitalize">{m}</span>
                                  <span>
                                    {historicalFoodRating(
                                      m,
                                      dayData.meals[key].foodRatings
                                    )}{" "}
                                    stars
                                  </span>
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Flex
                              justifyContent="center"
                              flexDirection="col"
                              className="my-1"
                            >
                              <Icon
                                icon={CubeTransparentIcon}
                                size="lg"
                                variant="light"
                                className="mb-1"
                              />
                              <Subtitle>
                                No menu available for the selected meal.
                              </Subtitle>
                            </Flex>
                          )}
                        </AccordionBody>
                      </Accordion>
                    ))}
                  </AccordionList>
                </Flex>
              ) : (
                <Flex flexDirection="col">
                  <Icon
                    icon={CursorClickIcon}
                    size="lg"
                    variant="light"
                    className="mb-1"
                  />
                  <Subtitle>Select a point to see more information</Subtitle>
                </Flex>
              )}
            </Flex>
          </Card>
          <Card className="h-max">
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
        </Grid>
      </div>
    </TabPanel>
  );
}
