import { token } from "./controller/cookies.js";
import { deleteCookie } from "https://jscroot.github.io/cookie/croot.js";

function getTicket() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('http://34.128.102.98/api/ticket', requestOptions)
        .then(response => {
            console.log('Raw Response:', response);
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                displayTickets(data.data);
            } else {
                console.error('API Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

// Display tickets in the table
function displayTickets(tickets) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    tickets.forEach(ticket => {
        if (ticket.status !== "false") {
            const card = document.createElement('div');
            card.innerHTML = `
            <a style="text-decoration: none;" href="./details.html?id=${ticket.id}">
                <div class="popular__card">
                    <img src="https://source.unsplash.com/360x200?ticket" alt="popular hotel" />
                    
                    <div class="popular__content">
                        <div class="popular__card__header">
                        <h4>${ticket.title}</h4>
                        <h4>${ticket.price}</h4>
                        </div>
                        <p>${ticket.description}</p>
                        <a href="buy.html?id=${ticket.id}">
                            <button id="buyBtn" class="btn-home">Buy</button>
                        </a>    
                    </div>
                </div>    
            </a>
            `;
            tableBody.appendChild(card);  // Use 'card' instead of 'row'
        }
    });
}

// Function to remove the 'token' cookie
function removeTokenCookie() {
  deleteCookie('token');
  window.location.reload();
}

// Update the showProtectedNav function to include the Log Out link with the click event
function showProtectedNav() {
  const tableBody = document.getElementById('protectedNavLinks');
  tableBody.innerHTML = '';
  const navLink = document.createElement('li');

  navLink.className = "link";

  if (token === "") {
    navLink.innerHTML = `
    <a href="/login">Login</a>
    `;
  } else {
    navLink.innerHTML = `
    <a href="my_order.html">My Orders</a>
    <a href="#" id="logoutLink">Log Out</a>
    `;
  }

  tableBody.appendChild(navLink);

  // Attach an event listener to the Log Out link
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', removeTokenCookie);
  }
}


function initialize() {
    showProtectedNav();
    getTicket();
}

window.onload = initialize;
