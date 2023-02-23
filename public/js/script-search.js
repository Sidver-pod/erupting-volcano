let title = ""; // default value
let description = ""; // default value

/* 
    checking the database to see whether the searched values (title & description) are present;
    if so, then it retrieves that data and presents it on the frontend!
*/
function searchVideoData() {

    let currentSearchPageNo = parseInt(localStorage.getItem('currentSearchPageNo')); // required for pagination

    axios.get('http://localhost:3000/fampay-assignment/search', {
        params: {
            title: title,
            description: description,
            currentPageNo: currentSearchPageNo
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
            const totalCount_SearchData = result.data.totalCount_SearchData;
            const search_data = result.data.search_data; // array
            const DATA_PER_PAGE = result.data.DATA_PER_PAGE;

            let totalPageCount = Math.ceil(totalCount_SearchData/DATA_PER_PAGE); // determining total page count

            let totalPageNumberElement = document.getElementsByClassName('total-page-number')[0];
            totalPageNumberElement.innerText = totalPageCount; // setting total page count

            let inputBox = document.getElementById('page-number');
            inputBox.max = totalPageCount; // setting 'max' for input box

            tbody = document.getElementsByTagName('tbody')[0];

            // populating the table rows with YouTube Video Data
            for(let i=0; i<search_data.length; i++) {
                let tr = document.createElement('tr');
                tbody.appendChild(tr);

                // #1
                let td_thumbnail = document.createElement('td');
                let img = document.createElement('img');
                img.src = search_data[i].thumbnailURL;
                img.width = "120";
                img.height = "90";
                tr.appendChild(td_thumbnail);
                td_thumbnail.appendChild(img);

                // #2
                let td_title = document.createElement('td');
                td_title.innerText = search_data[i].title;
                tr.appendChild(td_title);

                // #3
                let td_description = document.createElement('td');
                td_description.innerText = search_data[i].description;
                tr.appendChild(td_description);

                // #4
                let td_publishedAt = document.createElement('td');
                td_publishedAt.innerText = search_data[i].publishedAt;
                tr.appendChild(td_publishedAt);
            }
        }
        else {
            alert('No match found!');
        }
    })
    .catch(err => {
        alert('Connection to server lost! Server may be down.');
        console.error(err);
    });
}

// function that does a common task for both prevData() & nextData()
function commonTask(page_num) {
    // filling the text box with new page number
    let textBox = document.getElementById('page-number');
    textBox.value = page_num;

    localStorage.setItem('currentSearchPageNo', `${page_num}`);

    searchVideoData();
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

    let currentSearchPageNo = parseInt(localStorage.getItem('currentSearchPageNo'));

    let inputElement = document.getElementById('page-number');
    let newInputValue = inputElement.value;

    let totalPageNumber = parseInt(document.getElementsByClassName('total-page-number')[0].innerText);

    // invalid input!
    if(newInputValue <= 0) {
        inputElement.value = currentSearchPageNo; // resetting the value back to original
    }
    // invalid input!
    else if(newInputValue > totalPageNumber) {
        inputElement.value = currentSearchPageNo; // resetting the value back to original
    }
    // valid input...
    else if(newInputValue !== currentSearchPageNo){
        localStorage.setItem('currentSearchPageNo', `${newInputValue}`);
        
        searchVideoData();
    }
}

function clickedSearchButton(e) {
    e.preventDefault();

    title = document.getElementById('search_title').value; // search query #1
    description = document.getElementById('search_description').value; // search query #2

    // search only when at least the 'title' field is filled!
    if(title !== "") {
        searchVideoData();
    }
    // invalid case!
    else {
alert(`
In order to search something you must first start from what you already know. Please enter in what you know into at least one of the search fields provided. That said 'Title' is a must! 
            
NOTE: Be very specific with your letters. Otherwise, you won't see any result pop up. Anything you search for must be exactly the same (word for word!).
`);
    }
}

document.addEventListener('DOMContentLoaded', (e) => {

    localStorage.setItem('currentSearchPageNo', '1'); // default page number

    document.getElementById('button-left').addEventListener('click', prevData); // triggered when 'left button' is clicked

    document.getElementById('button-right').addEventListener('click', nextData); // triggered when 'right button' is clicked

    document.getElementById('form-pagination').addEventListener('submit', inputPageNo); // triggered when the form is submitted (text-box input)

    document.getElementById('search-button').addEventListener('click', clickedSearchButton); // triggered on clicking 'Search' button
});