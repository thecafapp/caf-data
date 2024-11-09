import { useState, useEffect } from "react";
import FoodTable from "../../components/FoodTable";
import RatingBadge from "../../components/RatingBadge";
import {
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Icon,
  Card,
  Flex,
  Title,
  Subtitle,
  Button,
  Select,
  SelectItem,
  SearchSelect,
  SearchSelectItem,
  Badge,
} from "@tremor/react";
import { Tooltip } from "../TremorTooltip";

export default function FoodList({
  foods,
  setFoods,
  setMeal,
  meals,
  heading,
}) {
  const [foodQuery, setFoodQuery] = useState("");
  const [searchFoods, setSearchFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState("");

  useEffect(() => {
    console.log("FOODS\n", foods);
  }, [foods])

  useEffect(() => {
    if (foodQuery) {
      fetch(`/api/foods?q=${encodeURIComponent(foodQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchFoods(data);
        });
    }
  }, [foodQuery]);

  useEffect(() => {
    if (selectedFood) {
      if (selectedFood === "create") {
        setFoods([...foods, {
          id: (Math.random() * 100000).toString(),
          name: foodQuery.toLowerCase(),
          rating: 0,
          ratings: 0
        }])
        return;
      }
      const f = [...foods, searchFoods.find((f) => f._id == selectedFood)];
      setFoods(f);
      setSelectedFood("");
    }
  }, [selectedFood]);

  const uppercaseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Card className="h-auto">
      <Flex className="gap-3">
        <Title className="w-auto whitespace-nowrap flex-1">{heading}</Title>

        {meals && (
          <Select
            className="w-max"
            icon={ClockIcon}
            defaultValue={meals[0].name}
            onValueChange={(v) => setMeal(v)}
          >
            {meals.map((m) => (
              <SelectItem value={m.name} key={m.name} className="cursor-pointer">
                {m.name}
              </SelectItem>
            ))}
          </Select>
        )}
        <SearchSelect
          className="w-max"
          placeholder="Add foods..."
          defaultValue="Breakfast"
          icon={MagnifyingGlassIcon}
          searchValue={foodQuery}
          onSearchValueChange={(q) => {
            if (q.trim() == foodQuery) return;
            setFoodQuery(q.trim());
          }}
          value={selectedFood}
          onValueChange={(f) => setSelectedFood(f)}
        >
          {searchFoods
            .filter((food) => foods.findIndex((f) => f._id == food._id) == -1)
            .map((food) => (
              <SearchSelectItem
                value={food._id}
                className="searchselectorderinvert cursor-pointer"
                key={food._id}
                icon={() => (
                  <RatingBadge
                    rating={food.rating}
                    ratingCount={food.ratings}
                    showIcon={false}
                    size="xs"
                    className="ml-2 order-last"
                  />
                )}
              >
                {uppercaseFirstLetter(food.name)}
              </SearchSelectItem>
            ))}
          {foodQuery.length > 2 && <SearchSelectItem value="create" className="cursor-pointer" icon={() => (
            <Badge
              size="xs"
              className="ml-2 order-last cursor-pointer"
              color="blue"
              tooltip="Create a new food item"
            >Create new</Badge>
          )}>{foodQuery}</SearchSelectItem>}
        </SearchSelect>
      </Flex>
      {foods.length > 0 ? (
        <FoodTable
          showId={false}
          showTitle={false}
          customLastColumn={(food) => (
            <Tooltip side="left" content="Remove from meal" triggerAsChild={true}>
              <Button
                icon={TrashIcon}
                className="float-end"
                size="xs"
                variant="secondary"
                color="red"
                onClick={() =>
                  setFoods(foods.filter((f) => f._id != food._id))
                }
              />
            </Tooltip>
          )
          }
          customLastColumnTitle=""
          foods={foods}
        ></FoodTable >
      ) : (
        <Flex justifyContent="center" flexDirection="col" className="h-full">
          <Icon
            icon={QuestionMarkCircleIcon}
            size="lg"
            variant="light"
            className="mb-1"
          />
          <Subtitle color="slate" className="text-sm mb-3">
            This meal is empty. Add some foods to get started.
          </Subtitle>
        </Flex>
      )}
    </Card >
  );
}
