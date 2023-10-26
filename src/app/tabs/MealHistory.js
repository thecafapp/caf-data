import {
  CalendarIcon,
  DownloadIcon,
  ViewListIcon,
  ExclamationIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import {
  TabPanel,
  Card,
  Select,
  SelectItem,
  Flex,
  List,
  ListItem,
  Title,
  Text,
  Subtitle,
  Button,
  Grid,
  Col,
  Metric,
  Badge,
  Callout,
  CategoryBar,
} from "@tremor/react";
import { useEffect, useState } from "react";

export default function MealHistory() {
  const [dates, setDates] = useState([]);
  const [day, setDay] = useState(null);
  const [mealOptions, setMealOptions] = useState([]);
  const [meal, setMeal] = useState(null);
  const [dayData, setDayData] = useState(null);

  useEffect(() => {
    fetch("/api/raw?item=list")
      .then((res) => res.json())
      .then((json) => {
        json.forEach((doc) => {
          doc.date = new Date(doc.name.split("cafdata-")[1].split(".json")[0]);
        });
        json.sort((a, b) => {
          return b.date - a.date;
        });
        setDates(json);
      });
  }, []);

  useEffect(() => {
    if (day) {
      fetch(`/api/raw?file=${day}`)
        .then((res) => res.json())
        .then((json) => {
          setMealOptions(Object.keys(json.meals));
          setDayData(json);
        });
    }
  }, [day]);

  const downloadData = () => {
    const link = document.createElement("a");
    link.href = `/api/raw?file=${day}`;
    link.download = day;
    link.click();
  };

  const computeMealAvg = (ratingArray) => {
    let sum = 0,
      count = 0;
    ratingArray.forEach((obj) => {
      sum += obj.rating;
      count++;
    });
    return (sum / count).toFixed(2);
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
      <Grid numItemsLg={6} className="gap-6 mt-6">
        <Col numColSpanLg={2}>
          <div className="space-y-6">
            <Card>
              <Select
                onValueChange={setDay}
                className="mb-2"
                icon={CalendarIcon}
                placeholder="Select date..."
              >
                {dates.map((d) => (
                  <SelectItem value={d.name}>
                    {d.date.toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </Select>
              <Select
                placeholder="Select meal..."
                icon={ViewListIcon}
                disabled={!day}
                onValueChange={setMeal}
              >
                {mealOptions.map((m) => (
                  <SelectItem value={m}>
                    {m.charAt(0).toUpperCase() + m.substring(1)}
                  </SelectItem>
                ))}
              </Select>
            </Card>
            {dayData && meal && (
              <Card>
                <Flex justifyContent="between">
                  <Text>Meal Rating</Text>
                  <Badge>
                    {dayData.meals[meal].mealRatings.length} ratings
                  </Badge>
                </Flex>
                <Metric>
                  {computeMealAvg(dayData.meals[meal].mealRatings)} stars
                </Metric>
                <CategoryBar
                  showAnimation={true}
                  showLabels={false}
                  values={[20, 20, 20, 20, 20]}
                  markerValue={
                    computeMealAvg(dayData.meals[meal].mealRatings) * 20
                  }
                  className="mt-2"
                />
              </Card>
            )}
            <Card>
              <Callout
                title="Data disclaimer"
                icon={ExclamationIcon}
                color="yellow"
              >
                Ratings shown in the menu are recorded as of the meal date. To
                get up-to-date food ratings, use the{" "}
                <a href="#/food" className="underline">
                  Individual Foods
                </a>{" "}
                tab.
              </Callout>
            </Card>
          </div>
        </Col>

        <Col numColSpanLg={4}>
          <Card className="h-full relative">
            {meal && dayData ? (
              <>
                <Text>Menu</Text>
                <Title>
                  <span className="capitalize">{meal}</span> on{" "}
                  {dates
                    .find((d) => d.name === day)
                    .date.toLocaleString("en-US", {
                      weekday: "long",
                    })}
                </Title>
                <List className="mb-10">
                  {dayData.meals[meal].menu.map((m) => (
                    <ListItem key={m}>
                      <span className="capitalize">{m}</span>
                      <span>
                        {historicalFoodRating(
                          m,
                          dayData.meals[meal].foodRatings
                        )}{" "}
                        stars
                      </span>
                    </ListItem>
                  ))}
                </List>
                <Flex className="bottom-5 absolute" justifyContent="start">
                  <Button
                    icon={DownloadIcon}
                    iconPosition="right"
                    variant="secondary"
                    onClick={downloadData}
                    className="mr-3"
                  >
                    Download data (JSON)
                  </Button>
                  <Button
                    icon={ClockIcon}
                    iconPosition="right"
                    disabled
                    variant="primary"
                    tooltip="Coming soon..."
                  >
                    Open food history
                  </Button>
                </Flex>
              </>
            ) : (
              <Flex justifyContent="center" className="h-full">
                <Subtitle>Select a date and meal to get started</Subtitle>
              </Flex>
            )}
          </Card>
        </Col>
      </Grid>
    </TabPanel>
  );
}
