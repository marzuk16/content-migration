const XLSX = require('xlsx')

exports.readExecl = (inputFile, sheetName = null) => {
    const file = XLSX.readFile(inputFile);
    const sheets = file.SheetNames;

    if (sheetName) {
        let dataFromExcel = [];
        dataFromExcel = XLSX.utils.sheet_to_json(file.Sheets[sheetName]);
        console.log("Excel read finished for sheet: " + sheetName);
        return dataFromExcel;
    } else {
        let dataFromExcel = {};
        for (let i = 0; i < sheets.length; i++) {
            dataFromExcel[file.SheetNames[i]] = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
        }
        console.log("Excel read finished");

        return dataFromExcel;
    }
}

exports.writeExcel = (data, outputFile, sheetName = 'sheet 1') => {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, sheetName);
    XLSX.writeFile(workBook, outputFile);
}