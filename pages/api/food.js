export default async function handler(req, res) {
    let date = new Date();
    let documentFetch, documentName;
    if (req.query.date) {
      date = new Date(req.query.date);
      const dateFormatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(date)
        .replace(/\//g, "-");
      documentName = `cafdata-${dateFormatted}.json`;
      documentFetch = await fetch(`${process.env.CAFBUCKET}/${documentName}`);
    } else {
      const listFetch = await fetch(
        `${process.env.CAFBUCKET}?fields=timeCreated`
      );
      const { objects: list } = await listFetch.json();
      if (req.query.offset) {
        try {
          documentName = list[list.length - (Number(req.query.offset) + 1)].name;
        } catch {
          return res
            .setHeader("Cache-Control", "max-age=3600, public")
            .status(404)
            .json({ error: "No data for this day" });
        }
        documentFetch = await fetch(`${process.env.CAFBUCKET}/${documentName}`);
      } else {
        documentName = list[list.length - 1].name;
        documentFetch = await fetch(`${process.env.CAFBUCKET}/${documentName}`);
      }
    }
    if (documentFetch.status != 200) {
      if (req.query.date) {
        return res
          .setHeader("Cache-Control", "max-age=3600, public")
          .status(404)
          .json({ error: "No data for this day" });
      } else {
        return res
          .setHeader("Cache-Control", "max-age=3600, public")
          .status(404)
          .json({ error: "Unknown error" });
      }
    }
    const json = await documentFetch.json();
    const keys = Object.keys(json);
    const lastMeal = json[keys[keys.length - 1]];
    let rating = 0;
    lastMeal.foodRatings.forEach((obj) => {
      sum += obj.rating;
    });
    const cacheLength = req.query.offset > 0 ? "2630000" : "3600";
    return res
      .setHeader("Cache-Control", `max-age=${cacheLength}, public`)
      .status(200)
      .json({
        rating: avgFood,
        date: documentName.split("cafdata-")[1].split(".json")[0],
      });
  }
  