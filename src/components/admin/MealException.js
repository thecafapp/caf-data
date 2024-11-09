import { useState } from "react";
import { Card, Title, Flex, Subtitle, Button, Icon, TextInput, Callout } from "@tremor/react";
import { Drawer, DrawerBody, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../../components/TremorDrawer";
import { PlusIcon, ArrowDownIcon, CubeTransparentIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Label } from "../../components/TremorLabel";
import TimeInput from "../TimeInput";

export default function MealException({ meal, date }) {
    const [exception, setException] = useState(null);
    const [exceptionInputs, setExceptionInputs] = useState({
        name: "",
        start: "",
        end: ""
    })
    const [exceptionFormOpen, setExceptionFormOpen] = useState(false);

    return <>
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
                <Button className="mb-6" onClick={() => {
                    setExceptionInputs({
                        name: meal.name,
                        start: new Date(meal.start).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' }),
                        end: new Date(meal.end).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })
                    });
                    setExceptionFormOpen(true)
                }} icon={PlusIcon}>Add an exception</Button>
            </Flex> :
                <>
                    <Card className="mt-4 opacity-65">
                        <p className="italic">{meal.name} from {meal.times}</p>
                    </Card>
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
                        <Button variant="secondary" icon={TrashIcon} onClick={() => {
                            setExceptionInputs({ name: "", start: "", end: "" });
                            setException(null);
                        }}>Delete</Button>
                    </Flex>
                </>}
        </Card>
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
                    <DrawerDescription className="mt-1 text-sm">
                        {meal.name} on {date}
                    </DrawerDescription>
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
    </>
}