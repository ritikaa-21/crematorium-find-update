var express = require("express");
const excelToJson = require('convert-excel-to-json');

var app = express();

 
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

console.log(result);



app.listen(8080, ()=>{
    console.log("Listening at 8080");
})