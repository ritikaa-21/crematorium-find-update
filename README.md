Implementation Using : NodeJs

Assumptions Made : The sheet name in the excel file shared will be "Sheet1"

API structure : Two APIs have been created as mentioned.

API-1 : 

Method : GET

PORT : 8080

URL : http://localhost:8080/crematoriums/x coordinate value here&y coordinate value here

EXAMPLE URL :  http://localhost:8080/crematoriums/120&0

NOTE : x and y values represent user input and can be changed to fetch different responses


API-2

Method : POST

PORT : 8080

URL : http://localhost:8080/crematoriums/update

BODY : 

{

    "name": "<name string here>",

    "X": <x coordinate value here>,

    "Y": <y coordinate value here>

}

EXAMPLE BODY :  

{

    "name": "Ritika",

    "X": 100,

    "Y": 100

}

NOTE : x, y and name values represent user input and can be changed to fetch different responses

How to run the code : The apis have been created using NodeJs. Postman is used to test these APIs

1. The link for the postman collection of the two required APIs is : https://www.getpostman.com/collections/3a9997da6619ff258b2a

2. Open postman, click on import collection, go to link tab, paste the link in point 1 and import collection name "Find and Update Crematoriums"

3. Download or clone the github repo locally and in the same folder, open a terminal and type "node app.js" to have the server be in running state

4. Use postman to send and receive requests and responses. 


FOR ADDED BONUS : 

Still learning and reading about cloud run, was able to follow along the steps and deploy this on cloud run. 

This is the final URL : https://crematoriums-fmw6ob6v5q-pd.a.run.app/

FIRST API URL : https://crematoriums-fmw6ob6v5q-pd.a.run.app/crematoriums/ {add x value here}&{add y value here}

SECOND API URL : https://crematoriums-fmw6ob6v5q-pd.a.run.app/update

I am still learning more and understanding this vast topic!