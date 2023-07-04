//Function that runs once the window is fully loaded
var dropDownSelValue = "default";

var selectElement = document.getElementById('sorting');
selectElement.addEventListener('change', function() {
    dropDownSelValue = handleSelectChange();
    console.log('Selected value assigned:', dropDownSelValue);
    loadPosts();
});

window.onload = function() {
    // Attempt to retrieve the API base URL from the local storage
    var savedBaseUrl = localStorage.getItem('apiBaseUrl');
    // If a base URL is found in local storage, load the posts
    if (savedBaseUrl) {
        document.getElementById('api-base-url').value = savedBaseUrl;
        loadPosts();
    }
}

function handleSelectChange() {
    // Retrieve the selected option
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    // Retrieve the value of the selected option
    var selectedValue = selectedOption.value;

    return selectedValue;
}

function renderTemplate(datas){
    // Once the data is ready, we can use it
    // Clear out the post container first
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = '';

    // For each post in the response, create a new post element and add it to the page
    datas.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `<h1>${post.author}</h1><h2>${post.title}</h2><p>${post.content}</p><p>${post.date}</p>
        <button onclick="deletePost(${post.id})">Delete-eeeeeeeeee</button> <div class = "upBtn"><button onclick="showUpdateFields(${post.id})">U</button></div>
        <input type="button" onclick="like(${post.id})" value="Like - ${post.likes}"/>
        <div class="update-fields" id="update-fields-${post.id}" style="display: none;">
            <input type="text" id="post-title-${post.id}" placeholder="Enter New Post Title">
            <input type="text" id="post-content-${post.id}" placeholder="Enter New Post Content">
            <input type="text" id="post-date-${post.id}" placeholder="*Enter New Post Date - YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}" style="width: 310px;">
            <button onclick="submit(${post.id})">Submit-tttt</button>
        </div>`;
        postContainer.appendChild(postDiv);
    });
}

// Function to fetch all the posts from the API and display them on the page
function loadPosts() {
    // Retrieve the base URL from the input field and save it to local storage
    var baseUrl = document.getElementById('api-base-url').value;
    localStorage.setItem('apiBaseUrl', baseUrl);

    // Use the Fetch API to send a GET request to the /posts endpoint
    if (dropDownSelValue == "default") {
    fetch(baseUrl + '/posts')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "author_asc") {
    fetch(baseUrl + '/posts' + '?sort=author&direction=asc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "author_desc") {
    fetch(baseUrl + '/posts' + '?sort=author&direction=desc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "title_asc") {
    fetch(baseUrl + '/posts' + '?sort=title&direction=asc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "title_desc") {
    fetch(baseUrl + '/posts' + '?sort=title&direction=desc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "content_asc") {
    fetch(baseUrl + '/posts' + '?sort=content&direction=asc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "content_desc") {
    fetch(baseUrl + '/posts' + '?sort=content&direction=desc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "date_asc") {
    fetch(baseUrl + '/posts' + '?sort=date&direction=asc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }
    if (dropDownSelValue == "date_desc") {
    fetch(baseUrl + '/posts' + '?sort=date&direction=desc')
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
    }

}
// Function to send a POST request to the API to add a new post
function addPost() {
    // Retrieve the values from the input fields
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById('post-title').value;
    var postContent = document.getElementById('post-content').value;
    var postAuthor = document.getElementById('post-author').value;
    var postDateInput = document.getElementById('post-date');
    var postDate = postDateInput.value;

  // Check if the date is in the correct format (YYYY-MM-DD)
  var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(postDate)) {
    alert('Invalid date format. Please enter a date in the format YYYY-MM-DD.');
    postDateInput.focus();
    postDateInput.value = '';
    return;
  }

    // Use the Fetch API to send a POST request to the /posts endpoint
    fetch(baseUrl + '/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent, author: postAuthor, date: postDate  })
    })
    .then(response => response.json())  // Parse the JSON data from the response
    .then(post => {
        console.log('Post added:', post);
        loadPosts(); // Reload the posts after adding a new one
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        document.getElementById('post-author').value = '';
        document.getElementById('post-date').value = '';
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

// Function to send a DELETE request to the API to delete a post
function deletePost(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    // Use the Fetch API to send a DELETE request to the specific post's endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Post deleted:', postId);
        loadPosts(); // Reload the posts after deleting one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

function showUpdateFields(postId) {
  const updateFieldsDiv = document.getElementById(`update-fields-${postId}`);
  updateFieldsDiv.style.display = 'block';
}


function submit(postId) {
    var baseUrl = document.getElementById('api-base-url').value;
    var postTitle = document.getElementById(`post-title-${postId}`).value;
    var postContent = document.getElementById(`post-content-${postId}`).value;
    var postDateInput = document.getElementById(`post-date-${postId}`);
    var postDate = postDateInput.value;

  // Check if the date is in the correct format (YYYY-MM-DD)
    var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(postDate)) {
      alert('Invalid date format. Please enter a date in the format YYYY-MM-DD.');
      postDateInput.focus();
      postDateInput.value = '';
      return;
  }

    // Use the Fetch API to send a POST request to the /posts endpoint
    fetch(baseUrl + '/posts/' + postId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: postTitle, content: postContent, date: postDate })
    })
    .then(response => response.json())  // Parse the JSON data from the response
    .then(post => {
        console.log('Post added:', post);
        loadPosts(); // Reload the posts after adding a new one
    })
    .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}

function search(){
    var baseUrl = document.getElementById('api-base-url').value;
    var postSearch = document.getElementById('post-search').value;

    // Use the Fetch API to send a POST request to the /posts endpoint
    fetch(baseUrl + '/posts' + '/search' + `?search-word=${postSearch}`)
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })

}

function like(postId) {
    var baseUrl = document.getElementById('api-base-url').value;

    // Use the Fetch API to send a DELETE request to the specific post's endpoint
    fetch(baseUrl + '/posts' + '/like/' + postId)
        .then(response => response.json())  // Parse the JSON data from the response
        .then(data => {  // Once the data is ready, we can use it
            renderTemplate(data);
        })
        .catch(error => console.error('Error:', error));  // If an error occurs, log it to the console
}