const fs = require("fs");
const { parse } = require("csv-parse");

fs.createReadStream("./data/input/tags.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    console.log(row);
    const sqlRow = `'${row[1]}', '${row[2]}', ${row[3]} \n`;
    fs.appendFileSync("./data/output/content-migration.sql", sqlRow);
  })
  .on("end", function () {
    console.log("tags reading finished");
  })
  .on("error", function (error) {
    console.log("Error when reading tags: ");
    console.log(error.message);
  });