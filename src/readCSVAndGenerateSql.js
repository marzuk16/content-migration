const queries = require("./queries");
const {
  sanitizeSqlValue,
  checkfiles,
  getTodayDate,
  getDifferenceFiles,
  sanitizeFileName
} = require("./utils");

exports.generateTagsSql = () => {
  const sqlRow = queries.WRITE_MASTER_DATA_ENTRY
    .replace("{name}", sanitizeSqlValue(data[1]))
    .replace("{nameLocal}", sanitizeSqlValue(data[2]))
    .replace("{masterDataTypeId}", "126")
    .replace("{viewOrder}", data[3]) + ";\n";
}

exports.generateCategorySql = () => {
  const thumbPath = "/" + getTodayDate() + CONTENT_LIBRARY_CATEGORY_THUMBNAIL + "/" + data[6];

  const sqlRow = queries.WRITE_CONTENT_CATEGORY
    .replace("{categoryType}", queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME
      .replace("{name}", sanitizeSqlValue(data[1].toLowerCase()))
    )
    .replace("{name}", sanitizeSqlValue(data[2]))
    .replace("{nameLocal}", sanitizeSqlValue(data[3]))
    .replace("{isPublished}", "0")
    .replace("{description}", sanitizeSqlValue(data[5]))
    .replace("{thumbImagePath}", thumbPath)
    .replace("{viewOrder}", data[7]) + ";\n";
}

exports.generateContent = () => {
  const thumbPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT_THUMBNAIL + "/" + sanitizeSqlValue(data[6]);
  const contentPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + sanitizeSqlValue(data[7]);

  categoryNameSet.add(sanitizeSqlValue(data[1].toLowerCase()))

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
    .replace("{isPublished}", "0")
    .replace("{viewOrder}", data[9]) + ";\n";

  fs.appendFileSync("./data/output/content-migration.sql", sqlRow);

  let contentPathTag = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + sanitizeSqlValue(data[7]);
  let readConent = queries.READ_CONTENT_ID_BY_PATH.replace("{path}", contentPathTag);
  let readMde = queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME.replace("{name}", sanitizeSqlValue(data[10].toLowerCase()));

  const sqlRow1 = queries.WRITE_CONTENT_INFORMATION_TAGS
    .replace("{contentInformationId}", readConent)
    .replace("{masterDataEntryId}", readMde) + ";\n"

  const sqlRow2 = queries.WRITE_CONTENT_INFORMATION_TAGS
    .replace("{contentInformationId}", readConent)
    .replace("{masterDataEntryId}",
      queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME.replace("{name}", sanitizeSqlValue(data[12].toLowerCase()))
    ) + ";\n"
}

let writeDifferenceFileNames = (errorContent, refinedContent) => {
  errorContent.forEach(data => {
    fs.appendFileSync("./data/output/error-content.csv", data.join(",") + "\n");

    fs.appendFileSync("./data/output/may122024/restContentThumb.txt", '`' + data[6] + '`' + ',');
    fs.appendFileSync("./data/output/may122024/restContent.txt", '`' + data[6] + '`' + ',');
  })

  refinedContent.forEach(data => {
    fs.appendFileSync("./scripts/content_thumb_cp.sh", sanitizeFileName(data[6]) + "\n");
    fs.appendFileSync("./scripts/content_cp.sh", sanitizeFileName(data[7]) + "\n");

    fs.appendFileSync("./data/output/refined-content.csv", data.join(",") + "\n");
  })
}