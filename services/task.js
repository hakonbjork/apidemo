var fs = require("fs");
var crypto = require("crypto");

const getTask = (int, res) => {
    fs.readFile( __dirname + "/data/" + "tasks.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        res.type('application/json');
        res.end(JSON.stringify(data[int]))
    })
};

const listTasks = (res) => {
    fs.readFile( __dirname + "/data/" + "tasks.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        res.type('application/json');
        res.end(JSON.stringify(data))
    })
};

const addTask = (int, req, res) => {
    fs.readFile( __dirname + "/data/" + "tasks.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        data[int] = req.body;
        let stringify = JSON.stringify(data);
        fs.writeFile( __dirname + "/data/" + "tasks.json", stringify, (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
            }});

        res.type('application/json');


        res.end(JSON.stringify(data[int]))    })
};

const checkResponse = (int, req, res) => {
    fs.readFile( __dirname + "/data/" + "correctResponses.json", 'utf8', function (err, data) {
        data = JSON.parse( data );
        let {response} = req.body;

        if(data[int]["correct"] != response){
            res.status(404).send("The answer is not correct");
            return
        }

        let responseObj =  {... req.body, id: "tasks/1/response/" + crypto.randomUUID(), created: new Date().toLocaleString()};

        fs.readFile( __dirname + "/data/" + "responses.json", 'utf8', function (err, responseData) {
            responseData = JSON.parse( responseData );
            responseData[int] = responseObj;

        let stringify = JSON.stringify(responseData);
        fs.writeFile( __dirname + "/data/" + "responses.json", stringify, (err) => {
            if (err)
              console.log(err);
            else {
              console.log("File written successfully\n");
            }});
        })
        
        res.type('application/json');
        res.end(JSON.stringify(responseObj))    })
};

module.exports = {
    listTasks,
    getTask,
    addTask,
    checkResponse
};