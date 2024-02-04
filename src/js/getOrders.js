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

    return fetch('http://34.128.102.98/api/auth/id', requestOptions)
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

function getTicketTitle(ticketId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(`http://34.128.102.98/api/ticket/${ticketId}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                return data.data.title;
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

function getTicketPrice(ticketId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(`http://34.128.102.98/api/ticket/${ticketId}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                return data.data.price;
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

    fetch('http://34.128.102.98/api/order', requestOptions)
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

    getUserId().then(userID => {
        // Use Promise.all to fetch title and price for each ticket in parallel
        const ticketPromises = tickets
            .filter(ticket => ticket.userid === userID)
            .map(ticket => {
                const titlePromise = getTicketTitle(ticket.ticketid);
                const pricePromise = getTicketPrice(ticket.ticketid);

                return Promise.all([titlePromise, pricePromise])
                    .then(([title, price]) => {
                        const card = document.createElement('div');
                        const formattedDate = new Date(ticket.CreatedAt).toLocaleString('en-US', {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        if (ticket.status === "true") {
                            card.innerHTML = `
                            <section class="section__container popular__container">
                                <h1 class="section__header">${title}</h1>
                                <div class="popular__grid text-white">
                                    <h2>Ticket ID</h2>
                                    <p>${ticket.ticketid}</p>
                                </div>
                                <div class="popular__grid text-white">
                                    <h2>Price</h2>
                                    <p>${price}</p>
                                </div>
                                <div class="popular__grid text-white">
                                    <h2>Ordered at</h2>
                                    <p>${formattedDate}</p>
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
                                <h1 class="section__header">${title}</h1>
                                <div class="popular__grid text-white">
                                    <h2>Ticket ID</h2>
                                    <p>${ticket.ticketid}</p>
                                </div>
                                <div class="popular__grid text-white">
                                    <h2>Price</h2>
                                    <p>${price}</p>
                                </div>
                                <div class="popular__grid text-white">
                                    <h2>Ordered at</h2>
                                    <p>${formattedDate}</p>
                                </div>
                                <div class="popular__grid text-white">
                                    <h2>Status</h2>
                                    <p>Cancelled</p>
                                </div>
                            </section>
                            `;
                        }
                        tableBody.appendChild(card);
                    })
                    .catch(error => {
                        console.error('Error fetching title and price:', error);
                    });
            });

        // Wait for all promises to be resolved before displaying the total
        Promise.all(ticketPromises).then(() => {
            // Additional actions after displaying tickets, if needed
        });
    });
}

window.onload = getTicket;
