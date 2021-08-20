var express = require("express");
const excelToJson = require('convert-excel-to-json');
var Excel = require('exceljs');

/*
the module "express" has a function as a return, which is set to a variable 
this can be used to call functions like get/post/use etc.
*/
var app = express();

/*
setting up the app instance to the middleware we want to use
since this middleware is now bundled with express, we neex explicity install it
*/
app.use(express.json());

/*
part 1 : used a parameterized URL to accept x and y coordninates from the user and call a function to find the closest 
crematorium with the same values parsed from string to float.
The function returns the required json  
*/
app.get('/crematoriums/:xcord&:ycord', (req, res) => {
    res.send(findClosestCrematorium(parseFloat(req.params.xcord), parseFloat(req.params.ycord)));
})

/*part 2 : post request, listening at baseURL/crematoriums/update 
Received body is passed in the written function to update the crematorium name and coordinates to the main list.
The function returns a boolean value, before adding the details to the list, the function checks if the value exists.
Returns FALSE if value not found, hence updates file. Returns TRUE if value already exists, no changes to main list.
Custom response sent to the user basis the action on the main list.
*/
app.post('/crematoriums/update', async (req, res) => {
    let updateState = await updateCrematoriumName(req.body.name, req.body.X, req.body.Y);
    updateState === false ? res.send("File Updated :D") : res.send("Same entry already exists :/");
})

//the instance of this app is listening for requests at port 8080
//no callback function written here
app.listen(8080, () => {
    console.log("Listening at 8080");
})

//calling this function would fetch the updated instance of the excel file's json at any time
function getUpdatedExcel() {

    //excelToJson method is provided by the (convert-excel-to-json) npm itself
    const result = excelToJson({
        sourceFile: 'X Y Crematoirums.xlsx',
        header: {
            rows: 1
        },
        columnToKey: {
            A: 'name',
            B: 'X',
            C: 'Y'
        }
    });

    //returns a json from the mentioned excel file
    return result;
}


//function to find the closest crematorium, accepts x and y coordinates as parameters
function findClosestCrematorium(x, y) {

    //get updated json
    const result = getUpdatedExcel();
    let leastDist =
    {
        "name": result["Sheet1"][0].name,
        "X": result["Sheet1"][0].X,
        "Y": result["Sheet1"][0].Y
    }

    //this method is optimized in a way that the loop exits if in a corner case, an exact match is found with the user entered coordinates, 
    //since there can't be a distance shorter than the exact coordinates
    for (let i = 0; i < result["Sheet1"].length && (leastDist.X !== x || leastDist.Y !== y); i++) {
        if (Math.hypot(x - result["Sheet1"][i].X, y - result["Sheet1"][i].Y) < Math.hypot(x - leastDist.X, y - leastDist.Y)) {
            leastDist = result["Sheet1"][i];
        }
    }

    return leastDist;
}

//an async function that writes to the main list, if the crematorium details entered by the user don't already exist
//loops to find an aexact match, if found, returns true. 
//if found is false (no match was found) the main list is updated with said details
async function updateCrematoriumName(name, x, y) {

    //get updated json
    const result = getUpdatedExcel();

    let found = false;

    //this loop stops looping if one exact match is found
    for (let i = 0; i < result["Sheet1"].length && !found; i++) {
        if (result["Sheet1"][i].X === x && result["Sheet1"][i].Y === y && result["Sheet1"][i].name == result["Sheet1"][i].name) {
            found = true;
        }
    }

    if (!found) {
        //create a workbook instance and read file from the file name using the "Exceljs" npm
        let workbook = await (new Excel.Workbook()).xlsx.readFile('X Y Crematoirums.xlsx');
        //fetch the worksheet with the data, here the worksheet is named "Sheet1"
        let worksheet = workbook.getWorksheet('Sheet1');

        //assigning keys to the headers or column names
        worksheet.columns = [
            { header: "Crematoirum Name", key: "Name" },
            { header: "A", key: "A" },
            { header: "B", key: "B" },
        ];

        //adding a row at the first empty row using a function provided by the npm
        worksheet.addRow({ Name: name, A: x, B: y });

        //writing the results back to the file that the data was read from
        workbook.xlsx.writeFile('X Y Crematoirums.xlsx');
    }

    //return boolean value of found variable
    return found;

}
