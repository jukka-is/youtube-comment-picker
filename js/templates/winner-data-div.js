/*
TEMPLATE for displaying an instance of winner data

      <div class="winner-data-container">
        <div class="image-container">
          <img id="winner-image" src="" alt="">
        </div>
        <ul>
          <li><span class="li-title">Name</span><span id="winner-name"></span></li>
          <li><span class="li-title">Comment</span><span id="winner-comment"></span></li>
        </ul>
      </div>

*/

export function addWinnerData(parentElelment, winnerId, winner) {
    console.log('Ready to add Winner info on a new DIV ...');
    console.log(parentElelment);

    let containerDiv = document.createElement("div");
    containerDiv.classList.add("winner-data-container");
    containerDiv.id = `winner-${winnerId}-data`;

    let imgContainer = document.createElement("div");
    imgContainer.classList.add("winner-image-container");

    let img = document.createElement("img");
    img.id = `winner-${winnerId}-img`;
    img.src = winner.imageUrl;
    imgContainer.appendChild(img);

    containerDiv.appendChild(imgContainer);

    let ul = document.createElement("ul");

    let nameLi = document.createElement("li");

    let nameTitleSpan = document.createElement("span");
    nameTitleSpan.classList.add("li-title");
    nameTitleSpan.textContent = "Name"
    nameLi.appendChild(nameTitleSpan);

    let winnerNameSpan = document.createElement("span");
    winnerNameSpan.id = `winner-${winnerId}-name`;
    winnerNameSpan.textContent = winner.name;
    nameLi.appendChild(winnerNameSpan);

    ul.appendChild(nameLi);

    let titleLi = document.createElement("li");

    let commentTitleSpan = document.createElement("span");
    commentTitleSpan.classList.add("li-title");
    commentTitleSpan.textContent = "Comment";
    titleLi.appendChild(commentTitleSpan);

    let winnerCommentSpan = document.createElement("span");
    winnerCommentSpan.id = `winner-${winnerId}-comment`;
    winnerCommentSpan.textContent = winner.content;
    titleLi.appendChild(winnerCommentSpan);

    ul.appendChild(titleLi);


    containerDiv.appendChild(ul);

    parentElelment.appendChild(containerDiv);

}