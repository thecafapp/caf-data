"use client";
import Image from "next/image";
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
  Select,
  SelectItem,
  SearchSelect,
  SearchSelectItem,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TextInput,
} from "@tremor/react";
import { useRouter } from "next/navigation";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  ArrowLeftIcon,
  ArrowUpLeftIcon,
  CheckIcon,
  ClockIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { Calendar } from "../../components/TremorCalendar";
import TimeInput from "../../components/TimeInput";
import { useEffect, useState } from "react";
import FoodTable from "../../components/FoodTable";
import useFirebaseUser from "../../hooks/useFirebaseUser";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: "login.thecaf.app",
  projectId: "thecaf-dotme",
  storageBucket: "thecaf-dotme.appspot.com",
  appId: "1:545159752910:web:bd66c8c0e7e0b2d0d6f49f",
};
firebase.initializeApp(firebaseConfig);
export default function Admin() {
  const user = useFirebaseUser();
  const nextRouter = useRouter();
  const [date, setDate] = useState(new Date());
  const [editedMealtimeDay, setEditedMealtimeDay] = useState(null);
  const signOutUser = () => {
    firebase.auth().signOut();
    // .then(() => nextRouter.push("/login"));
  };

  useEffect(() => {
    if (user === false) {
      nextRouter.push("/login");
    }
  }, [user]);

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
          <Calendar onSelect={(d) => setDate(d)} selected={date} />
        </Card>
        <Card className="h-auto">
          <Flex className="gap-3">
            <Title className="w-auto whitespace-nowrap flex-1">
              Menu for{" "}
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Title>

            <Select className="w-max" defaultValue="Breakfast" icon={ClockIcon}>
              <SelectItem value="Breakfast">Breakfast</SelectItem>
              <SelectItem value="Lunch">Lunch</SelectItem>
              <SelectItem value="Dinner">Dinner</SelectItem>
            </Select>
            <SearchSelect
              className="w-max"
              defaultValue="Breakfast"
              icon={MagnifyingGlassIcon}
            >
              <SearchSelectItem value="Breakfast">
                Chicken Nuggets
              </SearchSelectItem>
              <SearchSelectItem value="Lunch">Pasta Salad</SearchSelectItem>
              <SearchSelectItem value="Dinner">
                Mac & Cheese Bowl
              </SearchSelectItem>
            </SearchSelect>
          </Flex>
          <FoodTable
            showId={false}
            showTitle={false}
            customLastColumn={(food) => (
              <>
                <Button
                  icon={TrashIcon}
                  className="float-end"
                  size="xs"
                  variant="secondary"
                  color="red"
                >
                  Remove from meal
                </Button>
              </>
            )}
            customLastColumnTitle=""
            foods={[
              { name: "Waffles", rating: 4, ratings: 3, _id: 302 },
              { name: "Breakfast Bowl", rating: 4.7, ratings: 3, _id: 305 },
              { name: "Egg Drop Soup", rating: 3.6, ratings: 3, _id: 307 },
              { name: "Boiled Eggs", rating: 3, ratings: 3, _id: 300 },
            ]}
          ></FoodTable>
        </Card>
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
