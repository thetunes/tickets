import { token } from "./controller/cookies.js";

function getUserId() {
    var requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
        redirect: 'follow'
    };

    return fetch('https://eclipse.herobuxx.me/api/auth/id', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                return data.data.user_id;
            } else {
                console.error('API Error:', data.message);
                return null;
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            return null;
        });
}

function getTicket() {
    var userID = getUserId();
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('https://eclipse.herobuxx.me/api/order', requestOptions)
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

    getUserId().then(userID => { // Use getUserId as a Promise
        tickets.filter(ticket => ticket.userid === userID).forEach(ticket => {
            const card = document.createElement('div');
            if (ticket.status === "true") {
                card.innerHTML = `
                <section class="section__container popular__container">
                    <h1 class="section__header">${ticket.ticketid}</h1>
                    <div class="popular__grid text-white">
                        <h2>Ticket ID</h2>
                        <p>${ticket.ticketid}</p>
                    </div>
                    <div class="popular__grid text-white">
                        <h2>Ordered at</h2>
                        <p>${ticket.CreatedAt}</p>
                    </div>
                    <div class="popular__grid text-white">
                        <h2>Status</h2>
                        <p>Completed</p>
                    </div>
                    <div class="btn-container">
                    <a href="ticket.html?id=${ticket.id}">
                        <button id="buyBtn" class="btn-main pt-8">Print Ticket</button>
                    </a>    
                    </div>
                </section>
                `;
            } else if (ticket.status === "false") {
                card.innerHTML = `
                <section class="section__container popular__container">
                    <h1 class="section__header">${ticket.ticketid}</h1>
                    <div class="popular__grid text-white">
                        <h2>Ticket ID</h2>
                        <p>${ticket.ticketid}</p>
                    </div>
                    <div class="popular__grid text-white">
                        <h2>Ordered at</h2>
                        <p>${ticket.CreatedAt}</p>
                    </div>
                    <div class="popular__grid text-white">
                        <h2>Status</h2>
                        <p>Cancelled</p>
                    </div>
                </section>
                `;
            } else {
                card.innerHTML = `
                <section class="section__container popular__container">
                    <h1 class="section__header">${ticket.ticketid}</h1>
                    <div class="popular__grid text-white">
                        <h2>Ticket ID</h2>
                        <p>${ticket.ticketid}</p>
                    </div>
                    <div class="popular__grid text-white">
                        <h2>Ordered at</h2>
                        <p>${ticket.CreatedAt}</p>
                    </div>
                    <div class="popular__grid text-white">
                        <h2>Status</h2>
                        <p>Waiting for payment</p>
                    </div>
                    <div class="btn-container">
                    <a href="payment.html?id=${ticket.id}">
                        <button id="buyBtn" class="btn-main pt-8">Upload Payment Receipt</button>
                    </a>    
                    </div>
                </section>
                `;
            }
            tableBody.appendChild(card);  // Use 'card' instead of 'row'
        });
    });
}

window.onload = getTicket;
