function getTicket() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('https://eclipse.herobuxx.me/api/ticket', requestOptions)
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
                    <a href="../buy.html?id=${ticket.id}">
                        <button id="buyBtn" class="btn-home">Buy</button>
                    </a>    
                </div>
            </div>    
        </a>
        `;
        tableBody.appendChild(card);  // Use 'card' instead of 'row'
    });
}

window.onload = getTicket;
