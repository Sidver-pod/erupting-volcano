const path = require('path');
const bodyParser = require('body-parser');

const express = require('express');

require('dotenv').config();

const sequelize = require('./util/database');

// database models
const NextPageToken = require('./models/NextPageToken');
const VideoData = require('./models/VideoData');

const cors = require('cors');

const app = express();

const youtubeDataRoute = require('./routes/youtubeDataRoute');

app.use(cors());

/* routes */

// #1
app.use('/fampay-assignment', youtubeDataRoute);

// #2
app.use('/fampay', (req, res) => {
   res.sendFile(path.join(__dirname, req.url)); // sends the file from the file path mentioned in the URL to the Client!
});

// #3
app.use('/', (req, res) => {
   res.sendStatus('404'); // URL Not Found!
});

app.use(bodyParser.json()); // helps parse the body of an incoming request

let callYouTubeDataAPI = require('./service/server-request');
callYouTubeDataAPI(); // calling this function allows the Server to request data from YouTube's Data API

// One-Many association
NextPageToken.hasMany(VideoData);
VideoData.belongsTo(NextPageToken);

sequelize.sync()
 .then(result => {
    console.log('database sync: CHECK');
    app.listen(process.env.PORT);
 })
 .catch(err => console.error(err));