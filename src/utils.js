export const sanitizeSqlValue = (data) => {
    return data
    .replace("'", "''")
    .replace("(", "''(")
    .replace(")", "'')");
};

export const checkfiles = (existingFilesSet, fileNames) => {
    const noOfExistingFiles = existingFilesSet.size();

    for (const name of fileNames) {
        existingFilesSet.add(name);
    }

    return noOfExistingFiles === existingFilesSet.size();
};

export const getTodayDate = () => {
    return "";
}