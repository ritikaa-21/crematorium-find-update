var express = require("express");
const excelToJson = require('convert-excel-to-json');
var Excel = require('exceljs');
var app = express();

app.use(express.json());

app.get('/crematoriums/:xcord&:ycord', (req, res) => {
    res.send(findClosestCrematorium(parseFloat(req.params.xcord), parseFloat(req.params.ycord)));
})

app.post('/crematoriums/update', async (req, res) => {
    let updateState = await updateCrematoriumName(req.body.name, req.body.X, req.body.Y);
    updateState === false ? res.send("File Updated :D") : res.send("Same entry already exists :/");
})

app.listen(8080, () => {
    console.log("Listening at 8080");
})

function findClosestCrematorium(x, y) {
    const result = getUpdatedExcel();

    let leastDist =
    {
        "name": result["Sheet1"][0].name,
        "X": result["Sheet1"][0].X,
        "Y": result["Sheet1"][0].Y
    }

    //this method is optimized in a way that the loop exits if in a corner case, an exact match is found with the user entered coordinates, 
    //since there can't be a distance shorter than the exact coordinates

    for (let i = 0; i < result["Sheet1"].length && (leastDist.X !== x && leastDist.Y !== y); i++) {
        if (Math.hypot(x - result["Sheet1"][i].X, y - result["Sheet1"][i].Y) < Math.hypot(x - leastDist.X, y - leastDist.Y)) {
            leastDist = result["Sheet1"][i];
        }
    }

    return leastDist;
}

async function updateCrematoriumName(name, x, y) {
    const result = getUpdatedExcel();

    let found = false;

    for (let i = 0; i < result["Sheet1"].length && !found; i++) {
        if(result["Sheet1"][i].X === x && result["Sheet1"][i].Y === y)
        {   
            console.log(result["Sheet1"][i], "IN");
            found = true;
        }
    }

    if (!found) {
        let workbook = await (new Excel.Workbook()).xlsx.readFile('X Y Crematoirums.xlsx');
        let worksheet = workbook.getWorksheet('Sheet1');

        worksheet.columns = [
            { header: "Crematoirum Name", key: "Name" },
            { header: "A", key: "A" },
            { header: "B", key: "B" },
        ];

        worksheet.addRow({ Name: name, A: x, B: y });
        workbook.xlsx.writeFile('X Y Crematoirums.xlsx');
    }

    return found;

}

function getUpdatedExcel(){
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

    return result;
}
