/*
    This server sends a GET request to YouTube's Data API every 10 seconds. It fetches information related to latest videos on the pre-defined search query: 'TED-Ed Animation'.
*/

// database models
const NextPageToken = require('../models/NextPageToken');
const VideoData = require('../models/VideoData');

const axios = require('axios');

/* URL query parameters */
const part = 'snippet';
const maxResults = 10;
const order = 'date';
const publishedAfter = '2005-01-01T00:00:00Z';
const q = 'TED-Ed Animation';
const type = 'video';
const key = process.env.API_KEY;
let nextPageToken; // required for Pagination (value comes in from YouTube Data API)

// #1 storing 'nextPageToken' in the database
function storing_nextPageToken(nextPageToken) {
    return new Promise((resolve, reject) => {
        NextPageToken.create({
            token: nextPageToken
        })
        .then(result => {
            resolve(result);
        })
        .catch(err => reject(err));
    });
}

// #2 storing video data in database
function storing_videoData(NextPageTokenId, videoData) {
    return new Promise((resolve, reject) => {
        // NOTE: 'NextPageTokenId' is a foreign key in this table
        VideoData.create({
            title: videoData.title,
            description: videoData.description,
            publishedAt: videoData.publishedAt,
            thumbnailURL: videoData.thumbnailURL,
            NextPageTokenId: NextPageTokenId
        })
        .then(result => {
            resolve();
        })
        .catch(err => reject(err));
    });
}

/* stores the data received from YouTube Data API in the database */
async function StoreInDatabase(result) {
    try {
        nextPageToken = result.data.nextPageToken;
        
        // #1 Storing 'nextPageToken' in database
        let tokenResult = await storing_nextPageToken(nextPageToken);
        let NextPageTokenId = tokenResult.dataValues.id; // ID number (from database)

        const items = result.data.items; // YouTube Data array

        // looping through YouTube Data array
        for(let i=0; i<items.length; i++) {
            let fetchedVideoData = items[i].snippet;

            /* Extracting video data */
            let videoData = {
                title: fetchedVideoData.title,
                description: fetchedVideoData.description,
                publishedAt: fetchedVideoData.publishedAt,
                thumbnailURL: fetchedVideoData.thumbnails.default.url
            }

            // #2 Storing video data in database
            await storing_videoData(NextPageTokenId, videoData);
        }
    }
    catch(err) {
        console.error(err);
    }
}

/* when server stops/starts again it first retrieves the token that was last stored in the database! */
function retrieving_nextPageToken() {
    return new Promise((resolve, reject) => {
        NextPageToken.findAll({
            limit: 1,
            order: [
                ['createdAt', 'DESC']
            ]
        })
        .then(result => {
            // token found
            if(result.length) {
                resolve(result[0].dataValues.token);
            }
            // no token available (database is empty!)
            else {
                resolve(undefined);
            }
        })
        .catch(err => reject(err));
    });
}

let flag = true; // helps query the database for 'nextPageToken' when the Server boots-up for the very first time either normally or due to crashing/shutting-down!

async function GET_YouTube_Data() {
    try{
        /* when server stops/starts again it first retrieves the token that was last stored in the database! */
        if(flag === true) {
            nextPageToken = await retrieving_nextPageToken();
            flag = false;
        }

        // with page token
        if(nextPageToken) {
            axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=${part}&maxResults=${maxResults}&order=${order}&publishedAfter=${publishedAfter}&q=${q}&type=${type}&key=${key}&pageToken=${nextPageToken}`)
            .then(result => {
                StoreInDatabase(result);
            })
            .catch(err => console.error(`YouTube Quota Exceeded!`, err)); // YouTube quota exceeded error! ( 2 )
        }
        // without page token (the very first request goes through this!)
        else {
            axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=${part}&maxResults=${maxResults}&order=${order}&publishedAfter=${publishedAfter}&q=${q}&type=${type}&key=${key}`)
            .then(result => {
                StoreInDatabase(result);
            })
            .catch(err => console.error(`YouTube Quota Exceeded!`, err)); // YouTube quota exceeded error! ( 1 )
        }
    }
    catch(err) {
        console.error(err);
    };
}

let intervalID; // stores interval ID of setInterval()

function callYouTubeDataAPI() {
    intervalID = setInterval(GET_YouTube_Data, 10000); // runs every 10 seconds
}

module.exports = callYouTubeDataAPI;