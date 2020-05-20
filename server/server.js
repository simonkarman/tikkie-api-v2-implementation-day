var express = require("express");
var MongoClient = require('mongodb').MongoClient;

// Setup Mongo DB Connection
var mongo;
var businessCollection;
var appointmentCollection;
MongoClient.connect("mongodb://localhost:27017/tikkie-api-v2-implementation-day", { useUnifiedTopology: true }).then(result => {
    mongo = result.db("tikkie-api-v2-implementation-day");
    businessCollection = mongo.collection("business");
    appointmentCollection = mongo.collection("appointment");
});

// Build endpoints
var app = express();
app.get("/health", (req, res, next) => {
    if (mongo) {
        res.send("OK");
    } else {
        res.send("NO_DATABASE");
    }
});
app.get("/abc", async (req, res, next) => {
    var result = await mongo.collection("abc").find({}).toArray();
    res.json(result);
});
app.post("/abc", async (req, res, next) => {
    var result = await mongo.collection("abc").insertOne({ time: new Date().toISOString() });
    res.json(result);
});

app.post("/business", async (req, res, next) => {
    // get appToken, apiKey from the request
    // subscribe to notification to validate the appToken and apiKey and get the subscriptionId
    // save business with id and subscriptionId in business db
    // return response with business information (business id) + business id as cookie
    res.json("Not Yet Implemented");
});

app.post("/appointment", async (req, res, next) => {
    // get business id, name, amountInCents, and description from the request
    // get appToken, apiKey from the business db
    // create payment requests with the appToken and apiKey and amountInCents and description
    // save paymentrequest + business id information with name to appointments db
    // return response with appointment information
    res.status(500).json("Not Yet Implemented");
});

app.post("/callback", async (req, res, next) => {
    // look up subscriptionId in business db to validate we want to listen to it
    //     and get the business id from it
    // look for the payment request of that business id in the appointment table
    // mark appointment as paid (or add counter)
    res.status(500).json("Not Yet Implemented");
});

app.get("/appointment", async (req, res, next) => {
    // get the businessid from the request (cookie)
    // return a list of all appointments ids for the business
    res.status(500).json("Not Yet Implemented");
});

app.get("/appointment/{appointmentId}", async (req, res, next) => {
    // get the businessid (cookie) and the appointmentId (path param) from the request 
    // return appointment information for business id and appointment id
    res.status(500).json("Not Yet Implemented");
})

app.listen(17233, () => {
 console.log("Server running on port 17233");
});