const searchForm = document.querySelector("#searchForm");

searchForm.addEventListener("submit", event => {
  const searchTerm = document.querySelector("#searchTerm").value;
  const sortBy = document.querySelector('input[name="sortByOptions"]:checked')
    .value;
  const limit = document.querySelector("#limit").value;
  if (searchTerm === "") {
    showMessage("Please enter the search term", "alert-danger");
  } else {
    debugger;

    redditSearch(searchTerm, sortBy, limit).then(results => {
      let outputDiv = '<div class="card-columns">';

      results.forEach(result => {
        outputDiv = showResult(result, outputDiv);
      });
      outputDiv += "</div>";
      document.getElementById("results").innerHTML = outputDiv;
    });
  }
  event.preventDefault();
});

showMessage = (message, className) => {
  var newDiv = document.createElement("div");
  newDiv.className = `alert ${className} my-2`;
  var newContent = document.createTextNode(message);

  newDiv.appendChild(newContent);
  currentDiv = document.getElementById("search");
  document.getElementById("searchContainer").insertBefore(newDiv, currentDiv);
};

redditSearch = (searchTerm, sortBy, limit) => {
  return fetch(
    `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${limit}`
  )
    .then(res => res.json())
    .then(data => {
      return data.data.children.map(item => item.data);
    });
};

showResult = (result, outputDiv) => {
  console.log(result);
  let image = result.preview
    ? result.preview.images[0].source.url
    : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";

  outputDiv += `
    <div class="card mb-2">
    <img class="card-img-top" src="${image}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${result.title}</h5>
      <p class="card-text">${truncateString(result.selftext, 100)}</p>
      <a href="${result.url}" target="_blank
      " class="btn btn-primary">Read More</a>
      <hr>
      <span class="badge badge-secondary">Subreddit: ${result.subreddit}</span> 
      <span class="badge badge-dark">Score: ${result.score}</span>
    </div>
  </div>
    `;

  return outputDiv;
};

function truncateString(myString, limit) {
  const shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
