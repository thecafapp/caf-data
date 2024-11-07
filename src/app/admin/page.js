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
  CubeTransparentIcon,
  PlusIcon,
  TrashIcon,
  UserMinusIcon,
  Cog6ToothIcon,
  MoonIcon,
  ArrowDownIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../../components/TremorDrawer";
import { Calendar } from "../../components/TremorCalendar";
import { Tooltip } from "../../components/TremorTooltip";
import TimeInput from "../../components/TimeInput";
import { useEffect, useState } from "react";
import FoodList from "../../components/admin/FoodList";
import useFirebaseUser from "../../hooks/useFirebaseUser";
import useHasChanged from "../../hooks/useHasChanged";
import { Label } from "../../components/TremorLabel";
import { CardHeader } from "@nextui-org/react";
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
  const [exception, setException] = useState(null);
  const [exceptionInputs, setExceptionInputs] = useState({
    name: "",
    start: "",
    end: ""
  })
  const [exceptionFormOpen, setExceptionFormOpen] = useState(false);

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
        <Card className="w-2/5">
          <Title>Mealtime Exception</Title>
          {!exception ? <Flex justifyContent="center" flexDirection="col" className="h-full">
            <Icon
              icon={CubeTransparentIcon}
              size="lg"
              variant="light"
              className="mb-1"
            />
            <Subtitle color="slate" className="text-sm mb-3">
              The selected meal has not been customized.
            </Subtitle>
            {!!data && <Button className="mb-6" onClick={() => {
              setExceptionInputs({
                name: data.meals[mealtime].name,
                start: new Date(data.meals[mealtime].start).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
                end: new Date(data.meals[mealtime].end).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })
              });
              setExceptionFormOpen(true)
            }}>Add an exception</Button>}
          </Flex> :
            <>
              {!!data && <Card className="mt-4 opacity-65">
                <p className="italic">{data.meals[mealtime].name} from {data.meals[mealtime].times}</p>
              </Card>}
              <Icon
                icon={ArrowDownIcon}
                size="lg"
                className="my-4 mx-auto w-full"
                variant="simple"
              />
              <Card color="blue">
                <p className="font-bold">{exception.name} from {exception.start} - {exception.end}</p>
              </Card>
              <Flex className="mt-4 items-center justify-center gap-2" alignItems="center">
                <Button variant="primary" icon={PencilIcon} onClick={() => setExceptionFormOpen(true)}>Edit</Button>
                <Button variant="secondary" icon={TrashIcon} onClick={() => setExceptionFormOpen(true)}>Delete</Button>
              </Flex>
            </>}
        </Card>
      </Flex>
      <Drawer
        open={exceptionFormOpen}
        onOpenChange={(modalOpened) => {
          if (!modalOpened) {
            setExceptionFormOpen(false);
          }
        }}
      >
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Exception editor</DrawerTitle>
            {!!data && <DrawerDescription className="mt-1 text-sm">
              {data.meals[mealtime].name} on {data.date}
            </DrawerDescription>}
          </DrawerHeader>
          <DrawerBody>
            <Label htmlFor="exceptionMealName">Meal name</Label>
            <TextInput name="exceptionMealName" placeholder="Meal name" value={exceptionInputs.name} onValueChange={(v) => setExceptionInputs({ ...exceptionInputs, name: v })} />
            <div className="grid grid-cols-2 mt-4 mb-4 gap-x-4">
              <Label htmlFor="exceptionStart" className="mb-1">Start Time</Label>
              <Label htmlFor="exceptionEnd" className="mb-1">End Time</Label>
              <TimeInput name="exceptionStart" value={exceptionInputs.start} onChange={(e) => setExceptionInputs({ ...exceptionInputs, start: e.target.value })} />
              <TimeInput name="exceptionEnd" value={exceptionInputs.end} onChange={(e) => setExceptionInputs({ ...exceptionInputs, end: e.target.value })} />
            </div>
            <Callout title="About exceptions" color="yellow">
              Exceptions allow changing meal times and names on specific dates.  These are designed to override regular meals, and if there is to be a permanent change in schedule or naming you should use the Recurring Mealtimes panel.
            </Callout>
          </DrawerBody>
          <DrawerFooter className="mt-6">
            <DrawerClose asChild>
              <Button
                className="mt-2 w-full sm:mt-0 sm:w-fit"
                variant="secondary"
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button className="w-full sm:w-fit" onClick={() => {
              setException(exceptionInputs);
              setExceptionFormOpen(false);
            }}>
              Save exception
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
