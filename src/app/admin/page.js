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
  Callout,
} from "@tremor/react";
import { useRouter } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  ArrowLeftIcon,
  ArrowUpLeftIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  UserMinusIcon,
  Cog6ToothIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { Calendar } from "../../components/TremorCalendar";
import { Tooltip } from "../../components/TremorTooltip";
import TimeInput from "../../components/TimeInput";
import { useEffect, useState } from "react";
import FoodList from "../../components/admin/FoodList";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import useHasChanged from "../../hooks/useHasChanged";
import MealException from "../../components/admin/MealException";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "login.thecaf.app",
  projectId: "thecaf-dotme",
  storageBucket: "thecaf-dotme.appspot.com",
  appId: "1:545159752910:web:bd66c8c0e7e0b2d0d6f49f",
};
firebase.initializeApp(firebaseConfig);

export default function Admin({ searchParams }) {
  const params = searchParams;
  const [date, setDate] = useState(
    params?.data ? new Date(params?.date) : new Date()
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
    document.querySelector("html").classList.toggle(
      'dark',
      localStorage.getItem("theme") === 'dark' || (!(localStorage.getItem("theme")) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }, []);

  useEffect(() => {
    console.log('Data change\n', data);
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
    console.log("UPDATED", updated);
    if (user) {
      user.getIdToken().then((token) => {
        console.log("Mutate");
        mutate(async () => {
          await fetch("/api/meals", {
            method: "POST",
            cache: 'no-store',
            headers: {
              "Content-Type": "application/json",
              "x-firebase-token": token,
            },
            body: JSON.stringify(updated),
          });
        }, {
          optimisticData: updated,
          revalidate: true
        });
      });
    }
  }, [updated]);

  const changeTheme = () => {
    if (localStorage.getItem("theme") === "dark") {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
    document.querySelector("html").classList.toggle(
      'dark',
      localStorage.getItem("theme") === 'dark' || (!(localStorage.getItem("theme")) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }

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
          className="mr-2"
        >
          Back to Data
        </Button>
        <Button
          variant="secondary"
          color="gray"
          onClick={signOutUser}
          icon={UserMinusIcon}
          className="mr-2"
        >
          Sign Out
        </Button>
        <Tooltip side="bottom" content="Change theme" triggerAsChild={true}>
          <Button
            variant="secondary"
            color="gray"
            onClick={changeTheme}
            icon={MoonIcon}
          >
          </Button>
        </Tooltip>
      </Flex>
      <Flex className="mt-6 gap-6 items-stretch">
        <Card className="w-max">
          <Calendar
            fromDate={new Date()}
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
        {!data && isLoading ? (
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
              console.log(arr);
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
        <Card className="w-3/5">
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
                      <TimeInput value="7:00 AM" />
                    </TableCell>
                    <TableCell>
                      <TimeInput value="9:00 AM" />
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
                      <TimeInput value="10:30 AM" />
                    </TableCell>
                    <TableCell>
                      <TimeInput value="2:00 PM" />
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
                      <TimeInput value="4:30 AM" />
                    </TableCell>
                    <TableCell>
                      <TimeInput value="7:00 PM" />
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
        {!!data && <MealException meal={data.meals[mealtime]} date={data.date} />}
      </Flex>
    </main>
  );
}
