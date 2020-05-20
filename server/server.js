const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const axios = require('axios').default;
const uuid = require('uuid').v4;
const cors = require('cors');

// Define consts
const tikkieUrl = 'https://api-sandbox.abnamro.com/v2/tikkie';

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
const app = express();
app.use(cors());
app.use(bodyParser.json());
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
    try {

        // get appToken, apiKey from the request
        const { appToken, apiKey } = req.body;
        if (appToken === undefined || apiKey === undefined) {
            throw new Error("Missing appToken or apiKey in the request");
        }

        // subscribe to notification to validate the appToken and apiKey and get the subscriptionId
        const data = { url: "http://tikkie-businesses.karman.dev/callback" };
        const config = { headers: { 'API-Key': apiKey, 'X-App-Token': appToken } };
        const subscriptionResponse = await axios.post(`${tikkieUrl}/paymentrequestssubscription`, data, config);
        const { subscriptionId } = subscriptionResponse.data;

        // check if business already exists
        var business = await businessCollection.findOne({ appToken, apiKey });
        if (!business) {
            // if is does not exist, create it and save business with id and subscriptionId in business db
            const businessId = uuid();
            business = {
                appToken,
                apiKey,
                subscriptionId,
                businessId
            };
            businessCollection.insertOne(business);
            console.log("successful created business", business);
            // TODO: add all existing payment requests as appointments to the list ?

        } else {
            console.log("using already existing business", business);
        }

        // return response with business information (business id) + business id as cookie
        console.log("successful posting business", business);
        res.json(business);

    } catch (err) {
        console.log("error while posting business");
        res.status(500).send("Internal Server Error");
    }
});

app.post("/appointment", async (req, res, next) => {
    try {
        // get business id, customerName, amountInCents, and description from the request
        const { businessId, customerName, amountInCents, description } = req.body;
        if (businessId === undefined || customerName === undefined || amountInCents === undefined || description === undefined) {
            throw new Error("Missing businessId, name, amountInCents, or description in the request");
        }

        // get appToken, apiKey from the business db
        const business = await businessCollection.findOne({ businessId });
        const { appToken, apiKey } = business;

        // create payment requests with the appToken and apiKey and amountInCents and description
        const data = { amountInCents, description };
        const config = { headers: { 'API-Key': apiKey, 'X-App-Token': appToken } };
        const createPaymentRequestResponse = await axios.post(`${tikkieUrl}/paymentrequests`, data, config);
        const { url, paymentRequestToken, createdDateTime } = createPaymentRequestResponse.data;

        // save paymentrequest + business id information with name to appointments db
        const appointment = {
            appointmentId: uuid(),
            tikkie: { url, paymentRequestToken, createdDateTime },
            isPaid: false,
            businessId,
            customerName,
            description,
            amountInCents
        };
        appointmentCollection.insertOne(appointment);

        // return response with appointment information
        console.log("successful posting appointment", appointment);
        res.json(appointment);

    } catch (err) {
        console.log("error while posting appointment");
        res.status(500).send("Internal Server Error");
    }
});

app.post("/callback", async (req, res, next) => {
    // look up subscriptionId in business db to validate we want to listen to it
    //     and get the business id from it
    // look for the payment request of that business id in the appointment table
    // mark appointment as paid (or add counter)
    res.status(500).json("Not Yet Implemented");
});

app.get("/appointment", async (req, res, next) => {
    try {
        // get the businessid from the request (cookie)
        const businessId = req.headers['x-business-id'];
        if (businessId === undefined) {
            throw new Error("Missing businessId");
        }

        // get appointments of the business in the business db
        const appointments = await appointmentCollection.find({ businessId }).toArray();
        const appointmentIds = appointments.map(a => a.appointmentId);

        // return response with appointment information
        console.log("successful getting list of appointments", appointmentIds);
        res.json(appointmentIds);

    } catch (err) {
        console.log("error while getting list of appointments");
        res.status(500).send("Internal Server Error");
    }
});

app.get("/appointment/:appointmentId", async (req, res, next) => {
    // get the businessid (cookie) and the appointmentId (path param) from the request 
    // return appointment information for business id and appointment id

    try {
        // get the businessid from the request (cookie)
        const businessId = req.headers['x-business-id'];
        const { appointmentId } = req.params;
        if (businessId === undefined || appointmentId === undefined) {
            throw new Error("Missing businessId or appointmentId");
        }

        // get appointments of the business in the business db
        const appointment = await appointmentCollection.findOne({ businessId, appointmentId });

        // return response with appointment information
        console.log("successful getting single appointment", appointment);
        res.json(appointment);

    } catch (err) {
        console.log("error while getting single appointment");
        res.status(500).send("Internal Server Error");
    }
})

app.listen(17233, () => {
 console.log("Server running on port 17233");
});