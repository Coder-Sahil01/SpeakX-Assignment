require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Question = require('../models/QuestionModel');
const app = express();
const cors = require('cors');

app.use(cors(
    {origin:"*"}
));

app.get('/', async (req, res) => {
    const { limit = 15, page = 1, title = null } = req.query;
    const limitValue = parseInt(limit, 10);
    const pageValue = parseInt(page, 10);
    const totalSkip = limitValue * (pageValue - 1);

    try {

        let query = {};
        if (title) {
            query = { title: { $regex: title, $options: 'i' } }; // Case-insensitive regex search
        }

        const data = await Question.find(query).skip(totalSkip).limit(limitValue);
        const totalRecords = await Question.countDocuments(query);

        res.json({ data, totalRecords, currentPage: pageValue });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ error: "An error occurred while fetching data." });
    }
});


app.listen(4000, () => {
    console.log("server is running on port no 4000");

})

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to database");

}).catch((error) => {
    console.log(error);

})

module.exports = app;
