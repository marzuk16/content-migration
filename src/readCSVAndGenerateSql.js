const fs = require("fs");
const { parse } = require("csv-parse");

import * as queries from "./queries";
import { 
  sanitizeSqlValue, 
  checkfiles,
  getTodayDate } from "./utils";


  const CONTENT_LIBRARY_CATEGORY_THUMBNAIL = "/content-library/category";
  const CONTENT_LIBRARY_CONTENT_THUMBNAIL = "/content-library/content/thumbnail";
  const CONTENT_LIBRARY_CONTENT = "/content-library/content";



export const generateTagsSql = () => {
  fs.createReadStream("./data/input/tags.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (data) {
    const sqlRow = queries.WRITE_MASTER_DATA_ENTRY
                          .replace("{name}", sanitizeSqlValue(data[1]))
                          .replace("{nameLocal}", sanitizeSqlValue(data[2]))
                          .replace("{masterDataTypeId}", "126")
                          .replace("{viewOrder}", data[3]) + ";\n";
    
    fs.appendFileSync("./data/output/content-migration.sql", sqlRow);
  })
  .on("end", function () {
    console.log("tags reading finished");
  })
  .on("error", function (error) {
    console.log("Error when reading tags: ");
    console.log(error.message);
  });
}

export const generateCategorySql = () => {
  let contentCategory = [];
  fs.createReadStream("./data/input/content-category.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (data) {
    contentCategory.push(data);
  })
  .on("end", function () {
    console.log("content category reading finished");
  })
  .on("error", function (error) {
    console.log("Error when reading content category: ");
    console.log(error.message);
  });

  let existingFilesSet = new Set([]);
  if(checkfiles(existingFilesSet, contentCategory.map(data => data[6]))){
    for (const data of contentCategory) {
      const thumbPath = "/" + getTodayDate() + CONTENT_LIBRARY_CATEGORY_THUMBNAIL + "/" + data[6];

      const sqlRow = queries.WRITE_CONTENT_CATEGORY
                            .replace("{categoryType}", queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME
                                                              .replace("{name}", sanitizeSqlValue(data[1].toLowerCase()))
                            )
                            .replace("{name}", sanitizeSqlValue(data[2]))
                            .replace("{nameLocal}", sanitizeSqlValue(data[3]))
                            .replace("{isPublished}", data[4] == "Yes" ? "1" : "0")
                            .replace("{description}", sanitizeSqlValue(data[5]))
                            .replace("{thumbImagePath}", thumbPath)
                            .replace("{viewOrder}", data[7]) + ";\n";

      fs.appendFileSync("./data/output/content-migration.sql", sqlRow);
    }
  
  }else{
    console.log("Content category thumb files number mismatch");
  }
}

export const generateContent = () => {
  let content = [];
  let fileSizeInMB = new Map();

  fs.createReadStream("./data/input/content-information.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (data) {
    content.push(data);
  })
  .on("end", function () {
    console.log("content information reading finished");
  })
  .on("error", function (error) {
    console.log("Error when reading content information: ");
    console.log(error.message);
  });

  fs.createReadStream("./data/input/content-information.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (data) {
    fileSizeInMB.set(data[0], data[1]);
  })
  .on("end", function () {
    console.log("file sizes reading finished");
  })
  .on("error", function (error) {
    console.log("Error when reading file sizes: ");
    console.log(error.message);
  });

  let existingContentThumbsSet = new Set([]);
  let existingContentsSet = new Set([]);

  if(checkfiles(existingContentThumbsSet, contentCategory.map(existingContentThumbsSet, data => data[6])) 
      && checkfiles(existingContentsSet, contentCategory.map(data => data[7]))
    ){
    for (const data of contentCategory) {
      const thumbPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT_THUMBNAIL + "/" + data[6];
      const contentPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + data[7];

      const sqlRow = queries.WRITE_CONTENT_INFORMATION
                            .replace("{contentCategory}", queries.READ_CATEGORY_ID_BY_NAME
                                                                  .replace("{name}", sanitizeSqlValue(data[1].toLowerCase()))
                            )
                            .replace("{title}", sanitizeSqlValue(data[2]))
                            .replace("{contentFileType}", data[3])
                            .replace("{shortDescription}", sanitizeSqlValue(data[4]))
                            .replace("{description}", sanitizeSqlValue(data[5]))
                            .replace("{thumbImagePath}", thumbPath)
                            .replace("{contentPath}", contentPath)
                            .replace("{fileSize}", fileSizeInMB.get(data[7]) + "")
                            .replace("{isPublished}", data[8] == "Yes" ? "1" : "0")
                            .replace("{viewOrder}", data[9]) + ";\n";

      fs.appendFileSync("./data/output/content-migration.sql", sqlRow);
    }
  
  }else{
    console.log("Content information thumb or content files number mismatch");
  }
}

export const generateContentTags = () => {
  fs.createReadStream("./data/input/content-information.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (data) {
    const sqlRow = queries.WRITE_CONTENT_INFORMATION_TAGS
                        .replace("{contentInformationId}", queries.READ_CONTENT_ID_BY_PATH
                                                                  .replace("{path}", sanitizeString(data[6]))
                        )
                        .replace("{masterDataEntryId}", queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME
                                                                .replace("{name}", sanitizeString(data[10].toLowerCase()))
                        ) + ";\n"

      fs.appendFileSync("./data/output/content-migration.sql", sqlRow);

      const sqlRow22 = queries.WRITE_CONTENT_INFORMATION_TAGS
                        .replace("{contentInformationId}", queries.READ_CONTENT_ID_BY_PATH
                                                                  .replace("{path}", sanitizeString(data[6]))
                        )
                        .replace("{masterDataEntryId}", queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME
                                                                .replace("{name}", sanitizeString(data[12].toLowerCase()))
                        ) + ";\n"

      fs.appendFileSync("./data/output/content-migration.sql", sqlRow);

  })
  .on("end", function () {
    console.log("content information for tags reading finished");
  })
  .on("error", function (error) {
    console.log("Error when reading content information for tags: ");
    console.log(error.message);
  });
}