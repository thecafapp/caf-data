"use client";

import {
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanels,
  Flex,
  Badge,
} from "@tremor/react";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import useWindowHash from "../hooks/useWindowHash";
import Dashboard from "../tabs/Dashboard";
import { HomeIcon } from "@heroicons/react/24/outline";
import ComingSoon from "../tabs/ComingSoon";
import AverageOverTime from "../tabs/AverageOverTime";
import MealHistory from "../tabs/MealHistory";
import { useRouter } from "next/navigation";

export default function Home() {
  const nextRouter = useRouter();

  const dashboardTab = useRef(null);
  const averageTab = useRef(null);
  const foodTab = useRef(null);
  const mealsTab = useRef(null);

  const [tabIndex, setTabIndex] = useState(null);
  const hash = useWindowHash();

  useEffect(() => {
    route(hash);
  }, [hash]);

  useEffect(() => {
    document.querySelector("html").classList.toggle(
      'dark',
      localStorage.getItem("theme") === 'dark' || (!(localStorage.getItem("theme")) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    route(window.location.hash);
  }, []);

  const route = (hashToUse) => {
    switch (hashToUse) {
      case "#/average":
        setTabIndex(1);
        if (averageTab.current) averageTab.current.click();
        break;
      case "#/food":
        if (foodTab.current) foodTab.current.click();
        setTabIndex(2);
        break;
      case "#/meals":
        setTabIndex(3);
        if (mealsTab.current) mealsTab.current.click();
        break;
      default:
        setTabIndex(0);
    }
  };

  const handleIndexChange = (index) => {
    setTabIndex(index);
    switch (index) {
      case 0:
        window.location.hash = "#/dashboard";
        break;
      case 1:
        window.location.hash = "#/average";
        break;
      case 2:
        window.location.hash = "#/food";
        break;
      case 3:
        window.location.hash = "#/meals";
        break;
      default:
        window.location.hash = "#/unknown";
    }
  };

  return (
    <main className="p-8 max-w-screen-xl m-auto">
      <Flex justifyContent="start">
        <Image
          src="https://thecaf.app/caf.svg"
          width={50}
          height={50}
          alt="The Caf App logo"
          className="contrast-0	brightness-200 mr-5"
        ></Image>
        <div>
          <Flex justifyContent="start">
            <Title className="mr-2">Caf Data</Title>
            <Badge
              color="yellow"
              size="xs"
              tooltip="This software is still in development and some features may be buggy or unfinished."
            >
              BETA
            </Badge>
          </Flex>
          <Text>
            A dashboard for historical rating data from{" "}
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

      {tabIndex !== null && (
        <TabGroup
          className="mt-6"
          tabIndex={tabIndex}
          onIndexChange={handleIndexChange}
          defaultIndex={tabIndex}
        >
          <TabList>
            <Tab ref={dashboardTab} icon={HomeIcon}>
              Dashboard
            </Tab>
            <Tab ref={averageTab}>Ratings Over Time</Tab>
            <Tab ref={foodTab}>Individual Foods</Tab>
            <Tab ref={mealsTab}>Meal History</Tab>
            <Tab onClick={() => nextRouter.push("/login")}>Admin</Tab>
          </TabList>
          <TabPanels>
            <Dashboard />
            <AverageOverTime />
            <ComingSoon />
            <MealHistory />
          </TabPanels>
        </TabGroup>
      )}
    </main>
  );
}
//
