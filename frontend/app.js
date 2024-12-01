// API Gateway URL for your application
const API_GATEWAY_URL = "https://vp0htlrzdg.execute-api.us-west-2.amazonaws.com/Dev";

// Upload image with custom labels
async function uploadImage() {
  const fileInput = document.getElementById('fileInput');
  const customLabelsInput = document.getElementById('customLabelsInput');
  const file = fileInput.files[0];
  const customLabels = customLabelsInput.value;

  if (!file) {
    alert("Please select an image file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("x-amz-meta-customlabels", customLabels);

  try {
    const response = await axios.put(`${API_GATEWAY_URL}/upload/${file.name}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    console.log("File uploaded successfully", response.data);
    alert("File uploaded successfully!");
  } catch (error) {
    console.error("Error uploading file", error);
    alert("Error uploading file.");
  }
}

// Search for images by label
async function searchImages() {
  const searchQuery = document.getElementById('searchInput').value;
  if (!searchQuery) {
    alert("Please enter a label to search for.");
    return;
  }

  try {
    const response = await axios.get(`${API_GATEWAY_URL}/search?q=${searchQuery}`);
    const results = response.data.results;

    if (results.length > 0) {
      displaySearchResults(results);
    } else {
      document.getElementById('results').innerHTML = "No photos found for this search.";
    }
  } catch (error) {
    console.error("Error searching images", error);
    alert("Error searching images.");
  }
}

// Display the search results (images)
function displaySearchResults(images) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ""; // Clear previous results

  images.forEach((image) => {
    const imageElement = document.createElement('img');
    imageElement.src = `https://devak-photo-bucket.s3.us-west-2.amazonaws.com/${image}`; // Replace with your S3 bucket URL
    imageElement.alt = image;
    imageElement.classList.add('search-result-image');
    resultsContainer.appendChild(imageElement);
  });
}
