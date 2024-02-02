import { getCookie } from "https://jscroot.github.io/cookie/croot.js";

// Get the current URL from the browser's address bar
var currentURL = window.location.href;

// Declare idValue using const
const idValue = getParameterByName('id', currentURL);

// Get token from cookie and create authorization header
var token = getCookie("token");
var auth = "Bearer " + token;

// Function to extract the value of a parameter from a URL
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getTicket() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('http://34.128.102.98/api/ticket/' + idValue, requestOptions)
        .then(response => {
            console.log('Raw Response:', response);
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                displayTicket(data.data);
            } else {
                console.error('API Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function displayTicket(ticket) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    const card = document.createElement('div');
    card.innerHTML = `
    <section class="section__container popular__container">
        <h1 class="section__header">${idValue}</h1>
        <h1 class="section__header">${ticket.title}</h1>
        <div class="popular__grid text-white">
            <h2>Title</h2>
            <p>${ticket.title}</p>
        </div>
        <div class="popular__grid text-white">
            <h2>Price</h2>
            <p>${ticket.price}</p>
        </div>
    </section>
    `;
    tableBody.appendChild(card);
}

// Post Program Studi
function submitOrder() {
    const ticketId = idValue;

    const myData = {
        "ticketid": ticketId
    };

    console.log(JSON.stringify(myData));

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(myData)
    };

    fetch('http://34.128.102.98/api/order/create', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                location.replace('payment.html');
            } else {
                console.error("Submit data error");
            }
        })
        .catch(error => {
            console.error("Error during POST request:", error);
        });
}

const submitButton = document.getElementById('buyBtn');
submitButton.addEventListener('click', (event) => {
    event.preventDefault();
    submitOrder();
});

// Run getTicket on window load
window.onload = getTicket;
