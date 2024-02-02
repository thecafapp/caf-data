export default async function handler(req, res) {
  let date = new Date();
  let documentFetch, documentName;
  if (req.query.item === "list") {
    documentFetch = await fetch(`${process.env.CAFBUCKET}?fields=timeCreated`);
  } else if (req.query.item === "day") {
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
    } else {
      const listFetch = await fetch(
        `${process.env.CAFBUCKET}?fields=timeCreated`
      );
      const { objects: list } = await listFetch.json();
      list.sort((a, b) => {
        if (Date.parse(a.timeCreated) > Date.parse(b.timeCreated)) {
          return 1;
        } else if (Date.parse(a.timeCreated) < Date.parse(b.timeCreated)) {
          return -1;
        } else {
          return 0;
        }
      });
      documentName = list[list.length - 1].name;
    }
    documentFetch = await fetch(`${process.env.CAFBUCKET}/${documentName}`);
  } else if (req.query.file) {
    documentName = req.query.file;
    documentFetch = await fetch(`${process.env.CAFBUCKET}/${documentName}`);
  }
  if (documentFetch.status != 200) {
    return res
      .setHeader("Cache-Control", "max-age=1200, public")
      .status(404)
      .json({ error: "No data found." });
  }
  let json = await documentFetch.json();
  return res
    .setHeader(
      "Cache-Control",
      `max-age=${req.query.item === "list" ? 600 : 1200}, public`
    )
    .status(200)
    .json(
      documentName
        ? {
            meals: json,
            date: documentName.split("cafdata-")[1].split(".json")[0],
          }
        : json.objects.sort((a, b) => {
            if (Date.parse(a.timeCreated) > Date.parse(b.timeCreated)) {
              return 1;
            } else if (Date.parse(a.timeCreated) < Date.parse(b.timeCreated)) {
              return -1;
            } else {
              return 0;
            }
          })
    );
}
