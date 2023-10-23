export default async function handler(req, res) {
  let date = new Date();
  if (req.query.date) {
    date = new Date(req.query.date);
  }
  const dateFormatted = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replace(/\//g, "-");
  const documentFetch = await fetch(
    `https://objectstorage.us-ashburn-1.oraclecloud.com/p/nyWTgMiuwyM7ad_-U0mT0LZIRCpLijIJ-atkcnVtIs5ny9ceQ7IGr5YTXp_LwlOh/n/idosm4hvvvj8/b/cafapp-data-bucket/o/cafdata-${dateFormatted}.json`
  );
  if (documentFetch.status != 200) {
    return res
      .setHeader("Cache-Control", "max-age=3600, public")
      .status(404)
      .json({ error: "No data for this day" });
  }
  const json = await documentFetch.json();
  const keys = Object.keys(json);
  const lastMeal = json[keys[keys.length - 1]];
  let sum = 0;
  lastMeal.foodRatings.forEach((obj) => {
    sum += obj.rating;
  });
  const avg = sum / lastMeal.foodRatings.length;
  return res
    .setHeader("Cache-Control", "max-age=7200, public")
    .status(200)
    .json({ average: avg });
}
