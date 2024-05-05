exports.sanitizeSqlValue = (data) => {
    return data
    .replace(/(?!^)'(?!$)/g, "''")
    .replace("(", "''(")
    .replace(")", "'')");
};

exports.checkfiles = (existingFilesSet, fileNames) => {
    const noOfExistingFiles = existingFilesSet.size();

    for (const name of fileNames) {
        existingFilesSet.add(name);
    }

    return noOfExistingFiles === existingFilesSet.size();
};

exports.getTodayDate = () => {
    return new Date().toLocaleDateString('en-EN').split( '/' ).reverse( ).join( '-' );;
}