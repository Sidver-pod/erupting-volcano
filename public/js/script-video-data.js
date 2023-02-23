/* 
    checking the database to see whether there is any data available at all;
    if so, then it retrieves all that data but in a paginated fashion;
    (this is made possible through 'page number elements' on the page and 'localStorage')
*/

function getVideoData() {
    let currentPageNo = parseInt(localStorage.getItem('currentPageNo')); // required for pagination

    axios.get('http://localhost:3000/fampay-assignment/video-data', {
        params: {
            currentPageNo: currentPageNo
        }
    })
    .then(result => {
        // first making sure that previous data rows are cleared out from the table! (on frontend)
        let arrayOfRows = document.getElementsByTagName('tbody')[0].children;
        let count_of_rows = arrayOfRows.length;

        while(count_of_rows) {
            arrayOfRows[0].remove();
            count_of_rows--;
        }
        
        return result;
    })
    .then(result => {
        // data is available!
        if(result.data.check) {
            /* Extracting response data */
            const totalCount_VideoData = result.data.totalCount_VideoData;
            const video_data = result.data.video_data; // array
            const DATA_PER_PAGE = result.data.DATA_PER_PAGE;

            let totalPageCount = Math.ceil(totalCount_VideoData/DATA_PER_PAGE); // determining total page count

            let totalPageNumberElement = document.getElementsByClassName('total-page-number')[0];
            totalPageNumberElement.innerText = totalPageCount; // setting total page count

            let inputBox = document.getElementById('page-number');
            inputBox.max = totalPageCount; // setting 'max' for input box

            tbody = document.getElementsByTagName('tbody')[0];

            // populating the table rows with YouTube Video Data
            for(let i=0; i<video_data.length; i++) {
                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                // #1
                let td_thumbnail = document.createElement('td');
                let img = document.createElement('img');
                img.src = video_data[i].thumbnailURL;
                img.width = "120";
                img.height = "90";
                tr.appendChild(td_thumbnail);
                td_thumbnail.appendChild(img);

                // #2
                let td_title = document.createElement('td');
                td_title.innerText = video_data[i].title;
                tr.appendChild(td_title);

                // #3
                let td_description = document.createElement('td');
                td_description.innerText = video_data[i].description;
                tr.appendChild(td_description);

                // #4
                let td_publishedAt = document.createElement('td');
                td_publishedAt.innerText = video_data[i].publishedAt;
                tr.appendChild(td_publishedAt);
            }
        }
        else {
            alert('No data in database! Please wait for 10 seconds before refreshing your page.');
        }
    })
    .catch(err => {
        alert('Connection to server lost! Server may be down.');
        console.error(err);
    });
}

// does a common task of setting the page number and fetching data for both prevData() & nextData()
function commonTask(page_num) {
    // filling the text box with new page number
    let textBox = document.getElementById('page-number');
    textBox.value = page_num;

    localStorage.setItem('currentPageNo', `${page_num}`);

    getVideoData();
}

function prevData(e) {
    let inputElement = document.getElementById('page-number');
    let inputValue = inputElement.value;

    // invalid case!
    if(inputValue <= 1) {
        inputElement.value = 1; // setting it back to default!
    }
    else if(inputValue !== 1) {
        let page_num = inputValue;
        page_num -= 1; // subtracting by 1 to go to the previous page

        commonTask(page_num);
    }
}

function nextData(e) {
    let inputValue = document.getElementById('page-number').value;
    let totalPageNumber = parseInt(document.getElementsByClassName('total-page-number')[0].innerText);

    if(inputValue < totalPageNumber) {
        let page_num = parseInt(inputValue);
        page_num += 1; // incrementing by 1 to go to the next page

        commonTask(page_num);
    }
}

function inputPageNo(e) {
    e.preventDefault(); // prevents default submission of the form

    let currentPageNo = parseInt(localStorage.getItem('currentPageNo'));

    let inputElement = document.getElementById('page-number');
    let newInputValue = inputElement.value;

    let totalPageNumber = parseInt(document.getElementsByClassName('total-page-number')[0].innerText);

    // invalid input!
    if(newInputValue <= 0) {
        inputElement.value = currentPageNo; // resetting the value back to original
    }
    // invalid input!
    else if(newInputValue > totalPageNumber) {
        inputElement.value = currentPageNo; // resetting the value back to original
    }
    // valid input...
    else if(newInputValue !== currentPageNo){
        localStorage.setItem('currentPageNo', `${newInputValue}`);
        
        getVideoData();
    }
}

document.addEventListener('DOMContentLoaded', (e) => {

    localStorage.setItem('currentPageNo', '1'); // default page number

    document.getElementById('button-left').addEventListener('click', prevData); // triggered when 'left button' is clicked

    document.getElementById('button-right').addEventListener('click', nextData); // triggered when 'right button' is clicked

    document.getElementById('form-pagination').addEventListener('submit', inputPageNo); // triggered when the form is submitted (text-box input)

    getVideoData(); // fetches video data from database
});