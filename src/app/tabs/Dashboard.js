import { useEffect, useState } from "react";
import {
  Metric,
  Badge,
  BadgeDelta,
  Flex,
  Text,
  Card,
  TabPanel,
  Grid,
} from "@tremor/react";
import { StarIcon } from "@heroicons/react/outline";
import FoodTable from "../components/FoodTable";

export default function Dashboard() {
  const [mostPopularItem, setMostPopularItem] = useState(null);
  const [popularFoods, setPopularFoods] = useState([]);
  const [worstItem, setWorstItem] = useState(null);
  const [worstFoods, setWorstFoods] = useState([]);
  const [dayAverage, setDayAverage] = useState(null);
  const [avgDelta, setAvgDelta] = useState({
    name: "unchanged",
    amount: "0.00",
  });
  useEffect(() => {
    fetch(`https://thecaf.app/api/foods?method=highest`)
      .then((res) => res.json())
      .then((json) => {
        setMostPopularItem(json.topFoods[0]);
        setPopularFoods(json.topFoods);
      });
    fetch(`https://thecaf.app/api/foods?method=lowest`)
      .then((res) => res.json())
      .then((json) => {
        setWorstItem(json.worstFoods[0]);
        setWorstFoods(json.worstFoods);
      });

    let todayAverage, yesterdayAverage;
    fetch(`/api/average`)
      .then((res) => res.json())
      .then((json) => {
        todayAverage = json.foodAverage;
        setDayAverage(json.foodAverage);
      });
    fetch(`/api/average?offset=1`)
      .then((res) => res.json())
      .then((json) => {
        yesterdayAverage = json.foodAverage;
        if (todayAverage > yesterdayAverage) {
          setAvgDelta({
            amount: Math.abs(todayAverage - yesterdayAverage).toFixed(2),
            name: "increase",
          });
        } else if (yesterdayAverage > todayAverage) {
          setAvgDelta({
            amount: Math.abs(todayAverage - yesterdayAverage).toFixed(2),
            name: "decrease",
          });
        } else {
          setAvgDelta({
            amount: "0.00",
            name: "unchanged",
          });
        }
      });
  }, []);
  return (
    <TabPanel>
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
        <Card>
          {mostPopularItem && (
            <>
              <Flex>
                <Text>Most Popular Item</Text>
                <Badge icon={StarIcon}>
                  {Number(mostPopularItem.rating).toFixed(2)}
                </Badge>
              </Flex>
              <Metric className="capitalize">{mostPopularItem.name}</Metric>
              <Text>
                {mostPopularItem.ratings} ratings |{" "}
                <a href="#top-foods" className="text-blue-500">
                  see more
                </a>
              </Text>
            </>
          )}
        </Card>
        <Card>
          {worstItem && (
            <>
              <Flex>
                <Text>Least Popular Item</Text>
                <Badge icon={StarIcon}>
                  {Number(worstItem.rating).toFixed(2)}
                </Badge>
              </Flex>
              <Metric className="capitalize">{worstItem.name}</Metric>
              <Text>
                {worstItem.ratings} ratings |{" "}
                <a href="#worst-foods" className="text-blue-500">
                  see more
                </a>
              </Text>
            </>
          )}
        </Card>
        <Card>
          {dayAverage && avgDelta && (
            <>
              <Flex>
                <Text>Average Rating</Text>
                <BadgeDelta deltaType={avgDelta.name}>
                  {avgDelta.amount}
                </BadgeDelta>
              </Flex>
              <Metric>{Number(dayAverage).toFixed(2)}</Metric>
              <Text>
                cumulative since Aug 2023 |{" "}
                <a href="#/average" className="text-blue-500">
                  see more
                </a>
              </Text>
            </>
          )}
        </Card>
      </Grid>
      <div className="mt-6">
        <FoodTable
          title="Top Foods All Time"
          foods={popularFoods}
          color="green"
          id="top-foods"
        />
      </div>
      <div className="mt-6">
        <FoodTable
          title="Worst Foods All Time"
          foods={worstFoods}
          color="red"
          id="worst-foods"
        />
      </div>
    </TabPanel>
  );
}
