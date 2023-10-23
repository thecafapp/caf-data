import {
  Card,
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

export default function FoodTable({ foods, color, title = "Foods" }) {
  return (
    <Card>
      <Title>{title}</Title>
      <Table className="mt-3">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Score</TableHeaderCell>
            <TableHeaderCell>Ratings</TableHeaderCell>
            <TableHeaderCell>ID</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {foods.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Badge color={color}>{Number(item.rating).toFixed(2)}</Badge>
              </TableCell>
              <TableCell>
                <Text>{item.ratings}</Text>
              </TableCell>
              <TableCell>
                <Text>{item._id}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
