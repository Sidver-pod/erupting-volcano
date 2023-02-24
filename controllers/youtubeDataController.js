const VideoData = require('../models/VideoData');

let DATA_PER_PAGE = 3; // required for pagination

exports.getVideoData = (req, res, next) => {
    const currentPageNo = req.query.currentPageNo;

    // invalid case #1: User is trying to access this URL, but not from the website!!
    if(currentPageNo === undefined || currentPageNo <= 0) {
        return res.sendStatus(404);
    }

    // OPTIMISED (querying the database only once to get back both 'total count' & 'video data' needed for pagination!)
    VideoData.findAndCountAll({
        order: [
            ['publishedAt', 'DESC']
        ],
        offset: (currentPageNo - 1) * DATA_PER_PAGE,
        limit: DATA_PER_PAGE,
        attributes: [
            'title', 'description', 'publishedAt', 'thumbnailURL'
        ]
    })
    .then(result => {
        let totalCount_VideoData = result.count; // integer
        let video_data = result.rows; // array
        let totalNumOfPages_Possible = Math.ceil(totalCount_VideoData/DATA_PER_PAGE);

        if(totalCount_VideoData === 0) {
            res.json({
                'check': false,
                'message': 'No data in database!'
            });
        }
        // invalid case #2: User is trying to access this URL, but not from the website!!
        else if(currentPageNo > totalNumOfPages_Possible) {
            return res.sendStatus(404);
        }
        else {
            res.json({
                'check': true,
                'totalCount_VideoData': totalCount_VideoData,
                'video_data': video_data,
                'DATA_PER_PAGE': DATA_PER_PAGE
            })
        }
    })
    .catch(err => console.error(err));
};

exports.getSearch = (req, res, next) => {
    const title = req.query.title;
    let description = req.query.description;
    const currentPageNo = req.query.currentPageNo;

    // invalid case: User is trying to access this URL, but not from the website!!
    if(currentPageNo === undefined || currentPageNo <= 0) {
        return res.sendStatus(404);
    }

    /* OPTIMISED (querying the database only once to get back both 'total count' & 'video data' needed for pagination!) */

    /* when User fills in the 'description' as well */
    if(description !== "") {
        VideoData.findAndCountAll({
            where: {
                title: title,
                description: description
            },
            offset: (currentPageNo - 1) * DATA_PER_PAGE,
            limit: DATA_PER_PAGE,
            attributes: [
                'title', 'description', 'publishedAt', 'thumbnailURL'
            ]
        })
        .then(result => {
            let totalCount_SearchData = result.count;
            let search_data = result.rows;

            if(totalCount_SearchData === 0) {
                res.json({
                    'check': false,
                    'message': "No match found!"
                });
            }
            else {
                res.json({
                    'check': true,
                    'totalCount_SearchData': totalCount_SearchData,
                    'search_data': search_data,
                    'DATA_PER_PAGE': DATA_PER_PAGE
                });
            }
        })
        .catch(err => console.error(err));
    }

    /* when User leaves the 'description' empty! */
    else if(description === "") {
        VideoData.findAndCountAll({
            where: {
                title: title
            },
            offset: (currentPageNo - 1) * DATA_PER_PAGE,
            limit: DATA_PER_PAGE,
            attributes: [
                'title', 'description', 'publishedAt', 'thumbnailURL'
            ]
        })
        .then(result => {
            let totalCount_SearchData = result.count;
            let search_data = result.rows;

            if(totalCount_SearchData === 0) {
                res.json({
                    'check': false,
                    'message': "No match found!"
                });
            }
            else {
                res.json({
                    'check': true,
                    'totalCount_SearchData': totalCount_SearchData,
                    'search_data': search_data,
                    'DATA_PER_PAGE': DATA_PER_PAGE
                });
            }
        })
        .catch(err => console.error(err));
    }
};
