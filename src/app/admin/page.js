"use client";
import Image from "next/image";
import useSWR from "swr";
import {
  Flex,
  Title,
  Subtitle,
  Badge,
  Text,
  Button,
  Card,
  Icon,
  List,
  ListItem,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TextInput,
} from "@tremor/react";
import { useRouter, useSearchParams } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  ArrowLeftIcon,
  ArrowUpLeftIcon,
  CheckIcon,
  CubeTransparentIcon,
  PlusIcon,
  TrashIcon,
  UserMinusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Calendar } from "../../components/TremorCalendar";
import TimeInput from "../../components/TimeInput";
import { useEffect, useState } from "react";
import FoodList from "../../components/admin/FoodList";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import useHasChanged from "../../hooks/useHasChanged";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "login.thecaf.app",
  projectId: "thecaf-dotme",
  storageBucket: "thecaf-dotme.appspot.com",
  appId: "1:545159752910:web:bd66c8c0e7e0b2d0d6f49f",
};
firebase.initializeApp(firebaseConfig);
export default function Admin() {
  const params = useSearchParams();
  const [date, setDate] = useState(
    params.get("date") ? new Date(params.get("date")) : new Date()
  );
  const { data, isLoading, mutate } = useSWR(
    `/api/meals?date=${date.toLocaleDateString("en-CA")}`,
    (url) => fetch(url).then((res) => res.json())
  );
  const user = useFirebaseUser();
  const nextRouter = useRouter();
  const [editedMealtimeDay, setEditedMealtimeDay] = useState(null);
  const [mealtime, setMealtime] = useState(0);
  const [updated, setUpdated] = useState(null);
  const [mealFoods, setMealFoods] = useState([]);

  const datahasChanged = useHasChanged(data);

  const signOutUser = () => {
    firebase.auth().signOut();
  };

  useEffect(() => {
    if (!!data && mealtime != undefined) {
      fetch("/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.meals[mealtime].menu),
      })
        .then((res) => res.json())
        .then((m) => setMealFoods(m));
    }
  }, [mealtime, data]);

  useEffect(() => {
    if (user === false) {
      nextRouter.push("/login");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        mutate(async () => {
          await fetch("/api/meals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-firebase-token": token,
            },
            body: JSON.stringify(updated),
          });
        });
      });
    }
  }, [updated]);

  const compareObjects = (obj1, obj2) => {
    if (Array.isArray(obj1)) {
      obj1 = obj1.sort();
      obj2 = obj2.sort();
    }
    return typeof obj1 === "object" && Object.keys(obj1).length > 0
      ? Object.keys(obj1).length === Object.keys(obj2).length &&
          Object.keys(obj1).every((p) => compareObjects(obj1[p], obj2[p]))
      : obj1 === obj2;
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
        <Flex>
          <div>
            <Flex justifyContent="start">
              <Title className="mr-2">The Caf App</Title>
              <Badge color="red" size="xs">
                ADMIN
              </Badge>
            </Flex>
            <Text>Administrator Dashboard</Text>
          </div>
        </Flex>
        <Button
          variant="secondary"
          color="gray"
          onClick={() => nextRouter.push("/")}
          icon={ArrowUpLeftIcon}
          tooltip="Go back to the data dashboard"
          className="mr-2"
        >
          Back to Data
        </Button>
        <Button
          variant="secondary"
          color="gray"
          onClick={() => signOutUser()}
          icon={UserMinusIcon}
          tooltip="Sign out of the admin panel"
        >
          Sign Out
        </Button>
      </Flex>
      <Flex className="mt-6 gap-6 items-stretch">
        <Card className="w-max">
          <Calendar
            onSelect={(d) => {
              if (d < new Date() - 86400000) {
                nextRouter.push(
                  "/#meals?date=" +
                    d
                      .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replaceAll("/", "-")
                );
                return;
              } else {
                setDate(d);
              }
            }}
            selected={date}
          />
        </Card>
        {isLoading ? (
          <Card>
            <Flex
              justifyContent="center"
              flexDirection="col"
              className="h-72 mt-3"
            >
              <Icon icon={Cog6ToothIcon} size="lg" className="animate-spin" />
              <Subtitle>Loading data...</Subtitle>
            </Flex>
          </Card>
        ) : (
          <FoodList
            heading={`Menu for
          ${date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}`}
            foods={mealFoods}
            setFoods={(arr) => {
              const meals = [...data.meals];
              meals[mealtime].menu = arr.map((f) => f.name);
              setUpdated({ ...data, meals });
            }}
            meals={data?.meals}
            setMeal={(name) => {
              setMealtime(data.meals.findIndex((m) => m.name == name));
            }}
          />
        )}
      </Flex>
      <Flex className="mt-6 gap-6 items-stretch">
        <Card>
          {!editedMealtimeDay ? (
            <>
              <Title>Recurring Mealtimes</Title>
              <List className="mt-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <ListItem key={day}>
                    <span>{day}</span>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setEditedMealtimeDay(day)}
                    >
                      Edit
                    </Button>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <>
              <Flex className="gap-3">
                <Title className="flex-grow">
                  Edit {editedMealtimeDay} Mealtimes
                </Title>
                <Button
                  size="xs"
                  variant="secondary"
                  icon={ArrowLeftIcon}
                  onClick={() => setEditedMealtimeDay(null)}
                >
                  View days
                </Button>
                <Button
                  size="xs"
                  icon={CheckIcon}
                  onClick={() => setEditedMealtimeDay(null)}
                >
                  Save changes
                </Button>
              </Flex>
              <Table className="mt-3">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Start Time</TableHeaderCell>
                    <TableHeaderCell>End Time</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextInput defaultValue="Breakfast"></TextInput>
                    </TableCell>
                    <TableCell>
                      <TimeInput value="7:00 AM"></TimeInput>
                    </TableCell>
                    <TableCell>
                      <TimeInput value="9:00 AM"></TimeInput>
                    </TableCell>
                    <TableCell>
                      <Icon
                        icon={TrashIcon}
                        color="red"
                        tooltip="Delete mealtime"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <TextInput defaultValue="Lunch"></TextInput>
                    </TableCell>
                    <TableCell>
                      <TimeInput value="10:30 AM"></TimeInput>
                    </TableCell>
                    <TableCell>
                      <TimeInput value="2:00 PM"></TimeInput>
                    </TableCell>
                    <TableCell>
                      <Icon
                        icon={TrashIcon}
                        color="red"
                        tooltip="Delete mealtime"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <TextInput defaultValue="Dinner"></TextInput>
                    </TableCell>
                    <TableCell>
                      <TimeInput value="4:30 AM"></TimeInput>
                    </TableCell>
                    <TableCell>
                      <TimeInput value="7:00 PM"></TimeInput>
                    </TableCell>
                    <TableCell>
                      <Icon
                        icon={TrashIcon}
                        color="red"
                        tooltip="Delete mealtime"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button icon={PlusIcon} className="mt-2 ml-4">
                Add mealtime
              </Button>
            </>
          )}
        </Card>
        <Card>
          <Title>Mealtime Exception</Title>
          <Flex justifyContent="center" flexDirection="col" className="h-full">
            <Icon
              icon={CubeTransparentIcon}
              size="lg"
              variant="light"
              className="mb-1"
            />
            <Subtitle color="slate" className="text-sm mb-3">
              No custom mealtime is set for the selected date.
            </Subtitle>
            <Button className="mb-6">Add an exception</Button>
          </Flex>
        </Card>
      </Flex>
    </main>
  );
}
