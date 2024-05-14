const fs = require("fs");
const { parse } = require("csv-parse");
const XLSX = require('xlsx')

const queries = require("./queries");
const {
  sanitizeSqlValue,
  checkfiles,
  getTodayDate,
  getDifferenceFiles,
  sanitizeFileName
} = require("./utils");

const { findRestContent } = require("./restContentsMigration");


const CONTENT_LIBRARY_CATEGORY_THUMBNAIL = "/content-library/category";
const CONTENT_LIBRARY_CONTENT_THUMBNAIL = "/content-library/content/thumbnail";
const CONTENT_LIBRARY_CONTENT = "/content-library/content";

const CONTENT_CATEGORY_TYPES = new Set(["Pre-Primary", "Class One", "Class Two", "Class Three", "Class Four", "Class Five"]);

const BASE_DESTINATION = `~/file-storage/2024-05-11`;
const DESTINATION_CATEGORY_THUMB = `~/file-storage/2024-05-11/content-library/category`;
const DESTINATION_CONTENT_THUMB = `~/file-storage/2024-05-11/content-library/content/thumbnail`;
const DESTINATION_CONTENT = `~/file-storage/2024-05-11/content-library/content`;
const DESTINATION_CONTENT_SOURCE = `~/file-storage/unicef-content06Apr2024/03.\ content-files`;

let dataFromExcel = [];

exports.generateTagsSql = () => {
  fs.createReadStream("./data/input/tags.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (data) {
      const sqlRow = queries.WRITE_MASTER_DATA_ENTRY
        .replace("{name}", sanitizeSqlValue(data[1]))
        .replace("{nameLocal}", sanitizeSqlValue(data[2]))
        .replace("{masterDataTypeId}", "126")
        .replace("{viewOrder}", data[3]) + ";\n";

      fs.appendFileSync("./data/output/content-tag-migration.sql", sqlRow);
    })
    .on("end", function () {
      console.log("tags reading finished");
    })
    .on("error", function (error) {
      console.log("Error when reading tags: ");
      console.log(error.message);
    });
}

exports.generateCategorySql = () => {
  let contentCategory = [];
  fs.createReadStream("./data/input/content-category.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (data) {
      contentCategory.push(data);
    })
    .on("end", function () {
      console.log("content category reading finished");

      for (const data of contentCategory) {

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

        fs.appendFileSync("./data/output/content-category-migration.sql", sqlRow);
      }
    })
    .on("error", function (error) {
      console.log("Error when reading content category: ");
      console.log(error.message);
    });
}

exports.generateContent = () => {
  let contents = [];
  let fileSizeInMB = new Map();

  fs.createReadStream("./data/input/content-information.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (data) {
      data[2] = data[2].replace(/(?:\r\n|\r|\n)/g, ' ');
      data[4] = data[4].replace(/(?:\r\n|\r|\n)/g, ' ');
      data[5] = data[5].replace(/(?:\r\n|\r|\n)/g, ' ');
      data[10] = data[10].replace(/(?:\r\n|\r|\n)/g, ' ');
      data[12] = data[12].replace(/(?:\r\n|\r|\n)/g, ' ');
      contents.push(data);
    })
    .on("end", function () {
      console.log("content information reading finished");

      // const { errorContent, refinedContent } = getDifferenceFiles(content);
      // writeDifferenceFileNames(errorContent, refinedContent);

      fs.createReadStream("./data/input/content_file_sizes.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (data) {
          fileSizeInMB.set(data[0], data[1]);
        })
        .on("end", function () {
          console.log("file sizes reading finished");

          let categoryNameSet = new Set([]);

          // for (const data of content) {

          // const thumbPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT_THUMBNAIL + "/" + sanitizeSqlValue(data[6]);
          // const contentPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + sanitizeSqlValue(data[7]);

          // categoryNameSet.add(sanitizeSqlValue(data[1].toLowerCase()))  

          // const sqlRow = queries.WRITE_CONTENT_INFORMATION
          //   .replace("{contentCategory}", queries.READ_CATEGORY_ID_BY_NAME
          //     .replace("{name}", sanitizeSqlValue(data[1].toLowerCase()))
          //   )
          //   .replace("{title}", sanitizeSqlValue(data[2]))
          //   .replace("{contentFileType}", data[3])
          //   .replace("{shortDescription}", sanitizeSqlValue(data[4]))
          //   .replace("{description}", sanitizeSqlValue(data[5]))
          //   .replace("{thumbImagePath}", thumbPath)
          //   .replace("{contentPath}", contentPath)
          //   .replace("{fileSize}", fileSizeInMB.get(data[7]) + "")
          //   .replace("{isPublished}", "0")
          //   .replace("{viewOrder}", data[9]) + ";\n";

          // fs.appendFileSync("./data/output/content-migration.sql", sqlRow);

          // let contentPathTag = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + sanitizeSqlValue(data[7]);
          // let readConent = queries.READ_CONTENT_ID_BY_PATH.replace("{path}", contentPathTag);
          // let readMde = queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME.replace("{name}", sanitizeSqlValue(data[10].toLowerCase()));

          // const sqlRow1 = queries.WRITE_CONTENT_INFORMATION_TAGS
          //   .replace("{contentInformationId}", readConent)
          //   .replace("{masterDataEntryId}", readMde) + ";\n"

          // const sqlRow2 = queries.WRITE_CONTENT_INFORMATION_TAGS
          //   .replace("{contentInformationId}", readConent)
          //   .replace("{masterDataEntryId}", 
          //     queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME.replace("{name}", sanitizeSqlValue(data[12].toLowerCase()))
          //   ) + ";\n"

          // fs.appendFileSync("./data/output/content-information-tags.sql", sqlRow1);
          // fs.appendFileSync("./data/output/content-information-tags.sql", sqlRow2);

          // }

          // categoryNameSet.forEach(categoryName => {
          //   fs.appendFileSync("./data/output/category-sub-query.sql", queries.READ_CATEGORY_ID_BY_NAME.replace("{name}", categoryName)+"\n");
          // })
        })
        .on("error", function (error) {
          console.log("Error when reading file sizes: ");
          console.log(error.message);
        });
    })
    .on("error", function (error) {
      console.log("Error when reading content information: ");
      console.log(error.message);
    });
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

const readExecl = (sheetName = null) => {
  const file = XLSX.readFile('./data/input/Combine Content_06.05.24.xlsx');
  const sheets = file.SheetNames;

  if (sheetName) {
    XLSX.utils.sheet_to_json(file.Sheets[sheetName]).forEach((res) => dataFromExcel.push(res));
  } else {
    for (let i = 0; i < sheets.length; i++) {
      XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]).forEach((res) => dataFromExcel.push(res));
    }
  }

  console.log("Excel read finished");
}

const writeExcel = (data) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Error Content Information');
  XLSX.writeFile(workBook, './data/output/Error-Content-Informations.xlsx');
}

exports.generateRestContent = () => {

  let fileSizeInMB = new Map();

  fs.createReadStream("./data/input/content_file_sizes.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (data) {
      fileSizeInMB.set(data[0], data[1]);
    })
    .on("end", function () {
      console.log("file sizes reading finished");

      readExecl("Content Information");

      let errorContents = [];

      const { restContentThumb, restContent, migratedContentThumb, migratedContent } = findRestContent();

      dataFromExcel.forEach(data => {

        if (restContentThumb.has(data['thumb Image file name (must be unique) (with extension)']) && restContent.has(data['content file name (must be unique) (with extension)'])) {

          const thumbPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT_THUMBNAIL + "/" + sanitizeSqlValue(data['thumb Image file name (must be unique) (with extension)']);
          const contentPath = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + sanitizeSqlValue(data['content file name (must be unique) (with extension)']);

          const sqlRow = queries.WRITE_CONTENT_INFORMATION
            .replace("{contentCategory}", queries.READ_CATEGORY_ID_BY_NAME
              .replace("{name}", sanitizeSqlValue(data['Content Category'].toLowerCase()))
            )
            .replace("{title}", sanitizeSqlValue(data['title']))
            .replace("{contentFileType}", data['content file type'])
            .replace("{shortDescription}", sanitizeSqlValue(data['Lesson/ Chapter']))
            .replace("{description}", sanitizeSqlValue(data['description']))
            .replace("{thumbImagePath}", thumbPath)
            .replace("{contentPath}", contentPath)
            .replace("{fileSize}", fileSizeInMB.get(data['content file name (must be unique) (with extension)']) + "")
            .replace("{isPublished}", "0")
            .replace("{viewOrder}", data['view order']) + ";\n";

          fs.appendFileSync("./data/output/rest-content-migration.sql", sqlRow);

          let contentPathTag = "/" + getTodayDate() + CONTENT_LIBRARY_CONTENT + "/" + sanitizeSqlValue(data['content file name (must be unique) (with extension)']);
          let readConent = queries.READ_CONTENT_ID_BY_PATH.replace("{path}", contentPathTag);
          let readMde = queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME.replace("{name}", sanitizeSqlValue(data['Tag 1'].toLowerCase()));

          const sqlRow1 = queries.WRITE_CONTENT_INFORMATION_TAGS
            .replace("{contentInformationId}", readConent)
            .replace("{masterDataEntryId}", readMde) + ";\n"

          const sqlRow2 = queries.WRITE_CONTENT_INFORMATION_TAGS
            .replace("{contentInformationId}", readConent)
            .replace("{masterDataEntryId}",
              queries.READ_MASTER_DATA_ENTRY_ID_BY_NAME.replace("{name}", sanitizeSqlValue(data['Tag 3'].toLowerCase()))
            ) + ";\n"

          fs.appendFileSync("./data/output/rest-content-information-tags.sql", sqlRow1);
          fs.appendFileSync("./data/output/rest-content-information-tags.sql", sqlRow2);

          fs.appendFileSync("./scripts/rest_content_thumb_cp.sh", sanitizeFileName(data['thumb Image file name (must be unique) (with extension)']) + "\n");
          fs.appendFileSync("./scripts/rest_content_cp.sh", sanitizeFileName(data['content file name (must be unique) (with extension)']) + "\n");
        } else {
          if (!migratedContentThumb.has(data['thumb Image file name (must be unique) (with extension)']))
            errorContents.push(data);
        }

      });

      writeExcel(errorContents);
    })
    .on("error", function (error) {
      console.log("Error when reading file sizes: ");
      console.log(error.message);
    });
}