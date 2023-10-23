"use client";

import {
  Card,
  Grid,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Metric,
  Flex,
  Badge,
} from "@tremor/react";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import FoodTable from "./components/TopFoodsTable";

export default function Home() {
  const [mostPopularItem, setMostPopularItem] = useState(null);
  const [popularFoods, setPopularFoods] = useState([]);
  const [worstItem, setWorstItem] = useState(null);
  const [worstFoods, setWorstFoods] = useState([]);
  const [dayAverage, setDayAverage] = useState(null);
  useEffect(() => {
    fetch(`https://thecaf.app/api/foods`)
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

    fetch(`/api/average?date=10-22-2023`)
      .then((res) => res.json())
      .then((json) => {
        setDayAverage(json.average);
      });
  }, []);
  return (
    <main className="p-12 max-w-screen-xl m-auto">
      <Flex justifyContent="start">
        <Image
          src="https://thecaf.app/caf.svg"
          width={50}
          height={50}
          alt="The Caf App logo"
          className="contrast-0	brightness-200 mr-5"
        ></Image>
        <div>
          <Title>Caf Data</Title>
          <Text>
            This dashboard allows you to view rating data for{" "}
            <a
              href="https://thecaf.app"
              target="_blank"
              className="text-blue-500"
            >
              The Caf App
            </a>
            .
          </Text>
        </div>
      </Flex>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Details</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
              <Card>
                {mostPopularItem && (
                  <>
                    <Flex>
                      <Text>Most Popular Meal Item</Text>
                      <Badge icon={StarIcon}>
                        {Number(mostPopularItem.rating).toFixed(2)}
                      </Badge>
                    </Flex>
                    <Metric>{mostPopularItem.name}</Metric>
                    <Text>
                      {mostPopularItem.ratings} ratings |{" "}
                      <a href="#" className="text-blue-500">
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
                      <Text>Least Popular Meal Item</Text>
                      <Badge icon={StarIcon}>
                        {Number(worstItem.rating).toFixed(2)}
                      </Badge>
                    </Flex>
                    <Metric>{worstItem.name}</Metric>
                    <Text>
                      {worstItem.ratings} ratings |{" "}
                      <a href="#" className="text-blue-500">
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
                      <Text>Average of Ratings</Text>
                      <Badge icon={ArrowRightIcon} color="yellow">
                        progress
                      </Badge>
                    </Flex>
                    <Metric>{Number(dayAverage).toFixed(2)}</Metric>
                    <Text>
                      cumulative average |{" "}
                      <a href="#" className="text-blue-500">
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
              />
            </div>
            <div className="mt-6">
              <FoodTable
                title="Worst Foods All Time"
                foods={worstFoods}
                color="red"
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">
              <Card></Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
