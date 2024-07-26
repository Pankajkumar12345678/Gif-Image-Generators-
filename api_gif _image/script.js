let submitBtn = document.getElementById("submit-btn");
let loadMoreBtn = document.getElementById("load-more-btn");
let gifCount = 10;
let offset = 0;

let generateGif = (isLoadMore = false) => {
  // Display loader until gifs load
  let loader = document.querySelector(".loader");
  loader.style.display = "block";
  if (!isLoadMore) {
    document.querySelector(".wrapper").style.display = "none";
  }

  // Get search value (default => laugh)
  let q = document.getElementById("search-box").value;

  // API URL
  let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=${offset}&rating=g&lang=en`;
  document.querySelector(".wrapper").innerHTML = isLoadMore ? document.querySelector(".wrapper").innerHTML : "";

  // Make a call to API
  fetch(finalURL)
    .then((resp) => resp.json())
    .then((info) => {
      let gifsData = info.data;
      let gifContainer = document.querySelector(".wrapper");

      gifsData.forEach((gif) => {
        let container = document.createElement("div");
        container.classList.add("container");

        let img = document.createElement("img");
        img.setAttribute("src", gif.images.downsized_medium.url);
        img.onload = () => {
          gifCount--;
          if (gifCount === 0) {
            loader.style.display = "none";
            document.querySelector(".wrapper").style.display = "grid";
            loadMoreBtn.style.display = "block";
          }
        };

        container.append(img);

        // Copy link button
        let copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy Link";
        copyBtn.onclick = () => {
          let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
          navigator.clipboard.writeText(copyLink).then(() => {
            alert("GIF copied to clipboard");
          }).catch(() => {
            alert("GIF copied to clipboard");
            let hiddenInput = document.createElement("input");
            hiddenInput.setAttribute("type", "text");
            document.body.appendChild(hiddenInput);
            hiddenInput.value = copyLink;
            hiddenInput.select();
            document.execCommand("copy");
            document.body.removeChild(hiddenInput);
          });
        };

        container.append(copyBtn);
        gifContainer.append(container);
      });

      offset += gifCount;
    });
};

// Generate Gifs on screen load or when user clicks on submit
submitBtn.addEventListener("click", () => {
  offset = 0;
  generateGif();
});
window.addEventListener("load", generateGif);

// Load more Gifs when user clicks on load more button
loadMoreBtn.addEventListener("click", () => {
  gifCount = 10;
  loadMoreBtn.disabled = true;
  loadMoreBtn.innerText = "Loading...";
  generateGif(true).then(() => {
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerText = "Load More";
  });
});
