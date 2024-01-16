// Function to get the value of the "id" parameter from the URL query
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function to append the body with a key "id" and its value from the URL query
function appendIdFromBody() {
    var idValue = getParameterByName('id');
    if (idValue !== null) {
        document.body.setAttribute('id', idValue);
    }
}

// Function to handle image upload
function uploadImage() {
    var input = document.getElementById('imageInput');
    var idValue = getParameterByName('id');

    if (input.files.length > 0) {
        var file = input.files[0];
        var formData = new FormData();
        formData.append('image', file);
        formData.append('id', idValue);

        // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your REST API
        fetch('https://eclipse.herobuxx.me/api/order/upload/payment', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                appendIdFromBody();
                window.location.replace("success.html");
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
            });
    } else {
        alert("Please select an image to upload.");
    }
}

// Call the function to append the body with the "id" key and its value from the URL query
appendIdFromBody();