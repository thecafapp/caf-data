import { Badge } from "@tremor/react";
import ratingToColor from "../lib/ratingToColor";
import { StarIcon } from "@heroicons/react/24/outline";
export default function RatingBadge({
  rating,
  ratingCount,
  size,
  className = "",
  decimalPoints = 2,
  showIcon = true,
}) {
  return (
    <Badge
      icon={showIcon ? StarIcon : undefined}
      color={ratingToColor(rating)}
      size={size}
      className={className}
      tooltip={
        ratingCount === 0
          ? "No ratings yet"
          : (ratingCount != undefined ? `Based on ${ratingCount} rating${rating > 1 ? "s" : ""}` : undefined)
      }
    >
      {rating != undefined ? Number(rating).toFixed(decimalPoints) : "--"}
    </Badge>
  );
}
