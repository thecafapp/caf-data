import {
  Title,
  Text,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";
import RatingBadge from "../components/RatingBadge";

export default function FoodTable({
  foods,
  title = "Foods",
  showId = true,
  showTitle = true,
  customLastColumn = null,
  customLastColumnTitle = "",
}) {
  return (
    <>
      {showTitle && <Title>{title}</Title>}
      <Table className="mt-3">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Score</TableHeaderCell>
            {showId && <TableHeaderCell>ID</TableHeaderCell>}
            {!!customLastColumn && (
              <TableHeaderCell>{customLastColumnTitle}</TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {foods.map((item) => (
            <TableRow key={item._id + Math.random()}>
              <TableCell className="capitalize py-2 dark:text-slate-400">{item.name}</TableCell>
              <TableCell className="py-2">
                <RatingBadge rating={item.rating} ratingCount={item.ratings} />
              </TableCell>
              {showId && (
                <TableCell className="py-2">
                  <Text>{item._id}</Text>
                </TableCell>
              )}
              {!!customLastColumn && (
                <TableCell className="py-2">{customLastColumn(item)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
