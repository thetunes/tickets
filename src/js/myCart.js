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


// Display tickets in the table
function displayTickets(tickets) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    // Variable to store the total price
    let totalToPay = 0;

    getUserId().then(userID => {
        // Array to store all promises for fetching ticket details
        const ticketPromises = [];

        tickets.filter(ticket => ticket.userid === userID).forEach(ticket => {
            const formattedDate = new Date(ticket.CreatedAt).toLocaleString('en-US', {
                month: 'long',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            if (ticket.status === "") {
                // Fetch the ticket details based on the ticket ID and push the promise to the array
                const ticketPromise = Promise.all([
                    getTicketTitle(ticket.ticketid),
                    getTicketPrice(ticket.ticketid)
                ]).then(([title, price]) => {
                    totalToPay += price;

                    const card = document.createElement('div');
                    card.innerHTML = `
                        <section class="section__container popular__container">
                            <h1 class="section__header">${title}</h1>
                            <div class="popular__grid text-white">
                                <h2>Ticket ID</h2>
                                <p>${ticket.ticketid}</p>
                            </div>
                            <div class="popular__grid text-white">
                                <h2>Ordered at</h2>
                                <p>${formattedDate}</p>
                            </div>
                            <div class="popular__grid text-white">
                                <h2>Price</h2>
                                <p>${price}</p>
                            </div>
                            <div class="btn-container">
                                <a href="payment.html?id=${ticket.id}">
                                    <button id="buyBtn" class="btn-main pt-8">Upload Payment Receipt</button>
                                </a>    
                            </div>
                        </section>
                    `;
                    tableBody.appendChild(card);
                });

                ticketPromises.push(ticketPromise);
            }
        });

        // Wait for all promises to be resolved before displaying the total
        Promise.all(ticketPromises).then(() => {
            // Update the value of the Total Order span
            const totalOrderSpan = document.getElementById('price-total');
            if (totalOrderSpan) {
                totalOrderSpan.textContent = `Total Order: $${totalToPay}`;
            }
            console.log('Total to pay:', totalToPay);
        });
    });
}

window.onload = getTicket;
