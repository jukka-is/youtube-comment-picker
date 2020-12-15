import {youtubeApiKey} from './../api-keys.js';
import {CommentList} from './CommentList.js';

console.log('Main JS loaded');


function submitVideoId(){
    if ( isValidId(videoIdField.value) ) {
        console.log('video id submitted: ' + videoIdField.value);
        commentData.video.id = videoIdField.value;
        gapi.load("client", start);
    }
    else {
        console.log('Video id is not valid');
    }
}

function updateId(){
    
    console.log('Video id updated "' + videoIdField.value + '", which is ' + isValidId(videoIdField.value));
    if(commentData.isSet && commentData.video.id != videoIdField.value){
        resetResults();
    }
}

function isValidId(id){
    const regex = /([a-zA-Z0-9_-]{11})/;
    return regex.test(id);
}

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
      'apiKey': youtubeApiKey,
      // Your API key will be automatically added to the Discovery Document URLs.
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    }).then(function() {
      // 3. Initialize and make the API request.
      return gapi.client.youtube.commentThreads.list({
        "part": [
          "snippet"
        ],
        "maxResults": 100,
        "videoId": videoIdField.value,
        "access_token": youtubeApiKey
      });
    }).then(function(response) {
      returnData(response.result);
    }, function(reason) {
      return 'Error: ' + reason.result.error.message;
    });

};

function returnData(data){

    console.log(data);
    
    let modifiedComments = [];

    for (let comment of data.items){
        let modifiedComment = {
            'id' : comment.snippet.topLevelComment.snippet.authorChannelId.value,
            'name' : comment.snippet.topLevelComment.snippet.authorDisplayName,
            'imageUrl' : comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
            'content' : comment.snippet.topLevelComment.snippet.textDisplay,
        };
        
        modifiedComments.push(modifiedComment);
    }

    commentData.isSet = true;
    commentData.comments = modifiedComments;

    updateResults();

}

function resetResults() {

    console.log('Resetting...')

    commentData.resetData();

    document.getElementById("comments-count").textContent = '';
    document.getElementById("winner-name").textContent =  '';
    document.getElementById("winner-comment").textContent =  '';
    document.getElementById("winner-image").setAttribute('src', '');

    document.getElementById("pick-winner").setAttribute('disabled', true);
}

function updateResults() {

    console.log('Updating reults')

    document.getElementById("comments-count").textContent = commentData.comments.length;

    document.getElementById("pick-winner").toggleAttribute('disabled', false);
}

function pickWinner() {

    console.log('Picking winner...');

    if (commentData.isSet) {
        var winner = commentData.comments[Math.floor(Math.random() * commentData.comments.length)];
        document.getElementById("winner-name").textContent =  winner.name;
        document.getElementById("winner-comment").textContent =  winner.content;
        document.getElementById("winner-image").setAttribute('src', winner.imageUrl);
    }
}

// DATA

let commentData = new CommentList();

let videoIdField = document.getElementById('video-id');
let submitButton = document.getElementById('submit-video-id');
let pickWinnerButton = document.getElementById('pick-winner');

// Events

videoIdField.addEventListener('input', updateId);
submitButton.addEventListener('click', submitVideoId);
pickWinnerButton.addEventListener('click', pickWinner);