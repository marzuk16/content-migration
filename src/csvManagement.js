const fs = require("fs");
const { parse } = require("csv-parse");

exports.readCsv = (inputFile) => {
    let dataFromCsv = [];
    fs.createReadStream(inputFile)
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (data) {
            dataFromCsv.push(data);
        })
        .on("end", function () {
            console.log("tags reading finished");
            return dataFromCsv;
        })
        .on("error", function (error) {
            console.log("Error when reading tags: ");
            console.log(error.message);
        });
}

exports.writeCsv = (data, outputFile) => {
    data.forEach(element => {
        writeFile(element.join(",") + "\n", outputFile);
    });
}

exports.writeFile = (data, outputFile) => {
    fs.appendFileSync(outputFile, data);
}