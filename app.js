"use strict";

/**
 * CS 132 Spring 2024 CP4
 * @author Nika Chuzhoy
 * Date: Jun 14, 2024
 * This API provides functionality to maintain an ecommerce website
 * selling postcards. It provides information on available products
 * and manages feedback.
*/

const express = require("express");
const fs = require("fs/promises");
const multer = require("multer");
const cards = require('./cards.json');
const faq = require('./faq.json');

const app = express();
app.use(express.static("public"));
app.use(multer().none());

const CLIENT_ERR_CODE = 400; // Bad Request
const SERVER_ERR_CODE = 500; // Internal Server Error
const NOT_FOUND_ERR_CODE = 404;
const SERVER_ERROR = "Oh no! Something has gone wrong on our end. Please refresh or try again later.";
const FEEDBACK_PATH = "feedback.json";

const DEBUG = true;

const PORT = process.env.PORT || 8000;
app.listen(PORT);
console.log(`Listening at port ${PORT}`);

/**
 * Updates feedback.json with user feedback
 * Returns a message indicating if the update was successful
 */
app.post("/contact", async (req, res, next) => {
    let feedback = parseFeedback(req.body.email, req.body.contactOK, req.body.message);

    if (!feedback) {
        res.status(CLIENT_ERR_CODE);
        next(Error("Required POST parameters for /contact: email, contactOK, message."));
    }
  
    try {
        let feedbackData = await fs.readFile(FEEDBACK_PATH, "utf8");
        feedbackData = JSON.parse(feedbackData);;
        feedbackData.push(feedback);
        await fs.writeFile(FEEDBACK_PATH, JSON.stringify(feedbackData, null, 4), "utf8");
        res.type("text").send("Thank you for your feedback!");
    } 
    catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Gets all cards matching a given country
 */
app.get('/cards/:country', async (req, res) => {
    const countryCards = cards[req.params.country];
    if (countryCards) {
        res.json(countryCards);
    }
    else {
        res.status(NOT_FOUND_ERR_CODE).send('Country not found.');
    }
});

/**
 * Searches for card matching a given UID
 */
app.get('/card/:id', async (req, res) => {
    let foundCard = null;
    for (const country in cards) {
        foundCard = cards[country].find(card => card.id === req.params.id);
        if (foundCard) {
            res.json(foundCard);
            return;
        }
    }
    res.status(NOT_FOUND_ERR_CODE).send('Card not found.');
});

/**
 * Gets all cards in database
 */
app.get('/cards', async (req, res, next) => {
    try {
        res.json(cards);
    }
    catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Gets all frequently asked questions
 */
app.get('/faq', async (req, res, next) => {
    try {
        res.json(faq);
    }
    catch (err) {
        res.status(SERVER_ERR_CODE);
        err.message = SERVER_ERROR;
        next(err);
    }
});

/**
 * Helper function for contact POST endpoint
 * Validates and processes feedback
 */
function parseFeedback(email, contactOK, message) {
    if (!email || !contactOK || !message) return null;
    const timestamp = new Date().toUTCString();
    return { email, contactOK, message, timestamp };
}

/**
 * Error handling middleware
 */
function errorHandler(err, res) {
    if (DEBUG) {
      console.error(err.stack);
    }
    const status = err.status || SERVER_ERR_CODE;
    const message = err.message || 'Unknown error';
    res.type('text').status(status).send(message);
}
  
app.use(errorHandler);