// Get the current URL from the browser's address bar
var currentURL = window.location.href;

// Function to extract the value of a parameter from a URL
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// Extract the 'id' parameter value from the current URL
var idValue = getParameterByName('id', currentURL);

function getTicket() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('https://eclipse.herobuxx.me/api/ticket/' + idValue, requestOptions)
        .then(response => {
            console.log('Raw Response:', response);
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                displayTicket(data.data); // Use displayTicket instead of displayTickets
            } else {
                console.error('API Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

// Display a single ticket in the table
function displayTicket(ticket) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    const card = document.createElement('div');
    card.innerHTML = `
        <section class="section__container popular__container">
            <h1 class="section__header">${idValue}</h1>
            <h1 class="section__header">${ticket.title}</h1>
            <div class="popular__grid text-white">
                <h2>Price</h2>
                <p>${ticket.price}</p>
            </div>
            <div class="popular__grid text-white">
                <h2>Artist</h2>
                <p>${ticket.artistid}.</p>
            </div>
            <div class="popular__grid text-white">
                <h2>Description</h2>
                <p>${ticket.description}</p>
            </div> 
        </section>
        <div class="btn-container">
            <a href="buy.html?id=${idValue}">
                <button id="buyBtn" class="btn-main">Place order</button>
            </a>    
        </div>
        `;
    tableBody.appendChild(card);
}

window.onload = getTicket;