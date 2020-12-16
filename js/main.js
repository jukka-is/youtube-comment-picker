import { youtubeApiKey } from './../api-keys.js';
import { CommentList } from './CommentList.js';

console.log('Main JS loaded');


// Functions

function submitVideoId() {

    if (isValidId(videoIdField.value)) {
        console.log('video id submitted: ' + videoIdField.value);
        commentData.video.id = videoIdField.value;
        //Loads client, get's data from Api and updates results in Dom
        gapi.load("client", startApiCall);
    }
    else {
        console.log("Can't submit invalid YouTube ID");
    }
}


function updateId() {

    if (isValidId(videoIdField.value)) {
        activateButton(submitButton);
    }
    else {
        console.log('Not a valid Youtube ID');
    }

    if (commentData.isSet && commentData.video.id != videoIdField.value) {
        commentData.resetData();
        resetResultsInDom();
    }
}


function isValidId(id) {
    const regex = /([a-zA-Z0-9_-]{11})/;
    return regex.test(id);
}


async function startApiCall() {
    const clientSettings = {
        'apiKey': youtubeApiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    }
    let clientResponse = await gapi.client.init(clientSettings);

    getData()
        .then(() => updateResultsInDom())
        .catch(reason => {
            errorMessageSpan.textContent = "Could not find YouTube video with the ID. Please try again.";
            return 'Error: ' + reason.result.error.message;
        });
    return;
}


async function getData() {

    const commentSettings = {
        "part": ["snippet"],
        "maxResults": 100,
        "videoId": videoIdField.value,
        "searchTerms": searchTermsField.value,
        "access_token": youtubeApiKey
    }
    const videoSettings = {
        "part": ["snippet"],
        "id": [videoIdField.value],
        "access_token": youtubeApiKey
    }

    let commentResponse = await gapi.client.youtube.commentThreads.list(commentSettings);
    let videoResponse = await gapi.client.youtube.videos.list(videoSettings);

    processCommentData(commentResponse);
    processVideoData(videoResponse);
    finishProcessingData();

    return;
}


function processCommentData(response) {

    console.log('Processing Comment Data...');
    const data = response.result;
    let modifiedComments = [];
    for (let comment of data.items) {
        let modifiedComment = {
            'id': comment.snippet.topLevelComment.snippet.authorChannelId.value,
            'name': comment.snippet.topLevelComment.snippet.authorDisplayName,
            'imageUrl': comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
            'content': comment.snippet.topLevelComment.snippet.textOriginal,
        };
        modifiedComments.push(modifiedComment);
    }

    commentData.comments = modifiedComments;

    let uniqueComments = uniqueCommentsCheckbox.checked;
    let excludeCreator = excludeCreatorCheckbox.checked;
    commentData.filterComments(uniqueComments, excludeCreator);

    return response;
}


function processVideoData(response) {

    console.log('Processing Video Data...');
    const data = response.result;

    commentData.video.channelName = data.items[0].snippet.channelTitle;
    commentData.video.title = data.items[0].snippet.title;
    commentData.video.channelId = data.items[0].snippet.channelId;

    return response;
}


function finishProcessingData() {
    commentData.isSet = true;
}


function updateResultsInDom() {

    console.log('Updating reults')

    channelNameSpan.textContent = commentData.video.channelName;
    videoTitleSpan.textContent = commentData.video.title;
    commentsCountSpan.textContent = commentData.comments.length;
    activateButton(pickWinnerButton);
}


function resetResultsInDom() {

    console.log('Resetting dom...')

    errorMessageSpan.textContent = '';
    channelNameSpan.textContent = '';
    videoTitleSpan.textContent = '';
    commentsCountSpan.textContent = '';
    winnerNameSpan.textContent = '';
    winnerCommentSpan.textContent = '';
    winnerImg.setAttribute('src', '');
    disableButton(submitButton);
    disableButton(pickWinnerButton);
}


function resetAll() {
    resetResultsInDom();
    commentData.resetData();
    videoIdField.value = '';
    uniqueCommentsCheckbox.checked = true;
    excludeCreatorCheckbox.checked = true;
}


function pickWinner() {

    console.log('Picking winner...');

    if (commentData.isSet) {
        let winner = commentData.comments[Math.floor(Math.random() * commentData.comments.length)];
        winnerNameSpan.textContent = winner.name;
        winnerCommentSpan.textContent = winner.content;
        winnerImg.setAttribute('src', winner.imageUrl);
    }
}


function disableButton(buttonElement) {
    buttonElement.setAttribute('disabled', true);
}


function activateButton(buttonElement) {
    buttonElement.removeAttribute('disabled');
}


// DATA

let commentData = new CommentList();


// DOM elements

let videoIdField = document.getElementById('video-id');
let submitButton = document.getElementById('submit-video-id');
let pickWinnerButton = document.getElementById('pick-winner');
let resetButton = document.getElementById('reset');
let searchTermsField = document.getElementById('search-terms');
let uniqueCommentsCheckbox = document.getElementById('unique-comments');
let excludeCreatorCheckbox = document.getElementById('exclude-creator');
let errorMessageSpan = document.getElementById('error-message');
let channelNameSpan = document.getElementById('channel-name');
let videoTitleSpan = document.getElementById('video-title');
let commentsCountSpan = document.getElementById("comments-count");
let winnerNameSpan = document.getElementById("winner-name");
let winnerCommentSpan = document.getElementById("winner-comment");
let winnerImg = document.getElementById("winner-image");


// Events

videoIdField.addEventListener('input', updateId);
videoIdField.addEventListener('paste', updateId);
submitButton.addEventListener('click', submitVideoId);
pickWinnerButton.addEventListener('click', pickWinner);
resetButton.addEventListener('click', resetAll);

