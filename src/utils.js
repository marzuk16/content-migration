exports.sanitizeSqlValue = (data) => {
    return data;
    // return data
    //     .replace(/(?!^)'(?!$)/g, "''")
    //     .replace(/\(/g, "''(")
    //     .replace(/\)/g, "'')");
};

exports.sanitizeFileName = (fileName) => {
    return `cp -av '${fileName.replace(/'/g, "'\\''")}' ./copied`;
}

exports.makeSubQuery = (data) => {
    return new Set([...data]);
}

exports.checkfiles = (existingFilesSet, fileNames) => {
    const noOfExistingFiles = existingFilesSet.size;

    for (const name of fileNames) {
        existingFilesSet.add(name);
    }

    return noOfExistingFiles === existingFilesSet.size;
};

exports.getTodayDate = () => {
    // return new Date().toLocaleDateString('en-EN').split('/').reverse().join('-')
    return "2024-05-15";
}

exports.replaceNewLine = (data) => {
    return data.replace(/(?:\r\n|\r|\n)/g, ' ');
}