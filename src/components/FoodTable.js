import {
  Title,
  Text,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
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
            <TableHeaderCell>Ratings</TableHeaderCell>
            {showId && <TableHeaderCell>ID</TableHeaderCell>}
            {!!customLastColumn && (
              <TableHeaderCell>{customLastColumnTitle}</TableHeaderCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {foods.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="capitalize">{item.name}</TableCell>
              <TableCell>
                <RatingBadge rating={item.rating} ratingCount={item.ratings} />
              </TableCell>
              <TableCell>
                <Text>{item.ratings}</Text>
              </TableCell>
              {showId && (
                <TableCell>
                  <Text>{item._id}</Text>
                </TableCell>
              )}
              {!!customLastColumn && (
                <TableCell>{customLastColumn(item)}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
