exports.READ_MASTER_DATA_ENTRY_ID_BY_NAME = "SELECT mde.MASTER_DATA_ENTRY_ID FROM MASTER_DATA_ENTRY mde WHERE LOWER(mde.NAME) = '{name}' and master_data_type_id=126";
exports.READ_CATEGORY_ID_BY_NAME = "SELECT cc.CONTENT_CATEGORY_ID FROM CONTENT_CATEGORY cc WHERE LOWER(cc.NAME) = '{name}'";
exports.READ_CONTENT_ID_BY_PATH = `SELECT ci.CONTENT_INFORMATION_ID FROM CONTENT_INFORMATION ci WHERE ci.CONTENT_PATH = '{path}'`;


exports.WRITE_MASTER_DATA_ENTRY =
        "INSERT INTO master_data_entry ( name, name_local, master_data_type_id, active, "
        + "created_at, updated_at, version, eprimary_id, apsc_id, view_order) "
        + "VALUES ( '{name}', '{nameLocal}', {masterDataTypeId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, NULL, NULL, {viewOrder})";

exports.WRITE_CONTENT_CATEGORY =
        "INSERT INTO CONTENT_CATEGORY ( category_type, name, name_local, is_published, description, thumb_image_path, "
        + "view_order, published_by, published_at, created_by, updated_by, created_at, updated_at) "
        + "VALUES ( ({categoryType}), '{name}', '{nameLocal}', {isPublished}, '{description}', '{thumbImagePath}', {viewOrder}, 1, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

exports.WRITE_CONTENT_INFORMATION =
        "INSERT INTO CONTENT_INFORMATION ( content_category, title, content_file_type, short_description, description, thumb_image_path, "
        + "content_path, file_size, is_published, view_order, published_by, published_at, created_by, updated_by, created_at, updated_at) "
        + "VALUES ( ({contentCategory}), '{title}', '{contentFileType}', '{shortDescription}', '{description}', '{thumbImagePath}', '{contentPath}', {fileSize}, {isPublished}, {viewOrder}, 1, CURRENT_TIMESTAMP, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";

exports.WRITE_CONTENT_INFORMATION_TAGS =
        "INSERT INTO content_information_tags ( content_information_id, master_data_entry_id) VALUES ( ({contentInformationId}), ({masterDataEntryId}) )";

exports.CP_COMMAND = "cp -av source /home/ipemis/ \n";