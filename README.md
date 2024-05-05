<h1 align="center"> content-migration </h1>

## To run scripts
- chmod +x file_name.sh
- ./file_name.sh

### Step 1:

    ./script/file_sizes.sh

### Step 2:
- Modify `./scripts/export_file_names.sh`
   - directory
   - output_file 
- Copy each files and paste corresponding `Set` in `readCSVAndGenerateSql.js`

### Step 3:

    node app.js