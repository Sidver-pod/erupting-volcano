# FamPay Backend Assignment

## High Level Design

#### **#1** Fetching video data from YouTube Data API (v3) every _10 seconds_.
![Server fetching latest video data from YouTube Data API and storing in Database](https://user-images.githubusercontent.com/75096302/220896124-930723f7-9f15-42be-9d0f-5bc236758b5b.jpg)

#### **#2** Presenting video data to Client in a paginated fashion
![Client sending GET/Search request to Server; Server retrieves data from Database and returns to Client](https://user-images.githubusercontent.com/75096302/220896135-4bfc10df-c330-4f25-ae2e-e205fa760b58.jpg)

#### **#3** Database Schema & Association
![One-Many Association between NextPageToken table and VideoData table respectively](https://user-images.githubusercontent.com/75096302/220896143-fe8a4e6b-c4ac-478d-99b9-013637eba014.jpg)

<br>

## What's the project about?
1. Server sends a GET request to **YouTube Data API (v3)** every _10 seconds_ and fetches data (information related to latest videos) on a pre-defined search query: "_TED-Ed Animation_".
    > Note: through the use of _maxResults_ and _pageToken_, provided in the response from YouTube Data API, data is received in a paginated fashion.
2. Data received is then stored in a Database.
3. This data is then presented to a Client requesting for it in a paginated fashion. Each video data is presented in a reverse chronological order of the date-time it was published in (i.e. in descending order; latest videos show up first)
4. Also, Client is capable of making search queries for this data by providing its _Title_ and _Description_.
    > Note: searching with a _Description_ is optional as many of the data don't necessarily have one.

## **"How to run this project on my local computer?"**
Either of the following two ways will help you with that:-
1. If you use Docker I suppose you know your whereabouts way better than many people in this industry! So let me fastrack you on your journey. The following sections will be enough for you: 
    - <a href="#docker">Docker</a>
    - <a href="#change">Changes to make...</a>
    - <a href="#api-testing">API Testing</a>

<br>

2. If the word _Docker_ is intimidating you right now I recommend taking the most worn path (it's safe and sound without cliff-hangers, whales and an ocean full of errors!):
    - <a href="#min-req">Minimum Requirements</a>
    - <a href="#install">Install the following packages</a>
    - <a href="#change">Changes to make...</a>
    - <a href="#run">Running the Server</a>
    - <a href="#api-testing">API Testing</a>

<br>
<hr>

## Docker <span id="docker"></span>
1. Make sure you have Docker installed on your computer.
2. Clone this repository on to your local computer.
3. Open the project in VS Code (or your preferred IDE).
4. **Important →** <a href="#change">Changes to make...</a>
5. Make sure you are in the root directory of the project folder. Open the CLI (command-line-interface) and run the following commands:-
    ```sh
    #1 builds all the services
    docker-compose build

    #2 runs images as Containers (in detached mode; in the background)
    docker-compose up -d
    ```
6. You're all set! The Server and Database should be up and running. But this is not it, keep reading...
    > **Important Note →** It is necessary for both the containers (Server and Database) to run in sync with each other. To come to that conclusion there is a 'healthcheck' condition set up wherein once the Database Container is up and running it will inform the Server Container about it. Only then is when you'll be able to access the API through a PORT number that the Server will listen on. From the time you start running the Containers it takes about **31.6 seconds** for both to be in sync. So have patience!
7. It is time for the most awaited of all → <a href="#api-testing">API Testing</a>
8. Once you're done with it all, or want to play around, you may run these commands:-
    ```sh
    #3 see all Containers relevant to the running project
    docker-compose ps

    #4 stops a running Docker Container
    docker stop <container_id or container_name>

    #5 removes the Containers and their persistent volumes!
    docker-compose down --volumes
    
    #6 remove any dangling images
    docker rmi $(docker images -f "dangling=true" -q)
    ```

<hr>

## Minimum Requirements <span id="min-req"></span>
1. **Node.js** version 16.0 (or newer)
    - Once set up, run the following command to install mandatory packages: `npm install`
2. **MySQL** version 8.0 (or newer)
3. And don't forget to clone this repository and open it in VS Code (or your preferred IDE).

<hr>

## Install the following packages <span id="install"></span>

> Note: Running `npm install` with the project open in **Node.js** will install all the packages mentioned below in one go! It is possible due to the _dependencies_ mentioned in the "package.json" file. So skip this section if you could follow along. However, if you're unsure what this note meant, please continue installing the packages by their respective commands, as mentioned below.

- **Axios** `npm install axios --save`

- **dotenv** `npm install dotenv --save`

- **Body-Parser** `npm install body-parser --save`

- **Express** `npm install express --save`

- **MySQL2** `npm install mysql2 --save`

- **Sequelize** `npm install sequelize --save`

- **CORS** `npm install cors --save`

<hr>

## Changes to make... <span id="change"></span>
- Make changes to the `.env` file by populating respective fields with the values provided to you in the email.

<hr>

## Running the Server <span id="run"></span>
- Before running the Server make sure you have set up a schema in MySQL database with the right configuration (check your email).
- Command to run the server:
    ```sh
    npm start
    ```

<hr>

## API Testing <span id="api-testing"></span>

- ### **GET API**

    -
        Let's say you want to get all the YouTube video data that is available in the Database. To do so you'll have to send a GET request to the Server. You can do that in **three** ways:-

        1. by typing the following URL in your web browser (**recommended**):
           ```url
           http://localhost:3000/fampay/views/video-data.html
           ```

        2. or, by opening "`video-data.html`" file which is stored in the "`views`" folder

        3. or, by directly accessing the URL:
            ```url 
            http://localhost:3000/fampay-assignment/video-data?currentPageNo=1
            ```
            >   Note: If you want to play around with the query parameter, you should know that the lowest value for _`currentPageNo`_ is _`1`_ and the highest value depends upon the amount of data there is in the Database.
        
    <br>

- ### **Search API**

    -
        Let's say you want to search the Database for data relating to a particular video by its _Title_ and _Description_. To do so you'll have to send a GET request with query parameters to the Server. You can do that in **three** ways:-

        1. by typing the following URL in your web browser, filling up a form that shows up and submitting it (**recommended**):
           ```url
           http://localhost:3000/fampay/views/search.html
           ```

        2. or, by opening "`search.html`" file which is stored in the "`views`" folder and filling out the form asking for _Title_ and _Description_ and clicking the _Search button_.

        3. or, by directly accessing the URL:
            ```url
            http://localhost:3000/fampay-assignment/search?title=TED-Ed&description=%23&currentPageNo=1
            ```
            >   Note: I don't recommend using the URL directly as query parameters are supposed to be encoded. To give you an example observe _`%23`_ in the URL; it is the _UTF-8_ encoded representation of the special character _`#`_.

<br>
<hr>
<br>

>## **Important Note ⚠️**
>Once YouTube's allocated quota for making requests to its Data API exhausts, you'll no longer be able to request for more data! Read more about it here → [YouTube Data API - Quota and Compliance Audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits).

## Reference Links
- [YouTube Data API (v3) Search: list](https://developers.google.com/youtube/v3/docs/search/list)
- [YouTube Data API (v3) Implementation: Pagination](https://developers.google.com/youtube/v3/guides/implementation/pagination)

# Impact the making of this project has had...
Through the creation of this project, I discovered that **YouTube Data API (v3)** happens to have bugs in it. Bug #1: data received through pagination keeps repeating one after another or is spreading among several pages when _maxResults_ is a number lesser than 50. Bug #2: page tokens— _nextPageToken_ & _prevPageToken_ obtained through pagination are not the same (of the first & third pages, respectively). The first time I reported this to Google, one of the engineers couldn't reproduce the problem and marked it as _"Intended behavior"_. So I reported again, this time with a more reasonable explanation. And it got accepted but got a mark of 'Duplicate' pointing to my previous report! Though it has been overlooked or is being processed internally (I cannot know), I can validate that this is a legitimate problem.
<br>
Check it out → [Google Issue Tracker](https://issuetracker.google.com/issues/269646336).
