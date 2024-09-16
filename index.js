const accessKey = "RZEIOVfPhS7vMLkFdd2TSKGFBS4o9_FmcV1Nje3FSjw";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("Search-input");
const searchResultsEl = document.querySelector(".Search-Results");
const showMoreButtonEl = document.getElementById("Show-more");
const btnEl = document.getElementById("Search-button");
const gohome = document.getElementById("go-home");

let inputData = "";
let page = 1;
let isSearching = false;

btnEl.addEventListener("mouseover", (event) => {
  const rect = btnEl.getBoundingClientRect();   
  const x = event.clientX - rect.left; 
  const y = event.clientY - rect.top;  

  btnEl.style.setProperty("--xPos", `${x}px`);
  btnEl.style.setProperty("--yPos", `${y}px`);
});

async function fetchRandomImages() {
  try {
    const url = `https://api.unsplash.com/photos/random?count=30&client_id=${accessKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log(data);  // Debugging line 

    if (data.length === 0) {
      console.log('No random images returned.');
    }

    data.forEach((result) => {
      displayImage(result);
    });
  } catch (error) {
    console.error('Error fetching random images:', error);
  }
}

async function searchImages() {
  try {
    inputData = searchInputEl.value;
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log(data);  // Debugging line

    if (data.results.length === 0) {
      console.log('No search results found.');
    }

    if (page === 1) {
      searchResultsEl.innerHTML = ""; 
    }

    const results = data.results;

    results.forEach((result) => {
      displayImage(result);
    });

    page++;
  } catch (error) {
    console.error('Error searching images:', error);
  }
}

function displayImage(result) {
  console.log(result);  // Debugging line
  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("Search-Result");

  const image = document.createElement("img");
  image.src = result.urls.small;
  image.alt = result.alt_description;
  image.loading = "lazy"; 

  const imageLink = document.createElement("a");
  imageLink.href = result.links.html;
  imageLink.target = "_blank";
  imageLink.textContent = result.alt_description;

  imageWrapper.appendChild(image);
  imageWrapper.appendChild(imageLink);
  searchResultsEl.appendChild(imageWrapper);
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  isSearching = true; 
  searchImages();
});

showMoreButtonEl.addEventListener("click", () => {
  if (isSearching) {
    searchImages(); // Load more searched images
  } else {
    fetchRandomImages(); // Load more random images
  }
});

// Load random images on page load
window.addEventListener("load", () => {
  fetchRandomImages(); 
  showMoreButtonEl.style.display = "block"; 
});

// Go back to homepage
gohome.addEventListener('click', () => { 
  window.location.href = "index.html";
});
